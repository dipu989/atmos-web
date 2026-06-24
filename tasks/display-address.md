# Task: Render short display addresses instead of full long addresses

## Goal

The Trips table, the dashboard's Recent Trips widget, and trip search
currently show the full, ugly, long-form address for trip origin/
destination — e.g.

> Krishna Reddy Building, Kaggadasapura Main Rd, Malleshpalya,
> Kaggadasapura, Bengaluru, Karnataka 560075, India

The backend (atmos-core) now resolves and sends a short, human-friendly
version of the same address (e.g. `"Kaggadasapura, Bengaluru"`) as two new
nullable fields on the Activity JSON response: `display_origin` and
`display_destination`, alongside the existing `origin`/`destination` (the
long-form text, unchanged). See atmos-core PR
https://github.com/dipu989/atmos-core/pull/84 (merged and deployed to
production) for the backend side.

**This repo (atmos-web) has not been updated to read these new fields at
all** — that's why production still shows the long addresses despite the
backend change being live. This is a client-only fix; no backend changes
needed.

---

## Background

- Repo root: `/Users/dipu/atmos/atmos-web`
- `NEXT_PUBLIC_API_URL` controls which backend the app talks to (defaults to
  `http://localhost:8081` if unset — check your `.env.local` to confirm
  you're pointed at production when verifying this).
- The backend change is **already deployed**. `display_origin`/
  `display_destination` may currently be `null` for many activities even in
  production — they're populated for new activities at Gmail-receipt-ingest
  time, and backfilled for historical activities by a worker cron job that
  runs every 15 minutes (sweeping ~50 rows at a time, oldest first,
  system-wide). They will also be permanently `null` for activities that
  have no resolvable coordinates (e.g. some GPS-only trips), or if the
  backend's Google Maps API key doesn't have the **Places API (New)**
  product enabled (a separate toggle from legacy Places/Geocoding — worth
  asking backend to confirm if addresses stay empty after this ships).
- Always prefer `display_origin`/`display_destination` when non-null/
  non-empty, and fall back to `origin`/`destination` (today's behavior)
  otherwise. Never assume the short field is always present.

### Root cause

All Activity-fetching calls in this app funnel through a single mapper,
`mapActivity()`, which only reads `origin`/`destination` from the raw
backend response — it was never updated to read the two new fields, so
every screen that renders a trip's route only ever sees the long-form text.

**File:** `lib/api/client.ts`

```typescript
// lines 46-65 — current BackendActivity (raw snake_case shape from the API)
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
  kg_co2e?: number
  origin?: string
  destination?: string
}
```

```typescript
// lines 143-162 — current mapper. from/to are taken as-is from origin/destination.
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
    from: a.origin,
    to: a.destination,
  }
}
```

Every Activity-related API call goes through `mapActivity()` — confirmed call
sites in this same file:

- `GET /activities` (list) — line ~385: `raw.activities.map(mapActivity)`
- `GET /activities/:id` (detail) — lines 397-398
- `POST /activities` (create) — lines 402-406
- `PATCH /activities/:id` (update) — lines 415-419

Downstream, `Trip.from`/`Trip.to` (typed in `types/index.ts:76-96`, both
`string | undefined`) are rendered as-is in every consuming component:

- `components/trips/TripsTable.tsx:214-240` — the main Trips table.
- `components/dashboard/RecentTripsList.tsx:69-96` — the dashboard's Recent
  Trips widget.
- `app/(dashboard)/trips/page.tsx:134-138` — client-side search filtering
  (`t.from?.toLowerCase().includes(q) || t.to?.toLowerCase().includes(q)`).

**None of those three files need to change.** They all just render/filter
on whatever string ends up in `trip.from`/`trip.to`. The single, surgical
fix point is `mapActivity()` and its input type.

---

## What needs to happen

**Only one file needs to change:** `lib/api/client.ts`

### 1. Add the two new fields to `BackendActivity` (after `destination`, ~line 64)

```typescript
  origin?: string
  destination?: string
  display_origin?: string
  display_destination?: string
```

### 2. Prefer the display fields in `mapActivity()` (lines 159-160)

Replace:
```typescript
    from: a.origin,
    to: a.destination,
```
with:
```typescript
    from: a.display_origin || a.origin,
    to: a.display_destination || a.destination,
```

Use `||` rather than `??` here deliberately — an empty string (`""`) should
also fall through to the long-form address, not render as a blank route,
matching the existing fallback semantics (`?? '—'`) used in `TripsTable.tsx`
and `RecentTripsList.tsx` where these are eventually displayed.

That's the entire fix. Do **not** modify `TripsTable.tsx`,
`RecentTripsList.tsx`, `app/(dashboard)/trips/page.tsx`, or the `Trip`
interface in `types/index.ts` — they already work correctly off whatever
string `mapActivity()` produces.

Optional, non-blocking cleanup: the doc comments on `Trip.from`/`Trip.to` in
`types/index.ts:92-95` currently say "mapped from activity metadata when
present" — you could update the wording to mention the short-address
preference, but this has no functional effect and isn't required.

---

## Verification

1. `npm run build` (or your usual command) — confirm no type errors from the
   new optional fields.
2. Run the app against production (confirm `NEXT_PUBLIC_API_URL` points at
   it) with a user that has activities with non-null `display_origin`/
   `display_destination` (ask backend/Shantnu which test account/activity ID
   has these populated, since the cron backfill is gradual) — confirm:
   - The Trips table (`/trips`) shows the short address.
   - The dashboard's Recent Trips widget shows the short address.
   - Searching by the short address text on the Trips page still filters
     correctly (it will, automatically, since search reads `trip.from`/`to`
     which now resolves to the short string).
3. Confirm an activity with `display_origin`/`display_destination` still
   `null` (not yet backfilled, or no coordinates) still falls back to the
   long-form `origin`/`destination` exactly as it did before this change —
   no blank `—` where a real address used to show.

## Files referenced

- `lib/api/client.ts:46-65` — `BackendActivity`, add 2 fields here.
- `lib/api/client.ts:143-162` — `mapActivity()`, change the 2 lines here.
- `lib/api/client.ts` lines ~385, 397-398, 402-406, 415-419 — confirmed call sites that all flow through `mapActivity()` (read-only reference, no change needed).
- `types/index.ts:76-96` — `Trip` interface (read-only reference; optional doc-comment tweak only).
- `components/trips/TripsTable.tsx:214-240` — Trips table renderer (read-only reference, no change needed).
- `components/dashboard/RecentTripsList.tsx:69-96` — dashboard widget renderer (read-only reference, no change needed).
- `app/(dashboard)/trips/page.tsx:134-138` — search filtering (read-only reference, no change needed).

## Commit

Use a commit message consistent with this repo's convention, e.g.:
```
fix(activity): prefer server-resolved short address over full address
```
