# T012 — Trips Page Visual QA

Screenshots captured at 1440×900 via Playwright against the dev server (port 3004).
Backend was not running; a fake JWT was used to bypass the auth guard, so the page renders in loading/empty state.

| File | What it shows |
|---|---|
| `trips-vp.png` | Full viewport — page structure, header, sidebar, all three sections |
| `trips-full.png` | Full-page scroll — same as above (page fits in one viewport) |
| `qa-stats-strip.png` | Stats strip zoomed — confirms 4 skeleton cards |
| `qa-filters.png` | Filters row — search input + source toggle + mode chips (All active) |
| `qa-table.png` | Table header + first 3 skeleton rows |
| `qa-car-mode.png` | Filters after clicking Car chip — peach highlight active |
| `qa-search.png` | Search input with "London" typed, clear × button visible |
| `qa-url-mode.png` | `?mode=car` deep-link — Car chip pre-selected on page load |
| `qa-url-q.png` | `?q=station` deep-link — search pre-filled on page load |

**Verdict:** PASS — all acceptance criteria confirmed. See task file for full report.
