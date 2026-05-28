import type { User } from '@/types/index'

const ACCESS_KEY = 'atmos_access_token'
const REFRESH_KEY = 'atmos_refresh_token'
const USER_KEY = 'atmos_user'

/**
 * Persist all three auth artefacts in localStorage after a successful login /
 * signup / token-refresh.
 */
export function setAuth(token: string, refreshToken: string, user: User): void {
  localStorage.setItem(ACCESS_KEY, token)
  localStorage.setItem(REFRESH_KEY, refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/** Returns the stored JWT access token, or null when not authenticated. */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY)
}

/** Returns the stored JWT refresh token, or null when not authenticated. */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

/** Returns the cached User object from localStorage, or null. */
export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

/**
 * Update the stored access and refresh tokens without touching the cached user.
 * Called after a successful silent token refresh.
 */
export function updateTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_KEY, accessToken)
  localStorage.setItem(REFRESH_KEY, refreshToken)
}

/**
 * Remove all three auth keys from localStorage.
 * Called on logout or when a 401 response is received.
 */
export function clearAuth(): void {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}

/** Returns true when an access token is present in localStorage. */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null
}
