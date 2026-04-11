import { useState, useRef, useCallback } from "react";
import { imageToDataUrl } from "../utils/resizeImage";

export function usePhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  const upload = useCallback(async (file) => {
    if (!file) return null;
    setUploading(true);
    setError(null);
    try {
      const dataUrl = await imageToDataUrl(file, 800, 0.6);
      return dataUrl;
    } catch (err) {
      console.error("Photo error:", err);
      setError("Couldn't process photo — try again");
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const openCamera = useCallback(() => {
    cameraRef.current?.click();
  }, []);

  const openGallery = useCallback(() => {
    galleryRef.current?.click();
  }, []);

  return { upload, uploading, error, cameraRef, galleryRef, openCamera, openGallery };
}
