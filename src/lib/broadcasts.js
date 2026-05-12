// Broadcast Messaging — client library.

import { useCallback, useEffect, useState } from "react";
import { collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

async function fetchBroadcasts() {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) return [];
  const res = await fetch("/.netlify/functions/get-broadcasts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    if (res.status === 404) return [];
    const eb = await res.json().catch(() => ({}));
    throw new Error(eb.error || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.items || [];
}

async function loadDismissals(uid) {
  if (!uid) return new Set();
  const snap = await getDocs(collection(db, "users", uid, "dismissed_broadcasts"));
  return new Set(snap.docs.map((d) => d.id));
}

export async function dismissBroadcast(uid, broadcastId) {
  if (!uid || !broadcastId) return;
  await setDoc(
    doc(db, "users", uid, "dismissed_broadcasts", broadcastId),
    { dismissed_at: serverTimestamp() },
  );
}

export function useBroadcasts(user) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!user?.uid) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [all, dismissed] = await Promise.all([
        fetchBroadcasts(),
        loadDismissals(user.uid),
      ]);
      setItems(all.filter((b) => !dismissed.has(b.id)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => { load(); }, [load]);

  const dismiss = useCallback(async (broadcastId) => {
    if (!user?.uid) return;
    setItems((prev) => prev.filter((b) => b.id !== broadcastId));
    try {
      await dismissBroadcast(user.uid, broadcastId);
    } catch (err) {
      console.error("dismiss failed:", err);
    }
  }, [user?.uid]);

  return { items, loading, error, dismiss, reload: load };
}
