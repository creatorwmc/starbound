import { useState, useEffect, useRef, useMemo } from "react";
import Star from "./Star";
import FilterChip from "./FilterChip";
import SkyTimeline from "./SkyTimeline";
import { CATEGORIES } from "../theme";
import { generateDateRange } from "../utils/dateUtils";

export default function NightSky({
  items,
  theme,
  onItemClick,
  onAddNew,
  onGoHome,
  rememberThis,
  filters,
  setFilters,
  immersive,
  onToggleImmersive,
  timelineMode,
  setTimelineMode,
}) {
  const [viewDate, setViewDate] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef(null);

  // Build a sorted timeline of all significant dates
  const timelineDates = useMemo(() => {
    const dates = new Set();
    items.forEach((item) => {
      if (item.createdAt) dates.add(item.createdAt.slice(0, 10));
      if (item.completedAt) dates.add(item.completedAt.slice(0, 10));
      (item.notes || []).forEach((n) => {
        if (n.at) dates.add(n.at.slice(0, 10));
      });
    });
    return Array.from(dates).sort();
  }, [items]);

  const firstDate = timelineDates[0] || new Date().toISOString().slice(0, 10);
  const lastDate = timelineDates[timelineDates.length - 1] || new Date().toISOString().slice(0, 10);

  // Filter items based on viewDate
  const timelineItems = useMemo(() => {
    if (!timelineMode || !viewDate) return items;
    const cutoff = viewDate + "T23:59:59Z";
    return items
      .map((item) => {
        if (item.createdAt > cutoff) return null;
        let stageAtDate = "dream";
        if (item.completedAt && item.completedAt <= cutoff) stageAtDate = "done";
        const notesAtDate = (item.notes || []).filter((n) => n.at <= cutoff);
        const latestStageNote = [...notesAtDate].reverse().find((n) => n.stage);
        if (latestStageNote && stageAtDate !== "done") stageAtDate = latestStageNote.stage;
        return {
          ...item,
          stage: stageAtDate,
          activityCount: notesAtDate.length + 1,
          notes: notesAtDate,
        };
      })
      .filter(Boolean);
  }, [items, timelineMode, viewDate]);

  const allDays = useMemo(() => generateDateRange(firstDate, lastDate), [firstDate, lastDate]);

  // Playback logic
  useEffect(() => {
    if (isPlaying && allDays.length > 0) {
      let idx = 0;
      setViewDate(allDays[0]);
      playIntervalRef.current = setInterval(() => {
        idx += 1;
        if (idx >= allDays.length) {
          clearInterval(playIntervalRef.current);
          setIsPlaying(false);
          return;
        }
        setViewDate(allDays[idx]);
      }, 200);
      return () => clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, allDays]);

  const exitTimeline = () => {
    setTimelineMode(false);
    setViewDate(null);
    setIsPlaying(false);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
  };

  const displayItems = timelineMode ? timelineItems : items;
  const uiOpacity = immersive ? 0 : 1;
  const uiPointerEvents = immersive ? "none" : "auto";
  const uiTransition = "opacity 0.6s ease, transform 0.6s ease";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Sky gradient */}
      <div style={{ position: "absolute", inset: 0, background: theme.bg }} />

      {/* Ambient stars — subtle backdrop, clearly smaller/dimmer than real stars */}
      {Array.from({ length: immersive ? 80 : 30 }).map((_, i) => (
        <div key={`ambient-${i}`} style={{
          position: "absolute",
          left: `${(i * 17 + 3) % 100}%`,
          top: `${(i * 23 + 7) % (immersive ? 98 : 85)}%`,
          width: "1px",
          height: "1px",
          borderRadius: "50%",
          background: `rgba(255,255,255,${immersive ? 0.25 : 0.12})`,
          animation: "twinkle 5s ease-in-out infinite",
          animationDelay: `${(i * 0.5) % 5}s`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Bucket list stars */}
      {displayItems.map((item, i) => (
        <Star key={item.id} item={item} theme={theme} onClick={immersive ? () => {} : onItemClick} index={i} />
      ))}

      {/* Ground / horizon with homestead silhouette */}
      <div
        onClick={(e) => { if (!immersive) { e.stopPropagation(); onGoHome(); } }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70px",
          cursor: "pointer",
          overflow: "hidden",
          opacity: immersive ? 0.3 : 1,
          transition: "opacity 0.6s ease",
          pointerEvents: immersive ? "none" : "auto",
          zIndex: 5,
        }}
      >
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(18,12,8,0.95) 0%, rgba(18,12,8,0.6) 40%, transparent 100%)",
        }} />
        <svg viewBox="0 0 400 70" preserveAspectRatio="none" style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "50px", width: "100%",
        }}>
          <path d="M0,45 Q50,30 100,38 Q150,46 200,35 Q250,24 300,32 Q350,40 400,28 L400,70 L0,70 Z" fill="rgba(25,18,12,0.9)" />
          <path d="M0,55 Q60,42 120,48 Q180,54 240,44 Q300,34 360,42 Q380,46 400,40 L400,70 L0,70 Z" fill="rgba(30,22,15,0.95)" />
        </svg>
        <svg viewBox="0 0 120 50" style={{
          position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)",
          width: "100px", height: "42px", opacity: 0.7,
          filter: `drop-shadow(0 0 6px ${theme.glow})`,
          transition: "opacity 0.3s ease, filter 0.3s ease",
        }}>
          <polygon points="30,35 30,18 45,10 60,18 60,35" fill="rgba(45,35,25,0.95)" />
          <line x1="30" y1="18" x2="45" y2="10" stroke="rgba(80,60,40,0.6)" strokeWidth="1" />
          <line x1="45" y1="10" x2="60" y2="18" stroke="rgba(80,60,40,0.6)" strokeWidth="1" />
          <rect x="41" y="26" width="7" height="9" fill="rgba(60,45,30,0.8)" rx="1" />
          <rect x="33" y="22" width="5" height="5" fill={`${theme.accent}40`} rx="0.5" />
          <rect x="51" y="22" width="5" height="5" fill={`${theme.accent}40`} rx="0.5" />
          <rect x="35" y="8" width="4" height="10" fill="rgba(45,35,25,0.95)" />
          <rect x="68" y="22" width="18" height="13" fill="rgba(50,30,25,0.9)" />
          <polygon points="66,22 77,14 88,22" fill="rgba(55,35,28,0.9)" />
          <line x1="15" y1="35" x2="15" y2="30" stroke="rgba(60,45,30,0.5)" strokeWidth="1" />
          <line x1="22" y1="35" x2="22" y2="30" stroke="rgba(60,45,30,0.5)" strokeWidth="1" />
          <line x1="95" y1="35" x2="95" y2="30" stroke="rgba(60,45,30,0.5)" strokeWidth="1" />
          <line x1="102" y1="35" x2="102" y2="30" stroke="rgba(60,45,30,0.5)" strokeWidth="1" />
          <line x1="12" y1="31" x2="25" y2="31" stroke="rgba(60,45,30,0.4)" strokeWidth="0.8" />
          <line x1="92" y1="31" x2="105" y2="31" stroke="rgba(60,45,30,0.4)" strokeWidth="0.8" />
          <line x1="10" y1="35" x2="10" y2="22" stroke="rgba(50,40,30,0.6)" strokeWidth="1.5" />
          <circle cx="10" cy="19" r="5" fill="rgba(35,50,30,0.6)" />
          <line x1="0" y1="35" x2="120" y2="35" stroke="rgba(40,30,20,0.3)" strokeWidth="0.5" />
        </svg>
        <div style={{
          position: "absolute", bottom: "2px", left: "50%", transform: "translateX(-50%)",
          color: theme.textSecondary, fontSize: "9px", opacity: 0.35,
          letterSpacing: "2px", textTransform: "uppercase",
        }}>
          our home
        </div>
      </div>

      {/* Filter bar */}
      <div style={{
        position: "absolute", top: "12px", left: "12px", right: "12px",
        display: "flex", gap: "6px", flexWrap: "wrap",
        opacity: uiOpacity, pointerEvents: uiPointerEvents, transition: uiTransition, zIndex: 5,
      }}>
        <FilterChip label="All" active={!filters.category && !filters.stage} theme={theme}
          onClick={() => setFilters({})} />
        {CATEGORIES.map((cat) => (
          <FilterChip key={cat.id} label={cat.icon} active={filters.category === cat.id} theme={theme}
            onClick={() => setFilters((f) => ({ ...f, category: f.category === cat.id ? null : cat.id }))} />
        ))}
      </div>

      {/* Remember This card */}
      {rememberThis && !timelineMode && (
        <div
          onClick={(e) => { e.stopPropagation(); onItemClick(rememberThis); }}
          style={{
            position: "absolute", bottom: "90px", left: "20px", right: "20px",
            background: theme.cardBg, backdropFilter: "blur(20px)",
            border: `1px solid ${theme.cardBorder}`, borderRadius: "16px",
            padding: "16px", cursor: "pointer",
            opacity: uiOpacity, pointerEvents: uiPointerEvents, transition: uiTransition, zIndex: 5,
          }}
        >
          <div style={{ fontSize: "10px", color: theme.accent, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>
            ✧ Remember This ✧
          </div>
          <div style={{ color: theme.textPrimary, fontSize: "15px", fontWeight: 600 }}>
            {rememberThis.title}
          </div>
          {rememberThis.notes?.[0] && (
            <div style={{ color: theme.textSecondary, fontSize: "12px", marginTop: "6px", fontStyle: "italic" }}>
              "{rememberThis.notes[0].text?.slice(0, 80)}..."
            </div>
          )}
        </div>
      )}

      {/* Add new FAB */}
      {!timelineMode && (
        <button
          onClick={(e) => { e.stopPropagation(); onAddNew(); }}
          style={{
            position: "absolute", bottom: "100px", right: "20px",
            width: "56px", height: "56px", borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            border: "none", color: "white", fontSize: "28px", cursor: "pointer",
            boxShadow: `0 4px 20px ${theme.glow}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10, opacity: uiOpacity, pointerEvents: uiPointerEvents, transition: uiTransition,
          }}
        >
          +
        </button>
      )}

      {/* Star count */}
      <div style={{
        position: "absolute", top: "12px", right: "12px",
        color: theme.accent, fontSize: "13px", fontWeight: 600,
        textShadow: "0 0 10px rgba(0,0,0,0.5)",
        opacity: uiOpacity, transition: uiTransition, zIndex: 5,
      }}>
        {displayItems.length} ✧{displayItems.filter((i) => i.stage === "done").length > 0 ? ` · ${displayItems.filter((i) => i.stage === "done").length} ✦` : ""}
      </div>

      {/* Immersive mode exit */}
      {immersive && (
        <button
          onClick={() => onToggleImmersive(false)}
          style={{
            position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)",
            padding: "8px 20px", borderRadius: "20px",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.3)", fontSize: "12px", cursor: "pointer",
            zIndex: 10, letterSpacing: "1px", animation: "fadeHint 6s ease forwards",
          }}
        >
          tap to return
        </button>
      )}

      {/* Timeline controls */}
      {timelineMode && (
        <SkyTimeline
          theme={theme}
          viewDate={viewDate}
          setViewDate={setViewDate}
          allDays={allDays}
          firstDate={firstDate}
          isPlaying={isPlaying}
          startPlayback={() => setIsPlaying(true)}
          stopPlayback={() => { setIsPlaying(false); if (playIntervalRef.current) clearInterval(playIntervalRef.current); }}
          exitTimeline={exitTimeline}
          timelineItems={timelineItems}
        />
      )}
    </div>
  );
}
