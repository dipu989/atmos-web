// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WeeklyTrendChart } from '@/components/charts/WeeklyTrendChart'

// ─── Mock Recharts ─────────────────────────────────────────────────────────────
// Recharts relies on browser APIs (ResizeObserver, SVG layout) unavailable in jsdom.
// We replace chart primitives with lightweight test doubles.

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({
    children,
    data,
  }: {
    children: React.ReactNode
    data: { co2_kg: number }[]
  }) => (
    <div data-testid="area-chart" data-point-count={data.length}>
      {children}
    </div>
  ),
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ReferenceLine: ({ y }: { y: number }) => (
    <div data-testid="reference-line" data-goal={y} />
  ),
}))

// ─── Mock data ─────────────────────────────────────────────────────────────────

const mockData = [
  { day: 'Mon', date: 'May 16', co2_kg: 3.2 },
  { day: 'Tue', date: 'May 17', co2_kg: 4.5 },
  { day: 'Wed', date: 'May 18', co2_kg: 2.1 },
  { day: 'Thu', date: 'May 19', co2_kg: 5.8 },
  { day: 'Fri', date: 'May 20', co2_kg: 1.9 },
  { day: 'Sat', date: 'May 21', co2_kg: 3.7 },
  { day: 'Sun', date: 'May 22', co2_kg: 2.4 },
]

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('WeeklyTrendChart', () => {
  it('renders without crashing with valid data', () => {
    render(<WeeklyTrendChart data={mockData} goal={5} />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('renders correct number of data points', () => {
    render(<WeeklyTrendChart data={mockData} goal={5} />)
    const chart = screen.getByTestId('area-chart')
    expect(chart).toHaveAttribute('data-point-count', '7')
  })

  it('renders goal reference line', () => {
    render(<WeeklyTrendChart data={mockData} goal={5} />)
    const referenceLine = screen.getByTestId('reference-line')
    expect(referenceLine).toBeInTheDocument()
    expect(referenceLine).toHaveAttribute('data-goal', '5')
  })

  it('renders without crashing when data is empty', () => {
    render(<WeeklyTrendChart data={[]} goal={5} />)
    const chart = screen.getByTestId('area-chart')
    expect(chart).toHaveAttribute('data-point-count', '0')
  })
})
