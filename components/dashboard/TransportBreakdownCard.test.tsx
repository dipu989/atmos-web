// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { TransportBreakdownCard } from '@/components/dashboard/TransportBreakdownCard'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/hooks/useTrips', () => ({
  useTransportBreakdown: vi.fn(),
}))

vi.mock('@/components/charts/TransportBreakdownChart', () => ({
  TransportBreakdownChart: ({
    data,
  }: {
    data: { id: string; name: string; co2_kg: number; color: string }[]
  }) => (
    <div
      data-testid="transport-breakdown-chart"
      data-slice-count={data.length}
    />
  ),
  TRANSPORT_COLORS: {
    car: '#F0956A',
    train: '#4A90C4',
    bus: '#7BA9D4',
    cycling: '#3DAB82',
    walking: '#8AC9A8',
    flight: '#E05252',
  },
}))

import { useTransportBreakdown } from '@/lib/hooks/useTrips'

// ─── Helpers ──────────────────────────────────────────────────────────────────

type QueryResult = { mode: string; co2_kg: number; distance_km: number }[]

// biome-ignore lint: test helper - partial mock is intentional
function q(
  data: QueryResult | undefined,
  isLoading = false,
  isError = false,
): ReturnType<typeof useTransportBreakdown> {
  return { data, isLoading, isError, error: isError ? new Error('fail') : null }
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const mockBreakdown: QueryResult = [
  { mode: 'car', co2_kg: 5.2, distance_km: 42.0 },
  { mode: 'train', co2_kg: 2.1, distance_km: 120.0 },
  { mode: 'bus', co2_kg: 1.4, distance_km: 30.0 },
]

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('TransportBreakdownCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading skeleton while data is loading', () => {
    vi.mocked(useTransportBreakdown).mockReturnValue(q(undefined, true))

    render(<TransportBreakdownCard />)

    expect(screen.getByTestId('transport-breakdown-skeleton')).toBeInTheDocument()
  })

  it('renders legend rows matching data', () => {
    vi.mocked(useTransportBreakdown).mockReturnValue(q(mockBreakdown))

    render(<TransportBreakdownCard />)

    // Mode names should appear in legend
    expect(screen.getByText('Car')).toBeInTheDocument()
    expect(screen.getByText('Train')).toBeInTheDocument()
    expect(screen.getByText('Bus')).toBeInTheDocument()
  })

  it('shows empty state when data is empty array', () => {
    vi.mocked(useTransportBreakdown).mockReturnValue(q([]))

    render(<TransportBreakdownCard />)

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('No trips this month')).toBeInTheDocument()
    expect(screen.getByText('Add trips to see your transport breakdown.')).toBeInTheDocument()
  })

  it('excludes modes with zero co2_kg', () => {
    const dataWithZero: QueryResult = [
      { mode: 'car', co2_kg: 5.2, distance_km: 42.0 },
      { mode: 'walking', co2_kg: 0, distance_km: 3.0 },
    ]
    vi.mocked(useTransportBreakdown).mockReturnValue(q(dataWithZero))

    render(<TransportBreakdownCard />)

    expect(screen.getByText('Car')).toBeInTheDocument()
    expect(screen.queryByText('Walking')).not.toBeInTheDocument()
  })

  it('sorts legend rows by co2_kg descending', () => {
    vi.mocked(useTransportBreakdown).mockReturnValue(q(mockBreakdown))

    render(<TransportBreakdownCard />)

    const modeNames = screen.getAllByText(/^(Car|Train|Bus)$/)
    // First rendered should be Car (highest), then Train, then Bus
    expect(modeNames[0].textContent).toBe('Car')
    expect(modeNames[1].textContent).toBe('Train')
    expect(modeNames[2].textContent).toBe('Bus')
  })

  it('renders card title and subtitle', () => {
    vi.mocked(useTransportBreakdown).mockReturnValue(q(mockBreakdown))

    render(<TransportBreakdownCard />)

    expect(screen.getByText('Transport breakdown')).toBeInTheDocument()
    expect(screen.getByText('This month')).toBeInTheDocument()
  })

  it('shows error state on failure', () => {
    vi.mocked(useTransportBreakdown).mockReturnValue(q(undefined, false, true))

    render(<TransportBreakdownCard />)

    expect(screen.getByText('Could not load transport data')).toBeInTheDocument()
  })
})
