# T010 — Component: TripsTable

**Branch:** `feat/T010-trips-table`
**Status:** ⬜ Todo
**Depends on:** T003 merged to main

---

## Context files to read first
- `CLAUDE.md` — component rules, design tokens
- `../.context/api-spec.md` — GET /activities endpoint (pagination, sort params)
- `types/index.ts` — Trip, TransportMode, PaginatedResponse types

## Design reference
- `design/Atmos Frontend/trips.jsx` — `TripRow`, `SortHeader`, `PageBtn` components + `COLS` grid template
- `design/Atmos Frontend/data.jsx` — `ALL_TRIPS` array for exact column data shapes

---

## What to build

The sortable trips table shown on the Trips page. Handles local client-side sorting over paginated server data.

### `components/trips/TripsTable.tsx`

```tsx
interface TripsTableProps {
  trips: Trip[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  loading: boolean
}
```

**Column grid** (match `trips.jsx` `COLS` exactly):
`"36px minmax(0, 1.6fr) 150px 90px 90px 90px 104px 28px"`
Columns: icon | route | date | distance | duration | CO₂ | source badge | chevron

**Header row** (sticky at top of table, `#FAFBFC` bg, bottom border):
- Each column has a `SortHeader` button (except icon and chevron)
- Columns: Route, Date, Distance, Duration, CO₂, Source
- Active sort column: `#1A2332` text, both arrows shown
- Inactive: `#6B7A8D` text, faded arrows
- Sort is **local** (client-side) over the current page — no server re-fetch on sort

**Result summary row** (above header, inside the card):
- Left: "{n} of {total} trips" (15px 600 `#1A2332`) + "{km} km · {kg} kg CO₂ in current filter" (12.5px `#6B7A8D`)
- Right: "Sorted by {column} ({direction})" (12px `#6B7A8D`)

**Trip row** (match `trips.jsx` `TripRow`):
- Grid template matches COLS
- Mode icon badge: 30×30, `border-radius: 9px`, bg `{modeColor}1F`, icon 16px
- Route: `{from} → {to}` with arrow icon, 13.5px 500 truncated
- Date: 12.5px `#6B7A8D`
- Distance: right-aligned, 13px `#1A2332`, "km" unit in gray
- Duration: right-aligned, 12.5px `#6B7A8D`, "min" label
- CO₂: right-aligned, 13px 600 — green if 0, orange if >2, dark otherwise + "kg" unit
- Source badge: pill — "Detected" (blue 10% bg, `#4A90C4` text) or "Manual" (`#F0F2F5` bg, `#6B7A8D` text)
- Row hover: bg `#F5F7FA`
- Chevron: `#C5CCD6`, 16px

**Loading state:** 12 skeleton rows (same grid, gray shimmer blocks)

**Empty state** (when trips is empty and not loading):
- Centered, Route icon 40px `#C5CCD6`
- "No trips match these filters" (14px 500 `#1A2332`)
- "Try widening the date range or clearing the search." (12.5px `#6B7A8D`)

**Pagination** (bottom of card, `#FAFBFC` bg):
- Left: "Showing {start}–{end} of {total}" (12.5px `#6B7A8D`)
- Right: prev button + numbered page buttons + next button
- Active page: bg `rgba(74,144,196,0.10)`, border `rgba(74,144,196,0.25)`, `#4A90C4` text
- Inactive: white bg, `#F0F2F5` border
- Disabled: 50% opacity

---

## Unit tests

**`components/trips/TripsTable.test.tsx`**
- Renders correct number of rows
- Loading state shows 12 skeletons
- Empty state shown when trips is empty array
- Clicking sort header toggles asc/desc
- Pagination buttons rendered correctly
- Prev/Next disabled at boundaries

---

## Acceptance criteria

- [ ] `pnpm build` passes
- [ ] Table renders with all 7 column headers
- [ ] Rows show mode icon, route, date, distance, duration, CO₂, source
- [ ] Clicking column header sorts rows (local sort on current page data)
- [ ] Pagination shows correct page numbers
- [ ] Prev/Next disabled appropriately at boundaries
- [ ] 12 skeleton rows shown during loading
- [ ] Empty state shown when no trips
- [ ] All unit tests pass

---

## Quality gates
- [ ] `pnpm build` zero errors
- [ ] `pnpm lint` zero warnings
- [ ] `pnpm test` green
- [ ] PR: `feat(T010): TripsTable — sortable table with pagination`
