# T013 — Component: MonthlyTrendChart

**Branch:** `feat/T013-monthly-trend-chart`
**Status:** ⬜ Todo
**Depends on:** T003 merged to main

---

## Context files to read first
- `CLAUDE.md` — chart folder rule, component rules
- `../.context/api-spec.md` — GET /analytics/monthly endpoint
- `types/index.ts` — MonthlySummary type

## Design reference
- `design/Atmos Frontend/charts.jsx` — look for `DailyBarChart` and `MoMBars` — these are the bar chart implementations
- `design/Atmos Frontend/analytics-charts.jsx` — additional chart variants specific to Analytics page
- `design/Atmos Frontend/analytics-data.jsx` — `DAILY_30`, `MOM_WEEKS` data shapes

---

## What to build

Two chart components for the Analytics page: a 30-day daily bar chart and a month-over-month comparison chart.

### `components/charts/DailyBarChart.tsx`

Bar chart showing last 30 days of CO₂. Match `DailyBarChart` in `charts.jsx`.

```tsx
interface DailyBarChartProps {
  data: { date: string; co2_kg: number; label: string }[]  // label = "May 1"
  goal: number
}
```

Recharts `BarChart`:
- Bar color: `#4A90C4`, `borderRadius: [4, 4, 0, 0]` (top rounded)
- Bar color overrides: if `co2_kg > goal`: `#F0956A` (over goal bar)
- X-axis: date labels, show every 5th label only (avoid crowding), 11px `#6B7A8D`
- Y-axis: kg values, 11px `#6B7A8D`
- Grid: horizontal only, `#F0F2F5`
- Reference line at `goal`: dashed `#3DAB82`, label "Goal" in green at right
- Tooltip: custom — white card, date + CO₂ value + "over goal" warning if applicable
- Height: 240px

### `components/charts/MonthOverMonthChart.tsx`

Side-by-side bar chart comparing current month vs previous month by week. Match `MoMBars` in `charts.jsx`.

```tsx
interface MonthOverMonthChartProps {
  data: { week: string; current: number; previous: number }[]
}
```

Recharts `BarChart` with two `Bar` components:
- Current month bar: `#4A90C4`
- Previous month bar: `#C5CCD6` (gray)
- Grouped bars, `barGap: 4`
- Legend: "This month" (blue dot) + "Last month" (gray dot)
- Height: 200px

### `components/dashboard/AnalyticsSummaryCards.tsx`

4 KPI cards for the Analytics page (match `analytics.jsx` `KPI` component):
- Same visual as `StatCard` from T004 (border-top accent, icon, big value)
- Slightly larger value text (30px, matching dashboard cards)
- Data: total trips, total distance, total CO₂, avg per trip

```tsx
export function AnalyticsSummaryCards()
```
- Calls `useWeeklySummaries(4)` and `useMonthlySummaries(3)` for data
- Loading: 4 skeletons
- Error: fallback state

---

## Unit tests

**`components/charts/DailyBarChart.test.tsx`**
- Renders without crash
- Correct number of bars
- Renders goal reference line
- Over-goal bars not crashing

**`components/charts/MonthOverMonthChart.test.tsx`**
- Renders without crash
- Two bar series present
- Legend rendered

**`components/dashboard/AnalyticsSummaryCards.test.tsx`**
- 4 cards rendered
- Loading skeletons shown
- Error state handled

---

## Acceptance criteria

- [ ] `pnpm build` passes
- [ ] 30-day bar chart renders with correct bar count
- [ ] Over-goal bars colored orange
- [ ] Goal reference line shown
- [ ] Month-over-month chart shows grouped bars
- [ ] Legend with current/previous month labels
- [ ] 4 analytics KPI cards rendered
- [ ] All tests pass

---

## Quality gates
- [ ] `pnpm build` zero errors
- [ ] `pnpm lint` zero warnings
- [ ] `pnpm test` green
- [ ] PR: `feat(T013): MonthlyTrendChart — daily bar chart + month-over-month`
