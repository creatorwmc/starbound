// Marks the current user as a Kairos household member.
//
// Takes its colour from the signed-in user's Starbound theme rather than
// Kairos gold — each app keeps its visual identity and the badge is a guest
// in it. Starbound themes per-user, so this is coral for Stacey and pale
// gold for Zach.

export default function KairosBadge({ membership, theme }) {
  if (!membership?.isMember) return null;
  const accent = theme?.accent || "#FFEAA7";
  return (
    <span
      title="Kairos household member"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        fontFamily: "'Courier New', monospace",
        fontSize: "9px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: accent,
        background: `${accent}1F`,
        border: `1px solid ${accent}40`,
        borderRadius: "4px",
        padding: "2px 7px",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: "8px", lineHeight: 1 }}>✦</span>
      <span>Kairos</span>
    </span>
  );
}
