# T004 — Component: TodayImpactCard (4 Stat Cards)

**Branch:** `feat/T004-today-impact-card`
**Status:** ✅ Done
**Depends on:** T003 merged to main

---

## Context files to read first
- `CLAUDE.md` — component rules, design tokens
- `../.context/api-spec.md` — GET /analytics/daily, GET /analytics/stats endpoints
- `types/index.ts` — DailySummary, Preferences types

## Design reference
- `design/Atmos Frontend/app.jsx` — `StatCard` component (lines 1–65) and `StatCards` assembly
- `design/Atmos Frontend/data.jsx` — `STATS` object for exact values and prop shapes

---

## What to build

This task builds the 4-card stat strip shown at the top of the Dashboard page.

### `components/dashboard/StatCard.tsx`

Match the `StatCard` component in `app.jsx` exactly:

```tsx
interface StatCardProps {
  accent: string       // hex color for top border and icon bg
  label: string        // uppercase label, 12px 500 #6B7A8D
  value: string | number
  unit?: string        // smaller secondary unit text
  sub?: React.ReactNode  // bottom slot — trend badge OR progress bar OR plain text
  icon?: string        // lucide icon name
}
```

Exact styles (Tailwind):
- Container: `bg-white rounded-2xl border-t-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-[20px_22px] flex flex-col gap-1.5 min-h-[128px]`
- Top row: flex justify-between items-center
- Icon badge: 28×28, `rounded-[8px]`, bg is `accent + '1A'` (10% opacity), icon 15px
- Label: `text-[12px] font-medium text-[#6B7A8D] tracking-[0.4px] uppercase`
- Value: `text-[30px] font-semibold text-[#1A2332] tracking-[-0.6px] leading-none`
- Unit: `text-[13px] font-medium text-[#6B7A8D]`
- Sub slot: `mt-auto pt-1`

**Icon name → lucide-react mapping** (add to a `components/ui/Icon.tsx` helper):
- `leaf` → `Leaf`, `target` → `Target`, `flame` → `Flame`, `calendar` → `Calendar`

### `components/dashboard/TodayImpactCards.tsx`

Renders the 4-card grid. Fetches real data — do not use mock data.

**API calls:**
- `useWeeklySummaries(1)` to get today's CO₂ (use the most recent daily entry, or a dedicated daily endpoint if available — check `api-spec.md`)
- `usePreferences()` to get `daily_goal_kg`
- Derive: trend vs last week, streak, days tracked (use whatever analytics endpoints are available)

**4 cards to render:**
1. **CO₂ this month** — accent `#4A90C4`, icon `leaf`
   - Value: `monthlyCO2.toFixed(1)`, unit `"kg"`
   - Sub: trend badge — arrow-down (green `#3DAB82`) if negative, arrow-up (orange `#F0956A`) if positive, `"% vs last month"` in gray
2. **Daily goal** — accent `#3DAB82`, icon `target`
   - Value: `todayKg.toFixed(1)`, unit: `"/ {goalKg.toFixed(1)} kg"`
   - Sub: progress bar (height 6px, rounded, green if under goal, orange if over) + `"{remaining} kg under today"`
3. **Current streak** — accent `#F0956A`, icon `flame`
   - Value: `streak`, unit `"days"`
   - Sub: `"Longest: {longest} days"` in gray
4. **Days tracked** — accent `#6B7A8D`, icon `calendar`
   - Value: `daysTracked`, unit `"total"`
   - Sub: `"Since {formattedDate}"` using `date-fns format`

**Loading state:** 4 skeleton cards (same size, gray shimmer bg, no content)
**Error state:** 4 cards with `—` value and "Data unavailable" sub text in gray

### `components/ui/Icon.tsx`

Central icon mapping component to avoid scattering lucide imports:
```tsx
interface IconProps {
  name: string
  size?: number
  color?: string
  strokeWidth?: number
}
```
Map known names to lucide icons. Unknown names: render null (no crash).

---

## Unit tests

**`components/dashboard/StatCard.test.tsx`**
- Renders label, value, unit
- Renders icon badge when `icon` prop provided
- Renders sub slot content
- Top border color matches accent prop

**`components/dashboard/TodayImpactCards.test.tsx`**
- Shows 4 skeleton cards while loading
- Shows 4 cards with data when loaded
- Shows error fallback when query fails
- Progress bar width proportional to todayKg/goalKg

---

## Acceptance criteria

- [x] `pnpm build` passes
- [x] 4 cards render in a `grid-cols-4 gap-4` grid
- [x] Colored top border matches accent for each card
- [x] Card 2 shows correct progress bar (green or orange based on goal)
- [x] Loading skeleton shown while API call in progress
- [x] Error state shown when API fails
- [x] No hardcoded values — all data from API hooks
- [x] All unit tests pass

---

## Quality gates
- [x] `pnpm build` zero errors
- [x] `pnpm lint` zero warnings
- [x] `pnpm test` green
- [x] PR: `feat(T004): TodayImpactCards — 4 stat cards with live data`
