import { useState } from "react";
import { THEMES, CATEGORIES, TIERS, STAGES } from "../theme";

export default function ItemDetail({ item, theme, currentUser, onUpdate, onClose }) {
  const [newNote, setNewNote] = useState("");
  const [showRelease, setShowRelease] = useState(false);
  const stage = STAGES.find((s) => s.id === item.stage);
  const cat = CATEGORIES.find((c) => c.id === item.category);
  const tier = TIERS.find((t) => t.id === item.tier);
  const stageIndex = STAGES.findIndex((s) => s.id === item.stage);

  const addNote = () => {
    if (!newNote.trim()) return;
    const updated = {
      ...item,
      notes: [...(item.notes || []), { text: newNote.trim(), by: currentUser, at: new Date().toISOString(), stage: item.stage }],
      activityCount: (item.activityCount || 0) + 1,
    };
    onUpdate(updated);
    setNewNote("");
  };

  const changeStage = (newStage) => {
    const updated = {
      ...item,
      stage: newStage,
      activityCount: (item.activityCount || 0) + 1,
      ...(newStage === "done" ? { completedAt: new Date().toISOString(), completedBy: currentUser } : {}),
    };
    onUpdate(updated);
  };

  const fillPercent = Math.min(100, (item.activityCount || 0) * 12);

  return (
    <div style={{
      position: "absolute", inset: 0, background: theme.bg,
      zIndex: 100, overflow: "auto",
    }}>
      <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
              <span style={{ fontSize: "14px" }}>{cat?.icon}</span>
              <span style={{ color: stage.color, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
                {stage.icon} {stage.label}
              </span>
            </div>
            <h2 style={{ color: theme.textPrimary, fontSize: "24px", fontWeight: 700, margin: 0 }}>
              {item.title}
            </h2>
            <span style={{ color: theme.textSecondary, fontSize: "12px" }}>
              {tier?.icon} {tier?.label} • {item.owner === "shared" ? "Ours" : `${THEMES[item.owner]?.name}'s`}
            </span>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: theme.textSecondary,
            fontSize: "28px", cursor: "pointer", padding: "0 4px",
          }}>×</button>
        </div>

        {/* Jar visualization */}
        <div style={{
          height: "8px", borderRadius: "4px",
          background: "rgba(255,255,255,0.06)", marginBottom: "24px", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${fillPercent}%`, borderRadius: "4px",
            background: `linear-gradient(90deg, ${theme.primary}, ${stage.color})`,
            transition: "width 0.5s ease",
          }} />
        </div>

        {/* Stage progression */}
        {item.stage !== "released" && (
          <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
            {STAGES.filter((s) => s.id !== "released").map((s, i) => {
              const isCurrent = s.id === item.stage;
              const isPast = i < stageIndex;
              const isNext = i === stageIndex + 1;
              return (
                <button
                  key={s.id}
                  onClick={() => { if (isNext || isPast) changeStage(s.id); }}
                  style={{
                    flex: 1, padding: "10px 4px", borderRadius: "10px",
                    border: `1px solid ${isCurrent ? s.color : isPast ? `${s.color}50` : "rgba(255,255,255,0.08)"}`,
                    background: isCurrent ? `${s.color}20` : isPast ? `${s.color}10` : "transparent",
                    color: isCurrent ? s.color : isPast ? `${s.color}90` : theme.textSecondary,
                    fontSize: "11px", cursor: isNext || isPast ? "pointer" : "default",
                    opacity: (!isCurrent && !isPast && !isNext) ? 0.4 : 1, textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "16px" }}>{s.icon}</div>
                  {s.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Released — restore option */}
        {item.stage === "released" && (
          <div style={{
            padding: "16px", borderRadius: "14px",
            background: "rgba(99,110,114,0.1)", border: "1px solid rgba(99,110,114,0.2)",
            textAlign: "center", marginBottom: "20px",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "6px" }}>☁</div>
            <div style={{ color: theme.textSecondary, fontSize: "14px", fontWeight: 600 }}>
              This dream was released into the nebula
            </div>
            <div style={{ color: theme.textSecondary, fontSize: "12px", marginTop: "4px", marginBottom: "16px" }}>
              Dreams can always come back. If this one is calling to you again, bring it home.
            </div>
            <button
              onClick={() => changeStage("dream")}
              style={{
                padding: "12px 28px", borderRadius: "12px",
                background: `linear-gradient(135deg, ${theme.primary}30, ${theme.secondary}20)`,
                border: `1px solid ${theme.primary}50`,
                color: theme.accent, fontSize: "14px", fontWeight: 600, cursor: "pointer",
              }}
            >
              ✧ Reclaim This Dream
            </button>
          </div>
        )}

        {/* Done celebration */}
        {item.stage === "done" && (
          <div style={{
            padding: "16px", borderRadius: "14px",
            background: `linear-gradient(135deg, ${theme.primary}15, ${theme.accent}10)`,
            border: `1px solid ${theme.accent}30`,
            textAlign: "center", marginBottom: "20px",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "6px" }}>✦</div>
            <div style={{ color: theme.accent, fontSize: "14px", fontWeight: 600 }}>Star Complete</div>
            <div style={{ color: theme.textSecondary, fontSize: "11px", marginTop: "4px" }}>
              {item.completedBy && `Completed by ${THEMES[item.completedBy]?.name}`}
              {item.completedAt && ` • ${new Date(item.completedAt).toLocaleDateString()}`}
            </div>
          </div>
        )}

        {/* Notes / Memory Capsule */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: theme.textSecondary, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>
            {item.stage === "done" ? "Memory Capsule" : "Notes & Plans"}
          </h3>

          {(item.notes || []).map((note, i) => (
            <div key={i} style={{
              padding: "12px", borderRadius: "12px",
              background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
              marginBottom: "8px",
            }}>
              <div style={{ color: theme.textPrimary, fontSize: "14px", whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                {note.text}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: "10px", marginTop: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>{THEMES[note.by]?.name || note.by}</span>
                <span>{new Date(note.at).toLocaleDateString()}{note.guided ? " • Guided" : ""}</span>
              </div>
            </div>
          ))}

          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={item.stage === "done" ? "Add to this memory..." : "Add a note..."}
              onKeyDown={(e) => e.key === "Enter" && addNote()}
              style={{
                flex: 1, padding: "12px", borderRadius: "12px",
                border: `1px solid ${theme.cardBorder}`, background: theme.cardBg,
                color: theme.textPrimary, fontSize: "14px", outline: "none",
              }}
            />
            <button onClick={addNote} style={{
              padding: "12px 16px", borderRadius: "12px",
              background: `${theme.primary}30`, border: `1px solid ${theme.primary}50`,
              color: theme.primary, fontSize: "14px", cursor: "pointer",
            }}>
              +
            </button>
          </div>
        </div>

        {/* Media placeholder */}
        <div style={{
          padding: "24px", borderRadius: "14px",
          border: `1px dashed ${theme.cardBorder}`,
          textAlign: "center", marginBottom: "20px",
        }}>
          <div style={{ color: theme.textSecondary, fontSize: "13px" }}>
            📷 Photos, videos & voice memos
          </div>
          <div style={{ color: theme.textSecondary, fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
            Media upload coming in Phase 5
          </div>
        </div>

        {/* Release option */}
        {item.stage !== "done" && item.stage !== "released" && (
          <div style={{ marginTop: "20px" }}>
            {!showRelease ? (
              <button
                onClick={() => setShowRelease(true)}
                style={{
                  width: "100%", padding: "12px", borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.08)", background: "transparent",
                  color: theme.textSecondary, fontSize: "13px", cursor: "pointer", opacity: 0.6,
                }}
              >
                Release this dream ☁
              </button>
            ) : (
              <div style={{
                padding: "16px", borderRadius: "14px",
                background: "rgba(99,110,114,0.1)", border: "1px solid rgba(99,110,114,0.2)",
              }}>
                <p style={{ color: theme.textPrimary, fontSize: "14px", margin: "0 0 4px 0" }}>
                  Let this one go?
                </p>
                <p style={{ color: theme.textSecondary, fontSize: "12px", margin: "0 0 16px 0" }}>
                  Choosing frees you to dream something new. This star becomes part of your sky's nebula — always part of the story.
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => changeStage("released")} style={{
                    flex: 1, padding: "10px", borderRadius: "10px",
                    background: "rgba(99,110,114,0.2)", border: "1px solid rgba(99,110,114,0.3)",
                    color: theme.textPrimary, fontSize: "13px", cursor: "pointer",
                  }}>
                    Release ☁
                  </button>
                  <button onClick={() => setShowRelease(false)} style={{
                    flex: 1, padding: "10px", borderRadius: "10px",
                    background: "transparent", border: `1px solid ${theme.cardBorder}`,
                    color: theme.textSecondary, fontSize: "13px", cursor: "pointer",
                  }}>
                    Keep dreaming
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
