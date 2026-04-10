import { useState, useRef, useCallback } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { resizeImage } from "../utils/resizeImage";

export function usePhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  const upload = useCallback(async (file, path) => {
    if (!file) return null;
    setUploading(true);
    setError(null);
    try {
      const resized = await resizeImage(file, 1200, 0.8);
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const storageRef = ref(storage, `${path}/${timestamp}_${safeName}`);
      await uploadBytes(storageRef, resized);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err) {
      console.error("Photo upload error:", err);
      setError("Upload failed — check your connection and try again");
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
