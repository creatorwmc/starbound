import { useState, useEffect } from "react";
import { THEMES } from "../theme";

const PAGES = [
  {
    lines: ["Hey, you."],
    pause: 2500,
  },
  {
    lines: [
      "I built something for us.",
    ],
    pause: 3000,
  },
  {
    lines: [
      "Every dream we've whispered about.",
      "Every \"what if\" and \"someday.\"",
      "Every wild idea we've had at 2am.",
    ],
    pause: 4500,
  },
  {
    lines: [
      "I wanted a place to put them all.",
      "Somewhere they could live and grow.",
    ],
    pause: 4000,
  },
  {
    lines: [
      "So I made us a sky.",
    ],
    pause: 3000,
  },
  {
    lines: [
      "Every dream becomes a star.",
      "The more we plan, the brighter it gets.",
      "The more we do, the more the sky fills.",
    ],
    pause: 5000,
  },
  {
    lines: [
      "There's no way to fall behind.",
      "No wrong answers.",
      "No deadlines.",
    ],
    pause: 4000,
  },
  {
    lines: [
      "Just us — building a sky together.",
    ],
    pause: 3500,
  },
  {
    lines: [
      "I love you, Stacey.",
      "Let's go fill it with light.",
    ],
    pause: 4500,
  },
];

export default function StaceyIntro({ onComplete }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [fadeState, setFadeState] = useState("in"); // "in", "visible", "out"
  const [stars, setStars] = useState([]);
  const t = THEMES.stacey;

  // Add stars progressively
  useEffect(() => {
    if (pageIndex >= 4) {
      const count = (pageIndex - 3) * 5;
      const newStars = Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 85,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 2,
      }));
      setStars(newStars);
    }
  }, [pageIndex]);

  // Auto-advance pages
  useEffect(() => {
    if (pageIndex >= PAGES.length) return;
    const page = PAGES[pageIndex];

    // Fade in
    setFadeState("in");

    const visibleTimer = setTimeout(() => {
      setFadeState("visible");
    }, 800);

    const outTimer = setTimeout(() => {
      setFadeState("out");
    }, page.pause);

    const nextTimer = setTimeout(() => {
      if (pageIndex < PAGES.length - 1) {
        setPageIndex((p) => p + 1);
      } else {
        onComplete();
      }
    }, page.pause + 800);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(outTimer);
      clearTimeout(nextTimer);
    };
  }, [pageIndex, onComplete]);

  const page = PAGES[pageIndex];
  if (!page) return null;

  const isLastPage = pageIndex === PAGES.length - 1;
  const opacity = fadeState === "out" ? 0 : fadeState === "in" ? 0 : 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #0d0a1a 0%, #1a0f20 40%, #0d1520 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        overflow: "hidden",
      }}
    >
      {/* Background stars that build up */}
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: "50%",
            background: `rgba(250, 177, 160, ${0.15 + star.size * 0.1})`,
            animation: "twinkle 3s ease-in-out infinite",
            animationDelay: `${star.delay}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Text content */}
      <div
        style={{
          textAlign: "center",
          padding: "40px 32px",
          maxWidth: "340px",
          opacity: fadeState === "in" ? 0 : fadeState === "out" ? 0 : 1,
          transform: fadeState === "in"
            ? "translateY(12px)"
            : fadeState === "out"
            ? "translateY(-12px)"
            : "translateY(0)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        {page.lines.map((line, i) => (
          <p
            key={`${pageIndex}-${i}`}
            style={{
              color: isLastPage && i === 0 ? t.accent : t.textPrimary,
              fontSize: page.lines.length === 1 && line.length < 30 ? "24px" : "18px",
              fontWeight: page.lines.length === 1 ? 700 : 400,
              lineHeight: "1.7",
              margin: "0 0 8px 0",
              letterSpacing: page.lines.length === 1 ? "1px" : "0.3px",
              opacity: 0,
              animation: "introLineIn 0.6s ease forwards",
              animationDelay: `${0.8 + i * 0.4}s`,
            }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Skip button */}
      <button
        onClick={onComplete}
        style={{
          position: "absolute",
          bottom: "32px",
          right: "24px",
          padding: "8px 16px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.2)",
          fontSize: "12px",
          cursor: "pointer",
          letterSpacing: "1px",
        }}
      >
        skip
      </button>

      {/* Progress dots */}
      <div style={{
        position: "absolute",
        bottom: "36px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "6px",
      }}>
        {PAGES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === pageIndex ? "16px" : "4px",
              height: "4px",
              borderRadius: "2px",
              background: i === pageIndex
                ? t.primary
                : i < pageIndex
                ? `${t.primary}60`
                : "rgba(255,255,255,0.1)",
              transition: "all 0.4s ease",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes introLineIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
