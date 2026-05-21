// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WeeklyDigestHero } from '@/components/insights/WeeklyDigestHero'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const baseInsight = {
  type: 'WEEKLY DIGEST',
  title: 'Your weekly carbon footprint',
  body: 'You emitted 33.5 kg CO₂ across 21 trips this week.',
  metric: {
    primary: '33.5 kg',
    sub: '21 trips · 7 days',
    delta: -8,
  },
  spark: [40, 38, 45, 30, 28, 35, 33],
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('WeeklyDigestHero', () => {
  it('renders the correct title and body', () => {
    render(<WeeklyDigestHero insight={baseInsight} />)

    expect(screen.getByText('Your weekly carbon footprint')).toBeInTheDocument()
    expect(
      screen.getByText('You emitted 33.5 kg CO₂ across 21 trips this week.'),
    ).toBeInTheDocument()
  })

  it('type chip shows "WEEKLY DIGEST"', () => {
    render(<WeeklyDigestHero insight={baseInsight} />)

    expect(screen.getByText('WEEKLY DIGEST')).toBeInTheDocument()
  })

  it('primary metric and sub text render correctly', () => {
    render(<WeeklyDigestHero insight={baseInsight} />)

    expect(screen.getByText('33.5 kg')).toBeInTheDocument()
    expect(screen.getByText('21 trips · 7 days')).toBeInTheDocument()
  })

  it('negative delta shows green downward badge', () => {
    render(<WeeklyDigestHero insight={baseInsight} />)

    const badge = screen.getByTestId('delta-down')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('8% vs last week')
    // Green color
    expect(badge).toHaveStyle({ color: '#3DAB82' })
  })

  it('positive delta shows orange upward badge', () => {
    const insight = {
      ...baseInsight,
      metric: { ...baseInsight.metric, delta: 12 },
    }
    render(<WeeklyDigestHero insight={insight} />)

    const badge = screen.getByTestId('delta-up')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('12% vs last week')
    // Orange color
    expect(badge).toHaveStyle({ color: '#F0956A' })
  })

  it('sparkline SVG element is present', () => {
    render(<WeeklyDigestHero insight={baseInsight} />)

    expect(screen.getByTestId('sparkline-svg')).toBeInTheDocument()
  })

  it('highlighted (peak) sparkline point is rendered', () => {
    render(<WeeklyDigestHero insight={baseInsight} />)

    // spark = [40, 38, 45, 30, 28, 35, 33] — peak is 45 at index 2
    expect(screen.getByTestId('sparkline-peak')).toBeInTheDocument()
  })

  it('zero delta shows orange badge (not an improvement)', () => {
    const insight = {
      ...baseInsight,
      metric: { ...baseInsight.metric, delta: 0 },
    }
    render(<WeeklyDigestHero insight={insight} />)

    // delta === 0 is not negative, so orange/up
    expect(screen.getByTestId('delta-up')).toBeInTheDocument()
  })
})
