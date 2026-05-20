# T012 — Trips Page Assembly

**Branch:** `feat/T012-trips-page`
**Status:** ⬜ Todo
**Depends on:** T010, T011 both merged to main

---

## Context files to read first
- `CLAUDE.md` — architecture, API client rules
- `../.context/api-spec.md` — GET /activities with `page`, `page_size`, `mode`, `source` query params
- `types/index.ts` — Trip, PaginatedResponse types

## Design reference
- `design/Atmos Frontend/trips.jsx` — `TripsPage` component (full state management)
- `design/Atmos Frontend/Trips.html` — open in browser to see final visual target

---

## What to build

Wire `TripStatsStrip`, `TripsFilters`, and `TripsTable` into `app/(dashboard)/trips/page.tsx`.

### `app/(dashboard)/trips/page.tsx`

```tsx
'use client'
```

**State managed at this level:**
```ts
const [search, setSearch] = useState('')
const [mode, setMode] = useState('all')
const [source, setSource] = useState<'all' | 'auto' | 'manual'>('all')
const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'date', dir: 'desc' })
const [page, setPage] = useState(1)
```

**API call:**
```ts
const { data, isLoading } = useTrips({
  page,
  page_size: 12,
  mode: mode === 'all' ? undefined : mode,
  source: source === 'all' ? undefined : source,
})
```

**Client-side filtering** (search is client-side, mode/source sent to API):
- Filter `data.data` by search: match `trip.from_label` or `trip.to_label` containing the search string
- Reset page to 1 whenever search/mode/source changes: `useEffect(() => setPage(1), [search, mode, source])`

**Client-side sort** on the filtered results (same logic as `trips.jsx`):
- `date` → sort by `trip.started_at`
- `route` → sort by `{from_label}{to_label}`
- `km` → sort by `trip.distance_km`
- `duration` → sort by `trip.duration_min`
- `kg` → sort by `trip.co2_kg`

**Trip counts for mode chips** (derive from full unfiltered dataset):
- Use a separate `useTrips({ page_size: 1000 })` call OR derive from the current page (acceptable for now — note in code that this is approximate)

**Page layout:**
```tsx
<PageShell title="Trips" subtitle="Browse and filter every trip Atmos has logged for you."
           rightExtra={<ExportButton />}>
  <TripStatsStrip ... />
  <TripsFilters ... />
  <TripsTable ... />
</PageShell>
```

**Export button** (stub — no real functionality):
- White button, border, "Export CSV" text, arrow-down icon
- `onClick`: show a toast/alert "CSV export coming soon"

**URL param pre-filtering** (match `trips.jsx` behavior):
- On mount, read `?mode=car` or `?q=search` from URL and apply to initial state
- Allows deep-linking from other pages

### Also create: `app/(dashboard)/trips/page.test.tsx`
- Renders stats strip, filters, and table
- URL params applied on mount
- Page resets to 1 when filters change

---

## Acceptance criteria

- [ ] `pnpm build` passes
- [ ] Trips page loads at `/trips`
- [ ] Search filters rows client-side
- [ ] Mode chip selection updates table
- [ ] Source toggle updates table
- [ ] Sorting columns works
- [ ] Pagination navigates pages
- [ ] Stats strip shows correct totals
- [ ] URL params `?mode=` and `?q=` applied on page load
- [ ] Export button shows "coming soon" message
- [ ] Visual matches `Trips.html` reference

---

## Quality gates
- [ ] `pnpm build` zero errors
- [ ] `pnpm lint` zero warnings
- [ ] `pnpm test` green
- [ ] Visual QA: compare against `design/Atmos Frontend/Trips.html`
- [ ] PR: `feat(T012): trips page — wire filters, table, pagination`
