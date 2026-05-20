# T020 — Settings Page

**Branch:** `feat/T020-settings-page`
**Status:** ⬜ Todo
**Depends on:** T003 merged to main

---

## Context files to read first
- `CLAUDE.md` — component rules, design tokens
- `../.context/api-spec.md` — GET/PUT /users/me, GET/PUT /users/preferences
- `types/index.ts` — User, Preferences types

## Design reference
- `design/Atmos Frontend/settings.jsx` — full `SettingsPage` component + all section components
- `design/Atmos Frontend/forms.jsx` — `TextInput`, `Select`, `Toggle`, `Segmented`, `Slider`, `Button`, `SettingsSection`, `FormRow` primitives
- `design/Atmos Frontend/Settings.html` — open in browser to see final visual target

---

## What to build

The Settings page with a left sub-navigation and section panels. Implement Profile and Goals sections fully (they connect to real API). Others are UI-only stubs.

### `app/(dashboard)/settings/page.tsx`

```tsx
'use client'
const [activeSection, setActiveSection] = useState('profile')
```

**Layout** (two-column):
```
<PageShell title="Settings">
  <div className="grid grid-cols-[220px_1fr] gap-6">
    <SettingsSubNav active={activeSection} onChange={setActiveSection} />
    <div>
      {activeSection === 'profile'       && <ProfileSection />}
      {activeSection === 'goals'         && <GoalsSection />}
      {activeSection === 'notifications' && <NotificationsSection />}
      {activeSection === 'privacy'       && <PrivacySection />}
      {activeSection === 'connections'   && <ConnectionsSection />}
      {activeSection === 'billing'       && <BillingSection />}
      {activeSection === 'account'       && <AccountSection />}
    </div>
  </div>
</PageShell>
```

### `components/settings/SettingsSubNav.tsx`

Match `settings.jsx` `SubNav`:
- 7 items: Profile, Goals & tracking, Notifications, Privacy & data, Connected apps, Plan & billing, Account
- Active: `rgba(74,144,196,0.10)` bg, `#4A90C4` text 600, icon colored
- Inactive: transparent, `#6B7A8D` 500
- `border-radius: 9px`, padding `9px 12px`, `font-size: 13.5px`

### `components/settings/SettingsSection.tsx`

Wrapper for each settings panel (match `forms.jsx` `SettingsSection`):
```tsx
interface SettingsSectionProps {
  title: string
  description?: string
  footer?: React.ReactNode  // Save/Cancel buttons
  children: React.ReactNode
}
```
- White card, `rounded-2xl`, padding `28px 32px`
- Title: 17px 600 `#1A2332`
- Description: 13px `#6B7A8D` margin-top 4px
- Content: separated by dividers
- Footer: sticky at bottom, right-aligned, `padding: 16px 0 0`, border-top `#F0F2F5`

### `components/settings/FormRow.tsx`

```tsx
interface FormRowProps {
  label: string
  hint?: string
  divider?: boolean
  children: React.ReactNode
}
```
- 2-column grid: label (140px) | control
- Label: 14px 500 `#1A2332`
- Hint: 12px `#6B7A8D` margin-top 2px
- Divider below (default true): 1px `#F0F2F5`
- Padding: `18px 0`

### Form primitives (create in `components/ui/` — reuse or extend existing Button/Input):

**`components/ui/Select.tsx`** — styled native `<select>`:
- Width 280px, height 36px, border `#F0F2F5`, `border-radius: 9px`, 13px

**`components/ui/Toggle.tsx`** — toggle switch:
- 40×22px track, 18px thumb circle
- On: `#4A90C4` track; Off: `#C5CCD6` track
- Animated thumb slide

**`components/ui/Segmented.tsx`** — segmented control:
- Already used in T003 Header — ensure it's extracted to `components/ui/`
- `{ value, onChange, options: { value, label }[] }`

**`components/ui/Slider.tsx`** — range slider:
- Custom-styled `<input type="range">`
- Track: `#F0F2F5`, filled: `#4A90C4`
- Thumb: 18px circle, white bg, `#4A90C4` border

### Profile Section (`components/settings/ProfileSection.tsx`)

Fully wired to API — matches `settings.jsx` `ProfileSection`:
- Avatar upload (UI only — no real upload, show "coming soon" toast)
- Full name input → PUT /users/me `{ name }`
- Email input → read-only, shows "Verified" badge
- City input → PUT /users/me `{ city }` (if backend supports, else store locally)
- Time zone select → PUT /users/preferences
- Distance unit segmented (km / mi) → PUT /users/preferences

**Save button behavior**: collect all changed fields, send one API call, show success toast "Changes saved" or error toast

### Goals Section (`components/settings/GoalsSection.tsx`)

Wired to API:
- Daily CO₂ goal slider: 1–10 kg, step 0.5, shows current value → PUT /users/preferences `{ daily_goal_kg }`
- Toggle: "Remind me if I haven't logged by 9pm" → PUT /users/preferences `{ notifications_enabled }`
- Match `settings.jsx` `GoalsSection` layout

### Stub sections (render placeholder card)

Notifications, Privacy, Connected apps, Plan & billing, Account sections: render a `SettingsSection` with title + description + "Coming soon" placeholder content. No API calls.

---

## Unit tests

**`components/settings/SettingsSubNav.test.tsx`**
- Renders all 7 nav items
- Active item has correct class

**`components/settings/FormRow.test.tsx`**
- Renders label and children
- Shows hint when provided
- Divider present by default

**`components/ui/Toggle.test.tsx`**
- Renders in off state
- Clicking calls onChange
- Visual state reflects value

**`components/settings/ProfileSection.test.tsx`**
- Renders all fields
- Submit sends PUT /users/me
- Error shows error message

---

## Acceptance criteria

- [ ] `pnpm build` passes
- [ ] Settings page loads at `/settings`
- [ ] Sub-nav with 7 sections
- [ ] Clicking each nav item shows corresponding section
- [ ] Profile section: name, email, city, timezone, unit inputs
- [ ] Goals section: daily goal slider + notification toggle
- [ ] Saving profile sends API call
- [ ] Save button disabled while submitting
- [ ] Success/error feedback shown
- [ ] Stub sections render placeholder
- [ ] Visual matches `Settings.html` reference

---

## Quality gates
- [ ] `pnpm build` zero errors
- [ ] `pnpm lint` zero warnings
- [ ] `pnpm test` green
- [ ] Visual QA: compare against `design/Atmos Frontend/Settings.html`
- [ ] PR: `feat(T020): settings page — profile, goals, sub-navigation`
