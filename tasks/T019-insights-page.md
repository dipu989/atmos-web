# T019 — Insights Page Assembly

**Branch:** `feat/T019-insights-page`
**Status:** ✅ Done
**Depends on:** T016, T017, T018 all merged to main

---

## Context files to read first
- `CLAUDE.md` — architecture
- `../.context/api-spec.md` — GET /insights, POST /insights/{id}/read
- `types/index.ts` — Insight, InsightType types

## Design reference
- `design/Atmos Frontend/insights.jsx` — `InsightsPage` component (full page structure with tabs and stats)
- `design/Atmos Frontend/Insights.html` — open in browser to see final visual target
- `design/Atmos Frontend/insights-data.jsx` — `INSIGHT_STATS`, `ALL_INSIGHTS`, `ACHIEVEMENTS`

---

## What to build

### `app/(dashboard)/insights/page.tsx`

```tsx
'use client'
```

**State:**
```ts
const [activeTab, setActiveTab] = useState<'all' | InsightType>('all')
```

**Page layout** (match `Insights.html`):

```
<PageShell title="Insights" subtitle="What Atmos has learned from your travel patterns.">

  {/* Stats strip — 4 compact cards */}
  <InsightStatsStrip />

  {/* Featured hero — most recent WEEKLY_DIGEST insight */}
  <WeeklyDigestHero insight={featuredInsight} />

  {/* Type tabs + feed */}
  <div>
    <InsightTypeTabs activeTab={activeTab} onChange={setActiveTab} />
    <InsightFeed insights={filteredInsights} onRead={handleMarkRead} />
  </div>

  {/* Achievements panel — full width at bottom */}
  <AchievementsPanel achievements={achievements} />

</PageShell>
```

### `components/insights/InsightStatsStrip.tsx`

4 compact stat cards for Insights page header:
- Total insights: `{INSIGHT_STATS.total}` — accent `#4A90C4`, icon `lightbulb`
- New: `{INSIGHT_STATS.newCount}` — accent `#F0956A`, icon `bell`
- Actions taken: `{INSIGHT_STATS.acted}` — accent `#3DAB82`, icon `check`
- Potential save: `{INSIGHT_STATS.potentialSave} kg/mo` — accent `#6B7A8D`, icon `leaf`

Match `TripStatsStrip` pattern from T011 (reuse or replicate).

### `components/insights/InsightTypeTabs.tsx`

Tab filter above the feed:
- Tabs: "All" + one per InsightType that appears in the data
- Each tab: count badge
- Active tab: blue underline + `#1A2332` text 600
- Inactive: `#6B7A8D` text 500
- Design: underline tabs (not pill), border-bottom `2px solid #4A90C4` on active

### `components/insights/InsightFeed.tsx`

```tsx
interface InsightFeedProps {
  insights: Insight[]
  onRead: (id: string) => void
  loading?: boolean
}
```

- Maps `insights` array to `InsightCard` components
- `gap: 12px` between cards
- Loading: 3 skeleton cards
- Empty state: "No insights of this type yet" with Lightbulb icon

### Data logic (in the page component)

```ts
const { data: insights, isLoading } = useInsights()
const { mutate: markRead } = useMarkInsightRead()

// Featured: first WEEKLY_DIGEST, or first insight if none
const featuredInsight = insights?.find(i => i.type === 'WEEKLY_DIGEST') ?? insights?.[0]

// Tab filter
const filteredInsights = activeTab === 'all'
  ? insights?.filter(i => i.type !== 'WEEKLY_DIGEST')
  : insights?.filter(i => i.type === activeTab)

function handleMarkRead(id: string) {
  markRead(id)  // optimistic update handled by mutation's onSuccess
}
```

Achievements: if there's no dedicated endpoint, derive from insights of type MILESTONE or STREAK and construct Achievement objects. Document this assumption in the code.

---

## Unit tests

**`app/(dashboard)/insights/page.test.tsx`**
- Renders stats strip, hero, tabs, feed, achievements
- Tab filtering works
- Mark read calls mutation

**`components/insights/InsightTypeTabs.test.tsx`**
- Renders "All" tab plus type-specific tabs
- Active tab has correct styling
- Clicking tab calls onChange

---

## Acceptance criteria

- [x] `pnpm build` passes
- [x] Insights page loads at `/insights`
- [x] Stats strip 4 cards
- [x] Hero card rendered (dark background)
- [x] Type tabs filter the feed
- [x] InsightCard variants render correctly in feed
- [x] Achievements grid at bottom
- [x] Mark read removes "New" dot
- [x] Visual matches `Insights.html` reference

---

## Quality gates
- [x] `pnpm build` zero errors
- [x] `pnpm lint` zero warnings
- [x] `pnpm test` green
- [x] Visual QA: compare against `design/Atmos Frontend/Insights.html`
- [x] PR: `feat(T019): insights page — wire hero, feed, tabs, achievements`
