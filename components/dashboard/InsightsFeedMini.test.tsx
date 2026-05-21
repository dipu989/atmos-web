// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { InsightsFeedMini } from '@/components/dashboard/InsightsFeedMini'
import type { Insight } from '@/types/index'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/hooks/useTrips', () => ({
  useInsights: vi.fn(),
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

import { useInsights } from '@/lib/hooks/useTrips'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// biome-ignore lint: test helper — partial mock is intentional
function q(
  data: Insight[] | undefined,
  isLoading = false,
  isError = false,
): ReturnType<typeof useInsights> {
  return { data, isLoading, isError, error: isError ? new Error('fail') : null }
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const NOW = new Date().toISOString()

const makeInsight = (overrides: Partial<Insight> = {}): Insight => ({
  id:          overrides.id ?? 'i1',
  userId:      'u1',
  insightType: overrides.insightType ?? 'tip',
  periodType:  'weekly',
  periodStart: NOW.slice(0, 10),
  periodEnd:   NOW.slice(0, 10),
  title:       overrides.title ?? 'Great job cycling!',
  body:        overrides.body ?? 'You saved 2 kg CO₂ by cycling this week.',
  metadata:    {},
  isRead:      overrides.isRead ?? false,
  createdAt:   NOW,
  updatedAt:   NOW,
  ...overrides,
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('InsightsFeedMini', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows 3 skeleton cards while loading', () => {
    vi.mocked(useInsights).mockReturnValue(q(undefined, true))

    render(<InsightsFeedMini />)

    const skeletons = screen.getAllByTestId('insight-skeleton')
    expect(skeletons).toHaveLength(3)
  })

  it('renders up to 3 insight cards', () => {
    const insights = Array.from({ length: 5 }, (_, i) =>
      makeInsight({ id: `i${i + 1}`, title: `Insight ${i + 1}` }),
    )
    vi.mocked(useInsights).mockReturnValue(q(insights))

    render(<InsightsFeedMini />)

    // Only 3 should be displayed
    expect(screen.getByText('Insight 1')).toBeInTheDocument()
    expect(screen.getByText('Insight 2')).toBeInTheDocument()
    expect(screen.getByText('Insight 3')).toBeInTheDocument()
    expect(screen.queryByText('Insight 4')).not.toBeInTheDocument()
    expect(screen.queryByText('Insight 5')).not.toBeInTheDocument()
  })

  it('unread badge count is shown correctly', () => {
    const insights = [
      makeInsight({ id: 'i1', isRead: false }),
      makeInsight({ id: 'i2', isRead: false }),
      makeInsight({ id: 'i3', isRead: true }),
    ]
    vi.mocked(useInsights).mockReturnValue(q(insights))

    render(<InsightsFeedMini />)

    const badge = screen.getByTestId('unread-badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('2')
  })

  it('unread badge is not shown when all insights are read', () => {
    const insights = [
      makeInsight({ id: 'i1', isRead: true }),
      makeInsight({ id: 'i2', isRead: true }),
    ]
    vi.mocked(useInsights).mockReturnValue(q(insights))

    render(<InsightsFeedMini />)

    expect(screen.queryByTestId('unread-badge')).not.toBeInTheDocument()
  })

  it('new dot is visible on unread insights', () => {
    const insights = [
      makeInsight({ id: 'i1', isRead: false }),
      makeInsight({ id: 'i2', isRead: true }),
    ]
    vi.mocked(useInsights).mockReturnValue(q(insights))

    render(<InsightsFeedMini />)

    const dots = screen.getAllByTestId('unread-dot')
    // Only i1 is unread — but only unread insights shown (i2 is read, so only i1 shown)
    expect(dots).toHaveLength(1)
  })

  it('shows unread dot only on unread cards when mixed', () => {
    const insights = [
      makeInsight({ id: 'i1', isRead: false }),
      makeInsight({ id: 'i2', isRead: false }),
      makeInsight({ id: 'i3', isRead: false }),
    ]
    vi.mocked(useInsights).mockReturnValue(q(insights))

    render(<InsightsFeedMini />)

    const dots = screen.getAllByTestId('unread-dot')
    expect(dots).toHaveLength(3)
  })

  it('"See all" link goes to /insights', () => {
    vi.mocked(useInsights).mockReturnValue(q([makeInsight()]))

    render(<InsightsFeedMini />)

    const link = screen.getByRole('link', { name: /see all/i })
    expect(link).toHaveAttribute('href', '/insights')
  })

  it('shows empty state when insights array is empty', () => {
    vi.mocked(useInsights).mockReturnValue(q([]))

    render(<InsightsFeedMini />)

    expect(screen.getByText('No insights yet. Keep tracking trips!')).toBeInTheDocument()
  })

  it('shows error state when query fails', () => {
    vi.mocked(useInsights).mockReturnValue(q(undefined, false, true))

    render(<InsightsFeedMini />)

    expect(screen.getByText('Could not load insights')).toBeInTheDocument()
  })

  it('prioritises unread insights over read ones', () => {
    // 2 read, then 2 unread — should show unread first
    const insights = [
      makeInsight({ id: 'i1', title: 'Read A',   isRead: true }),
      makeInsight({ id: 'i2', title: 'Read B',   isRead: true }),
      makeInsight({ id: 'i3', title: 'Unread A', isRead: false }),
      makeInsight({ id: 'i4', title: 'Unread B', isRead: false }),
    ]
    vi.mocked(useInsights).mockReturnValue(q(insights))

    render(<InsightsFeedMini />)

    expect(screen.getByText('Unread A')).toBeInTheDocument()
    expect(screen.getByText('Unread B')).toBeInTheDocument()
    // Read ones should not appear because unread ones fill all 3 slots (only 2 here)
    expect(screen.queryByText('Read A')).not.toBeInTheDocument()
    expect(screen.queryByText('Read B')).not.toBeInTheDocument()
  })

  it('falls back to all insights when all are read', () => {
    const insights = [
      makeInsight({ id: 'i1', title: 'Read A', isRead: true }),
      makeInsight({ id: 'i2', title: 'Read B', isRead: true }),
      makeInsight({ id: 'i3', title: 'Read C', isRead: true }),
      makeInsight({ id: 'i4', title: 'Read D', isRead: true }),
    ]
    vi.mocked(useInsights).mockReturnValue(q(insights))

    render(<InsightsFeedMini />)

    // First 3 of all insights shown
    expect(screen.getByText('Read A')).toBeInTheDocument()
    expect(screen.getByText('Read B')).toBeInTheDocument()
    expect(screen.getByText('Read C')).toBeInTheDocument()
    expect(screen.queryByText('Read D')).not.toBeInTheDocument()
  })
})
