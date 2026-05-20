# T001 — Rebuild API Client

**Branch:** `feat/T001-rebuild-api-client`
**Status:** ⬜ Todo
**Depends on:** nothing (start here)

---

## Context files to read first
- `../.context/api-spec.md` — all 33 endpoints with exact URLs and request/response shapes
- `../.context/data-models.md` — TypeScript interfaces for all domain objects
- `../.context/auth-flow.md` — JWT storage, localStorage keys, 401 handling
- `CLAUDE.md` — API client rules and architecture section

---

## What to build

Complete rewrite of the API client layer. The existing files (if any) in `lib/` are wrong — wrong base URL, missing `/api/v1/` prefix, endpoints that don't exist.

### Files to create / rewrite

**`types/index.ts`** — single source of truth for all TypeScript types. Export:
```ts
// Auth
export interface LoginRequest { email: string; password: string }
export interface SignupRequest { email: string; password: string; name: string }
export interface AuthResponse { access_token: string; refresh_token: string; user: User }

// User
export interface User { id: string; email: string; name: string; created_at: string }

// Trip (maps from backend "Activity")
export interface Trip {
  id: string
  mode: TransportMode
  distance_km: number
  co2_kg: number
  source: 'auto' | 'manual'
  started_at: string
  ended_at: string
  from_label?: string
  to_label?: string
  duration_min?: number
}
export type TransportMode = 'car' | 'train' | 'bus' | 'bike' | 'walk' | 'flight'

// Analytics summaries
export interface DailySummary { date: string; co2_kg: number; trip_count: number }
export interface WeeklySummary { week_start: string; co2_kg: number; trip_count: number }
export interface MonthlySummary { month: string; co2_kg: number; trip_count: number }

// Insights
export interface Insight {
  id: string
  type: InsightType
  title: string
  body: string
  created_at: string
  read: boolean
}
export type InsightType = 'STREAK' | 'TIP' | 'ANOMALY' | 'COMPARISON' | 'MILESTONE' | 'CONTEXT' | 'WEEKLY_DIGEST'

// User preferences
export interface Preferences {
  daily_goal_kg: number
  distance_unit: 'km' | 'mi'
  notifications_enabled: boolean
}

// Pagination
export interface PaginatedResponse<T> { data: T[]; total: number; page: number; page_size: number }

// API envelope
export interface ApiResponse<T> { data: T; message: string }
```

**`lib/auth.ts`** — pure functions for JWT storage (no side effects, unit-testable):
```ts
const ACCESS_KEY = 'atmos_access_token'
const REFRESH_KEY = 'atmos_refresh_token'
const USER_KEY = 'atmos_user'

export function setAuth(token: string, refreshToken: string, user: User): void
export function getAccessToken(): string | null
export function getRefreshToken(): string | null
export function getStoredUser(): User | null
export function clearAuth(): void
export function isAuthenticated(): boolean  // returns true if access token exists
```

**`lib/api/client.ts`** — the HTTP client:
- Base URL: `process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8081'`
- All routes prefixed with `/api/v1/`
- Attach `Authorization: Bearer <token>` on all protected calls
- On 401: call `clearAuth()` then `window.location.href = '/login'`
- Unwrap `{ data, message }` envelope — return `data` only
- Export these async functions (match `api-spec.md` exactly):

```ts
// Auth (no auth header needed)
export async function login(body: LoginRequest): Promise<AuthResponse>
export async function signup(body: SignupRequest): Promise<AuthResponse>
export async function refreshToken(token: string): Promise<AuthResponse>

// Trips (maps activity → Trip)
export async function getTrips(params?: { page?: number; page_size?: number; mode?: string; source?: string }): Promise<PaginatedResponse<Trip>>
export async function getTripById(id: string): Promise<Trip>
export async function createTrip(body: Omit<Trip, 'id' | 'co2_kg'>): Promise<Trip>
export async function updateTrip(id: string, body: Partial<Trip>): Promise<Trip>
export async function deleteTrip(id: string): Promise<void>

// Analytics
export async function getDailySummaries(params?: { days?: number }): Promise<DailySummary[]>
export async function getWeeklySummaries(params?: { weeks?: number }): Promise<WeeklySummary[]>
export async function getMonthlySummaries(params?: { months?: number }): Promise<MonthlySummary[]>
export async function getTransportBreakdown(params?: { period?: string }): Promise<{ mode: TransportMode; co2_kg: number; distance_km: number }[]>

// Insights
export async function getInsights(): Promise<Insight[]>
export async function markInsightRead(id: string): Promise<Insight>

// User / Preferences
export async function getMe(): Promise<User>
export async function updateMe(body: Partial<User>): Promise<User>
export async function getPreferences(): Promise<Preferences>
export async function updatePreferences(body: Partial<Preferences>): Promise<Preferences>
```

**`lib/hooks/useTrips.ts`** — TanStack Query hooks wrapping the API client:
```ts
export function useTrips(params?: Parameters<typeof getTrips>[0])
export function useTripById(id: string)
export function useDailySummaries(days?: number)
export function useWeeklySummaries(weeks?: number)
export function useMonthlySummaries(months?: number)
export function useTransportBreakdown(period?: string)
export function useInsights()
export function useMe()
export function usePreferences()
```
Each hook: correct `queryKey` with params, `staleTime: 5 * 60 * 1000` (5 min).

**`lib/hooks/useMutations.ts`** — mutation hooks:
```ts
export function useCreateTrip()
export function useUpdateTrip()
export function useDeleteTrip()
export function useMarkInsightRead()
export function useUpdateMe()
export function useUpdatePreferences()
```
Each mutation: `onSuccess` invalidates relevant query keys.

### Activity → Trip mapping

In `lib/api/client.ts`, the backend returns `activity` objects. Map them to `Trip` in the fetch functions — the UI must never see the word "activity". Mapping:
```
activity.id             → trip.id
activity.transport_mode → trip.mode
activity.distance_km    → trip.distance_km
activity.co2_kg         → trip.co2_kg
activity.source         → trip.source
activity.started_at     → trip.started_at
activity.ended_at       → trip.ended_at
activity.from_label     → trip.from_label
activity.to_label       → trip.to_label
```

---

## Unit tests

**`lib/auth.test.ts`** — test all 6 exported functions:
- `setAuth` stores values in localStorage
- `getAccessToken` returns null when empty, token after setAuth
- `clearAuth` removes all 3 keys
- `isAuthenticated` returns false when no token, true after setAuth

**`lib/api/client.test.ts`** — mock `fetch`, test:
- `login` sends POST to correct URL without auth header
- `getTrips` sends GET with Authorization header
- On 401 response: `clearAuth` is called
- Response envelope is unwrapped (returns `data`, not `{ data, message }`)
- `activity` keys from backend response are mapped to `trip` keys

Use `vi.stubGlobal('fetch', ...)` for mocking fetch. Use `vi.stubGlobal('localStorage', ...)` or jsdom's built-in localStorage.

---

## Acceptance criteria

- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes (all auth and client tests green)
- [ ] No `any` types anywhere in the new files
- [ ] `types/index.ts` has all interfaces listed above
- [ ] API client exports all listed functions
- [ ] Activity→Trip mapping applied in all trip-related fetchers

---

## Quality gates
- [ ] `pnpm build` zero errors
- [ ] `pnpm lint` zero warnings
- [ ] `pnpm test` green
- [ ] PR opened with template: `feat(T001): rebuild API client with correct routes and activity→trip mapping`
