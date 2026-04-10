import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "items"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        data.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
        setItems(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore items error:", error);
        setItems([]);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const addItem = useCallback(async (item) => {
    await setDoc(doc(db, "items", item.id), item);
  }, []);

  const updateItem = useCallback(async (updated) => {
    const { id, ...data } = updated;
    await updateDoc(doc(db, "items", id), data);
  }, []);

  return { items, loading, addItem, updateItem };
}
