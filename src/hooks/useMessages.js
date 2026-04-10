import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

export function useMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "chatroom"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        data.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
        setMessages(data);
      },
      (error) => {
        console.error("Firestore messages error:", error);
        setMessages([]);
      }
    );
    return unsubscribe;
  }, []);

  const sendMessage = useCallback(async (msg) => {
    await addDoc(collection(db, "chatroom"), msg);
  }, []);

  return { messages, sendMessage };
}
