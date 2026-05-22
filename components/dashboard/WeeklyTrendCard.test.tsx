// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { WeeklyTrendCard } from '@/components/dashboard/WeeklyTrendCard'
import type { DailySummary, Preferences } from '@/types/index'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/hooks/useTrips', () => ({
  useDailySummaries: vi.fn(),
  usePreferences: vi.fn(),
}))

vi.mock('@/components/charts/WeeklyTrendChart', () => ({
  WeeklyTrendChart: ({
    data,
    goal,
  }: {
    data: { day: string; date: string; co2_kg: number }[]
    goal: number
  }) => (
    <div
      data-testid="weekly-trend-chart"
      data-point-count={data.length}
      data-goal={goal}
    />
  ),
}))

import { useDailySummaries, usePreferences } from '@/lib/hooks/useTrips'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// biome-ignore lint: test helper - partial mock is intentional
function q<T>(data: T, isLoading = false, isError = false): ReturnType<typeof useDailySummaries> {
  return { data, isLoading, isError, error: isError ? new Error('fail') : null }
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const mockDailySummaries: DailySummary[] = Array.from({ length: 7 }, (_, i) => ({
  id: `d${i}`,
  userId: 'u1',
  dateLocal: `2026-05-${String(16 + i).padStart(2, '0')}`,
  totalKgCo2e: 2 + i * 0.5,
  totalDistanceKm: 10 + i,
  activityCount: 2,
  breakdown: {},
  computedAt: '2026-05-22T00:00:00Z',
  trend: { prev_total_kg_co2e: 3, change_pct: null, direction: 'flat' as const },
}))

const mockPrefs: Preferences = {
  distance_unit: 'km',
  push_notifications_enabled: true,
  weekly_report_enabled: true,
  daily_goal_kg_co2e: 5.0,
  data_sharing_enabled: false,
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('WeeklyTrendCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows skeleton while loading', () => {
    vi.mocked(useDailySummaries).mockReturnValue(q(undefined, true))
    vi.mocked(usePreferences).mockReturnValue(q(undefined, true))

    render(<WeeklyTrendCard />)

    expect(screen.getByTestId('weekly-trend-skeleton')).toBeInTheDocument()
  })

  it('renders chart with data when loaded', () => {
    vi.mocked(useDailySummaries).mockReturnValue(q(mockDailySummaries))
    vi.mocked(usePreferences).mockReturnValue(q(mockPrefs))

    render(<WeeklyTrendCard />)

    const chart = screen.getByTestId('weekly-trend-chart')
    expect(chart).toBeInTheDocument()
    expect(chart).toHaveAttribute('data-point-count', '7')
    expect(chart).toHaveAttribute('data-goal', '5')
  })

  it('shows error state on failure', () => {
    vi.mocked(useDailySummaries).mockReturnValue(q(undefined, false, true))
    vi.mocked(usePreferences).mockReturnValue(q(undefined, false, true))

    render(<WeeklyTrendCard />)

    expect(screen.getByText('Could not load chart data')).toBeInTheDocument()
  })

  it('renders card title and date range', () => {
    vi.mocked(useDailySummaries).mockReturnValue(q(mockDailySummaries))
    vi.mocked(usePreferences).mockReturnValue(q(mockPrefs))

    render(<WeeklyTrendCard />)

    expect(screen.getByText('Weekly CO₂ trend')).toBeInTheDocument()
  })

  it('shows empty state when no daily summaries', () => {
    vi.mocked(useDailySummaries).mockReturnValue(q([]))
    vi.mocked(usePreferences).mockReturnValue(q(mockPrefs))

    render(<WeeklyTrendCard />)

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('No data this week')).toBeInTheDocument()
    expect(screen.getByText('Start tracking to see your weekly trend.')).toBeInTheDocument()
    // Chart should not be rendered
    expect(screen.queryByTestId('weekly-trend-chart')).not.toBeInTheDocument()
  })
})
