import { useState, useCallback } from "react";

// For Phase 1, messages managed in local state.
// Phase 3 will add Firestore real-time sync.

export function useMessages(initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages);

  const sendMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  return { messages, sendMessage };
}
