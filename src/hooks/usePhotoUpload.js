import { useState, useRef, useCallback } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function usePhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  const upload = useCallback(async (file, path) => {
    if (!file) return null;
    setUploading(true);
    try {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const storageRef = ref(storage, `${path}/${timestamp}_${safeName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err) {
      console.error("Photo upload error:", err);
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

  return { upload, uploading, cameraRef, galleryRef, openCamera, openGallery };
}
