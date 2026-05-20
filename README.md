<h1 align="center">Atmos Web</h1>
<img width="1973" height="797" alt="atmos web" src="https://github.com/user-attachments/assets/280c4cd6-6e58-49fd-9307-36dfeb5c58fd" />


Web frontend for Atmos — a personal carbon footprint tracker that automatically detects and logs commute trips via the companion mobile app.

The web app is built for **deep data exploration and management**. Trip logging happens on mobile (auto-detected via location); the web provides the dashboard, history, analytics, and settings that benefit from a larger screen.

---

## Features

| Screen | Description |
|---|---|
| **Dashboard** | Summary stats, weekly CO₂ trend chart, transport breakdown, recent trips, and insights feed |
| **Trips** | Full sortable/filterable trip history with date range picker, mode filter, and CSV export |
| **Analytics** | Monthly and yearly CO₂ trends, mode-by-mode breakdown over time, goal trajectory |
| **Insights** | Streaks, tips, milestones, comparisons, and anomaly alerts |
| **Settings** | Profile, daily goal, commute defaults, appearance, notification preferences, data export, account management |

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) | Production-grade React framework with built-in routing, SSR, and optimization. Learning React within an opinionated structure. |
| Language | [TypeScript](https://www.typescriptlang.org) | Type safety, better IDE support, catches errors at compile time. |
| Styling | [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS. Rapid prototyping, consistent design system tokens, mobile-first by default. |
| Component Library | [shadcn/ui](https://ui.shadcn.com) | Pre-built, copy-paste React components built on Radix UI primitives. Accessible, customizable, production-ready. |
| State & Data | [TanStack Query (React Query)](https://tanstack.com/query) | Server state management, caching, background refetching, DevTools. Handles API fetching elegantly. |
| Charts | [Recharts](https://recharts.org) | Declarative React chart library, composable, responsive, optimized for dashboards. |
| Testing | [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com) | Fast unit/component testing with familiar Jest API. |
| E2E Testing | [Playwright](https://playwright.dev) | Cross-browser E2E testing, visual regression, CI-friendly. |
| Package Manager | [pnpm](https://pnpm.io) | Faster, more disk-efficient than npm. Strict dependency resolution. |
| Auth | JWT (issued by `atmos-core`) | Stateless auth, secure token refresh, mobile/web compatible. |
| API | REST — `atmos-core` backend | Type-safe fetchers with TanStack Query. |

### Learning Path

1. **React Fundamentals** (Next.js App Router, JSX, hooks, state)
2. **Styling** (Tailwind CSS utility classes, responsive design)
3. **Data Fetching** (TanStack Query, API integration, loading states)
4. **UI Components** (shadcn/ui, Radix, accessibility)
5. **TypeScript** (gradual adoption, type inference, generics)
6. **Charts & Visualization** (Recharts, responsive dashboards)
7. **Testing** (Vitest + RTL, component tests; Playwright for E2E)

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- `atmos-core` running locally (see [`../atmos-core/README.md`](../atmos-core/README.md))

### Install and run

```bash
cd atmos-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=Atmos
```

---

## Project Structure

```
atmos-web/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Login, sign up, forgot password
│   ├── dashboard/        # Main dashboard
│   ├── trips/            # Trip history
│   ├── analytics/        # Charts and trends
│   ├── insights/         # Insight cards
│   └── settings/         # Profile and preferences
├── components/
│   ├── ui/               # Primitive components (Button, Card, Badge …)
│   ├── charts/           # Recharts wrappers (TrendLine, DonutChart …)
│   ├── trips/            # Trip table, filters, row components
│   └── insights/         # Insight card variants by type
├── lib/
│   ├── api/              # API client and typed fetchers
│   ├── hooks/            # Shared React hooks
│   └── utils/            # Formatters, CO₂ calculations, date helpers
├── types/                # Shared TypeScript types (mirrors atmos-core models)
└── public/               # Static assets
```

---

## Design System

Atmos web shares the same visual language as the mobile app.

### Colors

| Token | Hex | Usage |
|---|---|---|
| `horizon-blue` | `#4A90C4` | Primary actions, links, active states |
| `sage` | `#3DAB82` | Eco-positive, low-emission, streaks |
| `peach` | `#F0956A` | Warnings, medium-emission modes |
| `alert-red` | `#E05252` | Errors, high-emission, destructive actions |
| `bg-page` | `#F5F7FA` | Page background |
| `bg-card` | `#FFFFFF` | Card surfaces |
| `text-primary` | `#1A2332` | Headings and body copy |
| `text-secondary` | `#6B7A8D` | Labels, secondary copy |
| `divider` | `#F0F2F5` | Borders and separators |

### Typography

- **Font:** Inter
- **Heading:** 24px / SemiBold
- **Subheading:** 17px / SemiBold
- **Body:** 15px / Regular
- **Label:** 13px / Medium

### Cards

- Border radius: 16px
- Box shadow: `0 1px 3px rgba(0, 0, 0, 0.08)`
- Padding: 20px

---

## Related Projects

| Project | Description |
|---|---|
| [`atmos-mobile`](../atmos-mobile) | KMP mobile app (Android + iOS) |
| [`atmos-core`](../atmos-core) | Backend API |

---

## License

Private — Atmos
