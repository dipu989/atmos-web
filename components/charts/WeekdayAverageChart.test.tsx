// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WeekdayAverageChart } from '@/components/charts/WeekdayAverageChart'

// ─── Mock Recharts ─────────────────────────────────────────────────────────────

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({
    children,
    data,
  }: {
    children: React.ReactNode
    data: { day: string; avg_kg: number }[]
  }) => (
    <div data-testid="bar-chart" data-bar-count={data.length}>
      {children}
    </div>
  ),
  Bar: ({
    children,
  }: {
    children: React.ReactNode
  }) => <div data-testid="bar">{children}</div>,
  Cell: ({
    fill,
    'data-day': day,
    'data-is-max': isMax,
  }: {
    fill: string
    'data-day': string
    'data-is-max': string
  }) => (
    <div
      data-testid="bar-cell"
      data-fill={fill}
      data-day={day}
      data-is-max={isMax}
    />
  ),
  XAxis:         () => null,
  YAxis:         () => null,
  CartesianGrid: () => null,
  Tooltip:       () => null,
}))

// ─── Mock data ─────────────────────────────────────────────────────────────────

const mockData = [
  { day: 'Mon', avg_kg: 3.2 },
  { day: 'Tue', avg_kg: 4.5 },
  { day: 'Wed', avg_kg: 2.1 },
  { day: 'Thu', avg_kg: 5.8 }, // max
  { day: 'Fri', avg_kg: 1.9 },
  { day: 'Sat', avg_kg: 3.7 },
  { day: 'Sun', avg_kg: 2.4 },
]

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('WeekdayAverageChart', () => {
  it('renders without crash', () => {
    render(<WeekdayAverageChart data={mockData} />)
    expect(screen.getByTestId('weekday-average-chart')).toBeInTheDocument()
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })

  it('renders 7 bars (Mon–Sun)', () => {
    render(<WeekdayAverageChart data={mockData} />)
    const chart = screen.getByTestId('bar-chart')
    expect(chart).toHaveAttribute('data-bar-count', '7')
  })

  it('renders a Cell for each day', () => {
    render(<WeekdayAverageChart data={mockData} />)
    const cells = screen.getAllByTestId('bar-cell')
    expect(cells).toHaveLength(7)
  })

  it('highest bar is distinguishable (orange #F0956A)', () => {
    render(<WeekdayAverageChart data={mockData} />)
    const cells = screen.getAllByTestId('bar-cell')
    const maxCell = cells.find((c) => c.getAttribute('data-is-max') === 'true')
    expect(maxCell).toBeDefined()
    expect(maxCell).toHaveAttribute('data-fill', '#F0956A')
  })

  it('non-max bars are blue #4A90C4', () => {
    render(<WeekdayAverageChart data={mockData} />)
    const cells   = screen.getAllByTestId('bar-cell')
    const nonMax  = cells.filter((c) => c.getAttribute('data-is-max') !== 'true')
    for (const cell of nonMax) {
      expect(cell).toHaveAttribute('data-fill', '#4A90C4')
    }
  })

  it('renders without crash when data is empty', () => {
    render(<WeekdayAverageChart data={[]} />)
    expect(screen.getByTestId('weekday-average-chart')).toBeInTheDocument()
  })
})
