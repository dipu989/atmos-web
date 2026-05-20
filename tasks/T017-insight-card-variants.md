# T017 — Component: InsightCard (All Type Variants)

**Branch:** `feat/T017-insight-card-variants`
**Status:** ⬜ Todo
**Depends on:** T003 merged to main

---

## Context files to read first
- `CLAUDE.md` — component rules, design tokens
- `types/index.ts` — Insight, InsightType types
- `../.context/api-spec.md` — POST /insights/{id}/read endpoint

## Design reference
- `design/Atmos Frontend/insights.jsx` — `InsightCard` component (the main card in the feed below the hero)
- `design/Atmos Frontend/insights-data.jsx` — `ALL_INSIGHTS` — all 7 insight type shapes with their unique fields

---

## What to build

A single `InsightCard` component that handles all 7 insight types with their visual variants.

### `components/insights/InsightCard.tsx`

```tsx
interface InsightCardProps {
  insight: {
    id: string
    type: InsightType
    color: string
    icon: string
    date: string
    new: boolean
    title: string
    body: string
    spark?: number[]           // present on ANOMALY type
    sparkHighlight?: number    // index to highlight in sparkline
    impact?: string            // present on TIP type, e.g. "Potential save: 8.8 kg/month"
    progress?: { current: number; target: number; label: string }  // present on STREAK type
    actions?: string[]         // action button labels
  }
  onRead?: (id: string) => void
}
```

**Base card layout** (all types share this):
- White bg, `border-radius: 16px`, shadow `0 1px 3px rgba(0,0,0,0.07)`
- Left border: `4px solid {insight.color}`
- Padding: `18px 20px`

**Header row** (space-between):
- Left: icon badge (28×28, `border-radius: 8px`, bg `{color}1A`, icon 15px) + type chip
- Type chip: `{type}` text 10px 600 uppercase, `{color}14` bg, color text, `border-radius: 999px`, `padding: 2px 8px`
- Right: date string (12px `#6B7A8D`) + "New" dot if `insight.new === true` (6px circle `#4A90C4`)

**Title**: 15px 600 `#1A2332`, margin-top 10px

**Body**: 13.5px 400 `#6B7A8D`, margin-top 6px, line-height 1.5

**Type-specific extras** (rendered below body):

*TIP type* — impact banner:
- `{impact}` text in green pill: `rgba(61,171,130,0.10)` bg, `#3DAB82` text, `border-radius: 8px`, `padding: 6px 12px`, leaf icon

*ANOMALY type* — mini sparkline:
- Use the same `Sparkline` SVG from T016 (extract to `components/charts/Sparkline.tsx` if not already done)
- Width: fit container (not 220px fixed), height: 48px
- Highlight the `sparkHighlight` index in orange

*STREAK type* — progress bar:
- `{progress.label}: {progress.current}/{progress.target}`
- Progress bar: `#F0F2F5` track, `{insight.color}` fill, height 6px, rounded, animated fill
- Percentage text: 12px `#6B7A8D`

**Actions row** (if `actions.length > 0`, margin-top 14px, gap 8px):
- First action: outlined button with insight color border and text, `padding: 6px 14px`, 13px 500
- Additional actions: ghost button, `#6B7A8D` text

**Mark as read behavior:**
- If `insight.new === true` and user clicks anywhere on card → call `onRead(insight.id)`
- After marked read: remove the "New" dot (optimistic update)

---

## Unit tests

**`components/insights/InsightCard.test.tsx`**
- Renders base card structure (title, body, type chip, date)
- Shows "New" dot when `insight.new === true`
- TIP type: renders impact banner
- ANOMALY type: renders sparkline
- STREAK type: renders progress bar
- Action buttons rendered when `actions` provided
- `onRead` called when new insight is clicked
- Left border color matches insight color

---

## Acceptance criteria

- [ ] `pnpm build` passes
- [ ] All 7 types render without error
- [ ] Left border color matches type color
- [ ] TIP type shows impact banner (green)
- [ ] ANOMALY type shows mini sparkline
- [ ] STREAK type shows progress bar
- [ ] "New" dot visible for unread insights
- [ ] Action buttons render and are clickable
- [ ] Mark-read removes the dot optimistically
- [ ] All tests pass

---

## Quality gates
- [ ] `pnpm build` zero errors
- [ ] `pnpm lint` zero warnings
- [ ] `pnpm test` green
- [ ] PR: `feat(T017): InsightCard — all 7 type variants`
