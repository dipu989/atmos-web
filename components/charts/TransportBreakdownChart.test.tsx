// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  TransportBreakdownChart,
  type TransportModeData,
} from '@/components/charts/TransportBreakdownChart'

// ─── Mock Recharts ─────────────────────────────────────────────────────────────
// Recharts relies on browser APIs (ResizeObserver, SVG layout) unavailable in jsdom.

vi.mock('recharts', () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({
    children,
    data,
  }: {
    children: React.ReactNode
    data: TransportModeData[]
  }) => (
    <div data-testid="pie" data-slice-count={data.length}>
      {children}
    </div>
  ),
  Cell: ({ fill }: { fill: string }) => (
    <div data-testid="pie-cell" data-fill={fill} />
  ),
  Tooltip: () => null,
  Sector: () => null,
}))

// ─── Mock data ─────────────────────────────────────────────────────────────────

const mockData: TransportModeData[] = [
  { id: 'car', name: 'Car', co2_kg: 5.2, color: '#F0956A' },
  { id: 'train', name: 'Train', co2_kg: 2.1, color: '#4A90C4' },
  { id: 'bus', name: 'Bus', co2_kg: 1.4, color: '#7BA9D4' },
]

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('TransportBreakdownChart', () => {
  it('renders without crash with valid data', () => {
    render(<TransportBreakdownChart data={mockData} />)
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('shows correct total CO₂ in center label', () => {
    render(<TransportBreakdownChart data={mockData} />)
    const total = mockData.reduce((sum, d) => sum + d.co2_kg, 0)
    const centerLabel = screen.getByTestId('chart-total')
    expect(centerLabel.textContent).toBe(total.toFixed(1))
  })

  it('renders correct number of pie slices', () => {
    render(<TransportBreakdownChart data={mockData} />)
    const pie = screen.getByTestId('pie')
    expect(pie).toHaveAttribute('data-slice-count', String(mockData.length))
  })

  it('renders zero total when data is empty', () => {
    render(<TransportBreakdownChart data={[]} />)
    const centerLabel = screen.getByTestId('chart-total')
    expect(centerLabel.textContent).toBe('0.0')
  })

  it('renders a Cell for each data entry', () => {
    render(<TransportBreakdownChart data={mockData} />)
    const cells = screen.getAllByTestId('pie-cell')
    expect(cells).toHaveLength(mockData.length)
    expect(cells[0]).toHaveAttribute('data-fill', '#F0956A')
    expect(cells[1]).toHaveAttribute('data-fill', '#4A90C4')
  })
})
