// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearAuth,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  isAuthenticated,
  setAuth,
} from '@/lib/auth'
import type { User } from '@/types/index'

const mockUser: User = {
  id: 'user-001',
  email: 'test@atmos.app',
  display_name: 'Test User',
  avatar_url: 'https://example.com/avatar.png',
  locale: 'en',
  timezone: 'UTC',
  email_verified_at: '2024-01-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// Provide a clean localStorage mock for every test regardless of runner environment
function makeMockStorage() {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
    get length() { return Object.keys(store).length },
    key: (index: number): string | null => Object.keys(store)[index] ?? null,
  }
}

describe('lib/auth', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', makeMockStorage())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ─── setAuth ───────────────────────────────────────────────────────────────

  describe('setAuth', () => {
    it('stores the access token in localStorage', () => {
      setAuth('access-token-abc', 'refresh-token-xyz', mockUser)
      expect(localStorage.getItem('atmos_access_token')).toBe('access-token-abc')
    })

    it('stores the refresh token in localStorage', () => {
      setAuth('access-token-abc', 'refresh-token-xyz', mockUser)
      expect(localStorage.getItem('atmos_refresh_token')).toBe('refresh-token-xyz')
    })

    it('stores the user as JSON in localStorage', () => {
      setAuth('access-token-abc', 'refresh-token-xyz', mockUser)
      expect(localStorage.getItem('atmos_user')).toBe(JSON.stringify(mockUser))
    })
  })

  // ─── getAccessToken ────────────────────────────────────────────────────────

  describe('getAccessToken', () => {
    it('returns null when no access token has been stored', () => {
      expect(getAccessToken()).toBeNull()
    })

    it('returns the access token after setAuth', () => {
      setAuth('access-token-abc', 'refresh-token-xyz', mockUser)
      expect(getAccessToken()).toBe('access-token-abc')
    })
  })

  // ─── getRefreshToken ───────────────────────────────────────────────────────

  describe('getRefreshToken', () => {
    it('returns null when no refresh token has been stored', () => {
      expect(getRefreshToken()).toBeNull()
    })

    it('returns the refresh token after setAuth', () => {
      setAuth('access-token-abc', 'refresh-token-xyz', mockUser)
      expect(getRefreshToken()).toBe('refresh-token-xyz')
    })
  })

  // ─── getStoredUser ─────────────────────────────────────────────────────────

  describe('getStoredUser', () => {
    it('returns null when no user has been stored', () => {
      expect(getStoredUser()).toBeNull()
    })

    it('returns the user object after setAuth', () => {
      setAuth('access-token-abc', 'refresh-token-xyz', mockUser)
      expect(getStoredUser()).toEqual(mockUser)
    })

    it('returns null when the stored value is invalid JSON', () => {
      localStorage.setItem('atmos_user', 'not-valid-json{{')
      expect(getStoredUser()).toBeNull()
    })
  })

  // ─── clearAuth ─────────────────────────────────────────────────────────────

  describe('clearAuth', () => {
    it('removes all three auth keys from localStorage', () => {
      setAuth('access-token-abc', 'refresh-token-xyz', mockUser)
      clearAuth()
      expect(localStorage.getItem('atmos_access_token')).toBeNull()
      expect(localStorage.getItem('atmos_refresh_token')).toBeNull()
      expect(localStorage.getItem('atmos_user')).toBeNull()
    })

    it('is safe to call when nothing is stored', () => {
      expect(() => clearAuth()).not.toThrow()
    })
  })

  // ─── isAuthenticated ───────────────────────────────────────────────────────

  describe('isAuthenticated', () => {
    it('returns false when there is no access token', () => {
      expect(isAuthenticated()).toBe(false)
    })

    it('returns true after setAuth', () => {
      setAuth('access-token-abc', 'refresh-token-xyz', mockUser)
      expect(isAuthenticated()).toBe(true)
    })

    it('returns false after clearAuth', () => {
      setAuth('access-token-abc', 'refresh-token-xyz', mockUser)
      clearAuth()
      expect(isAuthenticated()).toBe(false)
    })
  })
})
