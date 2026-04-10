import { CATEGORIES } from "../theme";

export default function ConstellationCelebration({ constellation, theme }) {
  const cat = CATEGORIES.find((c) => c.id === constellation.category);

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 150,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
      animation: "conCelebFade 4s ease forwards",
      pointerEvents: "none",
    }}>
      <div style={{
        textAlign: "center", padding: "32px",
        animation: "conCelebScale 4s ease forwards",
      }}>
        {/* Burst ring */}
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          margin: "0 auto 20px",
          background: `radial-gradient(circle, ${cat?.color || theme.accent}40 0%, transparent 70%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "conCelebPulse 1.5s ease-in-out infinite",
          boxShadow: `0 0 40px ${cat?.color || theme.accent}50, 0 0 80px ${cat?.color || theme.accent}20`,
        }}>
          <span style={{ fontSize: "36px" }}>{cat?.icon || "✦"}</span>
        </div>

        <div style={{
          color: cat?.color || theme.accent,
          fontSize: "11px", textTransform: "uppercase",
          letterSpacing: "4px", marginBottom: "8px",
          opacity: 0, animation: "introLineIn 0.5s ease 0.3s forwards",
        }}>
          Constellation Unlocked
        </div>

        <div style={{
          color: theme.textPrimary, fontSize: "22px", fontWeight: 700,
          marginBottom: "8px",
          opacity: 0, animation: "introLineIn 0.5s ease 0.5s forwards",
        }}>
          {cat?.label || constellation.category}
        </div>

        <div style={{
          color: theme.textSecondary, fontSize: "13px",
          opacity: 0, animation: "introLineIn 0.5s ease 0.7s forwards",
        }}>
          {constellation.threshold} stars aligned — your {cat?.label?.toLowerCase() || "dreams"} are forming something beautiful
        </div>
      </div>

      <style>{`
        @keyframes conCelebFade {
          0% { opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes conCelebScale {
          0% { transform: scale(0.8); }
          15% { transform: scale(1.05); }
          25% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        @keyframes conCelebPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes introLineIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
