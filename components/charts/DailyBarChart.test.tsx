// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DailyBarChart } from '@/components/charts/DailyBarChart'

// ─── Mock Recharts ─────────────────────────────────────────────────────────────
// Recharts relies on browser APIs (ResizeObserver, SVG layout) unavailable in jsdom.
// We replace chart primitives with lightweight test doubles.

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({
    children,
    data,
  }: {
    children: React.ReactNode
    data: { co2_kg: number }[]
  }) => (
    <div data-testid="bar-chart" data-bar-count={data.length}>
      {children}
    </div>
  ),
  Bar: ({
    children,
  }: {
    children: React.ReactNode
  }) => <div data-testid="bar-series">{children}</div>,
  Cell: ({ fill }: { fill: string }) => (
    <div data-testid="bar-cell" data-fill={fill} />
  ),
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ReferenceLine: ({ y }: { y: number }) => (
    <div data-testid="reference-line" data-goal={y} />
  ),
}))

// ─── Mock data ─────────────────────────────────────────────────────────────────

const makeData = (count: number, co2_kg = 2.0) =>
  Array.from({ length: count }, (_, i) => ({
    date: `2026-05-${String(i + 1).padStart(2, '0')}`,
    co2_kg,
    label: `May ${i + 1}`,
  }))

const mockData30 = makeData(30)

const mockDataWithOverGoal = [
  ...makeData(5, 2.0),
  { date: '2026-05-06', co2_kg: 8.0, label: 'May 6' }, // over goal (goal=5)
  ...makeData(4, 1.5).map((d, i) => ({
    ...d,
    date: `2026-05-${String(i + 7).padStart(2, '0')}`,
    label: `May ${i + 7}`,
  })),
]

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('DailyBarChart', () => {
  it('renders without crash', () => {
    render(<DailyBarChart data={mockData30} goal={5} />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('renders correct number of bars', () => {
    render(<DailyBarChart data={mockData30} goal={5} />)
    const chart = screen.getByTestId('bar-chart')
    expect(chart).toHaveAttribute('data-bar-count', '30')
  })

  it('renders goal reference line', () => {
    render(<DailyBarChart data={mockData30} goal={5} />)
    const refLine = screen.getByTestId('reference-line')
    expect(refLine).toBeInTheDocument()
    expect(refLine).toHaveAttribute('data-goal', '5')
  })

  it('renders over-goal bars without crashing', () => {
    render(<DailyBarChart data={mockDataWithOverGoal} goal={5} />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    // Should have cells for each data point
    const cells = screen.getAllByTestId('bar-cell')
    expect(cells.length).toBeGreaterThan(0)
  })

  it('colors over-goal bars orange', () => {
    render(<DailyBarChart data={mockDataWithOverGoal} goal={5} />)
    const cells = screen.getAllByTestId('bar-cell')
    // The 6th cell (index 5) has co2_kg=8 which is over goal=5 → should be orange
    const overGoalCell = cells[5]
    expect(overGoalCell).toHaveAttribute('data-fill', '#F0956A')
  })

  it('colors under-goal bars blue', () => {
    render(<DailyBarChart data={mockDataWithOverGoal} goal={5} />)
    const cells = screen.getAllByTestId('bar-cell')
    // First cell has co2_kg=2 which is under goal=5 → should be blue
    expect(cells[0]).toHaveAttribute('data-fill', '#4A90C4')
  })

  it('renders with empty data without crashing', () => {
    render(<DailyBarChart data={[]} goal={5} />)
    const chart = screen.getByTestId('bar-chart')
    expect(chart).toHaveAttribute('data-bar-count', '0')
  })
})
