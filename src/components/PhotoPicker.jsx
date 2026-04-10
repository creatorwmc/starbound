import { useRef, useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function PhotoPicker({ theme, storagePath, onPhoto }) {
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const storageRef = ref(storage, `${storagePath}/${timestamp}_${safeName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onPhoto(url);
    } catch (err) {
      console.error("Photo upload error:", err);
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
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

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
