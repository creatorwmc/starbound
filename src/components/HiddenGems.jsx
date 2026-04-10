import { useState } from "react";
import { THEMES } from "../theme";

const TRIGGER_TYPES = [
  { id: "item_completed", label: "Item completed", desc: "When a specific item moves to Done" },
  { id: "keyword", label: "Keyword detected", desc: "When the other creates an item with this word" },
  { id: "category_milestone", label: "Category milestone", desc: "When N items in a category are done" },
  { id: "date", label: "Date reached", desc: "On a specific date" },
  { id: "sky_milestone", label: "Sky milestone", desc: "At a specific star count" },
];

export default function HiddenGems({ theme, currentUser, triggers, onPlant }) {
  const [showPlant, setShowPlant] = useState(false);
  const [triggerType, setTriggerType] = useState("item_completed");
  const [condition, setCondition] = useState("");
  const [message, setMessage] = useState("");

  const myTriggers = triggers.filter((t) => t.plantedBy === currentUser && t.status === "planted");
  const discovered = triggers.filter((t) => t.status === "fired");

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 700, margin: "0 0 4px 0" }}>
        Hidden Gems
      </h2>
      <p style={{ color: theme.textSecondary, fontSize: "12px", margin: "0 0 24px 0" }}>
        Plant surprises for {currentUser === "zach" ? "Stacey" : "Zach"}
      </p>

      {!showPlant ? (
        <button
          onClick={() => setShowPlant(true)}
          style={{
            width: "100%", padding: "16px", borderRadius: "14px",
            background: `linear-gradient(135deg, ${theme.primary}20, ${theme.accent}10)`,
            border: `1px solid ${theme.primary}30`,
            color: theme.accent, fontSize: "15px", fontWeight: 600,
            cursor: "pointer", marginBottom: "24px",
          }}
        >
          ✧ Plant a Surprise
        </button>
      ) : (
        <div style={{
          padding: "16px", borderRadius: "14px",
          background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
          marginBottom: "24px",
        }}>
          <h3 style={{ color: theme.textPrimary, fontSize: "16px", fontWeight: 600, margin: "0 0 16px 0" }}>
            Plant a Surprise
          </h3>

          <label style={{ color: theme.textSecondary, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
            When should this appear?
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px", marginBottom: "16px" }}>
            {TRIGGER_TYPES.map((tt) => (
              <button
                key={tt.id}
                onClick={() => setTriggerType(tt.id)}
                style={{
                  padding: "10px 12px", borderRadius: "10px",
                  border: `1px solid ${triggerType === tt.id ? theme.primary : "rgba(255,255,255,0.08)"}`,
                  background: triggerType === tt.id ? `${theme.primary}15` : "transparent",
                  color: theme.textPrimary, fontSize: "13px", cursor: "pointer", textAlign: "left",
                }}
              >
                <div style={{ fontWeight: 600 }}>{tt.label}</div>
                <div style={{ fontSize: "11px", color: theme.textSecondary, marginTop: "2px" }}>{tt.desc}</div>
              </button>
            ))}
          </div>

          <label style={{ color: theme.textSecondary, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
            Condition
          </label>
          <input
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder={triggerType === "keyword" ? "Enter keyword..." : triggerType === "date" ? "YYYY-MM-DD" : "Enter condition..."}
            style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              border: `1px solid ${theme.cardBorder}`, background: "rgba(255,255,255,0.03)",
              color: theme.textPrimary, fontSize: "14px",
              marginTop: "6px", marginBottom: "16px", outline: "none", boxSizing: "border-box",
            }}
          />

          <label style={{ color: theme.textSecondary, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
            Your message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your surprise message..."
            rows={3}
            style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              border: `1px solid ${theme.cardBorder}`, background: "rgba(255,255,255,0.03)",
              color: theme.textPrimary, fontSize: "14px",
              marginTop: "6px", marginBottom: "16px", outline: "none",
              resize: "vertical", fontFamily: "inherit", boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => {
                if (condition && message) {
                  onPlant({
                    id: `trigger-${Date.now()}`,
                    plantedBy: currentUser,
                    targetUser: currentUser === "zach" ? "stacey" : "zach",
                    triggerType,
                    condition,
                    message,
                    status: "planted",
                    plantedAt: new Date().toISOString(),
                  });
                  setShowPlant(false);
                  setCondition("");
                  setMessage("");
                }
              }}
              style={{
                flex: 1, padding: "12px", borderRadius: "12px",
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                border: "none", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer",
              }}
            >
              Plant ✧
            </button>
            <button
              onClick={() => setShowPlant(false)}
              style={{
                padding: "12px 20px", borderRadius: "12px",
                background: "transparent", border: `1px solid ${theme.cardBorder}`,
                color: theme.textSecondary, fontSize: "14px", cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {myTriggers.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ color: theme.textSecondary, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" }}>
            Your Planted Surprises ({myTriggers.length})
          </h3>
          {myTriggers.map((t) => (
            <div key={t.id} style={{
              padding: "12px", borderRadius: "12px",
              background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
              marginBottom: "8px",
            }}>
              <div style={{ color: theme.accent, fontSize: "11px", marginBottom: "4px" }}>
                {TRIGGER_TYPES.find((tt) => tt.id === t.triggerType)?.label}: {t.condition}
              </div>
              <div style={{ color: theme.textPrimary, fontSize: "13px", fontStyle: "italic" }}>
                "{t.message.slice(0, 60)}{t.message.length > 60 ? "..." : ""}"
              </div>
            </div>
          ))}
        </div>
      )}

      {discovered.length > 0 && (
        <div>
          <h3 style={{ color: theme.accent, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" }}>
            ✦ Discovered Gems
          </h3>
          {discovered.map((t) => (
            <div key={t.id} style={{
              padding: "16px", borderRadius: "14px",
              background: `linear-gradient(135deg, ${theme.primary}10, ${theme.accent}08)`,
              border: `1px solid ${theme.accent}20`,
              marginBottom: "8px",
            }}>
              <div style={{ color: theme.accent, fontSize: "11px", marginBottom: "6px" }}>
                A surprise from {THEMES[t.plantedBy]?.name}
              </div>
              <div style={{ color: theme.textPrimary, fontSize: "14px" }}>{t.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
