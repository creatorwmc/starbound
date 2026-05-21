// Layer 3: a single soft pulse anchored to an element with a one-line label.
// Fires exactly once per user per id. Dismisses on click or after timeoutMs.

import { useEffect, useRef, useState } from 'react'
import { useHospitality } from '../context/HospitalityProvider'

export function CoachMark({ id, target, label, timeoutMs = 6000, side = 'top' }) {
  const { hasSeen, markSeen } = useHospitality()
  const [position, setPosition] = useState(null)
  const dismissedRef = useRef(false)

  useEffect(() => {
    if (hasSeen(id) || dismissedRef.current) return

    const el = document.querySelector(target)
    if (!el) return

    const rect = el.getBoundingClientRect()
    const offsets = {
      top:    { x: rect.left + rect.width / 2, y: rect.top - 12 },
      bottom: { x: rect.left + rect.width / 2, y: rect.bottom + 12 },
      left:   { x: rect.left - 12,             y: rect.top + rect.height / 2 },
      right:  { x: rect.right + 12,            y: rect.top + rect.height / 2 },
    }
    setPosition(offsets[side])

    const timer = setTimeout(() => {
      dismissedRef.current = true
      markSeen(id)
      setPosition(null)
    }, timeoutMs)

    return () => clearTimeout(timer)
  }, [id, target, side, timeoutMs, hasSeen, markSeen])

  const handleClick = () => {
    dismissedRef.current = true
    markSeen(id)
    setPosition(null)
  }

  if (!position || hasSeen(id)) return null

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      aria-label={label}
      className="hospitality-coachmark"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        zIndex: 9998,
      }}
    >
      <div className="hospitality-coachmark-pulse" />
      <div className="hospitality-coachmark-label">{label}</div>
    </div>
  )
}
