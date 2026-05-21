# T003 — App Layout Shell

**Branch:** `feat/T003-app-layout`
**Status:** ✅ Done
**Depends on:** T002 merged to main

---

## Context files to read first
- `CLAUDE.md` — component rules, design tokens, architecture
- `../.context/design-system.md` — color tokens, typography, sidebar specs

## Design reference
- `design/Atmos Frontend/shared.jsx` — exact Sidebar and Header implementation (pixel-perfect source)
- `design/Atmos Frontend/Dashboard.html` — full layout structure to reference in browser

---

## What to build

### Sidebar (`components/layout/Sidebar.tsx`)

Match `shared.jsx` exactly. Key measurements:
- Width: 240px, `flex-shrink-0`
- Background: `#FFFFFF`, right border `1px solid #F0F2F5`
- Padding: `24px 16px`
- Position: `sticky top-0 h-screen`

**Logo block** (top, padding `0 8px 28px`):
- 32×32 div, `border-radius: 9px`, gradient `135deg #4A90C4 → #3DAB82`
- White "a" text, Inter 700, 17px, letter-spacing -0.5px
- "atmos" wordmark: 18px, 600, `#1A2332`, letter-spacing -0.3px

**Nav items** (gap: 2px between items):
- Active: bg `rgba(74,144,196,0.10)`, color `#4A90C4`, weight 600
- Inactive: bg transparent, color `#6B7A8D`, weight 500
- Hover: bg `#F5F7FA`
- Padding: `10px 12px`, border-radius 10px
- Icon: 19px, colored same as text
- Font: Inter 14px
- Items: Dashboard → `/dashboard`, Trips → `/trips`, Analytics → `/analytics`, Insights → `/insights`, Settings → `/settings`
- Use Next.js `<Link>` and `usePathname()` to determine active item

**User block** (bottom, above border-top `#F0F2F5`):
- Avatar: 34×34 circle, bg `#E8DCC7`, color `#5A4A2A`, initials from `getStoredUser().name`
- Name: 13.5px 600 `#1A2332`
- Sub-label: 11.5px `#6B7A8D` — show "Free plan"

**Mobile behavior:**
- Below `lg` breakpoint (1024px): sidebar hidden by default
- Show a hamburger `☰` icon in the header that toggles a drawer overlay
- Drawer slides in from left over the content (z-index 50, backdrop overlay)

### Header (`components/layout/Header.tsx`)

Match `shared.jsx` Header component:
- Height implied: padding `20px 36px`
- Background: `#F5F7FA`, bottom border `1px solid #F0F2F5`
- Position: `sticky top-0 z-4`
- Left: `<h1>` 24px 600 `#1A2332` (page title via prop), optional subtitle 13px `#6B7A8D`
- Right: optional `rightExtra` slot (for page-specific buttons) + optional date-range picker

**Date range picker** (when `showRangePicker` prop is true):
- Button: white bg, border `#F0F2F5`, rounded-lg, 13px 500 `#1A2332`
- Calendar icon + selected label + chevron-down icon
- Dropdown: `["Today", "This week", "This month", "Last 30 days", "This year"]`
- Controlled: `value` + `onChange` props
- Mobile: display below title on smaller screens (stack vertically)

**Mobile hamburger:**
- Show `<Menu>` icon (lucide-react) at left of header on `< lg` screens
- Clicking opens the sidebar drawer

### Page Shell (`components/layout/PageShell.tsx`)

Wrapper component that pages import instead of writing layout boilerplate:
```tsx
interface PageShellProps {
  title: string
  subtitle?: string
  rangePicker?: { value: string; onChange: (v: string) => void }
  rightExtra?: React.ReactNode
  children: React.ReactNode
}
```
- Renders `<Header>` with title/subtitle/rangePicker/rightExtra
- Renders `<main>` with `padding: 32px 36px`, `display: flex`, `flex-direction: column`, `gap: 20px`
- Background: `#F5F7FA`

### Layout wiring (`app/(dashboard)/layout.tsx`)

Replace the stub from T002 with real implementation:
```tsx
'use client'
// auth guard (from T002) + render Sidebar + main content area
// Structure:
// <div className="flex h-screen overflow-hidden">
//   <Sidebar />
//   <div className="flex-1 flex flex-col overflow-y-auto">
//     {children}
//   </div>
// </div>
```

### Icon mapping (`components/layout/NavIcon.tsx` or inline in Sidebar)

Map nav item icon names to lucide-react icons:
- `dashboard` → `LayoutDashboard`
- `trips` → `Route`
- `analytics` → `BarChart2`
- `insights` → `Lightbulb`
- `settings` → `Settings`

---

## Unit tests

**`components/layout/Sidebar.test.tsx`**
- Renders all 5 nav items
- Active item has correct aria attributes (or data-active)
- User initials derived from stored user name
- Mobile: hamburger not visible at desktop breakpoint (mock usePathname)

**`components/layout/Header.test.tsx`**
- Renders title
- Renders subtitle when provided
- Renders rightExtra when provided
- Range picker shows dropdown on click

---

## Acceptance criteria

- [x] `pnpm build` passes
- [x] Sidebar visible at 1440px, all 5 nav items with correct icons
- [x] Active nav item highlighted correctly (matches current route)
- [x] User initials shown in sidebar footer
- [x] Date-range picker dropdown opens/closes
- [x] Mobile: sidebar hidden by default at <1024px, hamburger opens drawer
- [x] Dashboard stub page renders with layout (no console errors)
- [x] All unit tests pass

---

## Quality gates
- [x] `pnpm build` zero errors
- [x] `pnpm lint` zero warnings
- [x] `pnpm test` green
- [x] PR: `feat(T003): app layout — sidebar, header, page shell, mobile nav`
