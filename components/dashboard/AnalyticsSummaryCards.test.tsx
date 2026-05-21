// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { AnalyticsSummaryCards } from '@/components/dashboard/AnalyticsSummaryCards'
import type { DailySummary } from '@/types/index'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/hooks/useTrips', () => ({
  useDailySummaries: vi.fn(),
}))

import { useDailySummaries } from '@/lib/hooks/useTrips'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// biome-ignore lint: test helper — partial mock is intentional
function q<T>(data: T, isLoading = false, isError = false): ReturnType<typeof useDailySummaries> {
  return { data, isLoading, isError, error: isError ? new Error('fail') : null }
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockDaily: DailySummary[] = [
  {
    id: 'd1',
    userId: 'u1',
    dateLocal: '2026-05-01',
    totalKgCo2e: 18.0,
    totalDistanceKm: 90.0,
    activityCount: 6,
    breakdown: {},
    computedAt: '2026-05-01T00:00:00Z',
    trend: { prev_total_kg_co2e: 20, change_pct: -10, direction: 'down' },
  },
  {
    id: 'd2',
    userId: 'u1',
    dateLocal: '2026-05-02',
    totalKgCo2e: 18.0,
    totalDistanceKm: 90.0,
    activityCount: 6,
    breakdown: {},
    computedAt: '2026-05-02T00:00:00Z',
    trend: { prev_total_kg_co2e: 20, change_pct: -10, direction: 'down' },
  },
]

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AnalyticsSummaryCards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders 4 skeleton cards while loading', () => {
    vi.mocked(useDailySummaries).mockReturnValue(q(undefined, true))

    render(<AnalyticsSummaryCards />)

    const skeletons = screen.getAllByTestId('analytics-card-skeleton')
    expect(skeletons).toHaveLength(4)
  })

  it('renders 4 cards with data when loaded', () => {
    vi.mocked(useDailySummaries).mockReturnValue(q(mockDaily))

    render(<AnalyticsSummaryCards />)

    expect(screen.getByText('Total trips')).toBeInTheDocument()
    expect(screen.getByText('Total distance')).toBeInTheDocument()
    expect(screen.getByText('Total CO₂')).toBeInTheDocument()
    expect(screen.getByText('Avg per trip')).toBeInTheDocument()
  })

  it('renders correct values derived from daily summaries', () => {
    vi.mocked(useDailySummaries).mockReturnValue(q(mockDaily))

    render(<AnalyticsSummaryCards />)

    // totalTrips = 6 + 6 = 12
    expect(screen.getByText('12')).toBeInTheDocument()
    // totalDistanceKm = 90 + 90 = 180.0
    expect(screen.getByText('180.0')).toBeInTheDocument()
    // totalCo2 = 18 + 18 = 36.0
    expect(screen.getByText('36.0')).toBeInTheDocument()
    // avgPerTrip = 36 / 12 = 3.00
    expect(screen.getByText('3.00')).toBeInTheDocument()
  })

  it('shows error state when query fails', () => {
    vi.mocked(useDailySummaries).mockReturnValue(q(undefined, false, true))

    render(<AnalyticsSummaryCards />)

    const errorTexts = screen.getAllByText('Data unavailable')
    expect(errorTexts).toHaveLength(4)

    const dashes = screen.getAllByText('—')
    expect(dashes).toHaveLength(4)
  })

  it('renders 4 cards in a grid', () => {
    vi.mocked(useDailySummaries).mockReturnValue(q(mockDaily))

    const { container } = render(<AnalyticsSummaryCards />)

    const grid = container.firstChild as HTMLElement
    expect(grid.className).toContain('grid-cols-4')
    expect(grid.className).toContain('gap-4')
  })

  it('accepts a period prop and renders the period label', () => {
    vi.mocked(useDailySummaries).mockReturnValue(q(mockDaily))

    render(<AnalyticsSummaryCards period="3m" />)

    expect(screen.getAllByText('Last 3 months').length).toBeGreaterThan(0)
  })
})
