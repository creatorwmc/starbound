import { useState, useCallback } from "react";

const STORAGE_KEY = "starbound_user";

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  const selectUser = useCallback((user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEY, user);
    } catch {}
  }, []);

  const switchUser = useCallback(() => {
    const newUser = currentUser === "zach" ? "stacey" : "zach";
    selectUser(newUser);
    return newUser;
  }, [currentUser, selectUser]);

  const resetUser = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { currentUser, selectUser, switchUser, resetUser };
}
