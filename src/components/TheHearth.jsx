import { useState, useEffect, useRef } from "react";
import { THEMES } from "../theme";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { resizeImage } from "../utils/resizeImage";

export default function TheHearth({ messages, theme, currentUser, onSend }) {
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef(null);
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [photoError, setPhotoError] = useState(null);

  const handlePhotoFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setPhotoError(null);
    try {
      const resized = await resizeImage(file, 1200, 0.8);
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const storageRef = ref(storage, `hearth/${timestamp}_${safeName}`);
      await uploadBytes(storageRef, resized);
      const url = await getDownloadURL(storageRef);
      setPendingPhoto(url);
    } catch (err) {
      console.error("Photo upload error:", err);
      setPhotoError("Photo upload failed — try again");
    } finally {
      setUploading(false);
    }
  };

  const send = () => {
    if (!text.trim() && !pendingPhoto) return;
    onSend({
      text: text.trim(),
      author: currentUser,
      createdAt: new Date().toISOString(),
      ...(pendingPhoto ? { photoUrl: pendingPhoto } : {}),
      ...(replyTo !== null ? { replyToIndex: replyTo } : {}),
    });
    setText("");
    setReplyTo(null);
    setPendingPhoto(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "20px 20px 0" }}>
        <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 700, margin: "0 0 4px 0" }}>
          The Hearth
        </h2>
        <p style={{ color: theme.textSecondary, fontSize: "12px", margin: "0 0 16px 0" }}>
          Notes passed between us — our fire that's always burning
        </p>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "0 20px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: theme.textSecondary, fontStyle: "italic" }}>
            Drop the first note by the fire...
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.author === currentUser;
          const authorTheme = THEMES[msg.author];
          const repliedMsg = msg.replyToIndex != null ? messages[msg.replyToIndex] : null;
          const repliedAuthorTheme = repliedMsg ? THEMES[repliedMsg.author] : null;
          return (
            <div key={i} style={{
              display: "flex",
              justifyContent: isMe ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}>
              <div
                style={{
                  maxWidth: "80%",
                  padding: "12px 16px",
                  borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: isMe ? `${authorTheme.primary}25` : theme.cardBg,
                  border: `1px solid ${isMe ? authorTheme.primary + "40" : theme.cardBorder}`,
                  cursor: "pointer",
                }}
                onClick={() => setReplyTo(i)}
              >
                {repliedMsg && (
                  <div style={{
                    padding: "6px 10px", borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                    borderLeft: `3px solid ${repliedAuthorTheme?.primary || theme.primary}`,
                    marginBottom: "8px",
                  }}>
                    <div style={{ color: repliedAuthorTheme?.primary || theme.textSecondary, fontSize: "10px", fontWeight: 600, marginBottom: "2px" }}>
                      {repliedAuthorTheme?.name || ""}
                    </div>
                    <div style={{ color: theme.textSecondary, fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {repliedMsg.text.slice(0, 80)}{repliedMsg.text.length > 80 ? "..." : ""}
                    </div>
                  </div>
                )}
                {msg.photoUrl && (
                  <div style={{ marginBottom: msg.text ? "8px" : 0, borderRadius: "8px", overflow: "hidden" }}>
                    <img src={msg.photoUrl} alt="" style={{
                      maxWidth: "100%", maxHeight: "240px", objectFit: "cover", display: "block", borderRadius: "8px",
                    }} />
                  </div>
                )}
                {msg.text && (
                  <div style={{ color: theme.textPrimary, fontSize: "14px", lineHeight: "1.4" }}>
                    {msg.text}
                  </div>
                )}
                <div style={{ color: theme.textSecondary, fontSize: "10px", marginTop: "6px", textAlign: "right" }}>
                  {authorTheme?.name} • {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply indicator */}
      {replyTo !== null && messages[replyTo] && (
        <div style={{
          padding: "8px 20px",
          background: `${theme.primary}10`,
          borderTop: `1px solid ${theme.cardBorder}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
        }}>
          <div style={{
            flex: 1,
            borderLeft: `3px solid ${THEMES[messages[replyTo].author]?.primary || theme.primary}`,
            paddingLeft: "10px", overflow: "hidden",
          }}>
            <div style={{ color: THEMES[messages[replyTo].author]?.primary || theme.textSecondary, fontSize: "11px", fontWeight: 600 }}>
              Replying to {THEMES[messages[replyTo].author]?.name}
            </div>
            <div style={{ color: theme.textSecondary, fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {messages[replyTo].text.slice(0, 60)}{messages[replyTo].text.length > 60 ? "..." : ""}
            </div>
          </div>
          <button onClick={() => setReplyTo(null)} style={{
            background: "none", border: "none", color: theme.textSecondary,
            fontSize: "18px", cursor: "pointer", padding: "4px 8px",
          }}>
            ×
          </button>
        </div>
      )}

      {/* Emoji picker */}
      {showEmoji && (
        <div style={{
          padding: "8px 16px 4px",
          borderTop: `1px solid ${theme.cardBorder}`,
          background: theme.cardBg,
          maxHeight: "200px",
          overflowY: "auto",
        }}>
          {[
            { label: "Favorites", emojis: ["❤️", "🔥", "⭐", "👍", "😘", "🤗", "💜", "✨", "🥰", "😍", "💋", "🫶"] },
            { label: "Smileys", emojis: ["😊", "😂", "🥹", "😭", "😏", "🤣", "😅", "😇", "🥺", "😜", "😎", "🤩", "😴", "🤔", "😳", "😱", "🫠", "🙄", "😤", "😈"] },
            { label: "Love", emojis: ["💕", "💖", "💗", "💘", "💝", "❣️", "💞", "💓", "🫂", "💏", "💑", "👩‍❤️‍👨", "😻", "💌"] },
            { label: "Gestures", emojis: ["👏", "🙌", "🤞", "✌️", "🤟", "👊", "💪", "🫡", "🙏", "👋", "🤝", "✊", "👐", "🫰", "🤌"] },
            { label: "Nature", emojis: ["🌙", "🌟", "☀️", "🌈", "🌊", "🍃", "🌸", "🌻", "🌺", "🦋", "🐝", "🌿", "🍂", "❄️", "⛈️"] },
            { label: "Animals", emojis: ["🐱", "🐶", "🐷", "🐔", "🐴", "🦊", "🐻", "🐰", "🦉", "🐝", "🐄", "🐑", "🦌"] },
            { label: "Food", emojis: ["☕", "🍕", "🍝", "🧁", "🍰", "🍓", "🥂", "🍷", "🍻", "🥘", "🧀", "🌮", "🍣", "🍳"] },
            { label: "Activities", emojis: ["🎵", "🎸", "🎮", "📷", "✈️", "🏕️", "🎪", "🎯", "🎨", "📚", "🏡", "🌄", "🗺️", "🧳", "🏔️"] },
            { label: "Celebrations", emojis: ["🎉", "🥳", "🎊", "🎂", "🎁", "🪄", "🏆", "🎇", "🎆", "💐", "🍾"] },
            { label: "Symbols", emojis: ["✅", "💯", "⚡", "🔮", "🕯️", "🗝️", "💎", "🧿", "♾️", "☮️", "💫", "🌀"] },
          ].map((group) => (
            <div key={group.label} style={{ marginBottom: "8px" }}>
              <div style={{
                color: theme.textSecondary, fontSize: "10px", textTransform: "uppercase",
                letterSpacing: "1px", marginBottom: "4px",
              }}>
                {group.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
                {group.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setText((prev) => prev + emoji)}
                    style={{
                      width: "36px", height: "36px", borderRadius: "8px",
                      border: "none", background: "transparent",
                      fontSize: "20px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden file inputs */}
      <input ref={cameraRef} type="file" accept="image/*" capture="environment"
        style={{ display: "none" }} onChange={(e) => { handlePhotoFile(e.target.files?.[0]); e.target.value = ""; }} />
      <input ref={galleryRef} type="file" accept="image/*"
        style={{ display: "none" }} onChange={(e) => { handlePhotoFile(e.target.files?.[0]); e.target.value = ""; }} />

      {/* Pending photo preview */}
      {pendingPhoto && (
        <div style={{
          padding: "8px 20px",
          borderTop: `1px solid ${theme.cardBorder}`,
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <img src={pendingPhoto} alt="" style={{
            width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover",
          }} />
          <div style={{ flex: 1, color: theme.textSecondary, fontSize: "12px" }}>Photo attached</div>
          <button onClick={() => setPendingPhoto(null)} style={{
            background: "none", border: "none", color: theme.textSecondary,
            fontSize: "18px", cursor: "pointer",
          }}>×</button>
        </div>
      )}

      {photoError && (
        <div style={{ padding: "8px 20px", color: "#ff6b6b", fontSize: "12px",
          borderTop: `1px solid rgba(255,80,80,0.3)`, background: "rgba(255,80,80,0.08)" }}>
          {photoError}
        </div>
      )}
      {uploading && (
        <div style={{ padding: "8px 20px", color: theme.textSecondary, fontSize: "12px",
          borderTop: `1px solid ${theme.cardBorder}` }}>
          Uploading photo...
        </div>
      )}

      <div style={{ padding: "12px 20px 20px", display: "flex", gap: "6px", alignItems: "center" }}>
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          style={{
            width: "38px", height: "38px", borderRadius: "10px",
            border: `1px solid ${showEmoji ? theme.primary : theme.cardBorder}`,
            background: showEmoji ? `${theme.primary}20` : theme.cardBg,
            fontSize: "18px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          😊
        </button>
        <button
          onClick={() => cameraRef.current?.click()}
          style={{
            width: "38px", height: "38px", borderRadius: "10px",
            border: `1px solid ${theme.cardBorder}`, background: theme.cardBg,
            fontSize: "18px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          📸
        </button>
        <button
          onClick={() => galleryRef.current?.click()}
          style={{
            width: "38px", height: "38px", borderRadius: "10px",
            border: `1px solid ${theme.cardBorder}`, background: theme.cardBg,
            fontSize: "18px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          🖼️
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={replyTo !== null ? "Write your reply..." : "Leave a note..."}
          onKeyDown={(e) => e.key === "Enter" && send()}
          onFocus={() => setShowEmoji(false)}
          style={{
            flex: 1, padding: "10px", borderRadius: "12px",
            border: `1px solid ${theme.cardBorder}`, background: theme.cardBg,
            color: theme.textPrimary, fontSize: "14px", outline: "none",
            minWidth: 0,
          }}
        />
        <button onClick={send} style={{
          padding: "10px 16px", borderRadius: "12px",
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
          border: "none", color: "white", fontSize: "14px", cursor: "pointer",
          flexShrink: 0,
        }}>
          Drop
        </button>
      </div>
    </div>
  );
}
