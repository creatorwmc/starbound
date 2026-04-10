import { useState, useEffect, useCallback, useMemo } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";

// Constellation thresholds: 3, 4, 5, 6, 7, then back to 3
function getThreshold(constellationIndex) {
  return 3 + (constellationIndex % 5); // cycles: 3, 4, 5, 6, 7, 3, 4, 5, 6, 7...
}

export function useConstellations(items) {
  const [constellations, setConstellations] = useState([]);
  const [newConstellation, setNewConstellation] = useState(null);

  // Load existing constellations from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "constellations"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        setConstellations(data);
      },
      (error) => {
        console.error("Firestore constellations error:", error);
      }
    );
    return unsubscribe;
  }, []);

  // Detect new constellations based on completed items
  const checkConstellations = useCallback(() => {
    // Group completed items by category
    const doneByCategory = {};
    items.filter((i) => i.stage === "done").forEach((item) => {
      if (!doneByCategory[item.category]) doneByCategory[item.category] = [];
      doneByCategory[item.category].push(item.id);
    });

    // For each category, check if we've hit a new threshold
    Object.entries(doneByCategory).forEach(([category, itemIds]) => {
      const existingInCategory = constellations.filter((c) => c.category === category);
      const alreadyClaimed = new Set(existingInCategory.flatMap((c) => c.itemIds));
      const unclaimed = itemIds.filter((id) => !alreadyClaimed.has(id));
      const threshold = getThreshold(existingInCategory.length);

      if (unclaimed.length >= threshold) {
        const constellationItemIds = unclaimed.slice(0, threshold);
        const conId = `con-${category}-${existingInCategory.length + 1}`;

        // Check if we already created this one
        if (constellations.find((c) => c.id === conId)) return;

        const newCon = {
          id: conId,
          category,
          itemIds: constellationItemIds,
          threshold,
          formedAt: new Date().toISOString(),
          number: existingInCategory.length + 1,
        };

        // Save to Firestore
        setDoc(doc(db, "constellations", conId), newCon).catch(console.error);

        // Trigger celebration
        setNewConstellation(newCon);
        setTimeout(() => setNewConstellation(null), 4000);
      }
    });
  }, [items, constellations]);

  // Check whenever items change
  useEffect(() => {
    checkConstellations();
  }, [checkConstellations]);

  // Build a map of itemId -> cluster position for constellation members
  const clusterPositions = useMemo(() => {
    const positions = {};
    constellations.forEach((con) => {
      // Generate a cluster center from the constellation ID
      const hash = con.id.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
      const cx = 15 + (Math.abs(hash * 13) % 70);
      const cy = 10 + (Math.abs(hash * 29) % 60);

      // Place stars in a tight cluster around the center
      con.itemIds.forEach((itemId, i) => {
        const angle = (i / con.itemIds.length) * Math.PI * 2;
        const radius = 3 + (i % 2) * 1.5; // 3-4.5% spread
        positions[itemId] = {
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          constellation: con,
        };
      });
    });
    return positions;
  }, [constellations]);

  return { constellations, clusterPositions, newConstellation };
}
