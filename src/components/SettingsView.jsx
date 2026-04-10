import { THEMES, OUR_APPS } from "../theme";
import AvatarCircle from "./AvatarCircle";

export default function SettingsView({ theme, currentUser, onSwitchUser }) {
  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 700, margin: "0 0 24px 0" }}>
        Settings
      </h2>

      {/* Current user */}
      <div style={{
        padding: "20px", borderRadius: "16px",
        background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
        marginBottom: "16px", display: "flex", alignItems: "center", gap: "16px",
      }}>
        <AvatarCircle user={currentUser} size={48} />
        <div>
          <div style={{ color: theme.textPrimary, fontSize: "18px", fontWeight: 600 }}>
            {THEMES[currentUser]?.name}
          </div>
          <div style={{ color: theme.textSecondary, fontSize: "12px", marginTop: "2px" }}>
            This phone is set up as {THEMES[currentUser]?.name}
          </div>
        </div>
      </div>

      {/* Category management */}
      <div style={{
        padding: "16px", borderRadius: "14px",
        background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
        marginBottom: "12px", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ color: theme.textPrimary, fontSize: "15px", fontWeight: 600 }}>Categories</div>
          <div style={{ color: theme.textSecondary, fontSize: "12px", marginTop: "2px" }}>Manage bucket list categories</div>
        </div>
        <span style={{ color: theme.textSecondary, fontSize: "16px" }}>→</span>
      </div>

      {/* Notifications */}
      <div style={{
        padding: "16px", borderRadius: "14px",
        background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
        marginBottom: "12px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ color: theme.textPrimary, fontSize: "15px", fontWeight: 600 }}>Notifications</div>
          <div style={{ color: theme.textSecondary, fontSize: "12px", marginTop: "2px" }}>Hidden Gem alerts</div>
        </div>
        <span style={{ color: theme.textSecondary, fontSize: "16px" }}>→</span>
      </div>

      {/* Guided mode default */}
      <div style={{
        padding: "16px", borderRadius: "14px",
        background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
        marginBottom: "24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ color: theme.textPrimary, fontSize: "15px", fontWeight: 600 }}>Default Mode</div>
          <div style={{ color: theme.textSecondary, fontSize: "12px", marginTop: "2px" }}>Guided or minimalist for new items</div>
        </div>
        <span style={{ color: theme.textSecondary, fontSize: "16px" }}>→</span>
      </div>

      {/* Our Apps */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{
          color: theme.textSecondary, fontSize: "11px",
          textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px",
        }}>
          Our Apps
        </h3>
        {OUR_APPS.map((app) => (
          <button
            key={app.name}
            onClick={() => window.open(app.url, '_blank', 'noopener,noreferrer')}
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "14px 16px", borderRadius: "14px",
              background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
              marginBottom: "8px", cursor: "pointer", width: "100%",
              textAlign: "left", font: "inherit", color: "inherit",
            }}
          >
            <span style={{ fontSize: "24px", flexShrink: 0 }}>{app.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: theme.textPrimary, fontSize: "15px", fontWeight: 600 }}>
                {app.name}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: "11px", marginTop: "2px" }}>
                {app.desc}
              </div>
            </div>
            <span style={{ color: theme.textSecondary, fontSize: "14px" }}>↗</span>
          </button>
        ))}
      </div>

      {/* Switch user */}
      <button
        onClick={onSwitchUser}
        style={{
          width: "100%", padding: "14px", borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.08)", background: "transparent",
          color: theme.textSecondary, fontSize: "14px", cursor: "pointer",
        }}
      >
        Switch user (set up as {currentUser === "zach" ? "Stacey" : "Zach"} instead)
      </button>

      {/* About */}
      <div style={{ textAlign: "center", marginTop: "32px", padding: "20px" }}>
        <div style={{
          fontSize: "14px", fontWeight: 700, letterSpacing: "2px",
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          STARBOUND
        </div>
        <div style={{ color: theme.textSecondary, fontSize: "11px", marginTop: "6px", opacity: 0.5 }}>
          Dreams we're building together
        </div>
      </div>
    </div>
  );
}
