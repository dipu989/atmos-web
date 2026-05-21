// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { RecentTripsList } from '@/components/dashboard/RecentTripsList'
import type { Trip, PaginatedResponse } from '@/types/index'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/hooks/useTrips', () => ({
  useTrips: vi.fn(),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

import { useTrips } from '@/lib/hooks/useTrips'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// biome-ignore lint: test helper — partial mock is intentional
function q(
  data: PaginatedResponse<Trip> | undefined,
  isLoading = false,
  isError = false,
): ReturnType<typeof useTrips> {
  return { data, isLoading, isError, error: isError ? new Error('fail') : null }
}

function makePaginated(trips: Trip[]): PaginatedResponse<Trip> {
  return { items: trips, total: trips.length, limit: 5, offset: 0 }
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const NOW = new Date().toISOString()

const makeTrip = (overrides: Partial<Trip> = {}): Trip => ({
  id:            overrides.id ?? 't1',
  userId:        'u1',
  activityType:  'transport',
  transportMode: 'car',
  distanceKm:    10,
  source:        'manual',
  startedAt:     NOW,
  dateLocal:     NOW.slice(0, 10),
  status:        'processed',
  createdAt:     NOW,
  updatedAt:     NOW,
  from:          'Home',
  to:            'Office',
  co2Kg:         1.2,
  ...overrides,
})

const FIVE_TRIPS: Trip[] = Array.from({ length: 5 }, (_, i) =>
  makeTrip({ id: `t${i + 1}` }),
)

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('RecentTripsList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows 5 skeleton rows while loading', () => {
    vi.mocked(useTrips).mockReturnValue(q(undefined, true))

    render(<RecentTripsList />)

    const skeletons = screen.getAllByTestId('trip-row-skeleton')
    expect(skeletons).toHaveLength(5)
  })

  it('renders correct number of trip rows', () => {
    vi.mocked(useTrips).mockReturnValue(q(makePaginated(FIVE_TRIPS)))

    render(<RecentTripsList />)

    // Each trip has "Home → Office" route text
    const routeTexts = screen.getAllByText('Home')
    expect(routeTexts).toHaveLength(5)
  })

  it('zero-emission trip row CO₂ value is green', () => {
    const zeroTrip = makeTrip({ id: 'z1', co2Kg: 0 })
    vi.mocked(useTrips).mockReturnValue(q(makePaginated([zeroTrip])))

    render(<RecentTripsList />)

    const co2El = screen.getByTestId('co2-value')
    expect(co2El).toHaveStyle({ color: 'rgb(61, 171, 130)' }) // #3DAB82
    expect(co2El).toHaveTextContent('0.0')
  })

  it('high-emission (> 2 kg) trip row CO₂ is orange', () => {
    const highTrip = makeTrip({ id: 'h1', co2Kg: 3.5 })
    vi.mocked(useTrips).mockReturnValue(q(makePaginated([highTrip])))

    render(<RecentTripsList />)

    const co2El = screen.getByTestId('co2-value')
    expect(co2El).toHaveStyle({ color: 'rgb(240, 149, 106)' }) // #F0956A
    expect(co2El).toHaveTextContent('3.5')
  })

  it('"View all" link points to /trips', () => {
    vi.mocked(useTrips).mockReturnValue(q(makePaginated(FIVE_TRIPS)))

    render(<RecentTripsList />)

    const link = screen.getByRole('link', { name: /view all/i })
    expect(link).toHaveAttribute('href', '/trips')
  })

  it('empty state shown when trips array is empty', () => {
    vi.mocked(useTrips).mockReturnValue(q(makePaginated([])))

    render(<RecentTripsList />)

    expect(screen.getByText('No trips yet')).toBeInTheDocument()
    expect(screen.getByText('Start by adding your first trip')).toBeInTheDocument()
  })

  it('shows error state when query fails', () => {
    vi.mocked(useTrips).mockReturnValue(q(undefined, false, true))

    render(<RecentTripsList />)

    expect(screen.getByText('Could not load recent trips')).toBeInTheDocument()
  })

  it('mid-range CO₂ (0 < x ≤ 2) is dark text-primary color', () => {
    const midTrip = makeTrip({ id: 'm1', co2Kg: 1.5 })
    vi.mocked(useTrips).mockReturnValue(q(makePaginated([midTrip])))

    render(<RecentTripsList />)

    const co2El = screen.getByTestId('co2-value')
    expect(co2El).toHaveStyle({ color: 'rgb(26, 35, 50)' }) // #1A2332
  })
})
