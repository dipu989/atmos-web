# T006 — Component: TransportBreakdownChart

**Branch:** `feat/T006-transport-breakdown`
**Status:** ✅ Done
**Depends on:** T003 merged to main

---

## Context files to read first
- `CLAUDE.md` — component rules, chart folder rule
- `../.context/api-spec.md` — GET /analytics/transport-breakdown endpoint
- `types/index.ts` — TransportMode type

## Design reference
- `design/Atmos Frontend/charts.jsx` — `DonutChart` component (look for the donut/pie section)
- `design/Atmos Frontend/shared.jsx` — `Legend` component (colored dot + label pattern)
- `design/Atmos Frontend/data.jsx` — `TRANSPORT_MODES` data shape for reference

---

## What to build

A donut chart showing CO₂ breakdown by transport mode, with a custom center label and a legend.

### `components/charts/TransportBreakdownChart.tsx`

```tsx
interface TransportMode {
  id: string
  name: string
  co2_kg: number
  color: string
}

interface TransportBreakdownChartProps {
  data: TransportMode[]
}
```

Use Recharts `PieChart` + `Pie` with `innerRadius`:

**Chart specs:**
- Container: 200×200px centered
- Outer radius: 90, inner radius: 58 (donut hole)
- No padding angle between slices
- Center label (two lines, absolutely positioned over the donut center):
  - Line 1: total CO₂ kg, 22px 600 `#1A2332`
  - Line 2: "kg CO₂" label, 12px `#6B7A8D`
- Active slice: grows slightly (outerRadius + 4) on hover
- Tooltip: custom — white card, shows mode name + kg + % of total

**Color mapping** (fixed, do not derive from data):
```ts
const TRANSPORT_COLORS: Record<string, string> = {
  car:    '#F0956A',
  train:  '#4A90C4',
  bus:    '#7BA9D4',
  bike:   '#3DAB82',
  walk:   '#8AC9A8',
  flight: '#E05252',
}
```

### `components/dashboard/TransportBreakdownCard.tsx`

Wraps chart + legend in a Card:
- Card title: "Transport breakdown" (17px 600 `#1A2332`)
- Card subtitle: "This month" (13px `#6B7A8D`)
- Layout: chart on left, legend stacked on right
- **Legend rows** (match `shared.jsx` Legend):
  - Each row: colored 10px circle + mode name (13px 500 `#1A2332`) + kg value right-aligned (13px 600) + km in gray (12px)
  - Only show modes with `co2_kg > 0`
  - Sorted by `co2_kg` descending
- Calls `useTransportBreakdown('month')`
- Loading: skeleton shapes for chart and legend rows
- Empty state: "No trips recorded this month" centered with Route icon

---

## Unit tests

**`components/charts/TransportBreakdownChart.test.tsx`**
- Renders without crash with valid data
- Shows correct total CO₂ in center label
- Renders correct number of pie slices (one per mode with co2_kg > 0)

**`components/dashboard/TransportBreakdownCard.test.tsx`**
- Shows loading skeleton while data is loading
- Renders legend rows matching data
- Shows empty state when data is empty array

---

## Acceptance criteria

- [x] `pnpm build` passes
- [x] Donut chart renders with center total
- [x] Legend shows modes sorted by CO₂ descending
- [x] Modes with 0 kg not shown in legend
- [x] Hover on slice highlights it
- [x] Loading state shown correctly
- [x] All unit tests pass

---

## Quality gates
- [x] `pnpm build` zero errors
- [x] `pnpm lint` zero warnings
- [x] `pnpm test` green
- [x] PR: `feat(T006): TransportBreakdownChart — donut chart with legend`
