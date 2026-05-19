# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server at localhost:3000
pnpm build        # Production build
pnpm lint         # ESLint via Next.js
pnpm test         # Vitest unit/component tests
pnpm test:ui      # Vitest with browser UI
pnpm e2e          # Playwright end-to-end tests
pnpm e2e:debug    # Playwright with inspector
```

Run a single test file:
```bash
pnpm test path/to/file.test.tsx
```

## Architecture

This is a **Next.js 15 App Router** project. All pages live in `app/` and follow the file-system routing convention. The `(auth)` folder is a route group — it doesn't add a URL segment.

**Data flow:** Pages and components call TanStack Query hooks from `lib/hooks/useApi.ts`, which in turn call typed fetchers on the `api` object in `lib/api/client.ts`. The client reads `NEXT_PUBLIC_API_URL` (default `http://localhost:8080`) and hits the `atmos-core` REST backend. There is no server-side data fetching yet — everything is client-side React Query.

**Global providers** are in `app/providers.tsx` (QueryClientProvider). Cache is set to 5-minute stale / 10-minute gc. Add new providers here, not in `layout.tsx`.

**Component conventions:**
- `components/ui/` — primitive, reusable components (Button, Card). Button uses `cva` for variants; always extend via the `variant` and `size` props rather than ad-hoc className overrides.
- `components/dashboard/` and `components/charts/` — domain components to be built out. Keep chart wrappers in `charts/` so Recharts imports are isolated.
- Use `cn()` from `lib/utils.ts` for all conditional className merging.

**Types** in `types/index.ts` mirror the `atmos-core` backend models. `TransportMode` and `InsightType` are enums; prefer them over raw strings throughout.

**Formatters** in `lib/utils.ts`: `formatKgCO2`, `formatDistance`, `formatDuration`, `percentChange` — use these everywhere CO₂/distance/time values are displayed.

## Design tokens

All tokens are in `tailwind.config.ts`. Use semantic names in JSX:

| Purpose | Token |
|---|---|
| Primary action / links | `horizon-blue` |
| Eco-positive / low-emission | `sage` |
| Warnings / medium-emission | `peach` |
| Errors / high-emission | `alert-red` |
| Page background | `bg-page` |
| Card surface | `bg-card` |
| Body text | `text-primary` |
| Secondary/label text | `text-secondary` |

Card style: `rounded-2xl shadow-card p-5` (radius 16px, 20px padding).

Typography classes: `text-heading`, `text-subheading`, `text-body`, `text-label` — defined as custom font sizes in the Tailwind config.

## Path aliases

`@/` maps to the project root. Use it for all imports (e.g. `@/lib/utils`, `@/types`).

## Environment

Copy `.env.example` → `.env.local`. The only required variable is `NEXT_PUBLIC_API_URL`. The `atmos-core` backend must be running locally for API calls to work; pages currently use placeholder/mock data until connected.
