// Persistence layer. Firestore-backed by default; in-memory available for
// dev/tests. Path: users/{uid}/walkthroughState/{appId}.

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

const emptyState = (appId) => ({
  appId,
  completed: {},
  dismissed: {},
  hasSeenWelcome: false,
  updatedAt: Date.now(),
})

export const createFirestoreStorage = (db) => ({
  async load(uid, appId) {
    const ref = doc(db, 'users', uid, 'walkthroughState', appId)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      const initial = emptyState(appId)
      await setDoc(ref, initial)
      return initial
    }
    return snap.data()
  },

  async save(uid, state) {
    const ref = doc(db, 'users', uid, 'walkthroughState', state.appId)
    await updateDoc(ref, { ...state, updatedAt: Date.now() })
  },
})

export const createMemoryStorage = () => {
  const store = new Map()
  const key = (uid, appId) => `${uid}:${appId}`
  return {
    async load(uid, appId) {
      const existing = store.get(key(uid, appId))
      if (existing) return existing
      const initial = emptyState(appId)
      store.set(key(uid, appId), initial)
      return initial
    },
    async save(uid, state) {
      store.set(key(uid, state.appId), { ...state, updatedAt: Date.now() })
    },
  }
}
