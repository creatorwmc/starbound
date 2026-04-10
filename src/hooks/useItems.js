import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStarId, setNewStarId] = useState(null);

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
    try {
      await setDoc(doc(db, "items", item.id), item);
      setNewStarId(item.id);
      setTimeout(() => setNewStarId(null), 2500);
    } catch (err) {
      console.error("Failed to add item:", err);
      alert("Couldn't save that star — check your connection and try again.");
    }
  }, []);

  const updateItem = useCallback(async (updated) => {
    try {
      // Use setDoc with merge to handle both new and existing docs
      const { id, ...data } = updated;
      await setDoc(doc(db, "items", id), data, { merge: true });
    } catch (err) {
      console.error("Failed to update item:", err);
    }
  }, []);

  return { items, loading, addItem, updateItem, newStarId };
}
