// Single source of truth for walkthrough state. Wraps the app at the root,
// loads state on auth, persists changes optimistically, orchestrates tours.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tourRegistry } from '../lib/registry'
import { runDriverTour } from '../lib/driver'

const HospitalityContext = createContext(null)

export function HospitalityProvider({
  appId,
  uid,
  storage,
  children,
  WelcomeMoment,
  welcomeTourId,
}) {
  const [state, setState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    if (!uid) {
      setState(null)
      setIsLoading(false)
      return
    }
    let cancelled = false
    setIsLoading(true)
    storage.load(uid, appId).then((loaded) => {
      if (cancelled) return
      setState(loaded)
      setIsLoading(false)
      if (!loaded.hasSeenWelcome && WelcomeMoment) {
        setShowWelcome(true)
      }
    }).catch((err) => {
      console.error('[hospitality] storage.load failed:', err)
      if (!cancelled) setIsLoading(false)
    })
    return () => { cancelled = true }
  }, [uid, appId, storage, WelcomeMoment])

  const persist = useCallback(async (next) => {
    setState(next)
    if (uid) {
      try {
        await storage.save(uid, next)
      } catch (err) {
        console.error('[hospitality] storage.save failed:', err)
      }
    }
  }, [uid, storage])

  const runTour = useCallback((tourId) => {
    const tour = tourRegistry.get(tourId)
    if (!tour) {
      console.warn(`[hospitality] No tour registered with id "${tourId}"`)
      return Promise.resolve('dismissed')
    }
    return new Promise((resolve) => {
      runDriverTour(tour, {
        onComplete: async () => {
          const current = stateRef.current
          if (current) {
            await persist({
              ...current,
              completed: {
                ...current.completed,
                [tourId]: { completedAt: Date.now() },
              },
            })
          }
          resolve('completed')
        },
        onDismiss: async (atStepId) => {
          const current = stateRef.current
          if (current) {
            await persist({
              ...current,
              dismissed: {
                ...current.dismissed,
                [tourId]: { dismissedAt: Date.now(), atStepId },
              },
            })
          }
          resolve('dismissed')
        },
      })
    })
  }, [persist])

  const markSeen = useCallback(async (id) => {
    const current = stateRef.current
    if (!current) return
    if (current.completed[id]) return
    await persist({
      ...current,
      completed: {
        ...current.completed,
        [id]: { completedAt: Date.now() },
      },
    })
  }, [persist])

  const hasSeen = useCallback(
    (id) => Boolean(state?.completed[id] || state?.dismissed[id]),
    [state],
  )

  const handleAcceptWelcomeTour = useCallback(async () => {
    setShowWelcome(false)
    const current = stateRef.current
    if (current) {
      await persist({ ...current, hasSeenWelcome: true })
    }
    if (welcomeTourId) await runTour(welcomeTourId)
  }, [persist, welcomeTourId, runTour])

  const handleDeclineWelcome = useCallback(async () => {
    setShowWelcome(false)
    const current = stateRef.current
    if (current) {
      await persist({ ...current, hasSeenWelcome: true })
    }
  }, [persist])

  const value = useMemo(
    () => ({ state, isLoading, runTour, markSeen, hasSeen }),
    [state, isLoading, runTour, markSeen, hasSeen],
  )

  return (
    <HospitalityContext.Provider value={value}>
      {children}
      {showWelcome && WelcomeMoment && (
        <WelcomeMoment
          onAcceptTour={handleAcceptWelcomeTour}
          onDecline={handleDeclineWelcome}
        />
      )}
    </HospitalityContext.Provider>
  )
}

export function useHospitality() {
  const ctx = useContext(HospitalityContext)
  if (!ctx) {
    throw new Error('[hospitality] useHospitality must be used inside a HospitalityProvider')
  }
  return ctx
}
