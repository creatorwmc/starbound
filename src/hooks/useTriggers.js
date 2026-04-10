import { useState, useCallback } from "react";

// For Phase 1, triggers managed in local state.
// Phase 4 will add Firestore sync + FCM push notifications.

export function useTriggers(initialTriggers = []) {
  const [triggers, setTriggers] = useState(initialTriggers);

  const plantTrigger = useCallback((trigger) => {
    setTriggers((prev) => [...prev, trigger]);
  }, []);

  return { triggers, plantTrigger };
}
