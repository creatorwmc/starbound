import { useRef, useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { resizeImage } from "../utils/resizeImage";

export default function PhotoPicker({ theme, storagePath, onPhoto }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const resized = await resizeImage(file, 1200, 0.8);
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const storageRef = ref(storage, `${storagePath}/${timestamp}_${safeName}`);
      await uploadBytes(storageRef, resized);
      const url = await getDownloadURL(storageRef);
      onPhoto(url);
    } catch (err) {
      console.error("Photo upload error:", err);
      setError("Upload failed — check your connection and try again");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {/* Hidden file inputs */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }}
      />

      {error && (
        <div style={{
          padding: "8px 12px", borderRadius: "10px",
          background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.3)",
          color: "#ff6b6b", fontSize: "12px", width: "100%", marginBottom: "8px",
        }}>
          {error}
        </div>
      )}
      {uploading ? (
        <div style={{
          padding: "10px 20px", borderRadius: "12px",
          background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
          color: theme.textSecondary, fontSize: "13px",
        }}>
          Uploading...
        </div>
      ) : (
        <>
          <button
            onClick={() => cameraRef.current?.click()}
            style={{
              padding: "10px 16px", borderRadius: "12px",
              background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
              color: theme.textPrimary, fontSize: "13px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            📸 Camera
          </button>
          <button
            onClick={() => galleryRef.current?.click()}
            style={{
              padding: "10px 16px", borderRadius: "12px",
              background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
              color: theme.textPrimary, fontSize: "13px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            🖼️ Gallery
          </button>
        </>
      )}
    </div>
  );
}
