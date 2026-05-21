# T015 — Analytics Page Assembly

**Branch:** `feat/T015-analytics-page`
**Status:** ✅ Done
**Depends on:** T013, T014 both merged to main

---

## Context files to read first
- `CLAUDE.md` — architecture
- `../.context/api-spec.md` — all analytics endpoints
- `design/Atmos Frontend/analytics.jsx` — full `AnalyticsPage` component with period switcher

## Design reference
- `design/Atmos Frontend/Analytics.html` — open in browser to see final visual target
- `design/Atmos Frontend/analytics.jsx` — full page with all sections

---

## What to build

### `app/(dashboard)/analytics/page.tsx`

```tsx
'use client'
```

**State:**
```ts
const [period, setPeriod] = useState<'30d' | '3m' | '6m' | '1y'>('30d')
```

**Period switcher** (pass as `rightExtra` to PageShell):
- Segmented control: "30 days" | "3 months" | "6 months" | "1 year"
- Match the Header date-range picker style from T003 — pill group, active tab white bg
- Changing period re-fetches analytics data

**Page layout** (match `Analytics.html` reference):
```
<PageShell title="Analytics" subtitle="Understand your travel patterns over time."
           rightExtra={<PeriodSwitcher />}>

  <AnalyticsSummaryCards period={period} />     {/* 4 KPI cards */}

  <div className="grid grid-cols-[1fr_auto] gap-5">
    <Card title="Daily CO₂" subtitle="Last 30 days">
      <DailyBarChart ... />
    </Card>
    <Card title="Month over month" subtitle="By week">
      <MonthOverMonthChart ... />
    </Card>
  </div>

  <Card title="CO₂ by mode over time" subtitle="Last 4 weeks">
    <ModeStackedAreaChart ... />
  </Card>

  <div className="grid grid-cols-[1fr_300px] gap-5">
    <Card title="Top recurring routes" subtitle="Most-repeated this month">
      <TopRoutesTable ... />
    </Card>
    <Card title="By day of week" subtitle="Average CO₂">
      <WeekdayAverageChart ... />
    </Card>
  </div>
</PageShell>
```

**Card component** (`components/ui/Card.tsx` — create if not already exists):
```tsx
interface CardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}
```
- `rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5`
- Title: 17px 600 `#1A2332`
- Subtitle: 13px `#6B7A8D` margin-top 2px

**Responsive** (below `lg`):
- 2-column grids collapse to 1 column
- `grid-cols-1 lg:grid-cols-[1fr_auto]` etc.

---

## Unit tests

**`app/(dashboard)/analytics/page.test.tsx`**
- Renders all 4 sections
- Period switcher renders with 4 options
- Changing period updates state

---

## Acceptance criteria

- [x] `pnpm build` passes
- [x] Analytics page loads at `/analytics`
- [x] Period switcher present with 4 options
- [x] 4 KPI cards rendered
- [x] Daily bar chart rendered
- [x] Month-over-month chart rendered
- [x] Stacked area chart rendered
- [x] Top routes table rendered
- [x] Weekday chart rendered
- [x] Visual matches `Analytics.html` reference
- [x] Responsive layout below 1024px

---

## Quality gates
- [x] `pnpm build` zero errors
- [x] `pnpm lint` zero warnings
- [x] `pnpm test` green
- [x] Visual QA: compare against `design/Atmos Frontend/Analytics.html`
- [x] PR: `feat(T015): analytics page — wire all charts with period switcher`
