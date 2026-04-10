import { useState, useCallback } from "react";
// import { db } from "../firebase";
// import { collection, onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore";

// For Phase 1, items are managed in local state with sample data.
// In Phase 2+, this hook will use Firestore onSnapshot for real-time sync.

export function useItems(initialItems = []) {
  const [items, setItems] = useState(initialItems);

  const addItem = useCallback((item) => {
    setItems((prev) => [...prev, item]);
    // TODO: addDoc(collection(db, "items"), item);
  }, []);

  const updateItem = useCallback((updated) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    // TODO: updateDoc(doc(db, "items", updated.id), updated);
  }, []);

  return { items, addItem, updateItem, setItems };
}
