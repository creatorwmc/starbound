import { useState } from "react";
import { THEMES, CATEGORIES, TIERS, STAGES } from "../theme";
import PhotoPicker from "./PhotoPicker";

export default function ItemDetail({ item, theme, currentUser, onUpdate, onClose, onDelete }) {
  const [newNote, setNewNote] = useState("");
  const [showRelease, setShowRelease] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(item.title);
  const [editingCategory, setEditingCategory] = useState(false);
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
              <span
                onClick={() => setEditingCategory(!editingCategory)}
                style={{ fontSize: "14px", cursor: "pointer", borderBottom: `1px dashed ${theme.cardBorder}`, paddingBottom: "1px" }}
                title="Tap to change category"
              >
                {cat?.icon} {cat?.label || "Uncategorized"}
              </span>
              <span style={{ color: stage.color, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px" }}>
                {stage.icon} {stage.label}
              </span>
            </div>
            {editingCategory && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onUpdate({ ...item, category: c.id });
                      setEditingCategory(false);
                    }}
                    style={{
                      padding: "6px 12px", borderRadius: "10px",
                      border: `1px solid ${c.id === item.category ? c.color : "rgba(255,255,255,0.1)"}`,
                      background: c.id === item.category ? `${c.color}20` : "transparent",
                      color: c.id === item.category ? c.color : theme.textSecondary,
                      fontSize: "12px", cursor: "pointer",
                    }}
                  >
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            )}
            {editingTitle ? (
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <input
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && titleDraft.trim()) {
                      onUpdate({ ...item, title: titleDraft.trim() });
                      setEditingTitle(false);
                    } else if (e.key === "Escape") {
                      setTitleDraft(item.title);
                      setEditingTitle(false);
                    }
                  }}
                  autoFocus
                  style={{
                    flex: 1, padding: "6px 10px", borderRadius: "8px",
                    border: `1px solid ${theme.primary}`,
                    background: theme.cardBg, color: theme.textPrimary,
                    fontSize: "20px", fontWeight: 700, outline: "none",
                  }}
                />
                <button
                  onClick={() => {
                    if (titleDraft.trim()) {
                      onUpdate({ ...item, title: titleDraft.trim() });
                      setEditingTitle(false);
                    }
                  }}
                  style={{
                    padding: "6px 12px", borderRadius: "8px",
                    background: `${theme.primary}30`, border: `1px solid ${theme.primary}50`,
                    color: theme.primary, fontSize: "13px", cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <h2
                onClick={() => { setTitleDraft(item.title); setEditingTitle(true); }}
                style={{
                  color: theme.textPrimary, fontSize: "24px", fontWeight: 700, margin: 0,
                  cursor: "pointer", borderBottom: `1px dashed ${theme.cardBorder}`,
                  paddingBottom: "2px",
                }}
                title="Tap to edit"
              >
                {item.title}
              </h2>
            )}
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

        {/* Photos */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: theme.textSecondary, fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>
            Photos
          </h3>

          {/* Photo gallery */}
          {(item.media || []).filter((m) => m.type === "photo").length > 0 && (
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px",
              marginBottom: "12px",
            }}>
              {(item.media || []).filter((m) => m.type === "photo").map((m, i) => (
                <div key={i} style={{
                  aspectRatio: "1", borderRadius: "10px", overflow: "hidden",
                  border: `1px solid ${theme.cardBorder}`, position: "relative",
                }}>
                  <img
                    src={m.url}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <button
                    onClick={() => {
                      if (!confirm("Delete this photo?")) return;
                      const photos = (item.media || []).filter((x) => x.type === "photo");
                      const toRemove = photos[i];
                      const updatedMedia = (item.media || []).filter((x) => x !== toRemove);
                      onUpdate({ ...item, media: updatedMedia });
                    }}
                    style={{
                      position: "absolute", top: "4px", right: "4px",
                      width: "24px", height: "24px", borderRadius: "50%",
                      background: "rgba(0,0,0,0.6)", border: "none",
                      color: "white", fontSize: "14px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <PhotoPicker
            theme={theme}
            onPhoto={(url) => {
              const newMedia = {
                type: "photo",
                url,
                createdBy: currentUser,
                createdAt: new Date().toISOString(),
                stage: item.stage,
              };
              onUpdate({
                ...item,
                media: [...(item.media || []), newMedia],
                activityCount: (item.activityCount || 0) + 1,
              });
            }}
          />
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
        {/* Delete option */}
        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              style={{
                width: "100%", padding: "12px", borderRadius: "12px",
                border: "1px solid rgba(255,60,60,0.15)", background: "transparent",
                color: "rgba(255,100,100,0.5)", fontSize: "13px", cursor: "pointer",
              }}
            >
              Delete this dream
            </button>
          ) : (
            <div style={{
              padding: "16px", borderRadius: "14px",
              background: "rgba(255,60,60,0.08)", border: "1px solid rgba(255,60,60,0.2)",
            }}>
              <p style={{ color: theme.textPrimary, fontSize: "14px", margin: "0 0 4px 0" }}>
                Delete permanently?
              </p>
              <p style={{ color: theme.textSecondary, fontSize: "12px", margin: "0 0 16px 0" }}>
                This removes the star from the sky completely. Notes, photos, and all content will be gone forever.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => onDelete(item.id)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: "10px",
                    background: "rgba(255,60,60,0.2)", border: "1px solid rgba(255,60,60,0.3)",
                    color: "#ff6b6b", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Delete forever
                </button>
                <button onClick={() => setShowDelete(false)} style={{
                  flex: 1, padding: "10px", borderRadius: "10px",
                  background: "transparent", border: `1px solid ${theme.cardBorder}`,
                  color: theme.textSecondary, fontSize: "13px", cursor: "pointer",
                }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
