// The Workbench — Tell Zach about this
//
// Vendored React component for ecosystem apps. Drops a floating
// "Tell Zach about this" button into the bottom-right of the host app.
// On submit, POSTs to a server-side endpoint (typically Kairos's
// /.netlify/functions/workbench-submit) which writes to the-workbench
// Firestore via service account.
//
// Host integration:
//   <FeedbackButton
//     appId="kairos"
//     appName="Kairos"
//     getIdToken={() => auth.currentUser?.getIdToken()}
//     user={user}                     // { email, displayName }
//     endpoint="https://kairos-pwa.netlify.app/.netlify/functions/workbench-submit"
//   />
//
// The host app's CSS variables (or theme) drive the button's surface.
// Override colors with the `accent` and `surface` props if needed.

import { useEffect, useRef, useState } from 'react'

const TAGS = ['Bug', 'Feature', 'Question', 'Wishlist']

// ───────────────────────────────────────────────────────────────────
// Diagnostics — three ring buffers populated by global listeners.
// Mount this component once at the host app's root so capture starts
// as early as possible.
// ───────────────────────────────────────────────────────────────────

const recentErrors = []   // window.error, unhandledrejection, console.error/warn
const recentNetwork = []  // non-2xx fetch responses + fetch failures
const breadcrumbs = []    // user actions: route changes + tracked clicks

let listenersInstalled = false

const ERROR_BUFFER_MAX = 30
const NETWORK_BUFFER_MAX = 20
const BREADCRUMB_BUFFER_MAX = 40

function pushBounded(buf, max, entry) {
  buf.push(entry)
  while (buf.length > max) buf.shift()
}

function safeStringify(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (value instanceof Error) return `${value.name}: ${value.message}`
  try {
    const out = JSON.stringify(value, (_k, v) =>
      v instanceof Error ? `${v.name}: ${v.message}` : v,
    )
    return (out || String(value)).slice(0, 500)
  } catch {
    return String(value).slice(0, 500)
  }
}

function installDiagnostics() {
  if (listenersInstalled || typeof window === 'undefined') return
  listenersInstalled = true

  // 1. Thrown errors + promise rejections
  window.addEventListener('error', (e) => {
    pushBounded(recentErrors, ERROR_BUFFER_MAX, {
      at: Date.now(),
      kind: 'error',
      message: e.message,
      source: e.filename,
    })
  })
  window.addEventListener('unhandledrejection', (e) => {
    pushBounded(recentErrors, ERROR_BUFFER_MAX, {
      at: Date.now(),
      kind: 'rejection',
      message: safeStringify(e.reason?.message || e.reason),
    })
  })

  // 2. console.error / console.warn — captures logged errors that never throw.
  // Wrap once; original behavior preserved so devtools output is unchanged.
  ;['error', 'warn'].forEach((level) => {
    const orig = console[level]
    if (!orig || orig.__wb_wrapped) return
    const wrapped = function (...args) {
      try {
        pushBounded(recentErrors, ERROR_BUFFER_MAX, {
          at: Date.now(),
          kind: `console-${level}`,
          message: args.map(safeStringify).join(' ').slice(0, 800),
        })
      } catch {
        // never break console
      }
      return orig.apply(this, args)
    }
    wrapped.__wb_wrapped = true
    console[level] = wrapped
  })

  // 3. Wrap fetch — capture non-2xx responses + outright failures.
  // Skip self (workbench endpoints) to avoid feedback loops.
  if (typeof window.fetch === 'function' && !window.fetch.__wb_wrapped) {
    const origFetch = window.fetch.bind(window)
    const wrapped = async function (input, init) {
      const url = typeof input === 'string' ? input : input?.url || ''
      const method = (
        init?.method ||
        (typeof input !== 'string' && input?.method) ||
        'GET'
      ).toUpperCase()
      const isWorkbench = /workbench-(submit|notifications)/.test(url)
      const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now()
      try {
        const res = await origFetch(input, init)
        if (!isWorkbench && !res.ok) {
          pushBounded(recentNetwork, NETWORK_BUFFER_MAX, {
            at: Date.now(),
            kind: 'http-error',
            url: url.slice(0, 300),
            method,
            status: res.status,
            ms: Math.round(
              (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0,
            ),
          })
        }
        return res
      } catch (err) {
        if (!isWorkbench) {
          pushBounded(recentNetwork, NETWORK_BUFFER_MAX, {
            at: Date.now(),
            kind: 'fetch-failed',
            url: url.slice(0, 300),
            method,
            message: String(err?.message || err).slice(0, 200),
            ms: Math.round(
              (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0,
            ),
          })
        }
        throw err
      }
    }
    wrapped.__wb_wrapped = true
    window.fetch = wrapped
  }

  // 4. Breadcrumbs: route changes (history API + popstate) + tracked clicks.
  function recordRoute(reason) {
    if (typeof location === 'undefined') return
    pushBounded(breadcrumbs, BREADCRUMB_BUFFER_MAX, {
      at: Date.now(),
      kind: 'route',
      reason,
      path: `${location.pathname}${location.search}`,
    })
  }
  ;['pushState', 'replaceState'].forEach((m) => {
    const orig = history[m]
    if (!orig || orig.__wb_wrapped) return
    const wrapped = function (...args) {
      const r = orig.apply(this, args)
      try {
        recordRoute(m)
      } catch {
        // ignore
      }
      return r
    }
    wrapped.__wb_wrapped = true
    history[m] = wrapped
  })
  window.addEventListener('popstate', () => recordRoute('popstate'))
  recordRoute('initial')

  document.addEventListener(
    'click',
    (e) => {
      try {
        const el = e.target?.closest?.('[data-track], [data-hospitality], button, a')
        if (!el) return
        const label =
          el.getAttribute('data-track') ||
          el.getAttribute('aria-label') ||
          (el.textContent || '').trim().slice(0, 60) ||
          el.tagName.toLowerCase()
        if (!label) return
        pushBounded(breadcrumbs, BREADCRUMB_BUFFER_MAX, {
          at: Date.now(),
          kind: 'click',
          label,
          tag: el.tagName?.toLowerCase() || null,
        })
      } catch {
        // never break clicks
      }
    },
    { capture: true, passive: true },
  )
}

function getRecentErrors(maxAgeMs = 120_000) {
  const cutoff = Date.now() - maxAgeMs
  return recentErrors.filter((e) => e.at >= cutoff)
}
function getRecentNetwork(maxAgeMs = 120_000) {
  const cutoff = Date.now() - maxAgeMs
  return recentNetwork.filter((e) => e.at >= cutoff)
}
function getBreadcrumbs(limit = 20) {
  return breadcrumbs.slice(-limit)
}

// Build SHA — Vite replaces import.meta.env.VITE_BUILD_SHA at build time.
// Falls back to 'dev' when running `npm run dev` or when not wired up.
const BUILD_SHA =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_BUILD_SHA
    ? String(import.meta.env.VITE_BUILD_SHA).slice(0, 12)
    : 'dev'

// ────────────────────────────────────────────────────────────────────
// Screenshot capture — dynamic-imported so html-to-image only loads
// when the user actually opens the feedback panel. Excludes any
// element marked [data-workbench-internal] so the floating button and
// notification panel don't appear in the capture.
//
// Privacy note: screenshots capture whatever is visible at submit
// time, including any sensitive content on screen (health data,
// finances, journal entries). This is intentional — Zach needs
// context to fix bugs. The toggle in the modal lets users opt out
// per submission.
// ────────────────────────────────────────────────────────────────────

async function captureScreenshot() {
  if (typeof document === 'undefined') return null
  try {
    const mod = await import('html-to-image')
    const toJpeg = mod.toJpeg || mod.default?.toJpeg
    if (typeof toJpeg !== 'function') return null
    return await toJpeg(document.body, {
      quality: 0.6,
      pixelRatio: 1,
      cacheBust: false,
      backgroundColor:
        (typeof window !== 'undefined' && getComputedStyle(document.body).backgroundColor) ||
        '#000',
      filter: (node) => {
        if (!(node instanceof Element)) return true
        return !node.hasAttribute('data-workbench-internal')
      },
    })
  } catch (err) {
    // Capture is best-effort. Submitting without a screenshot still works.
    console.warn('Workbench: screenshot capture failed', err)
    return null
  }
}

export default function FeedbackButton({
  appId,
  appName,
  endpoint = '/.netlify/functions/workbench-submit',
  notificationsEndpoint,
  getIdToken,
  user,
  // Visual overrides — defaults work against most dark surfaces.
  accent = 'rgba(184, 160, 96, 0.95)', // workbench iron / brass
  surface = 'rgba(25, 28, 31, 0.95)',
  textColor = '#e0dcd0',
  position = { right: '20px', bottom: '20px' },
  hideTrigger = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [tags, setTags] = useState([])
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)
  const [notes, setNotes] = useState([])
  const [screenshotDataUrl, setScreenshotDataUrl] = useState(null)
  const [capturing, setCapturing] = useState(false)
  const textareaRef = useRef(null)

  // Capture the current view, then open the modal. The wrench button and any
  // [data-workbench-internal] element are filtered out so the screenshot
  // reflects the host app, not the feedback UI.
  async function openWithCapture() {
    if (capturing) return
    setCapturing(true)
    try {
      const dataUrl = await captureScreenshot()
      if (dataUrl) setScreenshotDataUrl(dataUrl)
    } finally {
      setCapturing(false)
      setIsOpen(true)
    }
  }

  function closeAndReset() {
    setIsOpen(false)
    setScreenshotDataUrl(null)
  }

  // Derive notifications endpoint from the submit endpoint by swapping the
  // last path segment. Host apps can override via `notificationsEndpoint`.
  const notifsUrl = notificationsEndpoint || endpoint.replace(/\/[^/]+$/, '/workbench-notifications')

  useEffect(() => {
    installDiagnostics()
  }, [])

  // Cmd/Ctrl + . opens the modal from anywhere
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        openWithCapture()
      }
      if (e.key === 'Escape' && isOpen) {
        closeAndReset()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // openWithCapture is stable enough — no exhaustive-deps lint needed for this hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, capturing])

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isOpen) {
      setDone(false)
      setError(null)
      // Focus textarea once mounted
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isOpen])

  // Fetch unread closure_notes for this user once we have an ID token.
  // Failures are silent — the floating button works fine without notes.
  useEffect(() => {
    if (!getIdToken || !user) return
    let cancelled = false
    async function fetchNotes() {
      try {
        const idToken = await getIdToken()
        if (!idToken || cancelled) return
        const res = await fetch(notifsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ action: 'list' }),
        })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && Array.isArray(data?.notes)) setNotes(data.notes)
      } catch {
        // ignore — notifications are non-critical
      }
    }
    fetchNotes()
    return () => { cancelled = true }
  }, [getIdToken, user, notifsUrl])

  async function dismissNote(noteId) {
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
    try {
      const idToken = getIdToken ? await getIdToken() : null
      if (!idToken) return
      await fetch(notifsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ action: 'dismiss', note_ids: [noteId] }),
      })
    } catch {
      // Local dismiss already happened — server-side resync on next mount
    }
  }

  function toggleTag(t) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  async function handleSubmit() {
    setError(null)
    setBusy(true)
    try {
      const idToken = getIdToken ? await getIdToken() : null
      if (!idToken) {
        throw new Error('Not signed in. Sign in before sending feedback.')
      }
      const body = {
        app_id: appId,
        app_name: appName,
        user_email: user?.email || null,
        user_display_name: user?.displayName || null,
        user_comment: comment.trim() || null,
        user_tags: tags,
        app_route: typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : null,
        device_info: {
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          viewport_width: typeof window !== 'undefined' ? window.innerWidth : null,
          viewport_height: typeof window !== 'undefined' ? window.innerHeight : null,
          is_mobile: typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent),
          build_sha: BUILD_SHA,
          online: typeof navigator !== 'undefined' ? navigator.onLine : null,
          connection_type:
            (typeof navigator !== 'undefined' && navigator.connection?.effectiveType) || null,
          display_mode:
            typeof window !== 'undefined' &&
            window.matchMedia?.('(display-mode: standalone)').matches
              ? 'standalone'
              : 'browser',
        },
        error_state: {
          recent_errors: getRecentErrors(),
          recent_network: getRecentNetwork(),
          breadcrumbs: getBreadcrumbs(),
        },
        screenshot_data_url: screenshotDataUrl || null,
      }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
          'X-App-Source': appId,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.error || `Submit failed (${res.status})`)
      }
      setDone(true)
      setComment('')
      setTags([])
      setScreenshotDataUrl(null)
      setTimeout(() => setIsOpen(false), 1500)
    } catch (err) {
      console.error('Workbench submit failed:', err)
      setError(err.message || 'Send failed')
    } finally {
      setBusy(false)
    }
  }

  // Don't render the floating button until the user is signed in. Host apps
  // commonly mount this at the root and want it hidden on login screens.
  const canSubmit = !!user && !!getIdToken

  // Top-most note in the stack. We show one at a time so the panel
  // stays compact; dismissing reveals the next.
  const currentNote = canSubmit && notes.length > 0 ? notes[0] : null

  return (
    <>
      {/* Notification panel — pinned just above the floating button */}
      {currentNote && (
        <div
          data-workbench-internal
          style={{
            position: 'fixed',
            right: position.right,
            bottom: `calc(${position.bottom} + 56px)`,
            zIndex: 8999,
            width: 'min(340px, calc(100vw - 40px))',
            background: surface,
            color: textColor,
            border: `1px solid ${accent}`,
            borderRadius: '12px',
            padding: '12px 14px',
            boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            From Zach · {currentNote.disposition === 'deleted' ? 'request removed' : currentNote.disposition?.replace('_', ' ') || 'update'}
            {notes.length > 1 ? ` · 1 of ${notes.length}` : ''}
          </div>
          {currentNote.original_comment_summary && (
            <div style={{ fontSize: '11px', opacity: 0.55, marginBottom: '8px', fontStyle: 'italic', lineHeight: 1.4 }}>
              re: "{currentNote.original_comment_summary}{currentNote.original_comment_summary.length >= 200 ? '…' : ''}"
            </div>
          )}
          <div style={{ fontSize: '13px', lineHeight: 1.45, whiteSpace: 'pre-wrap', marginBottom: '10px' }}>
            {currentNote.developer_note}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={() => dismissNote(currentNote.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: accent,
                color: '#1a1a1a',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Floating trigger */}
      {canSubmit && !hideTrigger && (
        <button
          type="button"
          data-workbench-internal
          onClick={openWithCapture}
          disabled={capturing}
          aria-label="Tell Zach about this"
          title="Tell Zach about this — Ctrl+."
          style={{
            position: 'fixed',
            ...position,
            zIndex: 9000,
            width: '44px',
            height: '44px',
            borderRadius: '999px',
            background: surface,
            color: accent,
            border: `1px solid ${accent}`,
            boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
            cursor: 'pointer',
            opacity: 0.6,
            transition: 'opacity 0.15s ease, transform 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.6'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {/* Wrench */}
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div
          data-workbench-internal
          onClick={() => !busy && closeAndReset()}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9100,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '0 12px 12px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              background: surface,
              border: `1px solid ${accent}`,
              borderRadius: '14px',
              padding: '18px',
              color: textColor,
              fontFamily: 'inherit',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              maxHeight: '88dvh',
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600 }}>Tell Zach about this</div>
                <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '2px' }}>
                  {appName} · {user?.email}
                </div>
              </div>
              <button
                onClick={() => !busy && closeAndReset()}
                aria-label="Close"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: textColor,
                  fontSize: '20px',
                  cursor: 'pointer',
                  opacity: 0.6,
                  padding: '4px 8px',
                }}
              >
                ×
              </button>
            </div>

            {!done && (
              <>
                <textarea
                  ref={textareaRef}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What's up? A bug, a thought, something you'd change…"
                  rows={5}
                  disabled={busy}
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: textColor,
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Screenshot preview / toggle */}
                <div style={{ marginTop: '12px', minHeight: '32px' }}>
                  {capturing && (
                    <div style={{ fontSize: '11px', opacity: 0.55 }}>
                      Capturing screenshot…
                    </div>
                  )}
                  {!capturing && screenshotDataUrl && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <img
                        src={screenshotDataUrl}
                        alt="Screenshot preview"
                        style={{
                          width: '88px',
                          height: 'auto',
                          maxHeight: '140px',
                          borderRadius: '4px',
                          border: '1px solid rgba(255,255,255,0.18)',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '2px' }}>
                        <div style={{ fontSize: '11px', opacity: 0.7 }}>
                          Screenshot attached
                        </div>
                        <button
                          type="button"
                          onClick={() => setScreenshotDataUrl(null)}
                          disabled={busy}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: textColor,
                            fontSize: '11px',
                            opacity: 0.55,
                            cursor: 'pointer',
                            padding: 0,
                            textAlign: 'left',
                            textDecoration: 'underline',
                            fontFamily: 'inherit',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                  {!capturing && !screenshotDataUrl && (
                    <button
                      type="button"
                      onClick={async () => {
                        setCapturing(true)
                        try {
                          const d = await captureScreenshot()
                          if (d) setScreenshotDataUrl(d)
                        } finally {
                          setCapturing(false)
                        }
                      }}
                      disabled={busy}
                      style={{
                        background: 'transparent',
                        border: '1px dashed rgba(255,255,255,0.2)',
                        color: textColor,
                        fontSize: '11px',
                        opacity: 0.55,
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontFamily: 'inherit',
                      }}
                    >
                      + Add screenshot
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                  {TAGS.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      disabled={busy}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '999px',
                        background: tags.includes(t) ? accent : 'transparent',
                        color: tags.includes(t) ? '#1a1a1a' : textColor,
                        border: `1px solid ${tags.includes(t) ? accent : 'rgba(255,255,255,0.18)'}`,
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {error && (
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(184, 90, 74, 0.12)',
                    border: '1px solid rgba(184, 90, 74, 0.5)',
                    color: '#e8a89a',
                    fontSize: '12px',
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '14px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => !busy && closeAndReset()}
                    disabled={busy}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: textColor,
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={busy || (!comment.trim() && tags.length === 0)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      background: accent,
                      color: '#1a1a1a',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: busy ? 'wait' : 'pointer',
                      opacity: busy || (!comment.trim() && tags.length === 0) ? 0.6 : 1,
                      fontFamily: 'inherit',
                    }}
                  >
                    {busy ? 'Sending…' : 'Send to Zach'}
                  </button>
                </div>
              </>
            )}

            {done && (
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', marginBottom: '6px' }}>Sent.</div>
                <div style={{ fontSize: '12px', opacity: 0.6 }}>
                  Zach will see this in The Workbench.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
