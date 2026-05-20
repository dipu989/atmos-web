# T014 — Component: ModeBreakdownOverTime

**Branch:** `feat/T014-mode-breakdown-chart`
**Status:** ⬜ Todo
**Depends on:** T003 merged to main

---

## Context files to read first
- `CLAUDE.md` — chart folder rule, design tokens
- `../.context/api-spec.md` — GET /analytics/transport-breakdown with `period` param
- `types/index.ts` — TransportMode type

## Design reference
- `design/Atmos Frontend/charts.jsx` — `ModeStackedArea` and `WeekdayBars` components
- `design/Atmos Frontend/analytics-data.jsx` — `MODE_WEEKS`, `WEEKDAY_AVG`, `TOP_ROUTES` data shapes
- `design/Atmos Frontend/analytics.jsx` — `TopRoutes` component

---

## What to build

### `components/charts/ModeStackedAreaChart.tsx`

Stacked area chart showing CO₂ by transport mode over 4 weeks. Match `ModeStackedArea` in `charts.jsx`.

```tsx
interface ModeWeekData {
  week: string   // "Week 1", "Week 2", etc.
  car: number
  train: number
  bus: number
  bike: number
  walk: number
}

interface ModeStackedAreaChartProps {
  data: ModeWeekData[]
}
```

Recharts `AreaChart` with `stackOffset="none"`:
- One `Area` per mode, stacked
- Mode colors: car `#F0956A`, train `#4A90C4`, bus `#7BA9D4`, bike `#3DAB82`, walk `#8AC9A8`
- Each area: 70% fill opacity, `type="monotone"`, no dot on line
- Legend below chart with mode colors
- Height: 220px
- Tooltip: custom — shows week + breakdown per mode

### `components/charts/WeekdayAverageChart.tsx`

Horizontal bar chart showing average CO₂ by day of week. Match `WeekdayBars` in `charts.jsx`.

```tsx
interface WeekdayAverageChartProps {
  data: { day: string; avg_kg: number }[]  // Mon–Sun
}
```

Recharts `BarChart` with `layout="vertical"`:
- Y-axis: day names (Mon–Sun)
- X-axis: kg values
- Bar color: `#4A90C4`
- Highest bar: `#F0956A` (find max value and color it differently)
- Height: 260px

### `components/analytics/TopRoutesTable.tsx`

Table showing top 5 recurring routes. Match `analytics.jsx` `TopRoutes` component.

```tsx
interface TopRoute {
  mode: TransportMode
  from: string
  to: string
  count: number
  total_km: number
  total_kg: number
}

interface TopRoutesTableProps {
  routes: TopRoute[]
}
```

Layout: grid `"36px minmax(0, 1fr) 60px 80px 90px"`
Columns: icon | route + bar | trips | km | CO₂
- Route bar: thin horizontal progress bar below the route text, width proportional to max km
- Row border-bottom `#F0F2F5`
- Loading: 5 skeleton rows

---

## Unit tests

**`components/charts/ModeStackedAreaChart.test.tsx`**
- Renders without crash
- Correct number of area series (one per mode)

**`components/charts/WeekdayAverageChart.test.tsx`**
- Renders 7 bars (Mon–Sun)
- Highest bar distinguishable

**`components/analytics/TopRoutesTable.test.tsx`**
- Renders correct number of rows
- Loading state shown
- Empty state shown when no routes

---

## Acceptance criteria

- [ ] `pnpm build` passes
- [ ] Stacked area chart with 5 mode colors
- [ ] Weekday chart with 7 horizontal bars
- [ ] Highest day bar is orange
- [ ] Top routes table with progress bars
- [ ] All tests pass

---

## Quality gates
- [ ] `pnpm build` zero errors
- [ ] `pnpm lint` zero warnings
- [ ] `pnpm test` green
- [ ] PR: `feat(T014): ModeBreakdownOverTime — stacked area + weekday avg + top routes`
