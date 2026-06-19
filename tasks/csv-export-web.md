# Task: Implement CSV Export in the Web App

## Goal

Wire up the "Export CSV" button on the trips page so it calls the backend export
endpoint and triggers a browser file download. The button currently shows a placeholder
`alert('CSV export coming soon')` — replace that with real logic.

---

## Background

- Repo root: `/Users/dipu/atmos/atmos-web`
- Framework: Next.js 15 App Router, TypeScript, React 19, Tailwind CSS
- All API calls go through `lib/api/client.ts`
- Auth token is stored in `localStorage` via helpers in `lib/auth.ts`
  - `getAccessToken()` returns the JWT string or `null`
- Backend base URL: `process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8081'`
- Design tokens: use `cn()` for class merging, Tailwind only, no inline styles

---

## The endpoint

```
GET /api/v1/activities/export
Authorization: Bearer <token>
```

**Response** — raw CSV, `Content-Type: text/csv; charset=utf-8`,
`Content-Disposition: attachment; filename="atmos_trips.csv"`.
The response is **not** wrapped in the JSON envelope `{ success, data }` that
other endpoints use. Do not use the existing `request<T>()` helper — it always
calls `response.json()`. Use `fetch()` directly for this endpoint.

**Optional query params** (not needed for the initial export button, which exports all):

| Param | Format | Description |
|---|---|---|
| `from` | `YYYY-MM-DD` | Filter start date (inclusive), applied to `date_local` |
| `to` | `YYYY-MM-DD` | Filter end date (inclusive), applied to `date_local` |

---

## What to change

Only one file needs to change: `app/(dashboard)/trips/page.tsx`.

### Current `ExportButton` (lines 46–58)

```tsx
function ExportButton() {
  return (
    <button
      type="button"
      data-testid="export-button"
      onClick={() => alert('CSV export coming soon')}
      className="flex items-center gap-1.5 rounded-lg border border-divider bg-white px-3 py-2 text-[13px] font-medium text-text-primary transition-colors hover:bg-bg-page"
    >
      <Download size={14} aria-hidden="true" />
      Export CSV
    </button>
  )
}
```

### Replace with

```tsx
function ExportButton() {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const token = getAccessToken()
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8081'
      const response = await fetch(`${baseUrl}/api/v1/activities/export`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!response.ok) throw new Error(`Export failed: ${response.status}`)

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'atmos_trips.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('CSV export failed', err)
      alert('Export failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      data-testid="export-button"
      onClick={handleExport}
      disabled={loading}
      className={cn(
        'flex items-center gap-1.5 rounded-lg border border-divider bg-white px-3 py-2 text-[13px] font-medium text-text-primary transition-colors hover:bg-bg-page',
        loading && 'cursor-not-allowed opacity-60',
      )}
    >
      <Download size={14} aria-hidden="true" />
      {loading ? 'Exporting…' : 'Export CSV'}
    </button>
  )
}
```

### Required imports to add

The file already imports `useState` and `Download`. You need to add two more imports:

1. `getAccessToken` from `@/lib/auth`
2. `cn` from `@/lib/utils`

The existing import block at the top of the file starts with:
```tsx
import { Suspense, useState, useEffect, useMemo } from 'react'
```

Add the two new named imports:
```tsx
import { getAccessToken } from '@/lib/auth'
import { cn } from '@/lib/utils'
```

---

## What NOT to do

- Do not add a new function to `lib/api/client.ts` — this is a one-off raw fetch, not
  a JSON API call, and doesn't belong in the typed client.
- Do not use `request<T>()` — it parses the response as JSON and will fail on CSV.
- Do not create a new component file — the change lives entirely inside `page.tsx`.
- Do not add date range inputs to the button at this stage — export all trips.

---

## Verification

```bash
# From /Users/dipu/atmos/atmos-web

pnpm build        # must pass — a type error means the task is not done
pnpm lint         # must pass
```

Manual test with the dev server:
```bash
pnpm dev          # requires atmos-core running on :8081
```
1. Log in and navigate to `/trips`
2. Click "Export CSV"
3. Button should show "Exporting…" and be disabled while the request is in flight
4. A file named `atmos_trips.csv` should download automatically
5. Open the file — verify it has a header row and trip rows, not JSON

---

## Commit

```
feat(trips): wire Export CSV button to backend /activities/export endpoint
```

Branch from latest `main`. Never push directly to `main`. Run `/code-review` before raising the PR.
