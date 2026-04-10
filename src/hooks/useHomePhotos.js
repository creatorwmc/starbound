import { useState, useCallback } from "react";

// For Phase 1, home photos managed in local state.
// Phase 3 will add Firebase Storage uploads + Firestore metadata.

export function useHomePhotos() {
  const [photos, setPhotos] = useState({});

  const addPhoto = useCallback((areaId, photo) => {
    setPhotos((prev) => ({
      ...prev,
      [areaId]: [...(prev[areaId] || []), photo],
    }));
  }, []);

  return { photos, addPhoto };
}
