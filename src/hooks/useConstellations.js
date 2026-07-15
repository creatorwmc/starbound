import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { getShape } from "../utils/constellationShapes";

const THRESHOLD = 3;
// Old docs were `con-{category}-{N}` (3+ hyphens) and carried a `threshold` field.
// New docs are `con-{category}` (exactly 2 hyphens) with `orderIndex`.
function isLegacyDoc(d) {
  return d.threshold !== undefined || (typeof d.id === "string" && d.id.split("-").length > 2);
}
const SHAPE_RADIUS_PCT = 10;     // viewport % the shape occupies (half-width)
const EXTRA_ORBIT_PCT = 2.5;     // how far extra stars sit beyond the shape ring

// Fixed cluster slots, in viewport %. Hand-placed rather than hashed: every
// pair is >= 22.4 apart, so shape rings (radius 10) never touch, and all nine
// clear the top bar (~7%) and the ground silhouette (~88%).
//
// Assigned by orderIndex, not by a hash of the category name. The previous
// hash squeezed cy through `% 24`, which stacked all eight categories into a
// 14%-tall band and collided 18 of 28 pairs — skills and creative landed 5.8%
// apart. orderIndex is stored on the constellation doc, so placement is just
// as stable across items coming and going and across both phones, but it can
// actually guarantee separation.
//
// Nine slots covers the eight categories in theme.js. Extras orbit at
// radius + 2.5, slightly wider than the slot gap, so a constellation with more
// items than its shape has vertices can drift a loose star toward a neighbour.
// That is fine — they read as stray stars, not as skeleton.
const CLUSTER_SLOTS = [
  [20, 24], [50, 20], [80, 26],
  [16, 50], [47, 46], [80, 52],
  [24, 72], [56, 70], [84, 74],
];

function clusterCenterFor(orderIndex) {
  const [cx, cy] = CLUSTER_SLOTS[(orderIndex ?? 0) % CLUSTER_SLOTS.length];
  return { cx, cy };
}

export function useConstellations(items, mode = "zodiac") {
  const [constellations, setConstellations] = useState([]);
  const [newConstellation, setNewConstellation] = useState(null);
  const wipedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "constellations"),
      (snapshot) => {
        const all = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        // One-shot wipe of legacy-format docs the first time we see them.
        if (!wipedRef.current) {
          const legacy = all.filter(isLegacyDoc);
          if (legacy.length > 0) {
            wipedRef.current = true;
            legacy.forEach((d) => {
              deleteDoc(doc(db, "constellations", d.id)).catch(console.error);
            });
          } else {
            wipedRef.current = true;
          }
        }
        setConstellations(all.filter((d) => !isLegacyDoc(d)));
      },
      (err) => console.error("constellations snapshot error:", err),
    );
    return unsubscribe;
  }, []);

  // Re-evaluate every time items change. One constellation per category. First
  // category to hit THRESHOLD gets orderIndex=0, next gets 1, etc. Extra items
  // beyond the first 3 attach to the same constellation.
  const checkConstellations = useCallback(() => {
    const byCategory = {};
    items.forEach((item) => {
      if (!byCategory[item.category]) byCategory[item.category] = [];
      byCategory[item.category].push(item.id);
    });

    // Track orderIndex locally so multiple new constellations formed in the same
    // pass each get a distinct index instead of all colliding on constellations.length.
    let nextOrderIndex = constellations.reduce(
      (max, c) => Math.max(max, (c.orderIndex ?? -1) + 1),
      0,
    );

    Object.entries(byCategory).forEach(([category, itemIds]) => {
      const existing = constellations.find((c) => c.category === category);

      if (!existing) {
        if (itemIds.length < THRESHOLD) return;
        const orderIndex = nextOrderIndex++;
        const conId = `con-${category}`;
        const newCon = {
          id: conId,
          category,
          itemIds: [...itemIds],
          orderIndex,
          formedAt: new Date().toISOString(),
        };
        setDoc(doc(db, "constellations", conId), newCon).catch(console.error);
        setNewConstellation(newCon);
        setTimeout(() => setNewConstellation(null), 4000);
        return;
      }

      // Append any items not yet tracked. Don't unset removed items here — a
      // deleted item just becomes an absent star; the constellation's identity
      // stays intact (per spec: "stays even if the bucket list item is completed").
      const known = new Set(existing.itemIds);
      const additions = itemIds.filter((id) => !known.has(id));
      if (additions.length > 0) {
        const updated = { ...existing, itemIds: [...existing.itemIds, ...additions] };
        setDoc(doc(db, "constellations", existing.id), updated).catch(console.error);
      }
    });
  }, [items, constellations]);

  useEffect(() => {
    checkConstellations();
  }, [checkConstellations]);

  // Resolve positions + shape skeletons for the current mode.
  const { clusterPositions, skeletons } = useMemo(() => {
    const positions = {};
    const skeletonList = [];

    constellations.forEach((con) => {
      const shape = getShape(mode, con.orderIndex || 0);
      const { cx, cy } = clusterCenterFor(con.orderIndex || 0);
      const vertexCount = shape.vertices.length;

      // Stars 0..N-1 snap to shape vertices.
      shape.vertices.forEach(([vx, vy], i) => {
        const itemId = con.itemIds[i];
        if (!itemId) return;
        positions[itemId] = {
          x: cx + vx * SHAPE_RADIUS_PCT,
          y: cy + vy * SHAPE_RADIUS_PCT,
          constellation: con,
          isVertex: true,
        };
      });

      // Extras orbit the cluster center beyond the shape's bounding ring.
      const extras = con.itemIds.slice(vertexCount);
      extras.forEach((itemId, i) => {
        const angle = (i / Math.max(extras.length, 1)) * Math.PI * 2 + (i * 0.6);
        const orbitR = SHAPE_RADIUS_PCT + EXTRA_ORBIT_PCT + (i % 2) * 2;
        positions[itemId] = {
          x: cx + Math.cos(angle) * orbitR,
          y: cy + Math.sin(angle) * orbitR,
          constellation: con,
          isVertex: false,
        };
      });

      // Skeleton edges in viewport % — drawn by NightSky as SVG lines.
      const edgePoints = shape.edges.map(([a, b]) => ({
        x1: cx + shape.vertices[a][0] * SHAPE_RADIUS_PCT,
        y1: cy + shape.vertices[a][1] * SHAPE_RADIUS_PCT,
        x2: cx + shape.vertices[b][0] * SHAPE_RADIUS_PCT,
        y2: cy + shape.vertices[b][1] * SHAPE_RADIUS_PCT,
      }));
      skeletonList.push({
        id: con.id,
        category: con.category,
        shape,
        edges: edgePoints,
        cx, cy,
      });
    });

    return { clusterPositions: positions, skeletons: skeletonList };
  }, [constellations, mode]);

  return { constellations, clusterPositions, skeletons, newConstellation };
}
