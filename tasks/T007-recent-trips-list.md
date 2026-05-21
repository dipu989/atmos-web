# T007 — Component: RecentTripsList

**Branch:** `feat/T007-recent-trips-list`
**Status:** ✅ Done
**Depends on:** T003 merged to main

---

## Context files to read first
- `CLAUDE.md` — component rules, design tokens
- `../.context/api-spec.md` — GET /activities (trips list) endpoint with `page_size` param
- `types/index.ts` — Trip, TransportMode types

## Design reference
- `design/Atmos Frontend/app.jsx` — `RecentTrips` component (look for the trips table section toward the end of the file)
- `design/Atmos Frontend/data.jsx` — `RECENT_TRIPS` array — exact data shapes and display values

---

## What to build

A compact list showing the last 5 trips on the dashboard. Not a full table — more like a feed.

### `components/dashboard/RecentTripsList.tsx`

```tsx
export function RecentTripsList()
```

Fetches `getTrips({ page: 1, page_size: 5 })`, renders a list of trip rows.

**Card structure:**
- Card title: "Recent trips" (17px 600 `#1A2332`)
- "View all →" link at top-right → `/trips` (13px `#4A90C4`)
- List of up to 5 trip rows

**Trip row** (do NOT create a separate file — keep it as a local function inside RecentTripsList.tsx):
- Height: ~56px, border-bottom `1px solid #F0F2F5`, last row no border
- Layout: mode icon badge | route text | date | CO₂ value
- **Mode icon badge**: 32×32, `border-radius: 10px`, bg `{modeColor}1F` (12% opacity), icon 16px colored with `modeColor`
- **Route**: `{from} → {to}`, 13.5px 500 `#1A2332`, truncate with ellipsis if too long. Arrow: `→` icon 12px `#6B7A8D`
- **Date**: 12.5px `#6B7A8D` — e.g. "Today, 8:42 AM" or "Yesterday, 6:18 PM"
- **CO₂**: right-aligned, 13px 600:
  - `0.0 kg` → color `#3DAB82` (green, zero emission)
  - `> 2.0 kg` → color `#F0956A` (orange, high)
  - else → color `#1A2332`
  - Smaller "kg" unit label in `#6B7A8D`

**Transport mode colors** (fixed mapping):
```ts
const MODE_COLORS: Record<string, string> = {
  car:    '#F0956A',
  train:  '#4A90C4',
  bus:    '#7BA9D4',
  bike:   '#3DAB82',
  walk:   '#8AC9A8',
  flight: '#E05252',
}
```

**Transport mode icons** (lucide-react):
- car → `Car`, train → `Train`, bus → `Bus`, bike → `Bike`, walk → `Footprints`, flight → `Plane`

**Date formatting** with `date-fns`:
- Same day: "Today, HH:mm aa"
- Yesterday: "Yesterday, HH:mm aa"
- Older: "MMM d, HH:mm aa"

**Loading state:** 5 skeleton rows (gray shimmer rectangles, same height as real rows)
**Error state:** "Could not load recent trips" text centered with subtle icon
**Empty state:** "No trips yet" with a Route icon and "Start by adding your first trip" sub-text

---

## Unit tests

**`components/dashboard/RecentTripsList.test.tsx`**
- Shows 5 skeleton rows while loading
- Renders correct number of trip rows
- Zero-emission trip row CO₂ value is green
- High-emission (> 2 kg) trip row CO₂ is orange
- "View all" link points to /trips
- Empty state shown when trips array is empty

---

## Acceptance criteria

- [x] `pnpm build` passes
- [x] 5 rows rendered with mode icon badge, route, date, CO₂
- [x] CO₂ colors correct (green 0 kg, orange >2 kg, dark otherwise)
- [x] Date formatting: "Today", "Yesterday", or "MMM d" as appropriate
- [x] Loading skeleton 5 rows shown
- [x] Empty state shown when no trips
- [x] "View all →" link goes to /trips
- [x] All unit tests pass

---

## Quality gates
- [x] `pnpm build` zero errors
- [x] `pnpm lint` zero warnings
- [x] `pnpm test` green
- [x] PR: `feat(T007): RecentTripsList — last 5 trips feed on dashboard`
