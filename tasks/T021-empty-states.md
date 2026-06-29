# T021 — Empty States

**Branch:** `feat/T021-empty-states`
**Status:** ✅ Done
**Depends on:** T019 merged (all pages assembled)

---

## Context files to read first
- `CLAUDE.md` — component rules (every data-fetching component needs empty state)

## Design reference
- `design/Atmos Frontend/app.jsx`, `trips.jsx`, `insights.jsx` — each has an empty state defined
- Empty states were sketched inline in each component — this task centralizes and polishes them

---

## What to build

Audit every data-fetching component and ensure each has a proper empty state. Create a centralized `EmptyState` component and update any component using ad-hoc empty state strings.

### `components/ui/EmptyState.tsx`

```tsx
interface EmptyStateProps {
  icon: React.ReactNode   // lucide icon component
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}
```

- Centered layout, `padding: 48px 24px`, flex column, align-center
- Icon: 48px, color `#C5CCD6`
- Title: 15px 600 `#1A2332`, margin-top 14px
- Description: 13px `#6B7A8D`, margin-top 6px, text-center, max-width 320px
- Action: `Button variant="secondary"` or anchor, margin-top 16px

### Empty states to implement / verify per component:

| Component | Title | Description | Action |
|---|---|---|---|
| `RecentTripsList` | "No trips yet" | "Log your first trip to start tracking your carbon footprint." | — |
| `TripsTable` (0 results with active filter) | "No trips match these filters" | "Try widening the date range or clearing the search." | — |
| `TripsTable` (0 trips total) | "No trips logged yet" | "Trips detected by Atmos will appear here automatically." | — |
| `InsightsFeedMini` | "No insights yet" | "Keep tracking trips and insights will appear here." | "Go to Insights" → /insights |
| `InsightFeed` (filtered) | "No {type} insights" | "Nothing here yet." | "View all" |
| `InsightFeed` (all empty) | "No insights yet" | "Keep logging trips — Atmos will analyze your patterns soon." | — |
| `AchievementsPanel` (if 0 achievements) | "No achievements yet" | "Complete milestones to earn badges." | — |
| `TransportBreakdownCard` | "No trips this month" | "Add trips to see your transport breakdown." | — |
| `WeeklyTrendCard` | "No data this week" | "Start tracking to see your weekly trend." | — |
| `TopRoutesTable` | "No recurring routes yet" | "Atmos will identify your most-traveled routes here." | — |

### Process
1. Read each component file
2. Find existing empty state logic (if any)
3. Replace ad-hoc empty state markup with `<EmptyState ...>` component
4. Ensure component returns `<EmptyState>` when `data.length === 0` and `isLoading === false`

---

## Unit tests

**`components/ui/EmptyState.test.tsx`**
- Renders icon, title, description
- Renders action button when provided
- Action button triggers onClick
- Action renders as link when href provided

Add empty state assertions to existing component tests that already mock data:
- Verify `EmptyState` renders when data is `[]`

---

## Acceptance criteria

- [ ] `pnpm build` passes
- [ ] `EmptyState` component created in `components/ui/`
- [ ] All 10 components in table above use `EmptyState`
- [ ] Empty states visible by passing empty arrays to each component in dev
- [ ] Actions (where defined) navigate correctly
- [ ] All existing tests still pass

---

## Quality gates
- [ ] `pnpm build` zero errors
- [ ] `pnpm lint` zero warnings
- [ ] `pnpm test` green
- [ ] PR: `feat(T021): empty states — centralized EmptyState component across all pages`
