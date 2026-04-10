import { useState, useEffect, useRef, useMemo } from "react";
import { THEMES, CATEGORIES } from "../theme";

// ============================================================
// Simulated future data for the timeline demo
// ============================================================
const DEMO_ITEMS = [
  { id: "d1", title: "Visit Ireland together", category: "travel", tier: 3, owner: "shared", stage: "done", createdAt: "2026-06-01", completedAt: "2027-09-15" },
  { id: "d2", title: "Learn to make fresh pasta", category: "food", tier: 1, owner: "shared", stage: "done", createdAt: "2026-04-15", completedAt: "2026-05-20" },
  { id: "d3", title: "Build the chicken coop expansion", category: "home", tier: 2, owner: "shared", stage: "done", createdAt: "2026-05-01", completedAt: "2026-08-10" },
  { id: "d4", title: "See the Northern Lights", category: "travel", tier: 3, owner: "shared", stage: "done", createdAt: "2026-07-01", completedAt: "2028-02-14" },
  { id: "d5", title: "Picnic at Garden of the Gods", category: "experiences", tier: 1, owner: "shared", stage: "done", createdAt: "2026-04-20", completedAt: "2026-06-05" },
  { id: "d6", title: "Learn guitar together", category: "skills", tier: 2, owner: "shared", stage: "done", createdAt: "2026-05-15", completedAt: "2027-03-01" },
  { id: "d7", title: "Road trip to the Grand Canyon", category: "travel", tier: 2, owner: "shared", stage: "done", createdAt: "2026-08-01", completedAt: "2027-06-20" },
  { id: "d8", title: "Plant an orchard", category: "home", tier: 2, owner: "shared", stage: "done", createdAt: "2026-09-01", completedAt: "2027-04-15" },
  { id: "d9", title: "Cook a full Thanksgiving from scratch", category: "food", tier: 2, owner: "stacey", stage: "done", createdAt: "2026-10-01", completedAt: "2026-11-28" },
  { id: "d10", title: "Take a pottery class", category: "creative", tier: 1, owner: "shared", stage: "done", createdAt: "2027-01-15", completedAt: "2027-05-10" },
  { id: "d11", title: "Adopt a rescue dog", category: "home", tier: 2, owner: "shared", stage: "done", createdAt: "2027-02-01", completedAt: "2027-07-04" },
  { id: "d12", title: "Anniversary trip to Paris", category: "travel", tier: 3, owner: "shared", stage: "done", createdAt: "2027-03-01", completedAt: "2028-06-15" },
  { id: "d13", title: "Build a fire pit", category: "home", tier: 1, owner: "zach", stage: "done", createdAt: "2027-04-01", completedAt: "2027-08-20" },
  { id: "d14", title: "Learn to dance together", category: "skills", tier: 2, owner: "shared", stage: "done", createdAt: "2027-05-01", completedAt: "2028-01-10" },
  { id: "d15", title: "Host a barn party", category: "experiences", tier: 2, owner: "shared", stage: "done", createdAt: "2027-06-01", completedAt: "2027-09-15" },
  { id: "d16", title: "Sunrise hike at Pikes Peak", category: "experiences", tier: 1, owner: "shared", stage: "done", createdAt: "2027-07-01", completedAt: "2027-08-05" },
  { id: "d17", title: "Write our love story", category: "creative", tier: 2, owner: "stacey", stage: "done", createdAt: "2027-08-01", completedAt: "2028-12-25" },
  { id: "d18", title: "Visit Japan in cherry blossom season", category: "travel", tier: 3, owner: "shared", stage: "done", createdAt: "2027-09-01", completedAt: "2029-04-10" },
  { id: "d19", title: "Build a greenhouse", category: "home", tier: 2, owner: "zach", stage: "done", createdAt: "2028-01-01", completedAt: "2028-06-01" },
  { id: "d20", title: "100-mile bike ride together", category: "experiences", tier: 3, owner: "shared", stage: "done", createdAt: "2028-03-01", completedAt: "2029-07-20" },
  { id: "d21", title: "Scuba diving certification", category: "skills", tier: 2, owner: "shared", stage: "done", createdAt: "2028-05-01", completedAt: "2029-02-15" },
  { id: "d22", title: "Open a farmstand", category: "home", tier: 3, owner: "shared", stage: "done", createdAt: "2028-07-01", completedAt: "2030-05-01" },
  { id: "d23", title: "Paint a mural on the barn", category: "creative", tier: 1, owner: "stacey", stage: "done", createdAt: "2028-09-01", completedAt: "2029-06-15" },
  { id: "d24", title: "Northern Italy wine tour", category: "travel", tier: 3, owner: "shared", stage: "done", createdAt: "2029-01-01", completedAt: "2030-10-01" },
  { id: "d25", title: "Renew our vows on the farm", category: "relationships", tier: 3, owner: "shared", stage: "done", createdAt: "2029-06-01", completedAt: "2031-06-15" },
  { id: "d26", title: "Kayak the Colorado River", category: "travel", tier: 2, owner: "shared", stage: "planning", createdAt: "2030-01-01" },
  { id: "d27", title: "Learn woodworking", category: "skills", tier: 2, owner: "zach", stage: "doing", createdAt: "2030-03-01" },
  { id: "d28", title: "Star party with a real telescope", category: "experiences", tier: 1, owner: "shared", stage: "dream", createdAt: "2031-01-01" },
];

function hashPosition(id, index) {
  const hash = id.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  return { x: 5 + (Math.abs(hash * 13 + index * 47) % 90), y: 5 + (Math.abs(hash * 29 + index * 61) % 75) };
}

// ============================================================
// Page definitions
// ============================================================
const LOVE_PAGES = [
  { lines: ["Hey, Babe."] },
  { lines: ["I built something for us."] },
  { lines: ["Every dream we've whispered about.", "Every \"what if\" and \"someday.\"", "Every wild idea we've had at 2am."] },
  { lines: ["I wanted a place to put them all.", "Somewhere they could live and grow."] },
  { lines: ["So I made us a sky."] },
];

const FEATURE_PAGES = [
  {
    title: "The Night Sky",
    icon: "✦",
    desc: "Every dream becomes a star. Tap any star to see its story. The brighter it glows, the more you've added to it.",
  },
  {
    title: "Dream → Done",
    icon: "★",
    desc: "Each star moves through four stages: Dream it, Plan it, Do it, Done. There's no rush — every stage is part of the journey.",
  },
  {
    title: "The Hearth",
    icon: "🔥",
    desc: "A quiet place to leave notes for each other. No notifications, no pressure. Just a fire that's always burning when you want to stop by.",
  },
  {
    title: "Our Home",
    icon: "🏡",
    desc: "The ground beneath the stars. Take photos of the farm, the house, the animals — a living portrait of home that grows over the years.",
  },
  {
    title: "Hidden Gems",
    icon: "💎",
    desc: "Plant secret surprises that trigger when something special happens. A love letter that appears when the other completes a dream.",
  },
  {
    title: "Photos & Memories",
    icon: "📸",
    desc: "Snap photos right from the app. Every bucket list item becomes a memory capsule you can always add to — even years later.",
  },
];

// ============================================================
// Component
// ============================================================
export default function StaceyIntro({ onComplete }) {
  const [phase, setPhase] = useState("love"); // "love", "features", "timeline"
  const [pageIndex, setPageIndex] = useState(0);
  const [fadeState, setFadeState] = useState("in");
  const [loveStars, setLoveStars] = useState([]);

  // Timeline demo state
  const [timelineActive, setTimelineActive] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(0); // 0-1
  const timelineRef = useRef(null);

  const t = THEMES.stacey;

  // Love phase: auto-advance
  useEffect(() => {
    if (phase !== "love") return;
    if (pageIndex >= LOVE_PAGES.length) {
      setPhase("features");
      setPageIndex(0);
      setFadeState("in");
      return;
    }

    setFadeState("in");
    const fadeInTimer = setTimeout(() => setFadeState("visible"), 100);
    const fadeOutTimer = setTimeout(() => setFadeState("out"), pageIndex === 2 ? 4500 : pageIndex === 3 ? 3500 : 2500);
    const nextTimer = setTimeout(() => {
      setPageIndex((p) => p + 1);
      setFadeState("in");
    }, pageIndex === 2 ? 5300 : pageIndex === 3 ? 4300 : 3300);

    // Build stars
    if (pageIndex >= 3) {
      setLoveStars(Array.from({ length: (pageIndex - 2) * 6 }).map((_, i) => ({
        x: Math.random() * 100, y: Math.random() * 85,
        size: 1 + Math.random() * 1.5, delay: Math.random() * 2,
      })));
    }

    return () => { clearTimeout(fadeInTimer); clearTimeout(fadeOutTimer); clearTimeout(nextTimer); };
  }, [phase, pageIndex]);

  // Timeline playback
  useEffect(() => {
    if (!timelineActive) return;
    const start = Date.now();
    const duration = 15000; // 15 seconds for full playback
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(1, elapsed / duration);
      setTimelineProgress(progress);
      if (progress < 1) {
        timelineRef.current = requestAnimationFrame(tick);
      } else {
        setTimelineActive(false);
      }
    };
    timelineRef.current = requestAnimationFrame(tick);
    return () => { if (timelineRef.current) cancelAnimationFrame(timelineRef.current); };
  }, [timelineActive]);

  // Timeline: which items are visible at current progress
  const timelineItems = useMemo(() => {
    const count = Math.floor(timelineProgress * DEMO_ITEMS.length);
    return DEMO_ITEMS.slice(0, count);
  }, [timelineProgress]);

  const timelineYear = useMemo(() => {
    return 2026 + Math.floor(timelineProgress * 6); // 2026-2032
  }, [timelineProgress]);

  const doneCount = timelineItems.filter((i) => i.stage === "done").length;

  // Constellation detection + clustering for demo
  const { demoClusterPositions, demoConstellationCount } = useMemo(() => {
    const byCategory = {};
    timelineItems.filter((i) => i.stage === "done").forEach((item) => {
      if (!byCategory[item.category]) byCategory[item.category] = [];
      byCategory[item.category].push(item);
    });
    const positions = {};
    let count = 0;
    Object.entries(byCategory).forEach(([cat, catItems]) => {
      if (catItems.length >= 3) {
        count++;
        // Generate cluster center from category name
        const catHash = cat.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
        const cx = 15 + (Math.abs(catHash * 13) % 70);
        const cy = 10 + (Math.abs(catHash * 29) % 60);
        catItems.slice(0, 3).forEach((item, i) => {
          const angle = (i / 3) * Math.PI * 2;
          const radius = 3 + (i % 2) * 1.5;
          positions[item.id] = { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
        });
      }
    });
    return { demoClusterPositions: positions, demoConstellationCount: count };
  }, [timelineItems]);

  // ============================================================
  // Render: Love phase
  // ============================================================
  if (phase === "love") {
    const page = LOVE_PAGES[pageIndex];
    if (!page) return null;
    return (
      <div style={{
        position: "absolute", inset: 0, zIndex: 200, overflow: "hidden",
        background: "linear-gradient(135deg, #0d0a1a 0%, #1a0f20 40%, #0d1520 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        {loveStars.map((s, i) => (
          <div key={i} style={{
            position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
            width: `${s.size}px`, height: `${s.size}px`, borderRadius: "50%",
            background: `rgba(250,177,160,${0.15 + s.size * 0.08})`,
            animation: "twinkle 3s ease-in-out infinite", animationDelay: `${s.delay}s`,
            pointerEvents: "none",
          }} />
        ))}
        <div style={{
          textAlign: "center", padding: "40px 32px", maxWidth: "340px",
          opacity: fadeState === "visible" ? 1 : 0,
          transform: fadeState === "in" ? "translateY(12px)" : fadeState === "out" ? "translateY(-12px)" : "translateY(0)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          {page.lines.map((line, i) => (
            <p key={`${pageIndex}-${i}`} style={{
              color: t.textPrimary, margin: "0 0 8px 0", lineHeight: "1.7",
              fontSize: page.lines.length === 1 && line.length < 30 ? "24px" : "18px",
              fontWeight: page.lines.length === 1 ? 700 : 400,
              letterSpacing: page.lines.length === 1 ? "1px" : "0.3px",
              opacity: 0, animation: "introLineIn 0.6s ease forwards",
              animationDelay: `${0.3 + i * 0.4}s`,
            }}>
              {line}
            </p>
          ))}
        </div>
        <button onClick={onComplete} style={{
          position: "absolute", bottom: "32px", right: "24px",
          padding: "8px 16px", borderRadius: "16px",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.2)", fontSize: "12px", cursor: "pointer", letterSpacing: "1px",
        }}>
          skip
        </button>
        <style>{`@keyframes introLineIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    );
  }

  // ============================================================
  // Render: Features walkthrough
  // ============================================================
  if (phase === "features") {
    const feature = FEATURE_PAGES[pageIndex];
    const isLast = pageIndex === FEATURE_PAGES.length - 1;

    return (
      <div style={{
        position: "absolute", inset: 0, zIndex: 200, overflow: "hidden",
        background: t.bg,
        display: "flex", flexDirection: "column",
      }}>
        {/* Top bar */}
        <div style={{
          padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ color: t.textSecondary, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>
            Feature {pageIndex + 1} of {FEATURE_PAGES.length}
          </div>
          <button onClick={onComplete} style={{
            padding: "6px 14px", borderRadius: "12px",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: t.textSecondary, fontSize: "12px", cursor: "pointer",
          }}>
            End demo
          </button>
        </div>

        {/* Feature content */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "20px 32px",
        }}>
          <div style={{
            fontSize: "56px", marginBottom: "20px",
            animation: "introLineIn 0.5s ease forwards",
          }}>
            {feature.icon}
          </div>
          <h2 style={{
            color: t.textPrimary, fontSize: "26px", fontWeight: 700,
            margin: "0 0 12px 0", letterSpacing: "1px", textAlign: "center",
            opacity: 0, animation: "introLineIn 0.5s ease 0.2s forwards",
          }}>
            {feature.title}
          </h2>
          <p style={{
            color: t.textSecondary, fontSize: "15px", lineHeight: "1.7",
            textAlign: "center", maxWidth: "320px", margin: 0,
            opacity: 0, animation: "introLineIn 0.5s ease 0.4s forwards",
          }}>
            {feature.desc}
          </p>
        </div>

        {/* Bottom nav */}
        <div style={{ padding: "20px 24px 36px", display: "flex", gap: "10px" }}>
          {pageIndex > 0 && (
            <button
              onClick={() => setPageIndex((p) => p - 1)}
              style={{
                padding: "14px 24px", borderRadius: "14px",
                background: "transparent", border: `1px solid ${t.cardBorder}`,
                color: t.textSecondary, fontSize: "15px", cursor: "pointer",
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (isLast) {
                setPhase("timeline");
                setPageIndex(0);
              } else {
                setPageIndex((p) => p + 1);
              }
            }}
            style={{
              flex: 1, padding: "14px 24px", borderRadius: "14px",
              background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
              border: "none", color: "white", fontSize: "15px", fontWeight: 600,
              cursor: "pointer", letterSpacing: "0.5px",
            }}
          >
            {isLast ? "See your future sky →" : "Next →"}
          </button>
        </div>

        {/* Progress dots */}
        <div style={{
          position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: "5px",
        }}>
          {FEATURE_PAGES.map((_, i) => (
            <div key={i} style={{
              width: i === pageIndex ? "14px" : "4px", height: "4px", borderRadius: "2px",
              background: i === pageIndex ? t.primary : i < pageIndex ? `${t.primary}60` : "rgba(255,255,255,0.1)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        <style>{`@keyframes introLineIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    );
  }

  // ============================================================
  // Render: Timeline demo
  // ============================================================
  if (phase === "timeline") {
    return (
      <div style={{
        position: "absolute", inset: 0, zIndex: 200, overflow: "hidden",
        background: "linear-gradient(135deg, #0d0a1a 0%, #1a0f20 40%, #0d1520 100%)",
      }}>
        {/* Demo stars — matching real Star component exactly */}
        {timelineItems.map((item, idx) => {
          const globalIdx = DEMO_ITEMS.indexOf(item);
          const originalPos = hashPosition(item.id, globalIdx);
          const clusterPos = demoClusterPositions[item.id];
          const pos = clusterPos || originalPos;
          const isDone = item.stage === "done";
          const isDoing = item.stage === "doing";
          const inCluster = !!clusterPos;
          const ownerColor = item.owner === "shared" ? "#FFEAA7" : item.owner === "stacey" ? t.starColor : THEMES.zach.starColor;
          const tierSize = item.tier === 3 ? 8 : item.tier === 2 ? 5 : 3;
          const rawSize = tierSize * (isDone ? 1.4 : isDoing ? 1.2 : 1);
          const baseSize = Math.max(rawSize, 4);
          const brightness = Math.min(1, 0.4 + (isDone ? 0.5 : isDoing ? 0.3 : 0.1));
          const px = baseSize * 2.5;
          return (
            <div key={item.id} style={{
              position: "absolute",
              left: `calc(${pos.x}% - ${px / 2}px)`,
              top: `calc(${pos.y}% - ${px / 2}px)`,
              width: `${px}px`, height: `${px}px`,
              zIndex: isDone ? 3 : 2,
              transition: inCluster ? "left 2s ease, top 2s ease" : "none",
              animation: "starBirth 1s ease-out forwards",
            }}>
              <div style={{
                width: "100%", height: "100%", borderRadius: "50%",
                background: `radial-gradient(circle, ${ownerColor} 0%, ${ownerColor}80 40%, transparent 70%)`,
                opacity: brightness,
                boxShadow: isDone
                  ? `0 0 ${baseSize * 4}px ${ownerColor}80, 0 0 ${baseSize * 8}px ${ownerColor}40`
                  : isDoing
                  ? `0 0 ${baseSize * 3}px ${ownerColor}60`
                  : `0 0 ${baseSize * 2}px ${ownerColor}30`,
                animation: isDoing ? "pulse 2s ease-in-out infinite" : "twinkle 3s ease-in-out infinite",
                animationDelay: `${(globalIdx * 0.7) % 3}s`,
              }} />
            </div>
          );
        })}

        {/* Constellation lines removed — constellation system will handle clustering */}

        {/* Ambient stars */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={`a-${i}`} style={{
            position: "absolute", left: `${(i * 17 + 3) % 100}%`, top: `${(i * 23 + 7) % 85}%`,
            width: "1px", height: "1px", borderRadius: "50%",
            background: "rgba(255,255,255,0.1)", animation: "twinkle 5s ease-in-out infinite",
            animationDelay: `${(i * 0.5) % 5}s`, pointerEvents: "none", zIndex: 0,
          }} />
        ))}

        {/* Top info */}
        <div style={{
          position: "absolute", top: "16px", left: "20px", right: "20px",
          display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10,
        }}>
          <div>
            <div style={{ color: t.accent, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" }}>
              {timelineActive ? "✧ Your story unfolding ✧" : timelineProgress >= 1 ? "✧ Years of dreams ✧" : "✧ The Timeline ✧"}
            </div>
            <div style={{ color: t.textPrimary, fontSize: "22px", fontWeight: 700, marginTop: "2px" }}>
              {timelineYear}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: t.textPrimary, fontSize: "18px", fontWeight: 700 }}>
              {timelineItems.length} ✧
            </div>
            <div style={{ color: t.textSecondary, fontSize: "11px" }}>
              {doneCount} completed
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
          padding: "60px 20px 28px", zIndex: 10,
        }}>
          {/* Progress bar */}
          <div style={{
            height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.1)",
            marginBottom: "16px", overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: `${timelineProgress * 100}%`,
              background: `linear-gradient(90deg, ${t.primary}, ${t.accent})`,
              borderRadius: "2px", transition: timelineActive ? "none" : "width 0.3s ease",
            }} />
          </div>

          {!timelineActive && timelineProgress < 1 && (
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <p style={{ color: t.textSecondary, fontSize: "14px", margin: "0 0 4px 0" }}>
                This is what your sky could look like
              </p>
              <p style={{ color: t.textSecondary, fontSize: "12px", margin: 0, opacity: 0.6 }}>
                Years of dreams, plans, and adventures — all in one place
              </p>
            </div>
          )}

          {timelineProgress >= 1 && !timelineActive && (
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <p style={{ color: t.accent, fontSize: "16px", fontWeight: 600, margin: "0 0 6px 0" }}>
                {DEMO_ITEMS.length} stars in your sky
              </p>
              <p style={{ color: t.textSecondary, fontSize: "13px", margin: 0 }}>
                Every star is a story. Let's go write the first one.
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            {!timelineActive && timelineProgress < 1 && (
              <button
                onClick={() => { setTimelineProgress(0); setTimelineActive(true); }}
                style={{
                  flex: 1, padding: "14px", borderRadius: "14px",
                  background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                  border: "none", color: "white", fontSize: "15px", fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                ▶ Play your future sky
              </button>
            )}
            {timelineActive && (
              <button
                onClick={() => setTimelineActive(false)}
                style={{
                  flex: 1, padding: "14px", borderRadius: "14px",
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                  color: "white", fontSize: "15px", fontWeight: 600, cursor: "pointer",
                }}
              >
                ⏸ Pause
              </button>
            )}
            {timelineProgress >= 1 && !timelineActive && (
              <>
                <button
                  onClick={() => { setTimelineProgress(0); setTimelineActive(true); }}
                  style={{
                    padding: "14px 20px", borderRadius: "14px",
                    background: "transparent", border: `1px solid ${t.cardBorder}`,
                    color: t.textSecondary, fontSize: "14px", cursor: "pointer",
                  }}
                >
                  Replay
                </button>
                <button
                  onClick={onComplete}
                  style={{
                    flex: 1, padding: "14px", borderRadius: "14px",
                    background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                    border: "none", color: "white", fontSize: "15px", fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Start dreaming ✦
                </button>
              </>
            )}
          </div>

          {/* End demo always visible */}
          {timelineProgress < 1 && (
            <button onClick={onComplete} style={{
              width: "100%", marginTop: "12px", padding: "10px",
              background: "transparent", border: "none",
              color: "rgba(255,255,255,0.2)", fontSize: "12px", cursor: "pointer",
              letterSpacing: "1px",
            }}>
              end demo
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
