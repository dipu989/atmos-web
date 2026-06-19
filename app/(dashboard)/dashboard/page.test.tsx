// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import DashboardPage from './page'

// ─── Mock child components ─────────────────────────────────────────────────────

vi.mock('@/components/dashboard/TodayImpactCards', () => ({
  TodayImpactCards: () => <div data-testid="today-impact-cards" />,
}))

vi.mock('@/components/dashboard/WeeklyTrendCard', () => ({
  WeeklyTrendCard: () => <div data-testid="weekly-trend-card" />,
}))

vi.mock('@/components/dashboard/TransportBreakdownCard', () => ({
  TransportBreakdownCard: () => <div data-testid="transport-breakdown-card" />,
}))

vi.mock('@/components/dashboard/RecentTripsList', () => ({
  RecentTripsList: () => <div data-testid="recent-trips-list" />,
}))

vi.mock('@/components/dashboard/InsightsFeedMini', () => ({
  InsightsFeedMini: () => <div data-testid="insights-feed-mini" />,
}))

// ─── Mock PageShell ────────────────────────────────────────────────────────────

vi.mock('@/components/layout/PageShell', () => ({
  PageShell: ({
    title,
    subtitle,
    children,
  }: {
    title: string
    subtitle?: string
    rangePicker?: { value: string; onChange: (v: string) => void }
    children: React.ReactNode
  }) => (
    <div data-testid="page-shell">
      <h1>{title}</h1>
      {subtitle && <p data-testid="subtitle">{subtitle}</p>}
      {children}
    </div>
  ),
}))

// ─── Mock useMe ────────────────────────────────────────────────────────────────

const mockUseMe = vi.fn()

vi.mock('@/lib/hooks/useTrips', () => ({
  useMe: () => mockUseMe(),
}))

import type { User } from '@/types/index'

// ─── Tests ────────────────────────────────────────────────────────────────────

const mockUser: User = {
  id: 'u1',
  email: 'test@example.com',
  display_name: 'Shantnu Kumar',
  avatar_url: '',
  locale: 'en',
  timezone: 'UTC',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-05-22T00:00:00Z',
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseMe.mockReturnValue({ data: undefined, isLoading: false, isError: false })
  })

  it('renders all 5 component sections', () => {
    render(<DashboardPage />)

    expect(screen.getByTestId('today-impact-cards')).toBeInTheDocument()
    expect(screen.getByTestId('weekly-trend-card')).toBeInTheDocument()
    expect(screen.getByTestId('transport-breakdown-card')).toBeInTheDocument()
    expect(screen.getByTestId('recent-trips-list')).toBeInTheDocument()
    expect(screen.getByTestId('insights-feed-mini')).toBeInTheDocument()
  })

  it('shows the Dashboard title', () => {
    render(<DashboardPage />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('shows user first name in subtitle when user data is available', () => {
    mockUseMe.mockReturnValue({ data: mockUser, isLoading: false, isError: false })

    render(<DashboardPage />)

    const subtitle = screen.getByTestId('subtitle')
    expect(subtitle).toHaveTextContent('Welcome back, Shantnu')
  })

  it('shows no subtitle when user data is not yet loaded', () => {
    mockUseMe.mockReturnValue({ data: undefined, isLoading: true, isError: false })

    render(<DashboardPage />)

    expect(screen.queryByTestId('subtitle')).not.toBeInTheDocument()
  })

  it('extracts only the first name from display_name', () => {
    mockUseMe.mockReturnValue({
      data: { ...mockUser, display_name: 'Shantnu Kumar' },
      isLoading: false,
      isError: false,
    })

    render(<DashboardPage />)

    const subtitle = screen.getByTestId('subtitle')
    expect(subtitle).toHaveTextContent('Welcome back, Shantnu')
    expect(subtitle).not.toHaveTextContent('Kumar')
  })

  it('renders PageShell wrapping all content', () => {
    render(<DashboardPage />)

    expect(screen.getByTestId('page-shell')).toBeInTheDocument()
  })

  it('renders without crash at 375px mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 })
    expect(() => render(<DashboardPage />)).not.toThrow()
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
  })
})
