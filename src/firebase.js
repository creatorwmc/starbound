import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  initializeAuth,
  getAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
// Explicit persistence chain — IndexedDB first (survives PWA restarts on
// Android), then localStorage, then session as last resort. Default getAuth()
// silently dropped sessions in standalone PWA contexts on phones. The
// try/getAuth fallback is for HMR, which re-runs this module.
function getOrInitAuth() {
  try {
    return initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
    });
  } catch {
    return getAuth(app);
  }
}
export const auth = getOrInitAuth();
export const googleProvider = new GoogleAuthProvider();

export const HOUSEHOLD = {
  "zacharyrpaige@gmail.com": "zach",
  "staceycpaige@gmail.com": "stacey",
};

export function userKeyForEmail(email) {
  return HOUSEHOLD[(email || "").toLowerCase()] || null;
}

export default app;
