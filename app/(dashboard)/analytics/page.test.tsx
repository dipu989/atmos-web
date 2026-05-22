// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import AnalyticsPage from './page'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/components/layout/PageShell', () => ({
  PageShell: ({
    children,
    rightExtra,
    title,
  }: {
    children: React.ReactNode
    rightExtra?: React.ReactNode
    title: string
  }) => (
    <div data-testid="page-shell">
      <h1>{title}</h1>
      {rightExtra && <div data-testid="page-shell-right">{rightExtra}</div>}
      {children}
    </div>
  ),
}))

vi.mock('@/components/dashboard/AnalyticsSummaryCards', () => ({
  AnalyticsSummaryCards: ({ period }: { period?: string }) => (
    <div data-testid="analytics-summary-cards" data-period={period} />
  ),
}))

vi.mock('@/components/charts/DailyBarChart', () => ({
  DailyBarChart: () => <div data-testid="daily-bar-chart" />,
}))

vi.mock('@/components/charts/MonthOverMonthChart', () => ({
  MonthOverMonthChart: () => <div data-testid="mom-chart" />,
}))

vi.mock('@/components/charts/ModeStackedAreaChart', () => ({
  ModeStackedAreaChart: () => <div data-testid="mode-area-chart" />,
}))

vi.mock('@/components/charts/WeekdayAverageChart', () => ({
  WeekdayAverageChart: () => <div data-testid="weekday-chart" />,
}))

vi.mock('@/components/analytics/TopRoutesTable', () => ({
  TopRoutesTable: () => <div data-testid="top-routes-table" />,
}))

vi.mock('@/lib/hooks/useAnalytics', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/hooks/useAnalytics')>()
  return {
    ...actual, // re-export AnalyticsPeriod, PERIOD_DAYS, etc.
    useAnalytics: vi.fn(),
  }
})

import { useAnalytics } from '@/lib/hooks/useAnalytics'

// ─── Default mock return ──────────────────────────────────────────────────────

function mockAnalytics(overrides: Partial<ReturnType<typeof useAnalytics>> = {}): void {
  vi.mocked(useAnalytics).mockReturnValue({
    isLoading: false,
    isError: false,
    dailyBarData: [{ date: '2026-05-01', co2_kg: 2.5, label: 'May 1' }],
    momData: [{ week: 'W1', current: 3.0, previous: 4.0 }],
    modeData: [{ week: 'Week 1', car: 1.0, train: 0.5, bus: 0.2, bike: 0.1, walk: 0 }],
    weekdayData: [{ day: 'Mon', avg_kg: 1.2 }],
    routesData: [],
    goal: 5,
    ...overrides,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AnalyticsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAnalytics()
  })

  it('renders the page with Analytics title', () => {
    render(<AnalyticsPage />)
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('renders the period switcher with 4 options', () => {
    render(<AnalyticsPage />)

    const switcher = screen.getByTestId('period-switcher')
    expect(switcher).toBeInTheDocument()

    // All 4 period options
    expect(screen.getByTestId('period-option-30d')).toBeInTheDocument()
    expect(screen.getByTestId('period-option-3m')).toBeInTheDocument()
    expect(screen.getByTestId('period-option-6m')).toBeInTheDocument()
    expect(screen.getByTestId('period-option-1y')).toBeInTheDocument()
  })

  it('period switcher has 30d active by default', () => {
    render(<AnalyticsPage />)

    const btn30d = screen.getByTestId('period-option-30d')
    expect(btn30d).toHaveAttribute('aria-pressed', 'true')

    const btn3m = screen.getByTestId('period-option-3m')
    expect(btn3m).toHaveAttribute('aria-pressed', 'false')
  })

  it('changing period updates the active button', () => {
    render(<AnalyticsPage />)

    const btn3m = screen.getByTestId('period-option-3m')
    fireEvent.click(btn3m)

    expect(screen.getByTestId('period-option-3m')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('period-option-30d')).toHaveAttribute('aria-pressed', 'false')
  })

  it('passes the selected period to AnalyticsSummaryCards', () => {
    render(<AnalyticsPage />)

    // Initially 30d
    expect(screen.getByTestId('analytics-summary-cards')).toHaveAttribute('data-period', '30d')

    // Switch to 6m
    fireEvent.click(screen.getByTestId('period-option-6m'))
    expect(screen.getByTestId('analytics-summary-cards')).toHaveAttribute('data-period', '6m')
  })

  it('renders all 4 chart sections', () => {
    render(<AnalyticsPage />)

    expect(screen.getByTestId('analytics-section-daily')).toBeInTheDocument()
    expect(screen.getByTestId('analytics-section-mode')).toBeInTheDocument()
    expect(screen.getByTestId('analytics-section-routes')).toBeInTheDocument()
    expect(screen.getByTestId('analytics-summary-cards')).toBeInTheDocument()
  })

  it('renders chart components when data is available', () => {
    render(<AnalyticsPage />)

    expect(screen.getByTestId('daily-bar-chart')).toBeInTheDocument()
    expect(screen.getByTestId('mom-chart')).toBeInTheDocument()
    expect(screen.getByTestId('mode-area-chart')).toBeInTheDocument()
    expect(screen.getByTestId('weekday-chart')).toBeInTheDocument()
    expect(screen.getByTestId('top-routes-table')).toBeInTheDocument()
  })

  it('shows skeleton when loading', () => {
    mockAnalytics({ isLoading: true, dailyBarData: [], momData: [], modeData: [], weekdayData: [], routesData: [] })

    render(<AnalyticsPage />)

    const skeletons = screen.getAllByTestId('chart-skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
    expect(screen.queryByTestId('daily-bar-chart')).not.toBeInTheDocument()
  })

  it('shows error state when data fails to load', () => {
    mockAnalytics({ isError: true, dailyBarData: [], momData: [], modeData: [], weekdayData: [], routesData: [] })

    render(<AnalyticsPage />)

    const errors = screen.getAllByText('Failed to load chart data.')
    expect(errors.length).toBeGreaterThan(0)
  })

  it('shows empty state when data is empty', () => {
    mockAnalytics({ dailyBarData: [], momData: [], modeData: [], weekdayData: [], routesData: [] })

    render(<AnalyticsPage />)

    const emptyMessages = screen.getAllByText('No data yet')
    expect(emptyMessages.length).toBeGreaterThan(0)
  })

  it('renders without crash at 375px mobile viewport', () => {
    mockAnalytics()
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 })
    expect(() => render(<AnalyticsPage />)).not.toThrow()
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
  })
})
