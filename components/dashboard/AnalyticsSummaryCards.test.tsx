// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { AnalyticsSummaryCards } from '@/components/dashboard/AnalyticsSummaryCards'
import type { MonthlySummary, WeeklySummary } from '@/types/index'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/hooks/useTrips', () => ({
  useWeeklySummaries: vi.fn(),
  useMonthlySummaries: vi.fn(),
}))

import {
  useWeeklySummaries,
  useMonthlySummaries,
} from '@/lib/hooks/useTrips'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// biome-ignore lint: test helper — partial mock is intentional
function q<T>(data: T, isLoading = false, isError = false): ReturnType<typeof useMonthlySummaries> {
  return { data, isLoading, isError, error: isError ? new Error('fail') : null }
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockMonthly: MonthlySummary[] = [
  {
    id: 'm1',
    userId: 'u1',
    year: 2026,
    month: 5,
    totalKgCo2e: 36.0,
    totalDistanceKm: 180.0,
    activityCount: 12,
    breakdown: {},
    computedAt: '2026-05-22T00:00:00Z',
    trend: { prev_total_kg_co2e: 40, change_pct: -10, direction: 'down' },
  },
]

const mockWeekly: WeeklySummary[] = [
  {
    id: 'w1',
    userId: 'u1',
    weekStart: '2026-05-18',
    weekEnd: '2026-05-24',
    totalKgCo2e: 9.0,
    totalDistanceKm: 45.0,
    activityCount: 3,
    breakdown: {},
    computedAt: '2026-05-22T00:00:00Z',
    trend: { prev_total_kg_co2e: 10, change_pct: -10, direction: 'down' },
  },
]

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AnalyticsSummaryCards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders 4 skeleton cards while loading', () => {
    vi.mocked(useWeeklySummaries).mockReturnValue(q(undefined, true))
    vi.mocked(useMonthlySummaries).mockReturnValue(q(undefined, true))

    render(<AnalyticsSummaryCards />)

    const skeletons = screen.getAllByTestId('analytics-card-skeleton')
    expect(skeletons).toHaveLength(4)
  })

  it('renders 4 cards with data when loaded', () => {
    vi.mocked(useWeeklySummaries).mockReturnValue(q(mockWeekly))
    vi.mocked(useMonthlySummaries).mockReturnValue(q(mockMonthly))

    render(<AnalyticsSummaryCards />)

    expect(screen.getByText('Total trips')).toBeInTheDocument()
    expect(screen.getByText('Total distance')).toBeInTheDocument()
    expect(screen.getByText('Total CO₂')).toBeInTheDocument()
    expect(screen.getByText('Avg per trip')).toBeInTheDocument()
  })

  it('renders correct values from monthly data', () => {
    vi.mocked(useWeeklySummaries).mockReturnValue(q(mockWeekly))
    vi.mocked(useMonthlySummaries).mockReturnValue(q(mockMonthly))

    render(<AnalyticsSummaryCards />)

    // totalTrips = 12
    expect(screen.getByText('12')).toBeInTheDocument()
    // totalDistanceKm = 180.0
    expect(screen.getByText('180.0')).toBeInTheDocument()
    // totalCo2 = 36.0
    expect(screen.getByText('36.0')).toBeInTheDocument()
    // avgPerTrip = 36/12 = 3.00
    expect(screen.getByText('3.00')).toBeInTheDocument()
  })

  it('shows error state when query fails', () => {
    vi.mocked(useWeeklySummaries).mockReturnValue(q(undefined, false, true))
    vi.mocked(useMonthlySummaries).mockReturnValue(q(undefined, false, true))

    render(<AnalyticsSummaryCards />)

    const errorTexts = screen.getAllByText('Data unavailable')
    expect(errorTexts).toHaveLength(4)

    const dashes = screen.getAllByText('—')
    expect(dashes).toHaveLength(4)
  })

  it('renders 4 cards in a grid', () => {
    vi.mocked(useWeeklySummaries).mockReturnValue(q(mockWeekly))
    vi.mocked(useMonthlySummaries).mockReturnValue(q(mockMonthly))

    const { container } = render(<AnalyticsSummaryCards />)

    const grid = container.firstChild as HTMLElement
    expect(grid.className).toContain('grid-cols-4')
    expect(grid.className).toContain('gap-4')
  })
})
