import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useBroadcasts } from "../lib/broadcasts";

export default function BroadcastBanner({ theme }) {
  const [user, setUser] = useState(null);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  const { items, dismiss } = useBroadcasts(user);
  if (!items.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 16px 0" }}>
      {items.map((b) => (
        <div
          key={b.id}
          style={{
            position: "relative",
            padding: "10px 36px 10px 14px",
            borderRadius: 12,
            background: theme?.surfaceTint || "rgba(255,255,255,0.06)",
            border: `1px solid ${theme?.border || "rgba(255,255,255,0.15)"}`,
            color: theme?.textPrimary || "#e8eaf0",
            fontSize: 14,
            lineHeight: 1.4,
          }}
        >
          {b.body}
          <button
            type="button"
            onClick={() => dismiss(b.id)}
            aria-label="Dismiss"
            style={{
              position: "absolute",
              top: 4,
              right: 8,
              background: "transparent",
              border: "none",
              padding: 4,
              cursor: "pointer",
              color: theme?.textPrimary || "#e8eaf0",
              opacity: 0.55,
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
