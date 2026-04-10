import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export function useTriggers() {
  const [triggers, setTriggers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "triggers"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        data.sort((a, b) => (a.plantedAt || "").localeCompare(b.plantedAt || ""));
        setTriggers(data);
      },
      (error) => {
        console.error("Firestore triggers error:", error);
        setTriggers([]);
      }
    );
    return unsubscribe;
  }, []);

  const plantTrigger = useCallback(async (trigger) => {
    await setDoc(doc(db, "triggers", trigger.id), trigger);
  }, []);

  const updateTrigger = useCallback(async (updated) => {
    const { id, ...data } = updated;
    await updateDoc(doc(db, "triggers", id), data);
  }, []);

  return { triggers, plantTrigger, updateTrigger };
}
