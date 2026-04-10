export default function NavMenu({ theme, currentView, onNavigate, onClose }) {
  const items = [
    { id: "sky", label: "Night Sky", icon: "✦" },
    { id: "home", label: "Our Home", icon: "🏡" },
    { id: "list", label: "Bucket List", icon: "📋" },
    { id: "feed", label: "Activity", icon: "⚡" },
    { id: "jar", label: "The Hearth", icon: "🔥" },
    { id: "gems", label: "Hidden Gems", icon: "💎" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
        zIndex: 50, display: "flex", alignItems: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", background: theme.bg,
          borderRadius: "20px 20px 0 0",
          padding: "24px 20px 36px",
          borderTop: `1px solid ${theme.cardBorder}`,
        }}
      >
        <div style={{
          width: "40px", height: "4px", borderRadius: "2px",
          background: "rgba(255,255,255,0.2)", margin: "0 auto 20px",
        }} />
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => { onNavigate(item.id); onClose(); }}
            style={{
              width: "100%", padding: "16px", borderRadius: "12px",
              border: "none",
              background: currentView === item.id ? `${theme.primary}20` : "transparent",
              color: currentView === item.id ? theme.textPrimary : theme.textSecondary,
              fontSize: "16px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "16px", marginBottom: "4px",
            }}
          >
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
            <span style={{ fontWeight: currentView === item.id ? 600 : 400 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
