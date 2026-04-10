import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { SAMPLE_MESSAGES } from "../theme";

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "chatroom"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
      setMessages(data);

      // Seed sample messages if empty
      if (data.length === 0 && !seeded) {
        setSeeded(true);
        SAMPLE_MESSAGES.forEach((msg) => {
          addDoc(collection(db, "chatroom"), msg);
        });
      }
    });
    return unsubscribe;
  }, [seeded]);

  const sendMessage = useCallback(async (msg) => {
    await addDoc(collection(db, "chatroom"), msg);
  }, []);

  return { messages, sendMessage };
}
