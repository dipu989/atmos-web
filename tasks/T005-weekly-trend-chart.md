# T005 — Component: WeeklyTrendChart

**Branch:** `feat/T005-weekly-trend-chart`
**Status:** ✅ Done
**Depends on:** T003 merged to main

---

## Context files to read first
- `CLAUDE.md` — component rules, design tokens, chart folder rule
- `../.context/api-spec.md` — GET /analytics/daily endpoint
- `types/index.ts` — DailySummary type

## Design reference
- `design/Atmos Frontend/charts.jsx` — `WeeklyLineChart` function (full SVG implementation)
- `design/Atmos Frontend/data.jsx` — `WEEKLY_DATA` and `DAILY_GOAL` mock data shapes

---

## What to build

A line chart showing CO₂ for the last 7 days with a dashed goal line. Wrapped in a Card.

**IMPORTANT:** All chart components live in `components/charts/`. Never import Recharts directly from pages or dashboard components — only from `components/charts/`.

### `components/charts/WeeklyTrendChart.tsx`

Use **Recharts** (not raw SVG) to implement this chart. Recreate the visual from `charts.jsx` using Recharts components, matching the design as closely as possible.

```tsx
interface WeeklyTrendChartProps {
  data: { day: string; date: string; co2_kg: number }[]
  goal: number  // dashed horizontal reference line
}
```

**Chart specs** (match `charts.jsx` design):
- Chart area: full width, height 280px
- Line: `#4A90C4`, strokeWidth 2, smooth (Recharts `type="monotone"`)
- Area fill: gradient `#4A90C4` 18% opacity at top → 2% at bottom
- Goal line: dashed `#3DAB82 60%` opacity, `strokeDasharray="6 4"`
- Goal label: "Goal" text at right end of the reference line in `#3DAB82`
- X-axis: day labels (Mon, Tue…), 12px `#6B7A8D`, no axis line, tick line hidden
- Y-axis: 0, 2, 4, 6, 8… kg, 12px `#6B7A8D`, no axis line, right-aligned labels
- Grid: horizontal lines only, `#F0F2F5` stroke, no vertical grid lines
- Tooltip: custom — white card, rounded-xl, shadow, shows day + date + `X.X kg CO₂`
- Active dot: 6px radius, white fill, `#4A90C4` stroke

**Recharts components to use:**
```tsx
<ResponsiveContainer width="100%" height={280}>
  <AreaChart data={data} margin={{ top: 28, right: 28, bottom: 0, left: 0 }}>
    <defs>
      <linearGradient id="areaFill" ...>
    </defs>
    <CartesianGrid strokeDasharray="..." vertical={false} stroke="#F0F2F5" />
    <XAxis dataKey="day" ... />
    <YAxis ... />
    <Tooltip content={<CustomTooltip />} />
    <ReferenceLine y={goal} stroke="#3DAB82" strokeDasharray="6 4" strokeOpacity={0.6} label={...} />
    <Area type="monotone" dataKey="co2_kg" stroke="#4A90C4" fill="url(#areaFill)" ... />
  </AreaChart>
</ResponsiveContainer>
```

### `components/dashboard/WeeklyTrendCard.tsx`

Wraps the chart in a Card with header:

```tsx
// Fetches data, renders card
export function WeeklyTrendCard()
```

- Card title: "Weekly CO₂ trend" (17px 600 `#1A2332`)
- Card subtitle: date range like "May 12 – May 18" (13px `#6B7A8D`)
- Calls `useDailySummaries(7)` — maps response to `{ day, date, co2_kg }` format
- Maps DailySummary to chart format: `day = date-fns format(date, 'EEE')`, `date = format(date, 'MMM d')`
- Calls `usePreferences()` to get `daily_goal_kg`
- Loading: skeleton rectangle 280px tall inside card
- Error: "Could not load chart data" message centered in the card area

---

## Unit tests

**`components/charts/WeeklyTrendChart.test.tsx`**
- Renders without crashing with valid data
- Renders correct number of data points
- Goal reference line present (look for the `ReferenceLine` in output or a labeled element)
- Empty data: renders empty chart without crash

**`components/dashboard/WeeklyTrendCard.test.tsx`**
- Shows skeleton while loading
- Renders chart when data available
- Shows error state on failure

---

## Acceptance criteria

- [x] `pnpm build` passes
- [x] Chart renders with 7 data points
- [x] Dashed green goal line visible
- [x] X-axis shows Mon–Sun labels
- [x] Hover tooltip shows day + CO₂ value
- [x] Loading skeleton shown while fetching
- [x] No Recharts imports outside `components/charts/`
- [x] All unit tests pass

---

## Quality gates
- [x] `pnpm build` zero errors
- [x] `pnpm lint` zero warnings
- [x] `pnpm test` green
- [x] PR: `feat(T005): WeeklyTrendChart — 7-day CO₂ line chart with goal line`
