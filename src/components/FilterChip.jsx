export default function FilterChip({ label, active, theme, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "11px",
        border: `1px solid ${active ? theme.primary : "rgba(255,255,255,0.15)"}`,
        background: active ? `${theme.primary}30` : "rgba(255,255,255,0.05)",
        color: active ? theme.textPrimary : theme.textSecondary,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
