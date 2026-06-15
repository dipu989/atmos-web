# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
pnpm dev                        # dev server → localhost:3000
pnpm build                      # production build (run before every PR)
pnpm lint                       # ESLint
pnpm test                       # Vitest (--passWithNoTests set)
pnpm test path/to/file.test.tsx # single file
pnpm e2e                        # Playwright
```

Backend must be running: `cd ../atmos-core && make dev` (port 8081)

---

## Agent Rules

### Always
- Read the task file fully before writing any code
- Run `pnpm build` before marking a task done — a build failure means the task is not done
- Use design reference in `design/` for every UI component — pixel-perfect is the goal
- Check `../.context/api-spec.md` before writing any API call
- Use types from `types/index.ts` — never use `any`
- Use `cn()` for all conditional classNames
- Map `activity` → `trip` at the API client layer (`lib/api/client.ts`) — never expose backend terminology in UI

### Never
- Never create a new component if an existing one in `components/ui/` can be extended
- Never add a feature not listed in the task file
- Never use inline styles — Tailwind only
- Never hardcode colors — use design tokens from `tailwind.config.ts`
- Never commit `.env.local` or any secrets
- Never use `any` type — use `unknown` and narrow, or define the type
- Never leave unused imports
- Never skip loading and error states — every data-fetching component needs all three states: loading, error, empty

### When Uncertain
- If the design reference is missing for a component → stop, add a `## Blockers` section to the task file, notify
- If an API endpoint behaves differently than `api-spec.md` describes → document the discrepancy in the task file, use the actual behavior
- If a task requires touching code outside its defined scope → stop and ask, don't expand scope silently

---

## Architecture

**Stack:** Next.js 15 App Router · TypeScript · Tailwind CSS · TanStack Query · Recharts

**Data flow:**
```
Page → TanStack Query hook (lib/hooks/) → API fetcher (lib/api/client.ts) → atmos-core REST
```

Everything is client-side. No server components fetch data. All API calls go through `lib/api/client.ts`.

**Route groups:**
- `app/(auth)/` — login, signup. No sidebar layout.
- `app/(dashboard)/` — all protected pages. Shared sidebar + header layout.

**Providers** live in `app/providers.tsx`. Add new providers there only — never in `layout.tsx`.

**Auth:** JWT stored in `localStorage` keys `atmos_access_token` and `atmos_refresh_token`. On 401, clear tokens and redirect to `/login`. Auto-refresh is NOT implemented (deferred to production hardening — see `ROADMAP.md`).

---

## Component Rules

```
components/
  ui/           ← primitives (Button, Card, Badge). Extend these, don't duplicate.
  layout/       ← Sidebar, Header, PageShell
  dashboard/    ← dashboard-specific components
  charts/       ← ALL Recharts wrappers live here. Never import Recharts outside this folder.
  trips/        ← trips table, filters, row
  insights/     ← insight card variants by type
```

- If a component exceeds ~150 lines, split it
- Every component that fetches data must handle: loading skeleton, error state, empty state
- Empty state copy: "No [thing] yet" with a subtle illustration or icon

---

## API Client Rules

- Base URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:8081`)
- All protected endpoints require header: `Authorization: Bearer <token>`
- All routes are prefixed `/api/v1/` — see `../.context/api-spec.md` for full route list
- `activity` from the backend = `trip` in the UI — transform at the fetcher level
- Standard response envelope: `{ data: T, message: string }` — unwrap in fetcher, never in hooks

---

## Design Tokens

| Token | Value | Use |
|---|---|---|
| `horizon-blue` | #4A90C4 | Primary actions, links, active nav |
| `sage` | #3DAB82 | Eco-positive, low-emission, streaks |
| `peach` | #F0956A | Warnings, medium-emission |
| `alert-red` | #E05252 | Errors, high-emission, destructive |
| `bg-page` | #F5F7FA | Page background |
| `bg-card` | #FFFFFF | Card surfaces |
| `text-primary` | #1A2332 | Headings, body |
| `text-secondary` | #6B7A8D | Labels, captions |

Card pattern: `rounded-2xl shadow-card p-5`
Typography: `text-heading` (24px/600) · `text-subheading` (17px/600) · `text-body` (15px/400) · `text-label` (13px/500)

---

## Git Rules

Branch format: `feat/T00X-short-description`
One task = one branch = one PR. Never batch multiple tasks into one PR.

**Always start a task from latest main:**
```bash
git fetch origin main
git checkout -b feat/T00X-description origin/main
```

**Before pushing, fetch once more and rebase:**
```bash
git fetch origin main
git rebase origin/main   # resolve any conflicts that landed while you were working
pnpm test --run && pnpm build
git push --force-with-lease
```

### Commit message format

Commits are linted by commitlint on every PR (`commitlint.config.js`). Non-compliant messages will fail CI.

```
<type>(<scope>): <subject>
```

**Allowed types** (others will fail the pipeline):

| Type | When to use |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `perf` | Performance improvement |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `chore` | Maintenance, dependency bumps, config changes |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `ci` | CI/CD workflow changes |
| `revert` | Reverting a previous commit |

**Not allowed** (will fail CI): `build`, `style`

**Examples:**
```
feat(dashboard): add today impact card
fix(auth): handle 401 on token refresh
chore: upgrade pnpm to v11
refactor(trips): extract date grouping into util
test(timeline): add weekly aggregation test
```

---

## Path Aliases

`@/` = project root. Always use it. Never use relative `../../` imports.

---

## Decisions Log

| Decision | Choice | Reason | Revisit when |
|---|---|---|---|
| JWT storage | localStorage | Simpler for initial build | Before production — move to httpOnly cookies |
| Token expiry | Redirect to /login | Simpler for initial build | Before production — implement silent refresh |
| Data fetching | Client-side only | No SSR complexity | If SEO matters later |
| Activity naming | Map to "trip" in UI | UX clarity | If backend renames the resource |
