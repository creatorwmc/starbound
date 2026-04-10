export default function OurHome({ theme }) {
  const areas = [
    { id: "house", name: "The House", icon: "🏠" },
    { id: "kitchen", name: "Kitchen", icon: "🍳" },
    { id: "porch", name: "The Porch", icon: "🌅" },
    { id: "animals", name: "Our Animals", icon: "🐷" },
    { id: "garden", name: "Garden & Land", icon: "🌿" },
    { id: "views", name: "Farm Views", icon: "🌄" },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 700, margin: "0 0 4px 0" }}>
        Our Home
      </h2>
      <p style={{ color: theme.textSecondary, fontSize: "12px", margin: "0 0 24px 0" }}>
        The ground beneath our stars
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {areas.map((area) => (
          <div
            key={area.id}
            style={{
              padding: "24px 16px", borderRadius: "16px",
              background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
              textAlign: "center", cursor: "pointer", transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>{area.icon}</div>
            <div style={{ color: theme.textPrimary, fontSize: "14px", fontWeight: 600 }}>{area.name}</div>
            <div style={{ color: theme.textSecondary, fontSize: "11px", marginTop: "4px" }}>
              Tap to add photos
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: "24px", padding: "20px", borderRadius: "14px",
        border: `1px dashed ${theme.cardBorder}`, textAlign: "center",
      }}>
        <div style={{ color: theme.textSecondary, fontSize: "13px" }}>
          📷 Walk around the farm with your phone
        </div>
        <div style={{ color: theme.textSecondary, fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
          Photo capture coming in Phase 3
        </div>
      </div>
    </div>
  );
}
