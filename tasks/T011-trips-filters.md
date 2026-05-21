# T011 — Component: TripsFilters

**Branch:** `feat/T011-trips-filters`
**Status:** ✅ Done
**Depends on:** T003 merged to main

---

## Context files to read first
- `CLAUDE.md` — component rules, design tokens
- `types/index.ts` — TransportMode type

## Design reference
- `design/Atmos Frontend/trips.jsx` — `ModeChips`, `SourceToggle`, `SearchInput` components
- `design/Atmos Frontend/shared.jsx` — `Header` component date-range picker pattern

---

## What to build

The filter controls shown above the trips table: search input, mode chip filters, source toggle, and a stats strip.

### `components/trips/TripsFilters.tsx`

```tsx
interface TripsFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  mode: string            // 'all' | TransportMode
  onModeChange: (mode: string) => void
  source: 'all' | 'auto' | 'manual'
  onSourceChange: (source: 'all' | 'auto' | 'manual') => void
  tripCounts: Record<string, number>  // mode → count for chip badges
}
```

Renders a white card (`rounded-2xl shadow-card p-[18px_20px]`) with two rows:

**Row 1** (space-between):
- Left: `SearchInput`
- Right: "Source" label + `SourceToggle`

**Row 2**: `ModeChips` (wraps on mobile)

#### `SearchInput` (local subcomponent)
Match `trips.jsx` exactly:
- 280px wide, height 36px, white bg, border `#F0F2F5`, `border-radius: 9px`
- Search icon (14px `#6B7A8D`) at left, input text 13px `#1A2332`
- Placeholder: "Search by route or place…"
- × clear button appears when value is non-empty

#### `SourceToggle` (local subcomponent)
Match `trips.jsx`:
- Pill segmented control: All | Detected | Manual
- Container: `#F0F2F5` bg, 3px padding, `border-radius: 9px`
- Active tab: white bg, shadow `0 1px 2px rgba(26,35,50,0.08)`, `#1A2332` 600
- Inactive: transparent bg, `#6B7A8D` 500

#### `ModeChips` (local subcomponent)
Match `trips.jsx`:
- Items: All modes + 5 transport modes (car, train, bus, bike, walk)
- Each chip: `border-radius: 999px`, 12.5px, mode color icon + name + count
- Active chip: border `{modeColor}`, bg `{modeColor}14`, text `{modeColor}` 600
- Inactive: border `#F0F2F5`, white bg, `#1A2332` 500
- Count badge: 11px, mode color (active) or `#6B7A8D` (inactive)

### `components/trips/TripStatsStrip.tsx`

4 compact stat cards shown above the filters card (match `trips.jsx` `CompactStat`):

```tsx
interface TripStatsStripProps {
  totalTrips: number
  totalKm: number
  totalKg: number
  activeDays: number
  autoCount: number
  manualCount: number
  loading?: boolean
}
```

Card measurements (slightly shorter than dashboard StatCard):
- Height: 96px min, padding `18px 20px`, same card style
- Accents: `#4A90C4` (trips), `#3DAB82` (distance), `#F0956A` (CO₂), `#6B7A8D` (days)
- Sub-text: smaller gray text like "24 detected · 4 manual"

Loading state: 4 skeleton cards same height.

---

## Unit tests

**`components/trips/TripsFilters.test.tsx`**
- Renders search input
- Renders 6 mode chips (All + 5 modes)
- Renders source toggle with 3 options
- Clicking mode chip calls `onModeChange`
- Typing in search calls `onSearchChange`
- Source toggle calls `onSourceChange`
- Clear button in search resets value

**`components/trips/TripStatsStrip.test.tsx`**
- Renders 4 stat cards
- Shows loading skeletons when `loading={true}`
- Displays correct values

---

## Acceptance criteria

- [x] `pnpm build` passes
- [x] Search input with clear button works
- [x] 6 mode chips render with trip counts
- [x] Active mode chip highlighted with correct color
- [x] Source toggle: 3 options, active highlighted
- [x] 4 stats strip cards rendered
- [x] All unit tests pass

---

## Quality gates
- [x] `pnpm build` zero errors
- [x] `pnpm lint` zero warnings
- [x] `pnpm test` green
- [x] PR: `feat(T011): TripsFilters — mode chips, source toggle, search`
