# T009 — Dashboard Page Assembly

**Branch:** `feat/T009-dashboard-page`
**Status:** ⬜ Todo
**Depends on:** T004, T005, T006, T007, T008 all merged to main

---

## Context files to read first
- `CLAUDE.md` — architecture, page structure
- `design/Atmos Frontend/app.jsx` — full page layout with all components
- `design/Atmos Frontend/Dashboard.html` — open in browser to see final visual target

---

## What to build

Wire the 5 dashboard components into `app/(dashboard)/dashboard/page.tsx`. This task is primarily assembly — the heavy lifting was done in T004–T008.

### `app/(dashboard)/dashboard/page.tsx`

Replace the stub from T002.

```tsx
'use client'
import { PageShell } from '@/components/layout/PageShell'
import { TodayImpactCards } from '@/components/dashboard/TodayImpactCards'
import { WeeklyTrendCard } from '@/components/dashboard/WeeklyTrendCard'
import { TransportBreakdownCard } from '@/components/dashboard/TransportBreakdownCard'
import { RecentTripsList } from '@/components/dashboard/RecentTripsList'
import { InsightsFeedMini } from '@/components/dashboard/InsightsFeedMini'
```

**Page layout** (match `Dashboard.html` / `app.jsx` exactly):

```
<PageShell title="Dashboard" subtitle="Welcome back, {userName}">
  <TodayImpactCards />                          {/* full-width row, 4 cards */}

  <div className="grid grid-cols-[1fr_360px] gap-5">
    <WeeklyTrendCard />                          {/* left: 2/3 width */}
    <TransportBreakdownCard />                   {/* right: fixed 360px */}
  </div>

  <div className="grid grid-cols-[1fr_360px] gap-5">
    <RecentTripsList />                          {/* left: takes remaining width */}
    <InsightsFeedMini />                         {/* right: 360px */}
  </div>
</PageShell>
```

**Subtitle**: pull user's name from `getStoredUser()` — "Welcome back, Shantnu" (first name only)

**Range picker**: pass to `PageShell` — Dashboard uses "This month" as default. The range value is local state but not yet wired to the API calls (that's a future enhancement — just track the state).

**Responsive behavior** (below `lg` 1024px):
- The 2-column grids collapse to single column
- Use `grid-cols-1 lg:grid-cols-[1fr_360px]`

### Also: update `app/page.tsx`

Ensure it redirects to `/dashboard`:
```tsx
import { redirect } from 'next/navigation'
export default function RootPage() { redirect('/dashboard') }
```

---

## Unit tests

**`app/(dashboard)/dashboard/page.test.tsx`**
- Renders all 5 component sections
- User name appears in subtitle
- No console errors on render (mock all hooks to return loading state)

---

## Acceptance criteria

- [ ] `pnpm build` passes
- [ ] Dashboard page loads at `localhost:3000/dashboard` (requires backend + auth)
- [ ] Visual matches `Dashboard.html` reference opened in browser side-by-side
- [ ] 4 stat cards in top row
- [ ] Weekly chart + donut in second row (2-column)
- [ ] Recent trips + insights in third row (2-column)
- [ ] User name in subtitle
- [ ] Responsive: collapses to 1 column below 1024px
- [ ] All unit tests pass

---

## Quality gates
- [ ] `pnpm build` zero errors
- [ ] `pnpm lint` zero warnings
- [ ] `pnpm test` green
- [ ] Visual QA: compare against `design/Atmos Frontend/Dashboard.html`
- [ ] PR: `feat(T009): dashboard page — wire all components`
