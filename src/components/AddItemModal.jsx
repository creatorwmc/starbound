import { useState } from "react";
import { CATEGORIES, TIERS, GUIDED_PROMPTS } from "../theme";

export default function AddItemModal({ theme, currentUser, onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tier, setTier] = useState(2);
  const [owner, setOwner] = useState("shared");
  const [notes, setNotes] = useState("");
  const [useGuided, setUseGuided] = useState(false);
  const [guidedAnswers, setGuidedAnswers] = useState({});

  const prompts = GUIDED_PROMPTS[category] || [];

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)",
      zIndex: 100, display: "flex", flexDirection: "column", overflow: "auto",
    }}>
      <div style={{ padding: "20px", maxWidth: "500px", width: "100%", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 700, margin: 0 }}>
            New Dream ✧
          </h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: theme.textSecondary,
            fontSize: "24px", cursor: "pointer",
          }}>×</button>
        </div>

        {/* Title */}
        <label style={{ color: theme.textSecondary, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
          What's the dream?
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Name this star..."
          style={{
            width: "100%", padding: "14px", borderRadius: "12px",
            border: `1px solid ${theme.cardBorder}`, background: theme.cardBg,
            color: theme.textPrimary, fontSize: "16px",
            marginTop: "6px", marginBottom: "20px", outline: "none", boxSizing: "border-box",
          }}
        />

        {/* Category */}
        <label style={{ color: theme.textSecondary, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
          Category
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "6px", marginBottom: "20px" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                padding: "8px 14px", borderRadius: "12px",
                border: `1px solid ${category === cat.id ? cat.color : "rgba(255,255,255,0.1)"}`,
                background: category === cat.id ? `${cat.color}20` : "transparent",
                color: category === cat.id ? cat.color : theme.textSecondary,
                fontSize: "13px", cursor: "pointer",
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Tier */}
        <label style={{ color: theme.textSecondary, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
          How big is this dream?
        </label>
        <div style={{ display: "flex", gap: "8px", marginTop: "6px", marginBottom: "20px" }}>
          {TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTier(t.id)}
              style={{
                flex: 1, padding: "12px 8px", borderRadius: "12px",
                border: `1px solid ${tier === t.id ? theme.primary : "rgba(255,255,255,0.1)"}`,
                background: tier === t.id ? `${theme.primary}20` : "transparent",
                color: tier === t.id ? theme.textPrimary : theme.textSecondary,
                fontSize: "12px", cursor: "pointer", textAlign: "center",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>{t.icon}</div>
              {t.label}
            </button>
          ))}
        </div>

        {/* Owner */}
        <label style={{ color: theme.textSecondary, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
          Whose dream?
        </label>
        <div style={{ display: "flex", gap: "8px", marginTop: "6px", marginBottom: "20px" }}>
          {[
            { id: "shared", label: "Ours" },
            { id: "zach", label: "Zach's" },
            { id: "stacey", label: "Stacey's" },
          ].map((o) => (
            <button
              key={o.id}
              onClick={() => setOwner(o.id)}
              style={{
                flex: 1, padding: "10px", borderRadius: "12px",
                border: `1px solid ${owner === o.id ? theme.accent : "rgba(255,255,255,0.1)"}`,
                background: owner === o.id ? `${theme.accent}15` : "transparent",
                color: owner === o.id ? theme.accent : theme.textSecondary,
                fontSize: "14px", cursor: "pointer",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Notes */}
        <label style={{ color: theme.textSecondary, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="First thoughts, links, ideas..."
          rows={3}
          style={{
            width: "100%", padding: "14px", borderRadius: "12px",
            border: `1px solid ${theme.cardBorder}`, background: theme.cardBg,
            color: theme.textPrimary, fontSize: "14px",
            marginTop: "6px", marginBottom: "20px", outline: "none",
            resize: "vertical", fontFamily: "inherit", boxSizing: "border-box",
          }}
        />

        {/* Guided mode toggle */}
        {category && prompts.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={() => setUseGuided(!useGuided)}
              style={{
                padding: "10px 16px", borderRadius: "12px",
                border: `1px solid ${useGuided ? theme.accent : "rgba(255,255,255,0.1)"}`,
                background: useGuided ? `${theme.accent}15` : "transparent",
                color: useGuided ? theme.accent : theme.textSecondary,
                fontSize: "13px", cursor: "pointer", width: "100%",
              }}
            >
              {useGuided ? "✦ Guided Mode Active" : "☆ Enable Guided Mode"}
            </button>

            {useGuided && (
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {prompts.map((prompt, i) => (
                  <div key={i}>
                    <label style={{ color: theme.accent, fontSize: "12px", fontStyle: "italic" }}>
                      {prompt}
                    </label>
                    <input
                      value={guidedAnswers[i] || ""}
                      onChange={(e) => setGuidedAnswers({ ...guidedAnswers, [i]: e.target.value })}
                      style={{
                        width: "100%", padding: "10px", borderRadius: "10px",
                        border: `1px solid ${theme.cardBorder}`, background: theme.cardBg,
                        color: theme.textPrimary, fontSize: "13px",
                        marginTop: "4px", outline: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={() => {
            if (!title.trim()) return;
            const guidedNotes = useGuided
              ? Object.entries(guidedAnswers)
                  .filter(([, v]) => v)
                  .map(([k, v]) => `${prompts[k]}\n${v}`)
                  .join("\n\n")
              : "";
            onSave({
              id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              title: title.trim(),
              category: category || "wildcard",
              tier,
              owner,
              stage: "dream",
              createdBy: currentUser,
              createdAt: new Date().toISOString(),
              activityCount: 1,
              notes: [
                ...(notes ? [{ text: notes, by: currentUser, at: new Date().toISOString(), stage: "dream" }] : []),
                ...(guidedNotes ? [{ text: guidedNotes, by: currentUser, at: new Date().toISOString(), stage: "dream", guided: true }] : []),
              ],
              media: [],
            });
          }}
          disabled={!title.trim()}
          style={{
            width: "100%", padding: "16px", borderRadius: "14px", border: "none",
            background: title.trim()
              ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
              : "rgba(255,255,255,0.1)",
            color: "white", fontSize: "16px", fontWeight: 700,
            cursor: title.trim() ? "pointer" : "default", letterSpacing: "1px",
          }}
        >
          Place This Star ✦
        </button>
      </div>
    </div>
  );
}
