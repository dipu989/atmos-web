# T016 — Component: WeeklyDigestHero

**Branch:** `feat/T016-weekly-digest-hero`
**Status:** ✅ Done
**Depends on:** T003 merged to main

---

## Context files to read first
- `CLAUDE.md` — component rules, design tokens
- `../.context/api-spec.md` — GET /insights endpoint (look for WEEKLY_DIGEST type)
- `types/index.ts` — Insight, InsightType types

## Design reference
- `design/Atmos Frontend/insights.jsx` — `FeaturedHero` component (first major component in the file)
- `design/Atmos Frontend/insights-data.jsx` — `FEATURED_INSIGHT` object — exact props and sparkline data

---

## What to build

The large featured hero card at the top of the Insights page. Dark background, sparkline, key metric.

### `components/insights/WeeklyDigestHero.tsx`

```tsx
interface WeeklyDigestHeroProps {
  insight: {
    type: string               // "WEEKLY DIGEST"
    title: string
    body: string
    metric: {
      primary: string          // "33.5 kg"
      sub: string              // "21 trips · 7 days"
      delta: number            // -8 means -8% (negative = improvement)
    }
    spark: number[]            // 7 values for sparkline
  }
}
```

**Card design** (match `insights.jsx` `FeaturedHero`):
- Background: `#1A2332` (dark card, not default white)
- `border-radius: 20px`, padding `28px 32px`
- No shadow (dark card stands on its own)

**Layout** (two columns):
- Left: type chip + title + body + metric block
- Right: sparkline SVG

**Type chip** (top-left):
- `WEEKLY DIGEST` text, 10px 600 uppercase, `rgba(255,255,255,0.12)` bg, white 70% text, `border-radius: 999px`, `padding: 3px 10px`

**Title**: 22px 600 white, margin-top 12px, letter-spacing -0.4px

**Body**: 14px `rgba(255,255,255,0.65)` (muted white), margin-top 8px

**Metric block** (below body, margin-top 20px):
- Primary metric: 36px 700 white, letter-spacing -0.8px
- Sub text: 13px `rgba(255,255,255,0.55)`, margin-top 2px
- Delta badge: pill beside the metric
  - Negative delta (improvement): `rgba(61,171,130,0.18)` bg, `#3DAB82` text, arrow-down icon
  - Positive delta (worse): `rgba(240,149,106,0.18)` bg, `#F0956A` text, arrow-up icon
  - Text: `{|delta|}% vs last week`, 12px 600

**Sparkline** (right side, SVG):
- Width: 220px, height: 56px (match `Sparkline` component in `insights.jsx`)
- Smoothed Catmull-Rom bezier curve
- Line: `#4A90C4`, strokeWidth 1.75
- Area fill: gradient `#4A90C4` 22% → 2% opacity
- Each data point: 2.2px white circle with blue stroke
- Highlighted point (highest value): 4px orange fill `#F0956A`
- Implement as raw SVG (not Recharts — this is a micro chart)

---

## Unit tests

**`components/insights/WeeklyDigestHero.test.tsx`**
- Renders with correct title and body
- Type chip shows "WEEKLY DIGEST"
- Negative delta shows green downward badge
- Positive delta shows orange upward badge
- Sparkline SVG element present
- Highlighted point rendered

---

## Acceptance criteria

- [x] `pnpm build` passes
- [x] Dark card background `#1A2332`
- [x] Title, body, metric, delta badge render correctly
- [x] Sparkline SVG renders without crash
- [x] Negative delta = green badge, positive = orange
- [x] Highlighted (highest) sparkline point is orange
- [x] All tests pass

---

## Quality gates
- [x] `pnpm build` zero errors
- [x] `pnpm lint` zero warnings
- [x] `pnpm test` green
- [x] PR: `feat(T016): WeeklyDigestHero — dark hero card with sparkline`
