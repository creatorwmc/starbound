import { formatFullDate, formatShortDate } from "../utils/dateUtils";

export default function SkyTimeline({
  theme,
  viewDate,
  setViewDate,
  allDays,
  firstDate,
  isPlaying,
  startPlayback,
  stopPlayback,
  exitTimeline,
  timelineItems,
}) {
  const currentDayIndex = viewDate ? allDays.indexOf(viewDate) : allDays.length - 1;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)",
        padding: "60px 20px 24px",
        zIndex: 15,
      }}
    >
      {/* Date display */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{
          color: theme.accent,
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "3px",
          marginBottom: "4px",
        }}>
          {isPlaying ? "✧ Playing your story ✧" : "✧ Sky on this date ✧"}
        </div>
        <div style={{
          color: theme.textPrimary,
          fontSize: "20px",
          fontWeight: 700,
        }}>
          {viewDate ? formatFullDate(viewDate) : ""}
        </div>
        <div style={{
          color: theme.textSecondary,
          fontSize: "12px",
          marginTop: "4px",
        }}>
          {timelineItems.length} star{timelineItems.length !== 1 ? "s" : ""} in the sky
          {" • "}
          {timelineItems.filter((i) => i.stage === "done").length} completed
          {" • "}
          {timelineItems.filter((i) => i.stage === "released").length} in the nebula
        </div>
      </div>

      {/* Timeline slider */}
      <div style={{ position: "relative", margin: "0 8px 16px" }}>
        <input
          type="range"
          min={0}
          max={allDays.length - 1}
          value={currentDayIndex >= 0 ? currentDayIndex : allDays.length - 1}
          onChange={(e) => {
            if (!isPlaying) setViewDate(allDays[parseInt(e.target.value)]);
          }}
          style={{
            width: "100%",
            height: "4px",
            appearance: "none",
            background: `linear-gradient(90deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
            borderRadius: "2px",
            outline: "none",
            cursor: isPlaying ? "default" : "pointer",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ color: theme.textSecondary, fontSize: "9px" }}>
            {formatShortDate(firstDate)}
          </span>
          <span style={{ color: theme.textSecondary, fontSize: "9px" }}>
            Today
          </span>
        </div>
      </div>

      {/* Playback controls */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button
          onClick={isPlaying ? stopPlayback : startPlayback}
          style={{
            padding: "10px 24px",
            borderRadius: "12px",
            background: isPlaying
              ? "rgba(255,255,255,0.1)"
              : `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            border: isPlaying ? "1px solid rgba(255,255,255,0.2)" : "none",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isPlaying ? "⏸ Pause" : "▶ Play from beginning"}
        </button>
        <button
          onClick={exitTimeline}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            color: theme.textSecondary,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ✕ Close
        </button>
      </div>
    </div>
  );
}
