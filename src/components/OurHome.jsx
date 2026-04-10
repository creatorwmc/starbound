import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import PhotoPicker from "./PhotoPicker";

const AREAS = [
  { id: "house", name: "The House", icon: "🏠" },
  { id: "kitchen", name: "Kitchen", icon: "🍳" },
  { id: "porch", name: "The Porch", icon: "🌅" },
  { id: "animals", name: "Our Animals", icon: "🐷" },
  { id: "garden", name: "Garden & Land", icon: "🌿" },
  { id: "views", name: "Farm Views", icon: "🌄" },
];

export default function OurHome({ theme, currentUser }) {
  const [photos, setPhotos] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "homePhotos"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        data.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        setPhotos(data);
      },
      (error) => {
        console.error("Home photos error:", error);
      }
    );
    return unsubscribe;
  }, []);

  const areaPhotos = selectedArea ? photos.filter((p) => p.areaId === selectedArea) : [];
  const area = AREAS.find((a) => a.id === selectedArea);

  // Area detail view
  if (selectedArea) {
    return (
      <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <button
            onClick={() => setSelectedArea(null)}
            style={{
              background: "rgba(255,255,255,0.08)", border: "none",
              color: theme.textPrimary, fontSize: "18px", cursor: "pointer",
              width: "36px", height: "36px", borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ←
          </button>
          <div>
            <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 700, margin: 0 }}>
              {area?.icon} {area?.name}
            </h2>
            <div style={{ color: theme.textSecondary, fontSize: "12px" }}>
              {areaPhotos.length} photo{areaPhotos.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <PhotoPicker
          theme={theme}
          storagePath={`home/${selectedArea}`}
          onPhoto={async (url) => {
            await addDoc(collection(db, "homePhotos"), {
              areaId: selectedArea,
              url,
              uploadedBy: currentUser,
              createdAt: new Date().toISOString(),
            });
          }}
        />

        {areaPhotos.length > 0 ? (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px",
            marginTop: "16px",
          }}>
            {areaPhotos.map((photo) => (
              <div key={photo.id} style={{
                aspectRatio: "1", borderRadius: "12px", overflow: "hidden",
                border: `1px solid ${theme.cardBorder}`,
              }}>
                <img src={photo.url} alt="" style={{
                  width: "100%", height: "100%", objectFit: "cover", display: "block",
                }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "40px 20px", color: theme.textSecondary,
            fontStyle: "italic", marginTop: "16px",
          }}>
            No photos yet — snap the first one
          </div>
        )}
      </div>
    );
  }

  // Area grid view
  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ color: theme.textPrimary, fontSize: "22px", fontWeight: 700, margin: "0 0 4px 0" }}>
        Our Home
      </h2>
      <p style={{ color: theme.textSecondary, fontSize: "12px", margin: "0 0 24px 0" }}>
        The ground beneath our stars
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {AREAS.map((a) => {
          const count = photos.filter((p) => p.areaId === a.id).length;
          return (
            <div
              key={a.id}
              onClick={() => setSelectedArea(a.id)}
              style={{
                padding: "24px 16px", borderRadius: "16px",
                background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
                textAlign: "center", cursor: "pointer", transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{a.icon}</div>
              <div style={{ color: theme.textPrimary, fontSize: "14px", fontWeight: 600 }}>{a.name}</div>
              <div style={{ color: theme.textSecondary, fontSize: "11px", marginTop: "4px" }}>
                {count > 0 ? `${count} photo${count !== 1 ? "s" : ""}` : "Tap to add photos"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
