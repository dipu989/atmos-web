# atmos-web — 1-Week Roadmap

**Goal:** Fully functional web dashboard connected to atmos-core backend.
**Definition of Done:** pnpm build passes + visual QA in browser + merged to main.

---

## Parallel Execution Rules

Tasks in the same "parallel batch" can run simultaneously with `make agent`.
Tasks marked with ← DEPENDS ON must wait for their dependency to be merged first.

```
SEQUENTIAL (foundation — must run in order)
  T001 → T002 → T003

PARALLEL BATCH A (components — no page.tsx conflicts)
  T004, T005, T006, T007, T008 (all simultaneously)

SEQUENTIAL
  T009 ← DEPENDS ON T004, T005, T006, T007, T008

PARALLEL BATCH B
  T010, T011 (simultaneously)

SEQUENTIAL
  T012 ← DEPENDS ON T010, T011

PARALLEL BATCH C
  T013, T014 (simultaneously)

SEQUENTIAL
  T015 ← DEPENDS ON T013, T014

PARALLEL BATCH D
  T016, T017, T018 (simultaneously)

SEQUENTIAL FINISH
  T019, T020, T021 (in order)
```

---

## Day 1 — Foundation

| Task | Description | Branch | Status |
|------|-------------|--------|--------|
| T001 | Rebuild API client — correct routes, activity→trip mapping, auth headers | feat/T001-rebuild-api-client | ✅ Done |
| T002 | Auth pages — Login, Signup, protected route guard, JWT storage | feat/T002-auth-pages | ✅ Done |
| T003 | App layout shell — Sidebar, Header, collapsible mobile nav | feat/T003-app-layout | ✅ Done |

## Day 2 — Dashboard Components (Run in Parallel)

| Task | Description | Branch | Status |
|------|-------------|--------|--------|
| T004 | Component: TodayImpactCard — CO₂ total, goal ring, trend % | feat/T004-today-impact-card | ✅ Done |
| T005 | Component: WeeklyTrendChart — Recharts line chart, 7 days | feat/T005-weekly-trend-chart | ✅ Done |
| T006 | Component: TransportBreakdownChart — donut chart by mode | feat/T006-transport-breakdown | ✅ Done |
| T007 | Component: RecentTripsList — last 5 trips, mode icon, distance | feat/T007-recent-trips-list | ✅ Done |
| T008 | Component: InsightsFeedMini — 3 insight cards preview | feat/T008-insights-feed-mini | ✅ Done |

## Day 3 — Dashboard Assembly + Trips Start

| Task | Description | Branch | Status |
|------|-------------|--------|--------|
| T009 | Dashboard page — wire T004-T008 into app/page.tsx | feat/T009-dashboard-page | ✅ Done |
| T010 | Component: TripsTable — sortable table with mode icons | feat/T010-trips-table | ✅ Done |
| T011 | Component: TripsFilters — date range picker + mode filter | feat/T011-trips-filters | ✅ Done |

## Day 4 — Trips Assembly + Analytics

| Task | Description | Branch | Status |
|------|-------------|--------|--------|
| T012 | Trips page — wire T010-T011, pagination, empty state | feat/T012-trips-page | ✅ Done |
| T013 | Component: MonthlyTrendChart — bar chart, 12 months | feat/T013-monthly-trend-chart | ✅ Done |
| T014 | Component: ModeBreakdownOverTime — stacked area chart | feat/T014-mode-breakdown-chart | ✅ Done |

## Day 5 — Analytics + Insights

| Task | Description | Branch | Status |
|------|-------------|--------|--------|
| T015 | Analytics page — wire T013-T014, period switcher | feat/T015-analytics-page | ✅ Done |
| T016 | Component: WeeklyDigestHero — dark hero card with sparkline | feat/T016-weekly-digest-hero | ✅ Done |
| T017 | Component: InsightCard — all 8 type variants | feat/T017-insight-card-variants | ✅ Done |
| T018 | Component: AchievementsPanel — badge grid with progress | feat/T018-achievements-panel | ✅ Done |

## Day 6 — Insights + Settings

| Task | Description | Branch | Status |
|------|-------------|--------|--------|
| T019 | Insights page — wire T016-T018, type tabs, mark-read | feat/T019-insights-page | ✅ Done |
| T020 | Settings page — profile form, daily goal, preferences | feat/T020-settings-page | ✅ Done |

## Day 7 — Polish

| Task | Description | Branch | Status |
|------|-------------|--------|--------|
| T021 | Empty states — illustrations for all pages | feat/T021-empty-states | ✅ Done |
| T022 | Mobile responsive pass — test all pages at 375px | feat/T022-mobile-responsive | ✅ Done |
| T023 | Final QA + bug fixes — full walkthrough all pages | feat/T023-final-qa | ✅ Done |

---

## Quality Gates (Every Task)

Before a task is marked Done:
- [ ] `pnpm build` passes with zero errors
- [ ] `pnpm lint` passes with zero warnings
- [ ] `pnpm test` passes (unit tests written for all new components)
- [ ] Visual QA in browser at localhost:3000
- [ ] PR created using `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] PR title follows: `feat(T00X): description`
- [ ] Discord notified

---

## Phase 2 (Post Week 1 — Production Hardening)

- [ ] Move JWT from localStorage to httpOnly cookies
- [x] Implement silent token refresh
- [x] Google OAuth integration
- [x] CSV export for trips
- [ ] Lighthouse score > 90 on all pages
- [ ] Full E2E test suite with Playwright
