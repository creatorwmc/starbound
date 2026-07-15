import { CATEGORIES } from "../theme";
import { getShape } from "../utils/constellationShapes";

export default function ConstellationCelebration({ constellation, theme, mode = "zodiac" }) {
  const cat = CATEGORIES.find((c) => c.id === constellation.category);
  const shape = getShape(mode, constellation.orderIndex || 0);
  const color = cat?.color || theme.accent;

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
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          margin: "0 auto 20px",
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "conCelebPulse 1.5s ease-in-out infinite",
          boxShadow: `0 0 40px ${color}50, 0 0 80px ${color}20`,
        }}>
          <span style={{ fontSize: "36px" }}>{cat?.icon || "✦"}</span>
        </div>

        <div style={{
          color, fontSize: "11px", textTransform: "uppercase",
          letterSpacing: "4px", marginBottom: "8px",
          opacity: 0, animation: "introLineIn 0.5s ease 0.3s forwards",
        }}>
          Constellation Formed
        </div>

        <div style={{
          color: theme.textPrimary, fontSize: "22px", fontWeight: 700,
          marginBottom: "4px",
          opacity: 0, animation: "introLineIn 0.5s ease 0.5s forwards",
        }}>
          {shape.name}
        </div>

        <div style={{
          color: theme.textSecondary, fontSize: "13px", marginBottom: "10px",
          opacity: 0, animation: "introLineIn 0.5s ease 0.65s forwards",
        }}>
          {cat?.label || constellation.category}
        </div>

        <div style={{
          color: theme.textSecondary, fontSize: "12px", fontStyle: "italic",
          opacity: 0, animation: "introLineIn 0.5s ease 0.8s forwards",
        }}>
          three stars aligned — the shape stays, forever
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
