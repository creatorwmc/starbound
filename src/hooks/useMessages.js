import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { SAMPLE_MESSAGES } from "../theme";

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "chatroom"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        data.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
        setMessages(data);

        if (data.length === 0 && !seeded) {
          setSeeded(true);
          SAMPLE_MESSAGES.forEach((msg) => {
            addDoc(collection(db, "chatroom"), msg);
          });
        }
      },
      (error) => {
        console.error("Firestore messages error:", error);
        setMessages(SAMPLE_MESSAGES);
      }
    );
    return unsubscribe;
  }, [seeded]);

  const sendMessage = useCallback(async (msg) => {
    await addDoc(collection(db, "chatroom"), msg);
  }, []);

  return { messages, sendMessage };
}
