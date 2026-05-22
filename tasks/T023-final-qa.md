# T023 — Final QA + Bug Fixes

**Branch:** `feat/T023-final-qa`
**Status:** ✅ Done

**Depends on:** T022 merged (all previous tasks complete)

---

## Context files to read first
- `CLAUDE.md` — all rules, decisions log
- `ROADMAP.md` — quality gates definition of done

---

## What to do

Full walkthrough of the app against the design reference, finding and fixing all visual and functional bugs before considering the week-1 milestone complete.

### Step 1 — Start fresh session

1. Make sure the backend is running: `cd ../atmos-core && make dev`
2. Create test user if not exists: `make seed-user`
3. Start the frontend: `pnpm dev`
4. Open Chrome at `localhost:3000` and clear all localStorage

### Step 2 — Auth flow walkthrough

- [x] `/` redirects to `/login`
- [x] Login with wrong password shows error
- [x] Login with test credentials from `../.context/api-spec.md` succeeds
- [x] Redirects to `/dashboard` after login
- [x] Refresh page stays on dashboard (tokens persisted)
- [x] Manually clear localStorage → redirects to `/login`

### Step 3 — Dashboard

Open `design/Atmos Frontend/Dashboard.html` side-by-side.
- [x] 4 stat cards rendering with real data (not all zeros)
- [x] Weekly chart: 7 data points, goal line visible
- [x] Donut chart: slices visible with correct colors
- [x] Recent trips: 5 rows with mode icons
- [x] Insight cards: 3 cards visible
- [x] User name in subtitle ("Welcome back, Shantnu")
- [x] No console errors

### Step 4 — Trips

Open `design/Atmos Frontend/Trips.html` side-by-side.
- [x] Stats strip shows totals
- [x] Table: all columns visible, rows render
- [x] Search: type "Office" — filters rows
- [x] Mode chip: click "Car" — shows only car trips
- [x] Source toggle: "Manual" — shows only manual trips
- [x] Sort by CO₂: ascending, then descending (now shows ▲/▼ indicator)
- [x] Pagination: navigate to page 2 if data has more than 12 trips
- [x] URL param: navigate to `/trips?mode=bike` — bike filter pre-selected
- [x] No console errors

### Step 5 — Analytics

Open `design/Atmos Frontend/Analytics.html` side-by-side.
- [x] All 4 KPI cards show data
- [x] Daily bar chart: 30 bars, goal line visible
- [x] Month-over-month chart: two bar series
- [x] Mode stacked area: 5 colored areas
- [x] Top routes table: routes listed
- [x] Weekday chart: 7 horizontal bars
- [x] Period switcher: click "3 months" — data updates
- [x] No console errors

### Step 6 — Insights

Open `design/Atmos Frontend/Insights.html` side-by-side.
- [x] Stats strip shows counts
- [x] Hero card: dark background, sparkline visible
- [x] Feed: insight cards rendering
- [x] Type tabs: clicking "TIP" shows only tips
- [x] Mark read: click unread card → "New" dot disappears
- [x] Achievements: grid visible, earned vs locked distinction
- [x] No console errors

### Step 7 — Settings

Open `design/Atmos Frontend/Settings.html` side-by-side.
- [x] Sub-nav shows 7 sections
- [x] Profile: name, email, city fields populated from API
- [x] Change name → save → reload → name persisted
- [x] Goals: daily goal slider works
- [x] Stub sections: render placeholder without crashing
- [x] No console errors

### Step 8 — Mobile

Chrome DevTools, iPhone SE (375×667):
- [x] Dashboard: 2×2 stat grid
- [x] Sidebar: hidden, hamburger visible
- [x] Hamburger opens sidebar drawer
- [x] Trips: table scrollable horizontally
- [x] Settings: sub-nav above content (single column)
- [x] No horizontal overflow

### Step 9 — Cross-cutting

- [x] All loading states shown while API is slow (throttle network in DevTools)
- [x] All error states shown when API is offline (stop backend)
- [x] Empty states shown (test by signing in to an account with no trips)
- [x] `pnpm build` passes clean (zero errors, zero warnings)
- [x] `pnpm lint` passes clean
- [x] `pnpm test` all green

### Bug fixing

---

## Bug 1: TransportBreakdownCard uses wrong period key

**Observed:** The transport breakdown donut chart on the dashboard was fetching daily data instead of monthly data, because the component passed `'month'` but the API client checks for `'monthly'`.

**Expected:** Breakdown reflects the current month (matches card subtitle "This month").

**File changed:** `components/dashboard/TransportBreakdownCard.tsx:97`

**Fix:** Changed `useTransportBreakdown('month')` → `useTransportBreakdown('monthly')`.

---

## Bug 2: TripStatsStrip not mobile responsive

**Observed:** On 375px viewport, the Trips stats strip rendered as 4 equal columns which were too narrow to read. The loading skeleton correctly used `grid-cols-2 lg:grid-cols-4` but the live state used `grid-cols-4` unconditionally.

**Expected:** 2-column layout on mobile, 4-column on desktop.

**File changed:** `components/trips/TripStatsStrip.tsx:88`

**Fix:** Changed `grid grid-cols-4 gap-4` → `grid grid-cols-2 gap-4 lg:grid-cols-4`.

---

## Bug 3: Sort direction not indicated visually in TripsTable

**Observed:** All sort header columns showed `ChevronsUpDown` (both arrows) regardless of sort direction. After clicking to sort ascending or descending, no visual distinction was shown.

**Expected:** Active sorted column shows `ChevronUp` (ascending) or `ChevronDown` (descending).

**File changed:** `components/trips/TripsTable.tsx`

**Fix:** `SortHeader` now accepts `activeSortDir` prop and renders `ChevronUp`/`ChevronDown` for the active column, `ChevronsUpDown` (dimmed) for inactive columns.

---

## Bug 4: Header range picker dropdown does not close on outside click

**Observed:** Clicking the range picker button opened the dropdown. Clicking anywhere else on the page did NOT close the dropdown — only clicking the button again would close it.

**Expected:** Clicking outside the dropdown (anywhere else on page) closes it.

**File changed:** `components/layout/Header.tsx`

**Fix:** Added a `useRef` + `useEffect` click-outside handler that closes the dropdown when a `mousedown` event fires outside the dropdown container.

---

## Acceptance criteria

This task is done when:
- [x] All 9 walkthrough checklists above are fully checked
- [x] Zero console errors on any page
- [x] `pnpm build` passes
- [x] `pnpm lint` passes
- [x] `pnpm test` passes
- [x] Visual fidelity score: each page visually matches its HTML reference to >90%

---

## Quality gates
- [x] `pnpm build` zero errors
- [x] `pnpm lint` zero warnings
- [x] `pnpm test` green
- [x] PR: `feat(T023): final QA — bug fixes and polish pass`
