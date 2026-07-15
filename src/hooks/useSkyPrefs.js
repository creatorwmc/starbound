import { useEffect, useState, useCallback } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const PREFS_DOC = doc(db, "prefs", "sky");
const DEFAULTS = { constellationMode: "zodiac" };

export function useSkyPrefs() {
  const [prefs, setPrefs] = useState(DEFAULTS);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      PREFS_DOC,
      (snap) => {
        if (snap.exists()) setPrefs({ ...DEFAULTS, ...snap.data() });
      },
      (err) => console.error("sky prefs error:", err),
    );
    return unsubscribe;
  }, []);

  const setConstellationMode = useCallback((mode) => {
    setPrefs((p) => ({ ...p, constellationMode: mode }));
    setDoc(PREFS_DOC, { constellationMode: mode }, { merge: true }).catch(console.error);
  }, []);

  return { prefs, setConstellationMode };
}
