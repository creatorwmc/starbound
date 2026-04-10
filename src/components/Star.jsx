import { memo } from "react";
import { THEMES, TIERS, STAGES } from "../theme";
import { generateStarPosition } from "../utils/starPositions";

const Star = memo(function Star({ item, theme, onClick, index, isNew, clusterPos }) {
  const originalPos = generateStarPosition(item.id, index);
  const pos = clusterPos || originalPos;
  const inConstellation = !!clusterPos;
  const tier = TIERS.find((t) => t.id === item.tier) || TIERS[1];
  const stage = STAGES.find((s) => s.id === item.stage);
  const ownerTheme = item.owner === "shared" ? null : THEMES[item.owner];
  const starColor = item.owner === "shared" ? THEMES.shared.starColor : (ownerTheme?.starColor || theme.starColor);

  const isReleased = item.stage === "released";
  const isDone = item.stage === "done";
  const isDoing = item.stage === "doing";
  const activityBrightness = Math.min(1, 0.4 + (item.activityCount || 0) * 0.1);
  const rawSize = tier.size * (isDone ? 1.4 : isDoing ? 1.2 : 1);
  const baseSize = Math.max(rawSize, 4);

  if (isReleased) {
    return (
      <div
        onClick={() => onClick(item)}
        style={{
          position: "absolute",
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: `${baseSize * 6}px`,
          height: `${baseSize * 6}px`,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${starColor}15 0%, transparent 70%)`,
          cursor: "pointer",
          transition: "all 0.3s ease",
          filter: "blur(2px)",
        }}
        title={item.title}
      />
    );
  }

  return (
    <div
      onClick={() => onClick(item)}
      style={{
        position: "absolute",
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: `${baseSize * 2.5}px`,
        height: `${baseSize * 2.5}px`,
        cursor: "pointer",
        transition: inConstellation ? "left 2s ease, top 2s ease, all 0.3s ease" : "all 0.3s ease",
        zIndex: isNew ? 10 : isDone ? 3 : 2,
        animation: isNew ? "starBirth 2s ease-out forwards" : undefined,
      }}
      title={item.title}
    >
      {/* Birth flash — expanding ring of light */}
      {isNew && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: `${baseSize * 2.5}px`,
          height: `${baseSize * 2.5}px`,
          borderRadius: "50%",
          animation: "starBurst 1.5s ease-out forwards",
          background: `radial-gradient(circle, ${starColor} 0%, transparent 60%)`,
          pointerEvents: "none",
        }} />
      )}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${starColor} 0%, ${starColor}80 40%, transparent 70%)`,
          opacity: isNew ? 1 : activityBrightness,
          boxShadow: isNew
            ? `0 0 ${baseSize * 6}px ${starColor}, 0 0 ${baseSize * 12}px ${starColor}80`
            : isDone
            ? `0 0 ${baseSize * 4}px ${starColor}80, 0 0 ${baseSize * 8}px ${starColor}40`
            : isDoing
            ? `0 0 ${baseSize * 3}px ${starColor}60`
            : `0 0 ${baseSize * 2}px ${starColor}30`,
          animation: isNew
            ? "starGlow 2s ease-out forwards"
            : isDoing ? "pulse 2s ease-in-out infinite" : "twinkle 3s ease-in-out infinite",
          animationDelay: isNew ? "0s" : `${(index * 0.7) % 3}s`,
        }}
      />
      {item.isHonorCompletion && (
        <div
          style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: item.owner === "zach" ? THEMES.stacey.starColor : THEMES.zach.starColor,
            boxShadow: `0 0 6px ${item.owner === "zach" ? THEMES.stacey.starColor : THEMES.zach.starColor}`,
          }}
        />
      )}
    </div>
  );
});

export default Star;
