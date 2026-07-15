// kairosHandshake.js
//
// Asks Kairos whether the signed-in Vigil user is a Kairos household member,
// so Vigil can surface the Golden Ticket experience. Caches the answer in
// sessionStorage for an hour.
//
// Never blocks the app. Any failure — offline, Kairos down, timeout, non-member
// — resolves to null and Vigil renders its normal standalone experience.
// A Vigil user with no Kairos account is a first-class user, not an error.

const KAIROS_VERIFY_URL =
  'https://kairos-pwa.netlify.app/.netlify/functions/kairos-verify-member'
const CACHE_KEY = 'kairos_membership_v1'
const CACHE_TTL = 3600000 // 1 hour

// Synchronous cache peek. Lets a caller seed state on the first render so
// members don't watch the standalone UI flash past before the handshake
// resolves. Returns null when there's no fresh entry for this email.
export function readCachedMembership(email) {
  if (!email) return null
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (!cached) return null
    const { data, timestamp, email: cachedEmail } = JSON.parse(cached)
    if (cachedEmail !== email) return null
    if (Date.now() - timestamp >= CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

export async function getKairosMembership(firebaseUser) {
  if (!firebaseUser) return null

  const cached = readCachedMembership(firebaseUser.email)
  if (cached) return cached

  try {
    const token = await firebaseUser.getIdToken()
    const response = await fetch(KAIROS_VERIFY_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return null
    const data = await response.json()

    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now(),
        email: firebaseUser.email,
      }))
    } catch { /* private mode / quota — cache is optional */ }

    return data
  } catch {
    // Network failure, timeout, Kairos unreachable. Treat as non-member —
    // never block the app for a failed Kairos check.
    return null
  }
}

export function clearKairosMembershipCache() {
  try {
    sessionStorage.removeItem(CACHE_KEY)
  } catch { /* ignore */ }
}

export function isKairosUser(membership) {
  return membership?.isMember === true
}
