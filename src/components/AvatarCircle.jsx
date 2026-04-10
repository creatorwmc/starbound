import { THEMES } from "../theme";

export default function AvatarCircle({ user, size = 40 }) {
  const t = THEMES[user];
  if (!t) return null;
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: `${size * 0.45}px`,
      fontWeight: 700,
      letterSpacing: "0.5px",
      flexShrink: 0,
    }}>
      {t.initial}
    </div>
  );
}
