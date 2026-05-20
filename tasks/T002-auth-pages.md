# T002 — Auth Pages

**Branch:** `feat/T002-auth-pages`
**Status:** ⬜ Todo
**Depends on:** T001 merged to main

---

## Context files to read first
- `../.context/auth-flow.md` — JWT storage, redirect logic, localStorage keys
- `../.context/api-spec.md` — POST /auth/login, POST /auth/signup endpoints
- `CLAUDE.md` — Always/Never rules, route group structure
- `types/index.ts` (from T001) — LoginRequest, SignupRequest, AuthResponse types

---

## Design reference
- No specific page design exists for auth — build a clean, minimal auth layout consistent with the design system
- Logo: 32×32 gradient div (135deg, `#4A90C4` → `#3DAB82`) with white "a", Inter 700 17px
- Background: `#F5F7FA` (bg-page token)
- Card: centered, max-width 400px, `rounded-2xl shadow-card p-8 bg-white`
- Input style: full-width, border `#F0F2F5`, rounded-lg, focus border `#4A90C4`, 14px Inter
- Button: full-width, `bg-[#4A90C4] text-white rounded-xl py-2.5 font-semibold text-sm hover:bg-[#3d7aaa]`
- Error state: red-50 background, border-red-200, `text-[#E05252]` 13px

---

## What to build

### Files to create

**`app/(auth)/layout.tsx`**
- No sidebar, no header — just centered content on `#F5F7FA` background
- Full viewport height, flex center

**`app/(auth)/login/page.tsx`**
- Logo + "atmos" wordmark centered at top
- Card with: Email input, Password input, "Sign in" button (full-width, blue)
- Below button: "Don't have an account? Sign up" link → `/signup`
- On submit: call `login()` from `lib/api/client.ts`, then `setAuth(...)`, then `router.push('/')`
- Loading state: button shows spinner + "Signing in…" text, both inputs disabled
- Error state: show error message below button in red (catch API errors)
- If already authenticated (`isAuthenticated()` is true), redirect to `/` on mount

**`app/(auth)/signup/page.tsx`**
- Logo + "atmos" wordmark centered at top
- Card with: Full name input, Email input, Password input (min 8 chars), "Create account" button
- Below: "Already have an account? Sign in" link → `/login`
- On submit: call `signup()`, then `setAuth(...)`, then `router.push('/')`
- Same loading/error states as login page

**`middleware.ts`** (project root, not in app/)
- Protect all routes under `/(dashboard)` — redirect to `/login` if no token in localStorage
- Note: middleware runs on the server and can't access localStorage. Use cookies as an alternative OR simply rely on client-side guard in the layout. For this task: implement the client-side guard only (localStorage approach), not Next.js middleware.

**`app/(dashboard)/layout.tsx`** — client guard:
- On mount: call `isAuthenticated()` — if false, `router.push('/login')`
- While checking: show full-page loading spinner
- If authenticated: render `<SidebarLayout>` (stub it — T003 implements it)

**`components/ui/Input.tsx`** — reusable input primitive:
```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}
```
- Label above input if provided
- Red border + error message below if `error` prop set
- Use `cn()` for conditional classes

**`components/ui/Button.tsx`** — reusable button:
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}
```
- `primary`: blue fill, white text
- `secondary`: white fill, border, dark text
- `ghost`: no border, subtle hover
- `destructive`: red fill
- `loading`: show spinner SVG + disable, prevent double-submit

**`app/page.tsx`** — redirect only:
```tsx
// app/page.tsx
import { redirect } from 'next/navigation'
export default function RootPage() { redirect('/dashboard') }
```

**`app/(dashboard)/dashboard/page.tsx`** — stub only for now:
```tsx
export default function DashboardPage() {
  return <div className="p-6 text-[#1A2332]">Dashboard (T009)</div>
}
```

---

## Unit tests

**`app/(auth)/login/page.test.tsx`**
- Renders email and password inputs
- Submit calls `login()` with correct credentials
- Shows loading state during submission
- Shows error message when login fails
- Redirects on success (mock `router.push`)

**`components/ui/Input.test.tsx`**
- Renders label when provided
- Shows error text and red border when `error` prop set

**`components/ui/Button.test.tsx`**
- Renders children
- Disables and shows spinner when `loading={true}`
- Calls onClick handler
- Applies correct variant class

---

## Acceptance criteria

- [ ] `pnpm build` passes
- [ ] `/login` renders with email, password, submit button
- [ ] `/signup` renders with name, email, password, submit button
- [ ] Successful login stores tokens in localStorage and redirects to `/dashboard`
- [ ] Already-authenticated users redirect away from `/login`
- [ ] Unauthenticated users redirect to `/login` from `/dashboard`
- [ ] Error states display correctly
- [ ] All unit tests pass

---

## Quality gates
- [ ] `pnpm build` zero errors
- [ ] `pnpm lint` zero warnings
- [ ] `pnpm test` green
- [ ] PR: `feat(T002): auth pages — login, signup, route guard`
