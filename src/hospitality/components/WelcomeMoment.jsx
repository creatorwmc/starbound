// Layer 1: the first-sign-in greeting. Auto-launches once.
// Two options, neither weighted as the "right" choice. Themed via
// --hospitality-* CSS variables defined in styles.css.

import { useEffect } from 'react'

export function WelcomeMoment({
  onAcceptTour,
  onDecline,
  title = 'Welcome.',
  body = 'A quick walk around if you want one — about two minutes. Or skip it and explore on your own.',
  acceptLabel = 'Show me around',
  declineLabel = "I'll explore on my own",
  glyph = '✧',
}) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onDecline() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDecline])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hospitality-welcome-title"
      className="hospitality-welcome-overlay"
    >
      <div className="hospitality-welcome-card">
        <div className="hospitality-welcome-glyph" aria-hidden>{glyph}</div>

        <h2 id="hospitality-welcome-title" className="hospitality-welcome-title">
          {title}
        </h2>

        <p className="hospitality-welcome-body">{body}</p>

        <div className="hospitality-welcome-actions">
          <button onClick={onAcceptTour} className="hospitality-welcome-accept">
            {acceptLabel}
          </button>
          <button onClick={onDecline} className="hospitality-welcome-decline">
            {declineLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
