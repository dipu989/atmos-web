// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { InsightCard } from '@/components/insights/InsightCard'
import type { InsightCardInsight } from '@/components/insights/InsightCard'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const base: InsightCardInsight = {
  id: 'ins-001',
  type: 'milestone',
  color: '#4A90C4',
  icon: '🏆',
  date: 'May 20',
  new: false,
  title: 'First 100 km on foot',
  body: 'You have walked or cycled a total of 100 km this year.',
  actions: [],
}

const newInsight: InsightCardInsight = { ...base, new: true }

const tipInsight: InsightCardInsight = {
  ...base,
  id: 'ins-tip',
  type: 'tip',
  color: '#3DAB82',
  icon: '🌿',
  title: 'Switch to metro for your morning commute',
  body: 'Your Tuesday car trip to work emits 3× more than the metro.',
  impact: 'Potential save: 8.8 kg/month',
  actions: ['Try it', 'Dismiss'],
}

const anomalyInsight: InsightCardInsight = {
  ...base,
  id: 'ins-anomaly',
  type: 'anomaly',
  color: '#F0956A',
  icon: '📈',
  title: 'Unusual spike on Friday',
  body: 'Your CO₂ emissions last Friday were 3× your daily average.',
  spark: [10, 12, 11, 13, 38, 14, 10],
  sparkHighlight: 4,
}

const streakInsight: InsightCardInsight = {
  ...base,
  id: 'ins-streak',
  type: 'streak',
  color: '#3DAB82',
  icon: '🔥',
  title: '5-day green commute streak',
  body: 'You have taken public transport or cycled every day this week.',
  progress: { current: 5, target: 7, label: 'Days' },
  actions: ['Keep it up'],
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('InsightCard — base structure', () => {
  it('renders title and body', () => {
    render(<InsightCard insight={base} />)
    expect(screen.getByText('First 100 km on foot')).toBeInTheDocument()
    expect(
      screen.getByText('You have walked or cycled a total of 100 km this year.'),
    ).toBeInTheDocument()
  })

  it('renders type chip with uppercased type text', () => {
    render(<InsightCard insight={base} />)
    expect(screen.getByText('MILESTONE')).toBeInTheDocument()
  })

  it('renders date string', () => {
    render(<InsightCard insight={base} />)
    expect(screen.getByText('May 20')).toBeInTheDocument()
  })

  it('renders icon in the badge', () => {
    render(<InsightCard insight={base} />)
    expect(screen.getByText('🏆')).toBeInTheDocument()
  })
})

describe('InsightCard — New dot', () => {
  it('shows "New" dot when insight.new is true', () => {
    render(<InsightCard insight={newInsight} />)
    expect(screen.getByTestId('new-dot')).toBeInTheDocument()
  })

  it('does not show "New" dot when insight.new is false', () => {
    render(<InsightCard insight={base} />)
    expect(screen.queryByTestId('new-dot')).not.toBeInTheDocument()
  })
})

// JSDOM normalises hex colors to rgb(...), so compare using a helper
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

describe('InsightCard — left border color', () => {
  it('applies left border matching insight.color', () => {
    const { container } = render(<InsightCard insight={base} />)
    const card = container.firstChild as HTMLElement
    // JSDOM converts #4A90C4 → rgb(74, 144, 196)
    expect(card.style.borderLeft).toBe(`4px solid ${hexToRgb(base.color)}`)
  })
})

describe('InsightCard — TIP type', () => {
  it('renders impact banner for TIP type', () => {
    render(<InsightCard insight={tipInsight} />)
    expect(screen.getByTestId('impact-banner')).toBeInTheDocument()
    expect(screen.getByText('Potential save: 8.8 kg/month')).toBeInTheDocument()
  })

  it('does not render impact banner for non-TIP types', () => {
    render(<InsightCard insight={base} />)
    expect(screen.queryByTestId('impact-banner')).not.toBeInTheDocument()
  })
})

describe('InsightCard — ANOMALY type', () => {
  it('renders sparkline for ANOMALY type', () => {
    render(<InsightCard insight={anomalyInsight} />)
    expect(screen.getByTestId('anomaly-sparkline')).toBeInTheDocument()
    expect(screen.getByTestId('sparkline-svg')).toBeInTheDocument()
  })

  it('does not render sparkline for non-ANOMALY types', () => {
    render(<InsightCard insight={base} />)
    expect(screen.queryByTestId('anomaly-sparkline')).not.toBeInTheDocument()
  })
})

describe('InsightCard — STREAK type', () => {
  it('renders progress bar for STREAK type', () => {
    render(<InsightCard insight={streakInsight} />)
    expect(screen.getByTestId('streak-progress')).toBeInTheDocument()
  })

  it('renders label with current/target values', () => {
    render(<InsightCard insight={streakInsight} />)
    expect(screen.getByText('Days: 5/7')).toBeInTheDocument()
  })

  it('progress fill width reflects current/target ratio', () => {
    render(<InsightCard insight={streakInsight} />)
    const fill = screen.getByTestId('progress-fill')
    // 5/7 ≈ 71%
    expect(fill.style.width).toBe('71%')
  })

  it('does not render progress bar for non-STREAK types', () => {
    render(<InsightCard insight={base} />)
    expect(screen.queryByTestId('streak-progress')).not.toBeInTheDocument()
  })
})

describe('InsightCard — Action buttons', () => {
  it('renders action buttons when actions are provided', () => {
    render(<InsightCard insight={tipInsight} />)
    expect(screen.getByRole('button', { name: 'Try it' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
  })

  it('does not render actions when actions array is empty', () => {
    render(<InsightCard insight={base} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

describe('InsightCard — Mark as read', () => {
  it('calls onRead with insight id when a new insight is clicked', () => {
    const onRead = vi.fn()
    render(<InsightCard insight={newInsight} onRead={onRead} />)

    fireEvent.click(screen.getByRole('article'))

    expect(onRead).toHaveBeenCalledWith('ins-001')
    expect(onRead).toHaveBeenCalledTimes(1)
  })

  it('removes the New dot after clicking (optimistic update)', () => {
    const onRead = vi.fn()
    render(<InsightCard insight={newInsight} onRead={onRead} />)

    expect(screen.getByTestId('new-dot')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('article'))

    expect(screen.queryByTestId('new-dot')).not.toBeInTheDocument()
  })

  it('does not call onRead when insight is already read', () => {
    const onRead = vi.fn()
    render(<InsightCard insight={base} onRead={onRead} />)

    fireEvent.click(screen.getByRole('article'))

    expect(onRead).not.toHaveBeenCalled()
  })
})
