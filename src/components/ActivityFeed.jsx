import { THEMES } from "../theme";
import AvatarCircle from "./AvatarCircle";

export default function ActivityFeed({ activities, theme }) {
  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 700, margin: "0 0 16px 0" }}>
        Activity
      </h2>
      {activities.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: theme.textSecondary }}>
          No activity yet — add your first dream!
        </div>
      ) : (
        activities.map((a, i) => (
          <div key={i} style={{
            padding: "12px", borderRadius: "12px",
            background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
            marginBottom: "8px", display: "flex", gap: "12px", alignItems: "center",
          }}>
            <span style={{ fontSize: "20px" }}>
              {THEMES[a.actor] ? <AvatarCircle user={a.actor} size={28} /> : "✧"}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ color: theme.textPrimary, fontSize: "14px" }}>{a.description}</div>
              <div style={{ color: theme.textSecondary, fontSize: "10px", marginTop: "4px" }}>
                {THEMES[a.actor]?.name} • {new Date(a.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
