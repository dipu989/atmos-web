// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import InsightsPage from './page'
import type { Insight } from '@/types'

// ─── Child component mocks ─────────────────────────────────────────────────────

vi.mock('@/components/layout/PageShell', () => ({
  PageShell: ({
    children,
    title,
    subtitle,
  }: {
    children: React.ReactNode
    title: string
    subtitle?: string
  }) => (
    <div data-testid="page-shell">
      <h1>{title}</h1>
      {subtitle && <p data-testid="subtitle">{subtitle}</p>}
      {children}
    </div>
  ),
}))

vi.mock('@/components/insights/InsightStatsStrip', () => ({
  InsightStatsStrip: ({
    insights,
    loading,
  }: {
    insights: Insight[]
    loading?: boolean
  }) => (
    <div
      data-testid="insight-stats-strip"
      data-count={insights.length}
      data-loading={loading ?? false}
    />
  ),
}))

vi.mock('@/components/insights/WeeklyDigestHero', () => ({
  WeeklyDigestHero: ({ insight }: { insight: { title: string } }) => (
    <div data-testid="weekly-digest-hero" data-title={insight.title} />
  ),
}))

vi.mock('@/components/insights/InsightTypeTabs', () => ({
  InsightTypeTabs: ({
    insights,
    activeTab,
    onChange,
  }: {
    insights: Insight[]
    activeTab: string
    onChange: (tab: string) => void
  }) => (
    <div data-testid="insight-type-tabs" data-active={activeTab}>
      <button data-testid="tab-btn-all" onClick={() => onChange('all')}>
        All
      </button>
      {[...new Set(insights.map((i) => i.insightType))]
        .filter((t) => t !== 'weekly_comparison')
        .map((t) => (
          <button key={t} data-testid={`tab-btn-${t}`} onClick={() => onChange(t)}>
            {t}
          </button>
        ))}
    </div>
  ),
}))

vi.mock('@/components/insights/InsightFeed', () => ({
  InsightFeed: ({
    insights,
    onRead,
    loading,
  }: {
    insights: Insight[]
    onRead: (id: string) => void
    loading?: boolean
  }) => (
    <div
      data-testid="insight-feed"
      data-count={insights.length}
      data-types={insights.map((i) => i.insightType).join(',')}
      data-loading={loading ?? false}
    >
      {insights.map((i) => (
        <button key={i.id} data-testid={`read-btn-${i.id}`} onClick={() => onRead(i.id)}>
          read
        </button>
      ))}
    </div>
  ),
}))

vi.mock('@/components/insights/AchievementsPanel', () => ({
  AchievementsPanel: ({
    achievements,
    loading,
  }: {
    achievements: unknown[]
    loading?: boolean
  }) => (
    <div
      data-testid="achievements-panel"
      data-count={achievements.length}
      data-loading={loading ?? false}
    />
  ),
}))

// ─── Hook mocks ───────────────────────────────────────────────────────────────

vi.mock('@/lib/hooks/useTrips', () => ({
  useInsights: vi.fn(),
}))

const mockMarkRead = vi.fn()
vi.mock('@/lib/hooks/useMutations', () => ({
  useMarkInsightRead: () => ({ mutate: mockMarkRead }),
}))

import { useInsights } from '@/lib/hooks/useTrips'

// ─── Test fixtures ────────────────────────────────────────────────────────────

function makeInsight(
  overrides: Partial<Insight> & Pick<Insight, 'id' | 'insightType'>,
): Insight {
  return {
    userId:      'u1',
    periodType:  'weekly',
    periodStart: '2026-05-01',
    periodEnd:   '2026-05-07',
    title:       'Test insight',
    body:        'Body text',
    metadata:    {},
    isRead:      false,
    createdAt:   '2026-05-01T00:00:00Z',
    updatedAt:   '2026-05-01T00:00:00Z',
    ...overrides,
  }
}

const mockInsights: Insight[] = [
  makeInsight({ id: 'i1', insightType: 'weekly_comparison', title: 'Weekly Hero', isRead: true }),
  makeInsight({ id: 'i2', insightType: 'streak', title: 'Streak Insight' }),
  makeInsight({ id: 'i3', insightType: 'tip', title: 'Tip Insight' }),
  makeInsight({ id: 'i4', insightType: 'milestone', title: 'Milestone', isRead: true }),
]

function mockHookData(override?: {
  data?: Insight[]
  isLoading?: boolean
  isError?: boolean
}): void {
  vi.mocked(useInsights).mockReturnValue({
    data:      override?.data      ?? mockInsights,
    isLoading: override?.isLoading ?? false,
    isError:   override?.isError   ?? false,
  } as unknown as ReturnType<typeof useInsights>)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('InsightsPage — renders all sections', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHookData()
  })

  it('renders Insights page title', () => {
    render(<InsightsPage />)
    expect(screen.getByText('Insights')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<InsightsPage />)
    expect(
      screen.getByText("What Atmos has learned from your travel patterns."),
    ).toBeInTheDocument()
  })

  it('renders stats strip', () => {
    render(<InsightsPage />)
    expect(screen.getByTestId('insight-stats-strip')).toBeInTheDocument()
  })

  it('renders hero card for featured insight', () => {
    render(<InsightsPage />)
    expect(screen.getByTestId('weekly-digest-hero')).toBeInTheDocument()
  })

  it('renders type tabs', () => {
    render(<InsightsPage />)
    expect(screen.getByTestId('insight-type-tabs')).toBeInTheDocument()
  })

  it('renders insight feed', () => {
    render(<InsightsPage />)
    expect(screen.getByTestId('insight-feed')).toBeInTheDocument()
  })

  it('renders achievements panel', () => {
    render(<InsightsPage />)
    expect(screen.getByTestId('achievements-panel')).toBeInTheDocument()
  })

  it('stats strip receives all insights', () => {
    render(<InsightsPage />)
    expect(screen.getByTestId('insight-stats-strip')).toHaveAttribute(
      'data-count',
      String(mockInsights.length),
    )
  })
})

describe('InsightsPage — feed default state', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHookData()
  })

  it('feed excludes weekly_comparison (hero) insights in "all" tab', () => {
    render(<InsightsPage />)
    const feed = screen.getByTestId('insight-feed')
    // 4 total — 1 weekly_comparison = 3 in feed
    expect(feed).toHaveAttribute('data-count', '3')
  })

  it('hero title matches the featured weekly_comparison insight title', () => {
    render(<InsightsPage />)
    // mapToHeroInsight preserves the insight's title; type is always 'WEEKLY DIGEST'
    expect(screen.getByTestId('weekly-digest-hero')).toHaveAttribute(
      'data-title',
      'Weekly Hero',
    )
  })
})

describe('InsightsPage — tab filtering', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHookData()
  })

  it('clicking streak tab shows only streak insights', () => {
    render(<InsightsPage />)
    fireEvent.click(screen.getByTestId('tab-btn-streak'))

    const feed = screen.getByTestId('insight-feed')
    expect(feed).toHaveAttribute('data-count', '1')
    expect(feed).toHaveAttribute('data-types', 'streak')
  })

  it('clicking tip tab shows only tip insights', () => {
    render(<InsightsPage />)
    fireEvent.click(screen.getByTestId('tab-btn-tip'))

    const feed = screen.getByTestId('insight-feed')
    expect(feed).toHaveAttribute('data-count', '1')
    expect(feed).toHaveAttribute('data-types', 'tip')
  })

  it('clicking All tab after a type tab restores full feed', () => {
    render(<InsightsPage />)

    // Switch to streak
    fireEvent.click(screen.getByTestId('tab-btn-streak'))
    expect(screen.getByTestId('insight-feed')).toHaveAttribute('data-count', '1')

    // Switch back to All
    fireEvent.click(screen.getByTestId('tab-btn-all'))
    expect(screen.getByTestId('insight-feed')).toHaveAttribute('data-count', '3')
  })
})

describe('InsightsPage — mark read', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHookData()
  })

  it('clicking a read button calls the mutation with that insight id', () => {
    render(<InsightsPage />)
    fireEvent.click(screen.getByTestId('read-btn-i2'))
    expect(mockMarkRead).toHaveBeenCalledWith('i2')
  })

  it('mark read is only called once per click', () => {
    render(<InsightsPage />)
    fireEvent.click(screen.getByTestId('read-btn-i3'))
    expect(mockMarkRead).toHaveBeenCalledTimes(1)
  })
})

describe('InsightsPage — achievements', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHookData()
  })

  it('achievements panel receives milestone + streak insights', () => {
    render(<InsightsPage />)
    const panel = screen.getByTestId('achievements-panel')
    // mockInsights: 1 milestone + 1 streak = 2 achievements
    expect(panel).toHaveAttribute('data-count', '2')
  })
})

describe('InsightsPage — loading state', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows hero skeleton when loading', () => {
    mockHookData({ isLoading: true, data: undefined })
    render(<InsightsPage />)
    expect(screen.getByTestId('hero-skeleton')).toBeInTheDocument()
    expect(screen.queryByTestId('weekly-digest-hero')).not.toBeInTheDocument()
  })

  it('stats strip receives loading prop when loading', () => {
    mockHookData({ isLoading: true, data: undefined })
    render(<InsightsPage />)
    expect(screen.getByTestId('insight-stats-strip')).toHaveAttribute('data-loading', 'true')
  })

  it('feed receives loading prop when loading', () => {
    mockHookData({ isLoading: true, data: undefined })
    render(<InsightsPage />)
    expect(screen.getByTestId('insight-feed')).toHaveAttribute('data-loading', 'true')
  })
})

describe('InsightsPage — empty data', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render hero when no insights available', () => {
    mockHookData({ data: [] })
    render(<InsightsPage />)
    expect(screen.queryByTestId('weekly-digest-hero')).not.toBeInTheDocument()
  })

  it('feed shows 0 insights when data is empty', () => {
    mockHookData({ data: [] })
    render(<InsightsPage />)
    expect(screen.getByTestId('insight-feed')).toHaveAttribute('data-count', '0')
  })
})

describe('InsightsPage — error state', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows an error message instead of empty states when the insights query fails', () => {
    mockHookData({ isError: true, data: [] })
    render(<InsightsPage />)
    expect(screen.getByText('Could not load insights. Please try again.')).toBeInTheDocument()
  })

  it('does not render the stats strip, hero, feed, or achievements panel on error', () => {
    mockHookData({ isError: true, data: [] })
    render(<InsightsPage />)
    expect(screen.queryByTestId('insight-stats-strip')).not.toBeInTheDocument()
    expect(screen.queryByTestId('weekly-digest-hero')).not.toBeInTheDocument()
    expect(screen.queryByTestId('insight-feed')).not.toBeInTheDocument()
    expect(screen.queryByTestId('achievements-panel')).not.toBeInTheDocument()
  })
})

describe('InsightsPage — mobile viewport', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHookData()
  })

  it('renders without crash at 375px mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 })
    expect(() => render(<InsightsPage />)).not.toThrow()
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
  })
})
