import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { SAMPLE_TRIGGERS } from "../theme";

export function useTriggers() {
  const [triggers, setTriggers] = useState([]);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "triggers"), orderBy("plantedAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
      setTriggers(data);

      // Seed sample triggers if empty
      if (data.length === 0 && !seeded) {
        setSeeded(true);
        SAMPLE_TRIGGERS.forEach((t) => {
          setDoc(doc(db, "triggers", t.id), t);
        });
      }
    });
    return unsubscribe;
  }, [seeded]);

  const plantTrigger = useCallback(async (trigger) => {
    await setDoc(doc(db, "triggers", trigger.id), trigger);
  }, []);

  const updateTrigger = useCallback(async (updated) => {
    const { id, ...data } = updated;
    await updateDoc(doc(db, "triggers", id), data);
  }, []);

  return { triggers, plantTrigger, updateTrigger };
}
