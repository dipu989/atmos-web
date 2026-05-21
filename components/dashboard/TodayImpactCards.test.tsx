// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { TodayImpactCards } from '@/components/dashboard/TodayImpactCards'
import type { DailySummary, Insight, MonthlySummary, Preferences, User } from '@/types/index'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/hooks/useTrips', () => ({
  useDailySummaries: vi.fn(),
  useMonthlySummaries: vi.fn(),
  usePreferences: vi.fn(),
  useInsights: vi.fn(),
  useMe: vi.fn(),
}))

import {
  useDailySummaries,
  useInsights,
  useMe,
  useMonthlySummaries,
  usePreferences,
} from '@/lib/hooks/useTrips'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// biome-ignore lint: test helper - partial mock is intentional
function q<T>(data: T, isLoading = false, isError = false): ReturnType<typeof useDailySummaries> {
  return { data, isLoading, isError, error: isError ? new Error('fail') : null }
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockMonthly: MonthlySummary[] = [
  {
    id: 'm1',
    userId: 'u1',
    year: 2026,
    month: 5,
    totalKgCo2e: 42.5,
    totalDistanceKm: 200,
    activityCount: 15,
    breakdown: {},
    computedAt: '2026-05-22T00:00:00Z',
    trend: { prev_total_kg_co2e: 50, change_pct: -15, direction: 'down' },
  },
]

const mockDaily: DailySummary[] = [
  {
    id: 'd1',
    userId: 'u1',
    dateLocal: '2026-05-22',
    totalKgCo2e: 2.5,
    totalDistanceKm: 10,
    activityCount: 2,
    breakdown: {},
    computedAt: '2026-05-22T00:00:00Z',
    trend: { prev_total_kg_co2e: 3, change_pct: -17, direction: 'down' },
  },
]

const mockPrefs: Preferences = {
  distance_unit: 'km',
  push_notifications_enabled: true,
  weekly_report_enabled: true,
  daily_goal_kg_co2e: 5.0,
  data_sharing_enabled: false,
}

const mockInsights: Insight[] = [
  {
    id: 'i1',
    userId: 'u1',
    insightType: 'streak',
    periodType: 'daily',
    periodStart: '2026-05-01',
    periodEnd: '2026-05-22',
    title: 'Streak',
    body: 'Keep it up!',
    metadata: { current_streak: 7, longest_streak: 14 },
    isRead: false,
    createdAt: '2026-05-22T00:00:00Z',
    updatedAt: '2026-05-22T00:00:00Z',
  },
]

const mockMe: User = {
  id: 'u1',
  email: 'test@test.com',
  display_name: 'Test User',
  avatar_url: '',
  locale: 'en',
  timezone: 'UTC',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-05-22T00:00:00Z',
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('TodayImpactCards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows 4 skeleton cards while loading', () => {
    vi.mocked(useMonthlySummaries).mockReturnValue(q(undefined, true))
    vi.mocked(useDailySummaries).mockReturnValue(q(undefined, true))
    vi.mocked(usePreferences).mockReturnValue(q(undefined, true))
    vi.mocked(useInsights).mockReturnValue(q(undefined, true))
    vi.mocked(useMe).mockReturnValue(q(undefined, true))

    render(<TodayImpactCards />)

    const skeletons = screen.getAllByTestId('stat-card-skeleton')
    expect(skeletons).toHaveLength(4)
  })

  it('shows 4 cards with data when loaded', () => {
    vi.mocked(useMonthlySummaries).mockReturnValue(q(mockMonthly))
    vi.mocked(useDailySummaries).mockReturnValue(q(mockDaily))
    vi.mocked(usePreferences).mockReturnValue(q(mockPrefs))
    vi.mocked(useInsights).mockReturnValue(q(mockInsights))
    vi.mocked(useMe).mockReturnValue(q(mockMe))

    render(<TodayImpactCards />)

    // Card 1: CO₂ this month
    expect(screen.getByText('CO₂ this month', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('42.5')).toBeInTheDocument()

    // Card 2: Daily goal
    expect(screen.getByText('Daily goal', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('2.5')).toBeInTheDocument()

    // Card 3: Current streak
    expect(screen.getByText('Current streak', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText(/Longest: 14 days/)).toBeInTheDocument()

    // Card 4: Days tracked
    expect(screen.getByText('Days tracked', { exact: false })).toBeInTheDocument()
    expect(screen.getByText(/Since/)).toBeInTheDocument()
  })

  it('shows error fallback when query fails', () => {
    vi.mocked(useMonthlySummaries).mockReturnValue(q(undefined, false, true))
    vi.mocked(useDailySummaries).mockReturnValue(q(undefined, false, true))
    vi.mocked(usePreferences).mockReturnValue(q(undefined, false, true))
    vi.mocked(useInsights).mockReturnValue(q(undefined, false, true))
    vi.mocked(useMe).mockReturnValue(q(undefined, false, true))

    render(<TodayImpactCards />)

    // All 4 cards show "Data unavailable"
    const errorTexts = screen.getAllByText('Data unavailable')
    expect(errorTexts).toHaveLength(4)

    // All 4 cards show "—"
    const dashes = screen.getAllByText('—')
    expect(dashes).toHaveLength(4)
  })

  it('progress bar width is proportional to todayKg/goalKg', () => {
    // todayKg=2.5, goalKg=5.0 → 50%
    vi.mocked(useMonthlySummaries).mockReturnValue(q(mockMonthly))
    vi.mocked(useDailySummaries).mockReturnValue(q(mockDaily))
    vi.mocked(usePreferences).mockReturnValue(q(mockPrefs))
    vi.mocked(useInsights).mockReturnValue(q(mockInsights))
    vi.mocked(useMe).mockReturnValue(q(mockMe))

    render(<TodayImpactCards />)

    const progressFill = screen.getByTestId('progress-fill')
    expect(progressFill).toHaveStyle({ width: '50%' })
  })

  it('progress bar is green (sage) when under goal', () => {
    // todayKg=2.5 < goalKg=5.0 → green
    vi.mocked(useMonthlySummaries).mockReturnValue(q(mockMonthly))
    vi.mocked(useDailySummaries).mockReturnValue(q(mockDaily))
    vi.mocked(usePreferences).mockReturnValue(q(mockPrefs))
    vi.mocked(useInsights).mockReturnValue(q(mockInsights))
    vi.mocked(useMe).mockReturnValue(q(mockMe))

    render(<TodayImpactCards />)

    const progressFill = screen.getByTestId('progress-fill')
    expect(progressFill).toHaveStyle({ backgroundColor: 'rgb(61, 171, 130)' }) // #3DAB82
  })

  it('progress bar is orange (peach) when over goal', () => {
    // todayKg=8.0 > goalKg=5.0 → orange
    const overGoalDaily: DailySummary[] = [{ ...mockDaily[0], totalKgCo2e: 8.0 }]
    vi.mocked(useMonthlySummaries).mockReturnValue(q(mockMonthly))
    vi.mocked(useDailySummaries).mockReturnValue(q(overGoalDaily))
    vi.mocked(usePreferences).mockReturnValue(q(mockPrefs))
    vi.mocked(useInsights).mockReturnValue(q(mockInsights))
    vi.mocked(useMe).mockReturnValue(q(mockMe))

    render(<TodayImpactCards />)

    const progressFill = screen.getByTestId('progress-fill')
    expect(progressFill).toHaveStyle({ backgroundColor: 'rgb(240, 149, 106)' }) // #F0956A
  })

  it('renders 4 cards in a grid', () => {
    vi.mocked(useMonthlySummaries).mockReturnValue(q(mockMonthly))
    vi.mocked(useDailySummaries).mockReturnValue(q(mockDaily))
    vi.mocked(usePreferences).mockReturnValue(q(mockPrefs))
    vi.mocked(useInsights).mockReturnValue(q(mockInsights))
    vi.mocked(useMe).mockReturnValue(q(mockMe))

    const { container } = render(<TodayImpactCards />)

    const grid = container.firstChild as HTMLElement
    expect(grid.className).toContain('grid-cols-4')
    expect(grid.className).toContain('gap-4')
  })
})
