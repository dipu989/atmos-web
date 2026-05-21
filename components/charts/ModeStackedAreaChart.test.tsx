// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  ModeStackedAreaChart,
  type ModeWeekData,
} from '@/components/charts/ModeStackedAreaChart'

// ─── Mock Recharts ─────────────────────────────────────────────────────────────
// Recharts relies on browser APIs unavailable in jsdom.

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({
    children,
    data,
  }: {
    children: React.ReactNode
    data: ModeWeekData[]
  }) => (
    <div data-testid="area-chart" data-point-count={data.length}>
      {children}
    </div>
  ),
  Area: ({ dataKey }: { dataKey: string }) => (
    <div data-testid="area-series" data-mode={dataKey} />
  ),
  XAxis:         () => null,
  YAxis:         () => null,
  CartesianGrid: () => null,
  Tooltip:       () => null,
  Legend:        () => null,
}))

// ─── Mock data ─────────────────────────────────────────────────────────────────

const mockData: ModeWeekData[] = [
  { week: 'Week 1', car: 4.2, train: 1.1, bus: 0.8, bike: 0.0, walk: 0.0 },
  { week: 'Week 2', car: 3.5, train: 2.0, bus: 1.2, bike: 0.3, walk: 0.1 },
  { week: 'Week 3', car: 5.1, train: 0.9, bus: 0.5, bike: 0.2, walk: 0.0 },
  { week: 'Week 4', car: 2.8, train: 1.8, bus: 0.7, bike: 0.5, walk: 0.2 },
]

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('ModeStackedAreaChart', () => {
  it('renders without crash', () => {
    render(<ModeStackedAreaChart data={mockData} />)
    expect(screen.getByTestId('mode-stacked-area-chart')).toBeInTheDocument()
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('renders correct number of area series (one per mode)', () => {
    render(<ModeStackedAreaChart data={mockData} />)
    const series = screen.getAllByTestId('area-series')
    // 5 modes: car, train, bus, bike, walk
    expect(series).toHaveLength(5)
  })

  it('renders area series for all expected modes', () => {
    render(<ModeStackedAreaChart data={mockData} />)
    const series = screen.getAllByTestId('area-series')
    const modes  = series.map((el) => el.getAttribute('data-mode'))
    expect(modes).toContain('car')
    expect(modes).toContain('train')
    expect(modes).toContain('bus')
    expect(modes).toContain('bike')
    expect(modes).toContain('walk')
  })

  it('passes correct data point count to chart', () => {
    render(<ModeStackedAreaChart data={mockData} />)
    const chart = screen.getByTestId('area-chart')
    expect(chart).toHaveAttribute('data-point-count', '4')
  })

  it('renders without crash when data is empty', () => {
    render(<ModeStackedAreaChart data={[]} />)
    expect(screen.getByTestId('mode-stacked-area-chart')).toBeInTheDocument()
    const chart = screen.getByTestId('area-chart')
    expect(chart).toHaveAttribute('data-point-count', '0')
  })
})
