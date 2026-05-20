# T023 — Final QA + Bug Fixes

**Branch:** `feat/T023-final-qa`
**Status:** ⬜ Todo
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

- [ ] `/` redirects to `/login`
- [ ] Login with wrong password shows error
- [ ] Login with test credentials from `../.context/api-spec.md` succeeds
- [ ] Redirects to `/dashboard` after login
- [ ] Refresh page stays on dashboard (tokens persisted)
- [ ] Manually clear localStorage → redirects to `/login`

### Step 3 — Dashboard

Open `design/Atmos Frontend/Dashboard.html` side-by-side.
- [ ] 4 stat cards rendering with real data (not all zeros)
- [ ] Weekly chart: 7 data points, goal line visible
- [ ] Donut chart: slices visible with correct colors
- [ ] Recent trips: 5 rows with mode icons
- [ ] Insight cards: 3 cards visible
- [ ] User name in subtitle ("Welcome back, Shantnu")
- [ ] No console errors

### Step 4 — Trips

Open `design/Atmos Frontend/Trips.html` side-by-side.
- [ ] Stats strip shows totals
- [ ] Table: all columns visible, rows render
- [ ] Search: type "Office" — filters rows
- [ ] Mode chip: click "Car" — shows only car trips
- [ ] Source toggle: "Manual" — shows only manual trips
- [ ] Sort by CO₂: ascending, then descending
- [ ] Pagination: navigate to page 2 if data has more than 12 trips
- [ ] URL param: navigate to `/trips?mode=bike` — bike filter pre-selected
- [ ] No console errors

### Step 5 — Analytics

Open `design/Atmos Frontend/Analytics.html` side-by-side.
- [ ] All 4 KPI cards show data
- [ ] Daily bar chart: 30 bars, goal line visible
- [ ] Month-over-month chart: two bar series
- [ ] Mode stacked area: 5 colored areas
- [ ] Top routes table: routes listed
- [ ] Weekday chart: 7 horizontal bars
- [ ] Period switcher: click "3 months" — data updates
- [ ] No console errors

### Step 6 — Insights

Open `design/Atmos Frontend/Insights.html` side-by-side.
- [ ] Stats strip shows counts
- [ ] Hero card: dark background, sparkline visible
- [ ] Feed: insight cards rendering
- [ ] Type tabs: clicking "TIP" shows only tips
- [ ] Mark read: click unread card → "New" dot disappears
- [ ] Achievements: grid visible, earned vs locked distinction
- [ ] No console errors

### Step 7 — Settings

Open `design/Atmos Frontend/Settings.html` side-by-side.
- [ ] Sub-nav shows 7 sections
- [ ] Profile: name, email, city fields populated from API
- [ ] Change name → save → reload → name persisted
- [ ] Goals: daily goal slider works
- [ ] Stub sections: render placeholder without crashing
- [ ] No console errors

### Step 8 — Mobile

Chrome DevTools, iPhone SE (375×667):
- [ ] Dashboard: 2×2 stat grid
- [ ] Sidebar: hidden, hamburger visible
- [ ] Hamburger opens sidebar drawer
- [ ] Trips: table scrollable horizontally
- [ ] Settings: sub-nav above content (single column)
- [ ] No horizontal overflow

### Step 9 — Cross-cutting

- [ ] All loading states shown while API is slow (throttle network in DevTools)
- [ ] All error states shown when API is offline (stop backend)
- [ ] Empty states shown (test by signing in to an account with no trips)
- [ ] `pnpm build` passes clean (zero errors, zero warnings)
- [ ] `pnpm lint` passes clean
- [ ] `pnpm test` all green

### Bug fixing

Document each bug found as a `## Bug N: {description}` section in this task file with:
- What you observed vs expected
- The file and line you changed
- How you fixed it

---

## Acceptance criteria

This task is done when:
- [ ] All 9 walkthrough checklists above are fully checked
- [ ] Zero console errors on any page
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] Visual fidelity score: each page visually matches its HTML reference to >90%

---

## Quality gates
- [ ] `pnpm build` zero errors
- [ ] `pnpm lint` zero warnings
- [ ] `pnpm test` green
- [ ] PR: `feat(T023): final QA — bug fixes and polish pass`
