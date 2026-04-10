import { THEMES } from "../theme";

export default function FirstTimeSetup({ onSelect }) {
  return (
    <div style={{
      height: "100%",
      background: "linear-gradient(135deg, #0c0c2e 0%, #1a0f2e 50%, #1a0c0c 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "48px",
      padding: "20px",
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{
          fontSize: "36px",
          fontWeight: 800,
          background: "linear-gradient(135deg, #A29BFE 0%, #FFEAA7 50%, #FAB1A0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: 0,
          letterSpacing: "4px",
        }}>
          STARBOUND
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", letterSpacing: "3px", marginTop: "8px" }}>
          DREAMS WE'RE BUILDING TOGETHER
        </p>
      </div>

      <div style={{ textAlign: "center", width: "100%", maxWidth: "340px" }}>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", marginBottom: "28px" }}>
          Who's holding the phone?
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {Object.entries(THEMES)
            .filter(([k]) => k !== "shared")
            .map(([key, t]) => (
              <button
                key={key}
                onClick={() => onSelect(key)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  borderRadius: "16px",
                  border: `1px solid ${t.cardBorder}`,
                  background: t.cardBg,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = `1px solid ${t.primary}`;
                  e.currentTarget.style.boxShadow = `0 0 24px ${t.glow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = `1px solid ${t.cardBorder}`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "22px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {t.initial}
                </div>
                <span style={{ color: t.textPrimary, fontSize: "20px", fontWeight: 600 }}>
                  {t.name}
                </span>
              </button>
            ))}
        </div>

        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", marginTop: "24px" }}>
          This sets up your phone — you'll only need to do this once.
        </p>
      </div>

      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 23 + 5) % 100}%`,
          top: `${(i * 31 + 3) % 100}%`,
          width: `${1 + (i % 3)}px`,
          height: `${1 + (i % 3)}px`,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          animation: "twinkle 3s ease-in-out infinite",
          animationDelay: `${(i * 0.4) % 3}s`,
          pointerEvents: "none",
        }} />
      ))}
    </div>
  );
}
