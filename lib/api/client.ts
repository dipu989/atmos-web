import { clearAuth, getAccessToken, getRefreshToken, updateTokens } from '@/lib/auth'
import type {
  AuthResponse,
  CreateTripRequest,
  DailySummary,
  Insight,
  InsightType,
  LoginRequest,
  ModeBreakdown,
  MonthlySummary,
  PaginatedResponse,
  PeriodType,
  Preferences,
  SignupRequest,
  TokenRefreshResponse,
  TransportMode,
  Trip,
  TrendData,
  User,
  WeeklySummary,
  ActivitySource,
  ActivityStatus,
} from '@/types/index'

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8081'

// ─── Error helpers ────────────────────────────────────────────────────────────

function isNotFoundError(err: unknown): boolean {
  return (
    err instanceof Error &&
    (err.message.toLowerCase().includes('not found') ||
      err.message.toLowerCase().includes('record not found'))
  )
}
const API_PREFIX = '/api/v1'

// ─── Internal backend shapes (snake_case — never exposed to UI) ───────────────

interface BackendActivity {
  id: string
  user_id: string
  device_id?: string
  activity_type: 'transport' | 'flight' | 'energy' | 'food'
  transport_mode?: TransportMode
  distance_km?: number
  duration_minutes?: number
  source: ActivitySource
  started_at: string
  ended_at?: string
  date_local: string
  status: ActivityStatus
  created_at: string
  updated_at: string
  /** CO₂ field — not yet in API spec, mapped when present for forward compatibility */
  kg_co2e?: number
  /** Metadata bag — may contain `from` and `to` origin/destination labels */
  metadata?: { from?: string; to?: string; [key: string]: unknown }
}

interface BackendModeBreakdown {
  kg_co2e: number
  distance_km: number
  count: number
}

interface BackendTrend {
  prev_total_kg_co2e: number
  change_pct: number | null
  direction: 'up' | 'down' | 'flat'
}

interface BackendDailySummary {
  id: string
  user_id: string
  date_local: string
  total_kg_co2e: number
  total_distance_km: number
  activity_count: number
  breakdown: Partial<Record<TransportMode, BackendModeBreakdown>>
  computed_at: string
  created_at: string
  updated_at: string
  trend: BackendTrend
}

interface BackendWeeklySummary {
  id: string
  user_id: string
  week_start: string
  week_end: string
  total_kg_co2e: number
  total_distance_km: number
  activity_count: number
  breakdown: Partial<Record<TransportMode, BackendModeBreakdown>>
  computed_at: string
  created_at: string
  updated_at: string
  trend: BackendTrend
}

interface BackendMonthlySummary {
  id: string
  user_id: string
  year: number
  month: number
  total_kg_co2e: number
  total_distance_km: number
  activity_count: number
  breakdown: Partial<Record<TransportMode, BackendModeBreakdown>>
  computed_at: string
  created_at: string
  updated_at: string
  trend: BackendTrend
}

interface BackendInsight {
  id: string
  user_id: string
  insight_type: InsightType
  period_type: PeriodType
  period_start: string
  period_end: string
  title: string
  body: string
  cta_label?: string
  cta_target?: string
  metadata: Record<string, unknown>
  is_read: boolean
  expires_at?: string
  created_at: string
  updated_at: string
}

// ─── Mappers — Activity → Trip, backend shapes → UI shapes ───────────────────

function mapActivity(a: BackendActivity): Trip {
  return {
    id: a.id,
    userId: a.user_id,
    activityType: a.activity_type,
    transportMode: a.transport_mode,
    distanceKm: a.distance_km,
    durationMinutes: a.duration_minutes,
    source: a.source,
    startedAt: a.started_at,
    endedAt: a.ended_at,
    dateLocal: a.date_local,
    status: a.status,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
    co2Kg: a.kg_co2e,
    from: a.metadata?.from,
    to: a.metadata?.to,
  }
}

function mapBreakdown(
  raw: Partial<Record<TransportMode, BackendModeBreakdown>>,
): Partial<Record<TransportMode, ModeBreakdown>> {
  const result: Partial<Record<TransportMode, ModeBreakdown>> = {}
  for (const key of Object.keys(raw) as TransportMode[]) {
    const val = raw[key]
    if (val !== undefined) {
      result[key] = { kg_co2e: val.kg_co2e, distance_km: val.distance_km, count: val.count }
    }
  }
  return result
}

function mapTrend(t: BackendTrend): TrendData {
  return {
    prev_total_kg_co2e: t.prev_total_kg_co2e,
    change_pct: t.change_pct,
    direction: t.direction,
  }
}

function mapDailySummary(d: BackendDailySummary): DailySummary {
  return {
    id: d.id,
    userId: d.user_id,
    dateLocal: d.date_local,
    totalKgCo2e: d.total_kg_co2e,
    totalDistanceKm: d.total_distance_km,
    activityCount: d.activity_count,
    breakdown: mapBreakdown(d.breakdown),
    computedAt: d.computed_at,
    trend: mapTrend(d.trend),
  }
}

function mapWeeklySummary(w: BackendWeeklySummary): WeeklySummary {
  return {
    id: w.id,
    userId: w.user_id,
    weekStart: w.week_start,
    weekEnd: w.week_end,
    totalKgCo2e: w.total_kg_co2e,
    totalDistanceKm: w.total_distance_km,
    activityCount: w.activity_count,
    breakdown: mapBreakdown(w.breakdown),
    computedAt: w.computed_at,
    trend: mapTrend(w.trend),
  }
}

function mapMonthlySummary(m: BackendMonthlySummary): MonthlySummary {
  return {
    id: m.id,
    userId: m.user_id,
    year: m.year,
    month: m.month,
    totalKgCo2e: m.total_kg_co2e,
    totalDistanceKm: m.total_distance_km,
    activityCount: m.activity_count,
    breakdown: mapBreakdown(m.breakdown),
    computedAt: m.computed_at,
    trend: mapTrend(m.trend),
  }
}

function mapInsight(i: BackendInsight): Insight {
  return {
    id: i.id,
    userId: i.user_id,
    insightType: i.insight_type,
    periodType: i.period_type,
    periodStart: i.period_start,
    periodEnd: i.period_end,
    title: i.title,
    body: i.body,
    ctaLabel: i.cta_label,
    ctaTarget: i.cta_target,
    metadata: i.metadata,
    isRead: i.is_read,
    expiresAt: i.expires_at,
    createdAt: i.created_at,
    updatedAt: i.updated_at,
  }
}

// ─── HTTP core ────────────────────────────────────────────────────────────────

type QueryParams = Record<string, string | number | boolean | undefined>

function buildUrl(path: string, params?: QueryParams): string {
  const url = new URL(`${BASE_URL}${API_PREFIX}${path}`)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

async function request<T>(
  url: string,
  options: RequestInit = {},
  authenticated = true,
  allowRefreshRetry = true,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  if (authenticated) {
    const token = getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> | undefined) },
  })

  if (response.status === 401) {
    // Attempt a silent token refresh before falling back to logout.
    // Only retry once (allowRefreshRetry=false on the second attempt) and only
    // for authenticated requests — the refresh endpoint itself is unauthenticated.
    if (allowRefreshRetry && authenticated) {
      const storedRefreshToken = getRefreshToken()
      if (storedRefreshToken) {
        try {
          const refreshed = await refreshToken(storedRefreshToken)
          updateTokens(refreshed.access_token, refreshed.refresh_token)
          // Retry the original request with the new access token. No further retry.
          return request<T>(url, options, authenticated, false)
        } catch {
          // Refresh failed — fall through to logout below.
        }
      }
    }
    // Only clear the session for authenticated requests. The refresh endpoint
    // itself is unauthenticated — a 401 there means the refresh token is expired
    // or invalid, but there is no additional session state to tear down here.
    if (authenticated) {
      clearAuth()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    throw new Error('Unauthorized — redirecting to login')
  }

  if (!response.ok) {
    let message = response.statusText
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      // ignore parse errors — use statusText
    }
    throw new Error(message)
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

// ─── Auth endpoints (no Authorization header required) ────────────────────────

export async function login(body: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>(
    buildUrl('/auth/login'),
    { method: 'POST', body: JSON.stringify(body) },
    false,
  )
}

export async function signup(body: SignupRequest): Promise<AuthResponse> {
  return request<AuthResponse>(
    buildUrl('/auth/register'),
    { method: 'POST', body: JSON.stringify(body) },
    false,
  )
}

export async function refreshToken(token: string): Promise<TokenRefreshResponse> {
  return request<TokenRefreshResponse>(
    buildUrl('/auth/token/refresh'),
    { method: 'POST', body: JSON.stringify({ refresh_token: token }) },
    false,
  )
}

// ─── Trips (maps activity ↔ trip at this layer) ───────────────────────────────

export async function getTrips(params?: {
  limit?: number
  offset?: number
  date_from?: string
  date_to?: string
  transport_mode?: string
}): Promise<PaginatedResponse<Trip>> {
  try {
    const raw = await request<{
      activities: BackendActivity[]
      total: number
      limit: number
      offset: number
    }>(buildUrl('/activities', params))

    return {
      items: raw.activities.map(mapActivity),
      total: raw.total,
      limit: raw.limit,
      offset: raw.offset,
    }
  } catch (err) {
    if (isNotFoundError(err)) return { items: [], total: 0, limit: 20, offset: 0 }
    throw err
  }
}

export async function getTripById(id: string): Promise<Trip> {
  const raw = await request<BackendActivity>(buildUrl(`/activities/${id}`))
  return mapActivity(raw)
}

export async function createTrip(body: CreateTripRequest): Promise<Trip> {
  const raw = await request<BackendActivity>(buildUrl('/activities'), {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return mapActivity(raw)
}

/**
 * Update a trip by id.
 * NOTE: The API spec does not currently list a PUT /activities/:id endpoint.
 * This function is provided for future use and forwards a partial request body.
 */
export async function updateTrip(id: string, body: Partial<CreateTripRequest>): Promise<Trip> {
  const raw = await request<BackendActivity>(buildUrl(`/activities/${id}`), {
    method: 'PUT',
    body: JSON.stringify(body),
  })
  return mapActivity(raw)
}

/**
 * Delete a trip by id.
 * NOTE: The API spec does not currently list a DELETE /activities/:id endpoint.
 * This function is provided for future use.
 */
export async function deleteTrip(id: string): Promise<void> {
  await request<void>(buildUrl(`/activities/${id}`), { method: 'DELETE' })
}

// ─── Analytics ────────────────────────────────────────────────────────────────

/**
 * Returns daily CO₂ summaries.
 * When `days` is provided, fetches a range via GET /timeline/range;
 * otherwise returns today's summary via GET /timeline/daily.
 */
export async function getDailySummaries(params?: { days?: number }): Promise<DailySummary[]> {
  try {
    if (params?.days && params.days > 1) {
      const to = new Date()
      const from = new Date()
      from.setDate(from.getDate() - (params.days - 1))

      const toStr = to.toISOString().slice(0, 10)
      const fromStr = from.toISOString().slice(0, 10)

      const raw = await request<BackendDailySummary[]>(
        buildUrl('/timeline/range', { from: fromStr, to: toStr }),
      )
      return raw.map(mapDailySummary)
    }

    const raw = await request<BackendDailySummary>(buildUrl('/timeline/daily'))
    return [mapDailySummary(raw)]
  } catch (err) {
    if (isNotFoundError(err)) return []
    throw err
  }
}

/**
 * Returns weekly summaries.
 * NOTE: The current API only exposes the current week. The `weeks` param is
 * reserved for future multi-week support.
 */
export async function getWeeklySummaries(
  _params?: { weeks?: number },
): Promise<WeeklySummary[]> {
  try {
    const raw = await request<BackendWeeklySummary>(buildUrl('/timeline/weekly'))
    return [mapWeeklySummary(raw)]
  } catch (err) {
    if (isNotFoundError(err)) return []
    throw err
  }
}

/**
 * Returns monthly summaries.
 * NOTE: The current API only exposes the current month. The `months` param is
 * reserved for future multi-month support.
 */
export async function getMonthlySummaries(
  _params?: { months?: number },
): Promise<MonthlySummary[]> {
  try {
    const raw = await request<BackendMonthlySummary>(buildUrl('/timeline/monthly'))
    return [mapMonthlySummary(raw)]
  } catch (err) {
    if (isNotFoundError(err)) return []
    throw err
  }
}

/**
 * Returns per-mode CO₂ and distance breakdown.
 * Extracts breakdown data from the appropriate timeline summary.
 * `period` defaults to 'daily'; also accepts 'weekly' or 'monthly'.
 */
export async function getTransportBreakdown(
  params?: { period?: string },
): Promise<{ mode: TransportMode; co2_kg: number; distance_km: number }[]> {
  try {
    let rawBreakdown: Partial<Record<TransportMode, BackendModeBreakdown>>

    if (params?.period === 'weekly') {
      const raw = await request<BackendWeeklySummary>(buildUrl('/timeline/weekly'))
      rawBreakdown = raw.breakdown
    } else if (params?.period === 'monthly') {
      const raw = await request<BackendMonthlySummary>(buildUrl('/timeline/monthly'))
      rawBreakdown = raw.breakdown
    } else {
      const raw = await request<BackendDailySummary>(buildUrl('/timeline/daily'))
      rawBreakdown = raw.breakdown
    }

    const result: { mode: TransportMode; co2_kg: number; distance_km: number }[] = []
    for (const key of Object.keys(rawBreakdown) as TransportMode[]) {
      const val = rawBreakdown[key]
      if (val !== undefined) {
        result.push({ mode: key, co2_kg: val.kg_co2e, distance_km: val.distance_km })
      }
    }
    return result
  } catch (err) {
    if (isNotFoundError(err)) return []
    throw err
  }
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export async function getInsights(): Promise<Insight[]> {
  try {
    const raw = await request<{
      items: BackendInsight[]
      total: number
      limit: number
      offset: number
    }>(buildUrl('/insights'))
    return raw.items.map(mapInsight)
  } catch (err) {
    if (isNotFoundError(err)) return []
    throw err
  }
}

export async function markInsightRead(id: string): Promise<Insight> {
  const raw = await request<BackendInsight>(buildUrl(`/insights/${id}/read`), {
    method: 'PATCH',
  })
  return mapInsight(raw)
}

// ─── User / Preferences ───────────────────────────────────────────────────────

export async function getMe(accessToken?: string): Promise<User> {
  const options: RequestInit = accessToken
    ? { headers: { Authorization: `Bearer ${accessToken}` } }
    : {}
  return request<User>(buildUrl('/users/me'), options, !accessToken)
}

export async function updateMe(
  body: Partial<Pick<User, 'display_name' | 'timezone' | 'locale' | 'avatar_url'>>,
): Promise<User> {
  return request<User>(buildUrl('/users/me'), {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

const DEFAULT_PREFERENCES: Preferences = {
  distance_unit: 'km',
  push_notifications_enabled: false,
  weekly_report_enabled: true,
  daily_goal_kg_co2e: 5,
  data_sharing_enabled: false,
}

export async function getPreferences(): Promise<Preferences> {
  try {
    return await request<Preferences>(buildUrl('/users/me/preferences'))
  } catch (err) {
    if (isNotFoundError(err)) return DEFAULT_PREFERENCES
    throw err
  }
}

export async function updatePreferences(body: Partial<Preferences>): Promise<Preferences> {
  return request<Preferences>(buildUrl('/users/me/preferences'), {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}
