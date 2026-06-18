// ─── Transport ───────────────────────────────────────────────────────────────

export type TransportMode =
  | 'walking'
  | 'cycling'
  | 'metro'
  | 'train'
  | 'car'
  | 'cab'
  | 'flight'
  | 'bus'
  | 'auto_rickshaw'
  | 'two_wheeler'

export type ActivitySource =
  | 'manual'
  | 'uber'
  | 'ola'
  | 'rapido'
  | 'namma_yatri'
  | 'gmail'
  | 'health_kit'

export type ActivityStatus = 'pending' | 'processed' | 'failed' | 'skipped'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  display_name: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface TokenRefreshResponse {
  access_token: string
  refresh_token: string
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  display_name: string
  avatar_url: string
  locale: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface Preferences {
  distance_unit: 'km' | 'miles'
  push_notifications_enabled: boolean
  weekly_report_enabled: boolean
  daily_goal_kg_co2e: number
  data_sharing_enabled: boolean
}

// ─── Trip (maps from backend "Activity") ─────────────────────────────────────
// The backend calls this "activity". The UI always calls it "trip".
// Transformation (snake_case → camelCase) happens in lib/api/client.ts.
// Never use "activity" terminology in components.

export interface Trip {
  id: string
  userId: string
  activityType: 'transport' | 'flight' | 'energy' | 'food'
  transportMode?: TransportMode
  distanceKm?: number
  durationMinutes?: number
  source: ActivitySource
  startedAt: string
  endedAt?: string
  dateLocal: string
  status: ActivityStatus
  createdAt: string
  updatedAt: string
  /** CO₂ emissions in kg — derived from backend summary data when available */
  co2Kg?: number
  /** Trip origin label — mapped from activity metadata when present */
  from?: string
  /** Trip destination label — mapped from activity metadata when present */
  to?: string
}

/** Shape sent to POST /api/v1/activities */
export interface CreateTripRequest {
  transport_mode: TransportMode
  distance_km: number
  duration_minutes?: number
  source: ActivitySource
  metadata?: Record<string, unknown>
  started_at: string
  ended_at?: string
  idempotency_key?: string
}

// ─── Timeline ────────────────────────────────────────────────────────────────

export interface ModeBreakdown {
  kg_co2e: number
  distance_km: number
  count: number
}

export interface TrendData {
  prev_total_kg_co2e: number
  change_pct: number | null
  direction: 'up' | 'down' | 'flat'
}

export interface DailySummary {
  id: string
  userId: string
  dateLocal: string
  totalKgCo2e: number
  totalDistanceKm: number
  activityCount: number
  breakdown: Partial<Record<TransportMode, ModeBreakdown>>
  computedAt: string
  trend: TrendData
}

export interface WeeklySummary {
  id: string
  userId: string
  weekStart: string
  weekEnd: string
  totalKgCo2e: number
  totalDistanceKm: number
  activityCount: number
  breakdown: Partial<Record<TransportMode, ModeBreakdown>>
  computedAt: string
  trend: TrendData
}

export interface MonthlySummary {
  id: string
  userId: string
  year: number
  month: number
  totalKgCo2e: number
  totalDistanceKm: number
  activityCount: number
  breakdown: Partial<Record<TransportMode, ModeBreakdown>>
  computedAt: string
  trend: TrendData
}

// ─── Insights ────────────────────────────────────────────────────────────────

export type InsightType =
  | 'streak'
  | 'milestone'
  | 'comparison'
  | 'tip'
  | 'anomaly'
  | 'weekly_comparison'
  | 'mode_spike'
  | 'mode_summary'

export type PeriodType = 'daily' | 'weekly' | 'monthly'

export interface Insight {
  id: string
  userId: string
  insightType: InsightType
  periodType: PeriodType
  periodStart: string
  periodEnd: string
  title: string
  body: string
  ctaLabel?: string
  ctaTarget?: string
  metadata: Record<string, unknown>
  isRead: boolean
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

// ─── Gmail ────────────────────────────────────────────────────────────────────

export interface GmailStatus {
  connected: boolean
  email?: string
  connectedAt?: string
  lastSyncAt?: string
  lastSyncSummary?: {
    messagesChecked: number
    parsed: number
    skipped: number
    failed: number
  }
}

export interface GmailSyncResult {
  messagesChecked: number
  parsed: number
  skipped: number
  failed: number
  message: string
}

// ─── API Keys ─────────────────────────────────────────────────────────────────

export interface APIKey {
  id: string
  name: string
  prefix: string
  lastUsedAt?: string
  expiresAt?: string
  createdAt: string
}

export interface CreateAPIKeyResponse {
  id: string
  name: string
  /** Raw key — returned once at creation time only. Store it immediately. */
  key: string
  prefix: string
  createdAt: string
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}
