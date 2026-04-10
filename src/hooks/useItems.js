import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { SAMPLE_ITEMS } from "../theme";

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "items"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        // Sort client-side instead of requiring a Firestore index
        data.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
        setItems(data);
        setLoading(false);

        if (data.length === 0 && !seeded) {
          setSeeded(true);
          SAMPLE_ITEMS.forEach((item) => {
            setDoc(doc(db, "items", item.id), item);
          });
        }
      },
      (error) => {
        console.error("Firestore items error:", error);
        // Fall back to sample data so the app isn't stuck
        setItems(SAMPLE_ITEMS);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [seeded]);

  const addItem = useCallback(async (item) => {
    await setDoc(doc(db, "items", item.id), item);
  }, []);

  const updateItem = useCallback(async (updated) => {
    const { id, ...data } = updated;
    await updateDoc(doc(db, "items", id), data);
  }, []);

  return { items, loading, addItem, updateItem };
}
