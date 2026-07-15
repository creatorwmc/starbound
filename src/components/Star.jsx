import { memo } from "react";
import { THEMES, TIERS } from "../theme";
import { generateStarPosition } from "../utils/starPositions";

// Subtle starlight tints per category — all in the blue/white/warm white spectrum
const CATEGORY_TINTS = {
  travel: "#c8d8ff",
  skills: "#d4ccff",
  food: "#fff4d6",
  experiences: "#ffe8e0",
  home: "#d6ffe8",
  creative: "#ffd6e8",
  relationships: "#e0d6ff",
  wildcard: "#e8f0ff",
};

// Stage → visual treatment. Brightness is the primary stage signal; constellations
// "light up" as their member stars move from dream → planning → doing → done.
const STAGE_STYLES = {
  dream: {
    brightness: 0.4,
    sizeMul: 1.0,
    haloMul: 1.6,
    animation: "twinkleSlow 5s ease-in-out infinite",
  },
  planning: {
    brightness: 0.62,
    sizeMul: 1.05,
    haloMul: 2.4,
    animation: "starBreathe 4s ease-in-out infinite",
  },
  doing: {
    brightness: 0.88,
    sizeMul: 1.18,
    haloMul: 3.4,
    animation: "starPulse 1.8s ease-in-out infinite",
  },
  done: {
    brightness: 1.0,
    sizeMul: 1.35,
    haloMul: 5.0,
    animation: null, // steady
  },
  released: {
    brightness: 0.18,
    sizeMul: 1.0,
    haloMul: 0,
    animation: null,
  },
};

const Star = memo(function Star({ item, theme, onClick, index, isNew, clusterPos }) {
  const originalPos = generateStarPosition(item.id, index);
  const pos = clusterPos || originalPos;
  const inConstellation = !!clusterPos;
  const tier = TIERS.find((t) => t.id === item.tier) || TIERS[1];
  const stage = STAGE_STYLES[item.stage] || STAGE_STYLES.dream;
  const starColor = CATEGORY_TINTS[item.category] || "#e8f0ff";

  const isReleased = item.stage === "released";
  const isDone = item.stage === "done";

  const baseSize = Math.max(tier.size * stage.sizeMul, 4);

  if (isReleased) {
    return (
      <div
        onClick={() => onClick(item)}
        style={{
          position: "absolute",
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: `${baseSize * 5}px`,
          height: `${baseSize * 5}px`,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${starColor}18 0%, transparent 70%)`,
          opacity: stage.brightness,
          cursor: "pointer",
          transition: "all 0.3s ease",
          filter: "blur(2px)",
          zIndex: 2,
        }}
        title={item.title}
      />
    );
  }

  // Halo gets a soft inner + outer glow that grows with stage progress.
  const halo = isNew
    ? `0 0 ${baseSize * 6}px ${starColor}, 0 0 ${baseSize * 12}px ${starColor}80`
    : isDone
      ? `0 0 ${baseSize * stage.haloMul}px ${starColor}aa, 0 0 ${baseSize * stage.haloMul * 2}px ${starColor}40`
      : stage.haloMul > 0
        ? `0 0 ${baseSize * stage.haloMul}px ${starColor}80`
        : "none";

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
        transition: inConstellation ? "left 1.6s ease, top 1.6s ease" : "all 0.3s ease",
        zIndex: isNew ? 10 : isDone ? 4 : 3,
        animation: isNew ? "starBirth 2s ease-out forwards" : undefined,
      }}
      title={item.title}
    >
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
          background: `radial-gradient(circle, #ffffff 0%, ${starColor}80 30%, transparent 60%)`,
          pointerEvents: "none",
        }} />
      )}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: `radial-gradient(circle, #ffffff 0%, ${starColor} 30%, ${starColor}60 50%, transparent 70%)`,
          opacity: isNew ? 1 : stage.brightness,
          boxShadow: halo,
          animation: isNew
            ? "starGlow 2s ease-out forwards"
            : stage.animation || undefined,
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
