# T022 — Mobile Responsive Pass

**Branch:** `feat/T022-mobile-responsive`
**Status:** ⬜ Todo
**Depends on:** T021 merged (all pages + empty states complete)

---

## Context files to read first
- `CLAUDE.md` — design tokens (responsive breakpoints), sidebar mobile behavior
- `../.context/design-system.md` — responsive breakpoints specification

## Design reference
- All `design/Atmos Frontend/*.html` files — open each at 375px width in Chrome DevTools
- Primary target: 375px (iPhone SE) and 390px (iPhone 15)
- Secondary target: 768px (iPad)

---

## What to build

A systematic responsive audit across all 5 pages. Do NOT rewrite pages — make targeted fixes only.

### Breakpoints to target
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px (primary desktop breakpoint)
- Mobile-first assumption: default styles = mobile, `lg:` = desktop

### Audit checklist per page

For each page, open in Chrome DevTools at 375px width and fix each of these:

#### Dashboard (`/dashboard`)
- [ ] 4-card stat strip: `grid-cols-2 lg:grid-cols-4` (2×2 on mobile)
- [ ] Weekly chart + donut: `grid-cols-1 lg:grid-cols-[1fr_360px]`
- [ ] Recent trips + insights: `grid-cols-1 lg:grid-cols-[1fr_360px]`
- [ ] Stat card value: reduce to 24px on mobile (from 30px)
- [ ] Page padding: `p-4 lg:p-[32px_36px]`

#### Trips (`/trips`)
- [ ] Stats strip: `grid-cols-2 lg:grid-cols-4`
- [ ] Trips table: add horizontal scroll wrapper `overflow-x-auto` at <768px
- [ ] Filter chips: allow wrap `flex-wrap`
- [ ] Column: hide "Duration" column on mobile (it's lowest-priority info)
- [ ] Pagination: reduce page buttons shown on mobile (show max 3)

#### Analytics (`/analytics`)
- [ ] KPI cards: `grid-cols-2 lg:grid-cols-4`
- [ ] Chart grids: `grid-cols-1 lg:grid-cols-[1fr_auto]`
- [ ] Daily bar chart: reduce height to 180px on mobile
- [ ] Period switcher: compress labels ("30d" instead of "30 days" on mobile)
- [ ] Top routes table: hide "Total km" column on mobile

#### Insights (`/insights`)
- [ ] Stats strip: `grid-cols-2 lg:grid-cols-4`
- [ ] Hero card: reduce padding to `20px` on mobile, stack layout
- [ ] Sparkline in hero: hide on mobile (it's decorative)
- [ ] Achievement grid: `grid-cols-2 sm:grid-cols-4`

#### Settings (`/settings`)
- [ ] Sub-nav + content: `grid-cols-1 lg:grid-cols-[220px_1fr]`
- [ ] On mobile: sub-nav shows above content as horizontal scrollable chips
- [ ] FormRow: stack label above input on mobile (default 2-col is desktop only)

#### Sidebar (from T003 — ensure mobile works)
- [ ] Sidebar hidden on mobile (below `lg`)
- [ ] Hamburger `<Menu>` icon visible in header on mobile
- [ ] Sidebar slides in as overlay on tap, backdrop closes it
- [ ] Touch target: all buttons min 44×44px

### Implementation approach
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) — no CSS media queries
- Use `overflow-x-auto` wrapper around tables
- Use `hidden lg:block` / `lg:hidden` for show/hide patterns
- Do not break desktop layout while fixing mobile

---

## Unit tests

No new unit tests required for responsive styles — these are visual.

Add one test per page to ensure the page renders without error at a small viewport:
- Mock `window.innerWidth = 375` before render
- Assert page renders without crash

---

## Acceptance criteria

- [ ] `pnpm build` passes
- [ ] Dashboard at 375px: 2×2 stat grid, single-column charts
- [ ] Trips at 375px: table scrolls horizontally, filters wrap
- [ ] Analytics at 375px: 2×2 KPI, single-column charts
- [ ] Insights at 375px: 2×2 achievement grid, hero stacked
- [ ] Settings at 375px: sub-nav above content
- [ ] Sidebar: hamburger visible, drawer opens on mobile
- [ ] No horizontal overflow on any page at 375px
- [ ] Desktop layout unchanged at 1440px

---

## Quality gates
- [ ] `pnpm build` zero errors
- [ ] `pnpm lint` zero warnings
- [ ] `pnpm test` green
- [ ] Chrome DevTools visual QA at 375px for all 5 pages
- [ ] PR: `feat(T022): mobile responsive — 375px pass across all pages`
