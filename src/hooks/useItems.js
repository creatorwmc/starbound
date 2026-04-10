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
import { SAMPLE_ITEMS } from "../theme";

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
      setItems(data);
      setLoading(false);

      // Seed sample data if collection is empty (first run only)
      if (data.length === 0 && !seeded) {
        setSeeded(true);
        SAMPLE_ITEMS.forEach((item) => {
          setDoc(doc(db, "items", item.id), item);
        });
      }
    });
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
