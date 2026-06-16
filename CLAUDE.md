# atmos-web

Next.js 15 App Router, TypeScript, Tailwind, TanStack Query, Recharts. All data-fetching is client-side — no server components fetch data.

## Commands

```bash
pnpm dev              # localhost:3000 (backend must be running on :8081)
pnpm build            # run before every PR — a build failure means the task is not done
pnpm lint             # ESLint
pnpm test             # Vitest
pnpm e2e              # Playwright
```

Backend: `cd ../atmos-core && make dev`

## Commits — enforced by commitlint in CI

```
<type>(<scope>): <subject>
```

Allowed: `feat` `fix` `perf` `refactor` `chore` `docs` `test` `ci` `revert`  
**Not allowed (fail CI):** `build` `style`

## Rules

- Never push to `main`. Branch → PR always. One task = one branch = one PR.
- Read the task file in `tasks/` fully before writing any code. Stop if design reference is missing — add a `## Blockers` note to the task file.
- Check `../.context/api-spec.md` before writing any API call.
- `activity` (backend term) → `trip` (UI term). Transform at the fetcher level in `lib/api/client.ts`. Never let backend terminology reach components.
- Use types from `types/index.ts`. No `any` — use `unknown` and narrow, or define the type.
- `cn()` for all conditional classNames. Tailwind only — no inline styles, no hardcoded colors.
- Never import Recharts outside `components/charts/`.
- Every data-fetching component needs all three states: loading skeleton, error, empty.
- Never create a new primitive if one in `components/ui/` can be extended.
- `@/` path alias always. No relative `../../` imports.

## Non-obvious gotchas

**Auth** — JWT in `localStorage` (`atmos_access_token`, `atmos_refresh_token`). On 401, clear tokens and redirect `/login`. Silent refresh is not implemented.

**Providers** go in `app/providers.tsx` only — never in `layout.tsx`.

**Response envelope** — `{ data: T, message: string }`. Unwrap in the fetcher (`lib/api/client.ts`), never in hooks or components.

## Design tokens (don't hardcode hex values)

`horizon-blue` · `sage` · `peach` · `alert-red` · `bg-page` · `bg-card` · `text-primary` · `text-secondary`  
Card: `rounded-2xl shadow-card p-5` · Type scale: `text-heading` `text-subheading` `text-body` `text-label`
