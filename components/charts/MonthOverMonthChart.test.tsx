// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MonthOverMonthChart } from '@/components/charts/MonthOverMonthChart'

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
    data: unknown[]
  }) => (
    <div data-testid="bar-chart" data-point-count={data.length}>
      {children}
    </div>
  ),
  Bar: ({ dataKey, fill }: { dataKey: string; fill: string }) => (
    <div data-testid={`bar-series-${dataKey}`} data-fill={fill} />
  ),
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}))

// ─── Mock data ─────────────────────────────────────────────────────────────────

const mockData = [
  { week: 'Week 1', current: 12.4, previous: 15.2 },
  { week: 'Week 2', current: 10.1, previous: 13.5 },
  { week: 'Week 3', current: 8.7, previous: 11.0 },
  { week: 'Week 4', current: 9.3, previous: 12.8 },
]

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('MonthOverMonthChart', () => {
  it('renders without crash', () => {
    render(<MonthOverMonthChart data={mockData} />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('renders two bar series', () => {
    render(<MonthOverMonthChart data={mockData} />)
    expect(screen.getByTestId('bar-series-current')).toBeInTheDocument()
    expect(screen.getByTestId('bar-series-previous')).toBeInTheDocument()
  })

  it('current bar series is blue', () => {
    render(<MonthOverMonthChart data={mockData} />)
    const currentBar = screen.getByTestId('bar-series-current')
    expect(currentBar).toHaveAttribute('data-fill', '#4A90C4')
  })

  it('previous bar series is gray', () => {
    render(<MonthOverMonthChart data={mockData} />)
    const previousBar = screen.getByTestId('bar-series-previous')
    expect(previousBar).toHaveAttribute('data-fill', '#C5CCD6')
  })

  it('renders legend with This month label', () => {
    render(<MonthOverMonthChart data={mockData} />)
    expect(screen.getByTestId('legend-current')).toBeInTheDocument()
    expect(screen.getByText('This month')).toBeInTheDocument()
  })

  it('renders legend with Last month label', () => {
    render(<MonthOverMonthChart data={mockData} />)
    expect(screen.getByTestId('legend-previous')).toBeInTheDocument()
    expect(screen.getByText('Last month')).toBeInTheDocument()
  })

  it('renders correct number of data points', () => {
    render(<MonthOverMonthChart data={mockData} />)
    const chart = screen.getByTestId('bar-chart')
    expect(chart).toHaveAttribute('data-point-count', '4')
  })

  it('renders with empty data without crashing', () => {
    render(<MonthOverMonthChart data={[]} />)
    const chart = screen.getByTestId('bar-chart')
    expect(chart).toHaveAttribute('data-point-count', '0')
  })
})
