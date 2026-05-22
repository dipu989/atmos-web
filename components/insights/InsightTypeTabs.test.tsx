// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { InsightTypeTabs } from '@/components/insights/InsightTypeTabs'
import type { Insight } from '@/types'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeInsight(overrides: Partial<Insight> & Pick<Insight, 'id' | 'insightType'>): Insight {
  return {
    userId: 'u1',
    periodType: 'weekly',
    periodStart: '2026-05-01',
    periodEnd:   '2026-05-07',
    title:       'Title',
    body:        'Body',
    metadata:    {},
    isRead:      false,
    createdAt:   '2026-05-01T00:00:00Z',
    updatedAt:   '2026-05-01T00:00:00Z',
    ...overrides,
  }
}

const mockInsights: Insight[] = [
  makeInsight({ id: 'i1', insightType: 'streak' }),
  makeInsight({ id: 'i2', insightType: 'streak', isRead: true }),
  makeInsight({ id: 'i3', insightType: 'tip' }),
  makeInsight({ id: 'i4', insightType: 'milestone' }),
  // weekly_comparison → hero; should NOT appear as a tab
  makeInsight({ id: 'i5', insightType: 'weekly_comparison' }),
]

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('InsightTypeTabs — tab rendering', () => {
  it('renders the "All" tab', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="all" onChange={vi.fn()} />)
    expect(screen.getByTestId('tab-all')).toBeInTheDocument()
  })

  it('renders a tab for each type that appears in the feed (excluding hero types)', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="all" onChange={vi.fn()} />)
    expect(screen.getByTestId('tab-streak')).toBeInTheDocument()
    expect(screen.getByTestId('tab-tip')).toBeInTheDocument()
    expect(screen.getByTestId('tab-milestone')).toBeInTheDocument()
  })

  it('does NOT render a tab for weekly_comparison (it is the hero)', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="all" onChange={vi.fn()} />)
    expect(screen.queryByTestId('tab-weekly_comparison')).not.toBeInTheDocument()
  })

  it('does not render tabs for types absent from the data', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="all" onChange={vi.fn()} />)
    expect(screen.queryByTestId('tab-anomaly')).not.toBeInTheDocument()
    expect(screen.queryByTestId('tab-comparison')).not.toBeInTheDocument()
  })

  it('renders the tab label for the streak type', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="all" onChange={vi.fn()} />)
    expect(screen.getByTestId('tab-streak')).toHaveTextContent('Streak')
  })
})

describe('InsightTypeTabs — count badges', () => {
  it('"All" tab shows count of all non-hero insights', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="all" onChange={vi.fn()} />)
    // 4 feed insights (excluding weekly_comparison)
    const allTab = screen.getByTestId('tab-all')
    expect(allTab).toHaveTextContent('4')
  })

  it('streak tab shows correct count', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="all" onChange={vi.fn()} />)
    expect(screen.getByTestId('tab-streak')).toHaveTextContent('2')
  })

  it('tip tab shows correct count', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="all" onChange={vi.fn()} />)
    expect(screen.getByTestId('tab-tip')).toHaveTextContent('1')
  })
})

describe('InsightTypeTabs — active state', () => {
  it('"All" tab has aria-selected="true" when activeTab is "all"', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="all" onChange={vi.fn()} />)
    expect(screen.getByTestId('tab-all')).toHaveAttribute('aria-selected', 'true')
  })

  it('non-active tabs have aria-selected="false" when activeTab is "all"', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="all" onChange={vi.fn()} />)
    expect(screen.getByTestId('tab-streak')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByTestId('tab-tip')).toHaveAttribute('aria-selected', 'false')
  })

  it('active type tab has aria-selected="true"', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="streak" onChange={vi.fn()} />)
    expect(screen.getByTestId('tab-streak')).toHaveAttribute('aria-selected', 'true')
  })

  it('"All" tab has aria-selected="false" when a type tab is active', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="streak" onChange={vi.fn()} />)
    expect(screen.getByTestId('tab-all')).toHaveAttribute('aria-selected', 'false')
  })

  it('active tab has semibold text class', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="streak" onChange={vi.fn()} />)
    expect(screen.getByTestId('tab-streak')).toHaveClass('font-semibold')
  })

  it('inactive tab has medium weight class', () => {
    render(<InsightTypeTabs insights={mockInsights} activeTab="all" onChange={vi.fn()} />)
    expect(screen.getByTestId('tab-streak')).toHaveClass('font-medium')
  })
})

describe('InsightTypeTabs — interactions', () => {
  it('clicking "All" tab calls onChange with "all"', () => {
    const onChange = vi.fn()
    render(<InsightTypeTabs insights={mockInsights} activeTab="streak" onChange={onChange} />)
    fireEvent.click(screen.getByTestId('tab-all'))
    expect(onChange).toHaveBeenCalledWith('all')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('clicking a type tab calls onChange with that type', () => {
    const onChange = vi.fn()
    render(<InsightTypeTabs insights={mockInsights} activeTab="all" onChange={onChange} />)
    fireEvent.click(screen.getByTestId('tab-streak'))
    expect(onChange).toHaveBeenCalledWith('streak')
  })

  it('clicking the tip tab calls onChange with "tip"', () => {
    const onChange = vi.fn()
    render(<InsightTypeTabs insights={mockInsights} activeTab="all" onChange={onChange} />)
    fireEvent.click(screen.getByTestId('tab-tip'))
    expect(onChange).toHaveBeenCalledWith('tip')
  })
})

describe('InsightTypeTabs — empty data', () => {
  it('renders only "All" tab with count 0 when no insights', () => {
    render(<InsightTypeTabs insights={[]} activeTab="all" onChange={vi.fn()} />)
    expect(screen.getByTestId('tab-all')).toBeInTheDocument()
    expect(screen.getByTestId('tab-all')).toHaveTextContent('0')
    // No type-specific tabs
    expect(screen.queryByTestId('tab-streak')).not.toBeInTheDocument()
  })
})
