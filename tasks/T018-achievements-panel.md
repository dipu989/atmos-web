# T018 — Component: AchievementsPanel

**Branch:** `feat/T018-achievements-panel`
**Status:** ✅ Done
**Depends on:** T003 merged to main

---

## Context files to read first
- `CLAUDE.md` — component rules, design tokens
- `types/index.ts` — Insight types (achievements may come from insights or a separate endpoint — check `api-spec.md`)
- `../.context/api-spec.md` — look for any achievements or milestones endpoint; if none, derive from insights

## Design reference
- `design/Atmos Frontend/insights.jsx` — `AchievementsGrid` component
- `design/Atmos Frontend/insights-data.jsx` — `ACHIEVEMENTS` array — exact badge data shapes

---

## What to build

A grid of achievement badges — earned ones shown in color, locked ones shown grayed out with a progress indicator.

### `components/insights/AchievementsPanel.tsx`

```tsx
interface Achievement {
  id: string | number
  name: string
  desc: string
  icon: string          // lucide icon name
  color: string
  earned: boolean
  date?: string         // shown when earned
  progress?: number     // current value (when not yet earned)
  target?: number       // target value (when not yet earned)
}

interface AchievementsPanelProps {
  achievements: Achievement[]
}
```

**Panel card:**
- Card title: "Achievements" (17px 600 `#1A2332`)
- Badge count sub-text: "{earned} of {total} earned" (13px `#6B7A8D`)

**Grid layout:** `grid-cols-4 gap-4` (4 badges per row on desktop, 2 on mobile)

**Achievement badge** (each item):
- Container: `border-radius: 16px`, `padding: 18px 14px`, `text-align: center`
- **Earned**: white bg, shadow `0 1px 3px rgba(0,0,0,0.08)`
- **Locked**: `#F5F7FA` bg, no shadow, all content grayscale

**Badge icon circle:**
- 48×48 circle, `margin: 0 auto`
- Earned: bg `{color}1A`, icon 24px in `{color}`
- Locked: bg `#E8EDF2`, icon 24px in `#C5CCD6`

**Badge name:** 13px 600, margin-top 10px
- Earned: `#1A2332`
- Locked: `#6B7A8D`

**Badge sub-text:**
- Earned: date earned, 11px `{color}`, margin-top 2px (e.g. "Feb 21")
- Locked (no progress): 11px `#C5CCD6`
- Locked (with progress): mini progress bar + "{progress}/{target}", 11px `#6B7A8D`

**Mini progress bar** (when `earned === false && progress != null`):
- Height: 4px, `#F0F2F5` track, `{color}` fill (even though locked, show color-tinted progress)
- Width: `{progress/target * 100}%`
- Below bar: "{progress} / {target}" text, 10.5px `#6B7A8D`, margin-top 4px

**Earned checkmark:**
- Small 14px green checkmark circle overlay at top-right of icon circle
- `#3DAB82` background, white check icon 8px

---

## Unit tests

**`components/insights/AchievementsPanel.test.tsx`**
- Renders all badges
- Earned badges have date shown
- Locked badges without progress show no bar
- Locked badges with progress show progress bar
- Correct earned count in sub-text
- Loading: skeleton grid

---

## Acceptance criteria

- [x] `pnpm build` passes
- [x] Grid shows all badges (earned + locked)
- [x] Earned badges: colored icon, date earned, green checkmark
- [x] Locked badges: grayscale icon
- [x] Locked badges with progress show progress bar
- [x] Badge count sub-text correct
- [x] Responsive: 4 columns → 2 columns below 640px
- [x] All tests pass

---

## Quality gates
- [x] `pnpm build` zero errors
- [x] `pnpm lint` zero warnings
- [x] `pnpm test` green
- [x] PR: `feat(T018): AchievementsPanel — badge grid with progress`
