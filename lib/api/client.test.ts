// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as authModule from '@/lib/auth'

// ─── localStorage mock ────────────────────────────────────────────────────────

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

// ─── Response helpers ─────────────────────────────────────────────────────────

function makeOkResponse(data: unknown, status = 200) {
  return {
    ok: true,
    status,
    json: () => Promise.resolve(data),
  } as unknown as Response
}

function makeErrorResponse(status: number, message = 'Error') {
  return {
    ok: false,
    status,
    statusText: message,
    json: () => Promise.resolve({ message }),
  } as unknown as Response
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockUser = {
  id: 'user-001',
  email: 'test@atmos.app',
  display_name: 'Test User',
  avatar_url: '',
  locale: 'en',
  timezone: 'UTC',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockAuthResponse = {
  access_token: 'access-token-abc',
  refresh_token: 'refresh-token-xyz',
  user: mockUser,
}

const mockBackendActivity = {
  id: 'act-001',
  user_id: 'user-001',
  activity_type: 'transport',
  transport_mode: 'car',
  distance_km: 12.5,
  duration_minutes: 25,
  source: 'manual',
  started_at: '2024-01-15T08:00:00Z',
  ended_at: '2024-01-15T08:25:00Z',
  date_local: '2024-01-15',
  status: 'processed',
  created_at: '2024-01-15T08:25:01Z',
  updated_at: '2024-01-15T08:25:01Z',
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('lib/api/client', () => {
  let fetchSpy: ReturnType<typeof vi.fn>
  let clearAuthSpy: ReturnType<typeof vi.spyOn>
  let getAccessTokenSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.stubGlobal('localStorage', makeMockStorage())
    fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    clearAuthSpy = vi.spyOn(authModule, 'clearAuth')
    getAccessTokenSpy = vi
      .spyOn(authModule, 'getAccessToken')
      .mockReturnValue('mock-bearer-token')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  // ─── login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('sends a POST request to /api/v1/auth/login', async () => {
      fetchSpy.mockResolvedValue(makeOkResponse(mockAuthResponse))
      const { login } = await import('@/lib/api/client')

      await login({ email: 'test@atmos.app', password: 'Test1234!' })

      expect(fetchSpy).toHaveBeenCalledOnce()
      const [url] = fetchSpy.mock.calls[0] as [string, RequestInit]
      expect(url).toContain('/api/v1/auth/login')
    })

    it('does NOT attach an Authorization header', async () => {
      fetchSpy.mockResolvedValue(makeOkResponse(mockAuthResponse))
      const { login } = await import('@/lib/api/client')

      await login({ email: 'test@atmos.app', password: 'Test1234!' })

      const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit]
      const headers = options.headers as Record<string, string>
      expect(headers['Authorization']).toBeUndefined()
    })

    it('returns the auth response directly (no envelope unwrapping needed)', async () => {
      fetchSpy.mockResolvedValue(makeOkResponse(mockAuthResponse))
      const { login } = await import('@/lib/api/client')

      const result = await login({ email: 'test@atmos.app', password: 'Test1234!' })

      expect(result).toEqual(mockAuthResponse)
      expect(result.access_token).toBe('access-token-abc')
      expect(result.user).toEqual(mockUser)
    })
  })

  // ─── signup ────────────────────────────────────────────────────────────────

  describe('signup', () => {
    it('sends a POST request to /api/v1/auth/register', async () => {
      fetchSpy.mockResolvedValue(makeOkResponse(mockAuthResponse))
      const { signup } = await import('@/lib/api/client')

      await signup({ email: 'new@atmos.app', password: 'Test1234!', display_name: 'New User' })

      const [url] = fetchSpy.mock.calls[0] as [string, RequestInit]
      expect(url).toContain('/api/v1/auth/register')
    })

    it('does NOT attach an Authorization header', async () => {
      fetchSpy.mockResolvedValue(makeOkResponse(mockAuthResponse))
      const { signup } = await import('@/lib/api/client')

      await signup({ email: 'new@atmos.app', password: 'Test1234!', display_name: 'New User' })

      const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit]
      const headers = options.headers as Record<string, string>
      expect(headers['Authorization']).toBeUndefined()
    })
  })

  // ─── getTrips ──────────────────────────────────────────────────────────────

  describe('getTrips', () => {
    it('sends a GET request to /api/v1/activities with Authorization header', async () => {
      fetchSpy.mockResolvedValue(
        makeOkResponse({ activities: [], total: 0, limit: 20, offset: 0 }),
      )
      const { getTrips } = await import('@/lib/api/client')

      await getTrips()

      expect(fetchSpy).toHaveBeenCalledOnce()
      const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit]
      expect(url).toContain('/api/v1/activities')
      const headers = options.headers as Record<string, string>
      expect(headers['Authorization']).toBe('Bearer mock-bearer-token')
    })

    it('maps activity keys to trip keys (activity → trip transformation)', async () => {
      fetchSpy.mockResolvedValue(
        makeOkResponse({ activities: [mockBackendActivity], total: 1, limit: 20, offset: 0 }),
      )
      const { getTrips } = await import('@/lib/api/client')

      const result = await getTrips()

      expect(result.items).toHaveLength(1)
      const trip = result.items[0]
      expect(trip.id).toBe('act-001')
      expect(trip.userId).toBe('user-001')
      expect(trip.activityType).toBe('transport')
      expect(trip.transportMode).toBe('car')
      expect(trip.distanceKm).toBe(12.5)
      expect(trip.durationMinutes).toBe(25)
      expect(trip.source).toBe('manual')
      expect(trip.startedAt).toBe('2024-01-15T08:00:00Z')
      expect(trip.endedAt).toBe('2024-01-15T08:25:00Z')
      expect(trip.dateLocal).toBe('2024-01-15')
      expect(trip.status).toBe('processed')
      expect(trip.createdAt).toBe('2024-01-15T08:25:01Z')
      expect(trip.updatedAt).toBe('2024-01-15T08:25:01Z')
    })

    it('does NOT expose backend snake_case field names in the mapped trip', async () => {
      fetchSpy.mockResolvedValue(
        makeOkResponse({ activities: [mockBackendActivity], total: 1, limit: 20, offset: 0 }),
      )
      const { getTrips } = await import('@/lib/api/client')

      const result = await getTrips()
      const trip = result.items[0] as Record<string, unknown>

      expect(trip['user_id']).toBeUndefined()
      expect(trip['transport_mode']).toBeUndefined()
      expect(trip['distance_km']).toBeUndefined()
      expect(trip['started_at']).toBeUndefined()
    })

    it('maps the raw response to PaginatedResponse with items', async () => {
      fetchSpy.mockResolvedValue(
        makeOkResponse({ activities: [mockBackendActivity], total: 42, limit: 20, offset: 0 }),
      )
      const { getTrips } = await import('@/lib/api/client')

      const result = await getTrips()

      expect(result.total).toBe(42)
      expect(result.limit).toBe(20)
      expect(result.offset).toBe(0)
      expect(Array.isArray(result.items)).toBe(true)
    })

    it('appends query params to the URL', async () => {
      fetchSpy.mockResolvedValue(
        makeOkResponse({ activities: [], total: 0, limit: 10, offset: 5 }),
      )
      const { getTrips } = await import('@/lib/api/client')

      await getTrips({ limit: 10, offset: 5, transport_mode: 'car' })

      const [url] = fetchSpy.mock.calls[0] as [string, RequestInit]
      expect(url).toContain('limit=10')
      expect(url).toContain('offset=5')
      expect(url).toContain('transport_mode=car')
    })
  })

  // ─── 401 handling ──────────────────────────────────────────────────────────

  describe('401 handling — no refresh token stored', () => {
    it('calls clearAuth immediately when there is no refresh token', async () => {
      // localStorage is empty → getRefreshToken() returns null → no retry
      fetchSpy.mockResolvedValue(makeErrorResponse(401, 'Unauthorized'))
      const { getTrips } = await import('@/lib/api/client')

      await expect(getTrips()).rejects.toThrow('Unauthorized')
      expect(clearAuthSpy).toHaveBeenCalledOnce()
    })

    it('throws an error so callers can catch and handle the redirect', async () => {
      fetchSpy.mockResolvedValue(makeErrorResponse(401))
      const { getMe } = await import('@/lib/api/client')

      await expect(getMe()).rejects.toThrow()
    })
  })

  // ─── Silent token refresh ──────────────────────────────────────────────────

  describe('silent token refresh', () => {
    let getRefreshTokenSpy: ReturnType<typeof vi.spyOn>
    let updateTokensSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      getRefreshTokenSpy = vi
        .spyOn(authModule, 'getRefreshToken')
        .mockReturnValue('stored-refresh-token')
      updateTokensSpy = vi.spyOn(authModule, 'updateTokens').mockImplementation(() => {})
    })

    it('retries the original request with a new token after a successful refresh', async () => {
      const refreshResponse = { access_token: 'new-access-token', refresh_token: 'new-refresh-token' }
      const tripsResponse = { activities: [], total: 0, limit: 20, offset: 0 }

      fetchSpy
        .mockResolvedValueOnce(makeErrorResponse(401))          // original request → 401
        .mockResolvedValueOnce(makeOkResponse(refreshResponse)) // /auth/token/refresh → 200
        .mockResolvedValueOnce(makeOkResponse(tripsResponse))   // retried request → 200

      const { getTrips } = await import('@/lib/api/client')
      const result = await getTrips()

      // fetch called 3 times: original, refresh, retry
      expect(fetchSpy).toHaveBeenCalledTimes(3)
      // tokens updated in localStorage
      expect(updateTokensSpy).toHaveBeenCalledWith('new-access-token', 'new-refresh-token')
      // result is from the retried request
      expect(result.items).toHaveLength(0)
      // clearAuth NOT called — user stays logged in
      expect(clearAuthSpy).not.toHaveBeenCalled()
    })

    it('calls clearAuth when the refresh endpoint returns 401', async () => {
      fetchSpy
        .mockResolvedValueOnce(makeErrorResponse(401))  // original → 401
        .mockResolvedValueOnce(makeErrorResponse(401))  // refresh → 401 (refresh token expired)

      const { getTrips } = await import('@/lib/api/client')

      await expect(getTrips()).rejects.toThrow()
      expect(clearAuthSpy).toHaveBeenCalledOnce()
    })

    it('calls clearAuth when the refresh endpoint returns a network error', async () => {
      fetchSpy
        .mockResolvedValueOnce(makeErrorResponse(401))              // original → 401
        .mockRejectedValueOnce(new Error('Network error'))           // refresh → throws

      const { getTrips } = await import('@/lib/api/client')

      await expect(getTrips()).rejects.toThrow()
      expect(clearAuthSpy).toHaveBeenCalledOnce()
    })

    it('does NOT retry again if the retried request also returns 401', async () => {
      const refreshResponse = { access_token: 'new-access-token', refresh_token: 'new-refresh-token' }

      fetchSpy
        .mockResolvedValueOnce(makeErrorResponse(401))          // original → 401
        .mockResolvedValueOnce(makeOkResponse(refreshResponse)) // refresh → 200
        .mockResolvedValueOnce(makeErrorResponse(401))          // retry → 401 (no further retry)

      const { getTrips } = await import('@/lib/api/client')

      await expect(getTrips()).rejects.toThrow()
      // fetch called exactly 3 times — no infinite loop
      expect(fetchSpy).toHaveBeenCalledTimes(3)
      expect(clearAuthSpy).toHaveBeenCalledOnce()
    })

    it('does NOT attempt refresh for unauthenticated endpoints', async () => {
      fetchSpy.mockResolvedValue(makeErrorResponse(401))
      const { login } = await import('@/lib/api/client')

      await expect(login({ email: 'x@x.com', password: 'pass' })).rejects.toThrow()
      // only 1 fetch — no refresh attempt
      expect(fetchSpy).toHaveBeenCalledTimes(1)
      expect(getRefreshTokenSpy).not.toHaveBeenCalled()
    })
  })

  // ─── Error handling ────────────────────────────────────────────────────────

  describe('non-401 errors', () => {
    it('throws using the error message from the response body', async () => {
      fetchSpy.mockResolvedValue(makeErrorResponse(404, 'User not found'))
      const { getMe } = await import('@/lib/api/client')

      await expect(getMe()).rejects.toThrow('User not found')
    })

    it('throws for 5xx responses', async () => {
      fetchSpy.mockResolvedValue(makeErrorResponse(500, 'Internal Server Error'))
      const { getMe } = await import('@/lib/api/client')

      await expect(getMe()).rejects.toThrow()
    })
  })

  // ─── getMe ─────────────────────────────────────────────────────────────────

  describe('getMe', () => {
    it('sends GET to /api/v1/users/me with Authorization header', async () => {
      fetchSpy.mockResolvedValue(makeOkResponse(mockUser))
      const { getMe } = await import('@/lib/api/client')

      const result = await getMe()

      const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit]
      expect(url).toContain('/api/v1/users/me')
      const headers = options.headers as Record<string, string>
      expect(headers['Authorization']).toBe('Bearer mock-bearer-token')
      expect(result).toEqual(mockUser)
    })
  })

  // ─── markInsightRead ───────────────────────────────────────────────────────

  describe('markInsightRead', () => {
    it('sends PATCH to /api/v1/insights/:id/read', async () => {
      const backendInsight = {
        id: 'ins-001',
        user_id: 'user-001',
        insight_type: 'streak',
        period_type: 'daily',
        period_start: '2024-01-01',
        period_end: '2024-01-07',
        title: 'Green streak!',
        body: 'You had 5 low-emission days.',
        metadata: {},
        is_read: true,
        created_at: '2024-01-07T00:00:00Z',
        updated_at: '2024-01-07T00:00:00Z',
      }
      fetchSpy.mockResolvedValue(makeOkResponse(backendInsight))
      const { markInsightRead } = await import('@/lib/api/client')

      await markInsightRead('ins-001')

      const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit]
      expect(url).toContain('/api/v1/insights/ins-001/read')
      expect(options.method).toBe('PATCH')
    })

    it('maps insight backend fields to camelCase UI fields', async () => {
      const backendInsight = {
        id: 'ins-002',
        user_id: 'user-001',
        insight_type: 'tip',
        period_type: 'weekly',
        period_start: '2024-01-01',
        period_end: '2024-01-07',
        title: 'Try cycling',
        body: 'Cycling saves 80% CO₂ vs car.',
        cta_label: 'Log a ride',
        cta_target: '/trips/new',
        metadata: {},
        is_read: true,
        expires_at: '2024-02-01T00:00:00Z',
        created_at: '2024-01-07T00:00:00Z',
        updated_at: '2024-01-07T12:00:00Z',
      }
      fetchSpy.mockResolvedValue(makeOkResponse(backendInsight))
      const { markInsightRead } = await import('@/lib/api/client')

      const result = await markInsightRead('ins-002')

      expect(result.id).toBe('ins-002')
      expect(result.userId).toBe('user-001')
      expect(result.insightType).toBe('tip')
      expect(result.periodType).toBe('weekly')
      expect(result.isRead).toBe(true)
      expect(result.ctaLabel).toBe('Log a ride')
      expect(result.ctaTarget).toBe('/trips/new')
      expect(result.expiresAt).toBe('2024-02-01T00:00:00Z')
    })
  })

  // ─── Auth token attachment ─────────────────────────────────────────────────

  describe('auth token attachment', () => {
    it('does not attach Authorization header when getAccessToken returns null', async () => {
      getAccessTokenSpy.mockReturnValue(null)
      fetchSpy.mockResolvedValue(
        makeOkResponse({ activities: [], total: 0, limit: 20, offset: 0 }),
      )
      const { getTrips } = await import('@/lib/api/client')

      await getTrips()

      const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit]
      const headers = options.headers as Record<string, string>
      expect(headers['Authorization']).toBeUndefined()
    })
  })
})
