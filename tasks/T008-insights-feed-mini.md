# T008 — Component: InsightsFeedMini

**Branch:** `feat/T008-insights-feed-mini`
**Status:** ✅ Done
**Depends on:** T003 merged to main

---

## Context files to read first
- `CLAUDE.md` — component rules, design tokens
- `../.context/api-spec.md` — GET /insights endpoint
- `types/index.ts` — Insight, InsightType types

## Design reference
- `design/Atmos Frontend/app.jsx` — look for the `InsightsFeed` or insights section near the end of the Dashboard page code
- `design/Atmos Frontend/data.jsx` — `INSIGHTS` array (3 items) — exact props used in the mini feed
- `design/Atmos Frontend/insights-data.jsx` — `ALL_INSIGHTS` shapes for type variants

---

## What to build

A compact feed of 3 insight cards shown on the Dashboard page (preview of the Insights page). This is the "mini" variant — smaller cards, no actions, no sparkline.

### `components/dashboard/InsightsFeedMini.tsx`

```tsx
export function InsightsFeedMini()
```

Fetches `useInsights()`, takes the first 3 unread insights (or first 3 if all read).

**Card structure:**
- Card title: "Insights" (17px 600 `#1A2332`)
- Badge showing count of unread insights — pill, bg `rgba(74,144,196,0.10)`, color `#4A90C4`, 11px 600
- "See all →" link top-right → `/insights` (13px `#4A90C4`)
- 3 insight cards stacked vertically, `gap: 12px`

**Individual mini insight card** (local function, not exported):
- Border-left: `3px solid {insight.color}`, `border-radius: 12px`, `bg-white`, `padding: 14px 16px`
- Shadow: `0 1px 3px rgba(0,0,0,0.06)`
- **Type chip**: `{insight.type}` text, 10px 600 uppercase, colored with `insight.color`, bg `{color}14` (8% opacity), `padding: 2px 8px`, `border-radius: 999px`
- **Title**: 14px 600 `#1A2332`, margin-top 6px
- **Body**: 13px 400 `#6B7A8D`, margin-top 4px, 2-line clamp (CSS `-webkit-line-clamp: 2`)
- **New dot**: if `insight.read === false`, show a 6px circle `#4A90C4` at top-right of card

**Insight type → color mapping** (match `insights-data.jsx`):
```ts
const INSIGHT_COLORS: Record<string, string> = {
  STREAK:        '#4A90C4',
  TIP:           '#3DAB82',
  ANOMALY:       '#F0956A',
  COMPARISON:    '#7BA9D4',
  MILESTONE:     '#4A90C4',
  CONTEXT:       '#8AC9A8',
  WEEKLY_DIGEST: '#4A90C4',
}
```

**Loading state:** 3 skeleton cards (same dimensions, gray shimmer)
**Error state:** "Could not load insights" centered
**Empty state:** "No insights yet. Keep tracking trips!" with Lightbulb icon, `#6B7A8D`

---

## Unit tests

**`components/dashboard/InsightsFeedMini.test.tsx`**
- Renders up to 3 insight cards
- Unread badge count shown correctly
- New dot visible on unread insights
- "See all" link goes to /insights
- Loading skeleton shown
- Empty state shown when insights array empty

---

## Acceptance criteria

- [x] `pnpm build` passes
- [x] Up to 3 insight mini cards render
- [x] Left border color matches insight type
- [x] Unread count badge shown in header
- [x] New dot on unread insights
- [x] Body text clamped at 2 lines
- [x] Empty and loading states correct
- [x] "See all →" links to /insights
- [x] All unit tests pass

---

## Quality gates
- [x] `pnpm build` zero errors
- [x] `pnpm lint` zero warnings
- [x] `pnpm test` green
- [x] PR: `feat(T008): InsightsFeedMini — 3 insight preview cards for dashboard`
