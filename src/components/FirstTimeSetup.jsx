import { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, userKeyForEmail } from "../firebase";

export default function FirstTimeSetup() {
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user?.email;
      if (!userKeyForEmail(email)) {
        await signOut(auth);
        setError(`${email} isn't on the household list. Sign in with Zach or Stacey's Google account.`);
      }
    } catch (err) {
      console.error("Google sign-in failed:", err);
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        // User backed out — no error message needed
      } else if (err.code === "auth/unauthorized-domain") {
        setError("This domain isn't authorized in Firebase. Add it under Auth → Settings → Authorized domains.");
      } else {
        setError("Couldn't sign in — try again.");
      }
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div style={{
      height: "100%",
      background: "linear-gradient(135deg, #0c0c2e 0%, #1a0f2e 50%, #1a0c0c 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "48px",
      padding: "20px",
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{
          fontSize: "36px",
          fontWeight: 800,
          background: "linear-gradient(135deg, #A29BFE 0%, #FFEAA7 50%, #FAB1A0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: 0,
          letterSpacing: "4px",
        }}>
          STARBOUND
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", letterSpacing: "3px", marginTop: "8px" }}>
          DREAMS WE'RE BUILDING TOGETHER
        </p>
      </div>

      <div style={{ textAlign: "center", width: "100%", maxWidth: "340px" }}>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", marginBottom: "28px" }}>
          Sign in to your sky
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={signingIn}
          style={{
            width: "100%",
            padding: "16px 24px",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.95)",
            color: "#1f1f1f",
            fontSize: "15px",
            fontWeight: 600,
            cursor: signingIn ? "default" : "pointer",
            opacity: signingIn ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            transition: "all 0.2s ease",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          {signingIn ? "Signing in..." : "Continue with Google"}
        </button>

        {error && (
          <div style={{
            marginTop: "16px",
            padding: "12px 14px",
            borderRadius: "12px",
            background: "rgba(255,80,80,0.12)",
            border: "1px solid rgba(255,80,80,0.3)",
            color: "#ff9b9b",
            fontSize: "12px",
            textAlign: "left",
            lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", marginTop: "24px" }}>
          Only Zach and Stacey can sign in.
        </p>
      </div>

      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 23 + 5) % 100}%`,
          top: `${(i * 31 + 3) % 100}%`,
          width: `${1 + (i % 3)}px`,
          height: `${1 + (i % 3)}px`,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          animation: "twinkle 3s ease-in-out infinite",
          animationDelay: `${(i * 0.4) % 3}s`,
          pointerEvents: "none",
        }} />
      ))}
    </div>
  );
}
