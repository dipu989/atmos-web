// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TripsTable } from '@/components/trips/TripsTable'
import type { Trip } from '@/types/index'

// ─── Mock data ─────────────────────────────────────────────────────────────────

const FIXED_DATE = '2024-01-15T10:00:00Z'

const makeTrip = (overrides: Partial<Trip> = {}): Trip => ({
  id:              'default-id',
  userId:          'u1',
  activityType:    'transport',
  transportMode:   'car',
  distanceKm:      10,
  durationMinutes: 30,
  source:          'manual',
  startedAt:       FIXED_DATE,
  dateLocal:       '2024-01-15',
  status:          'processed',
  createdAt:       FIXED_DATE,
  updatedAt:       FIXED_DATE,
  from:            'Home',
  to:              'Office',
  co2Kg:           1.2,
  ...overrides,
})

const TRIPS_3: Trip[] = [
  makeTrip({ id: 't1', from: 'Home',   to: 'Office' }),
  makeTrip({ id: 't2', from: 'Office', to: 'Gym'    }),
  makeTrip({ id: 't3', from: 'Gym',    to: 'Home'   }),
]

function mkProps(overrides: Partial<{
  trips: Trip[]
  total: number
  page: number
  pageSize: number
  onPageChange: (p: number) => void
  loading: boolean
}> = {}) {
  return {
    trips:        TRIPS_3,
    total:        3,
    page:         1,
    pageSize:     20,
    onPageChange: vi.fn(),
    loading:      false,
    ...overrides,
  }
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('TripsTable', () => {
  it('renders correct number of trip rows', () => {
    render(<TripsTable {...mkProps()} />)

    // Rows are visible — each has route text. "Home" appears twice (t1 from, t3 to)
    expect(screen.getAllByText('Home')).toHaveLength(2)
    expect(screen.getAllByText(/^Office$/)).toHaveLength(2)
    expect(screen.getAllByText(/^Gym$/)).toHaveLength(2)

    // No skeleton rows shown
    expect(screen.queryAllByTestId('trip-skeleton-row')).toHaveLength(0)
  })

  it('loading state shows 12 skeleton rows', () => {
    render(<TripsTable {...mkProps({ loading: true })} />)

    const skeletons = screen.getAllByTestId('trip-skeleton-row')
    expect(skeletons).toHaveLength(12)
  })

  it('loading state hides trip rows', () => {
    render(<TripsTable {...mkProps({ loading: true })} />)

    // Trip text should not appear while loading
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
  })

  it('empty state shown when trips is empty array', () => {
    render(<TripsTable {...mkProps({ trips: [], total: 0 })} />)

    expect(screen.getByText('No trips match these filters')).toBeInTheDocument()
    expect(
      screen.getByText('Try widening the date range or clearing the search.'),
    ).toBeInTheDocument()
  })

  it('empty state not shown when loading', () => {
    render(<TripsTable {...mkProps({ trips: [], total: 0, loading: true })} />)

    expect(screen.queryByText('No trips match these filters')).not.toBeInTheDocument()
  })

  it('clicking sort header on active key toggles asc→desc', () => {
    render(<TripsTable {...mkProps()} />)

    // Default sort is Date descending
    expect(screen.getByText('Sorted by Date (descending)')).toBeInTheDocument()

    // Click Date to toggle to ascending
    fireEvent.click(screen.getByRole('button', { name: /^Date/i }))
    expect(screen.getByText('Sorted by Date (ascending)')).toBeInTheDocument()
  })

  it('clicking sort header on active key toggles desc→asc', () => {
    render(<TripsTable {...mkProps()} />)

    // First click: desc → asc
    fireEvent.click(screen.getByRole('button', { name: /^Date/i }))
    expect(screen.getByText('Sorted by Date (ascending)')).toBeInTheDocument()

    // Second click: asc → desc
    fireEvent.click(screen.getByRole('button', { name: /^Date/i }))
    expect(screen.getByText('Sorted by Date (descending)')).toBeInTheDocument()
  })

  it('clicking different column header changes active sort key to asc', () => {
    render(<TripsTable {...mkProps()} />)

    // Click Distance header (different from default Date)
    fireEvent.click(screen.getByRole('button', { name: /^Distance/i }))
    expect(screen.getByText('Sorted by Distance (ascending)')).toBeInTheDocument()
  })

  it('all 6 sort column headers are rendered', () => {
    render(<TripsTable {...mkProps()} />)

    for (const label of ['Route', 'Date', 'Distance', 'Duration', 'CO₂', 'Source']) {
      expect(screen.getByRole('button', { name: new RegExp(`^${label}`, 'i') })).toBeInTheDocument()
    }
  })

  it('pagination shows page numbers for multi-page results', () => {
    const trips20 = Array.from({ length: 20 }, (_, i) =>
      makeTrip({ id: `t${i}` }),
    )
    render(
      <TripsTable
        trips={trips20}
        total={100}
        page={1}
        pageSize={20}
        onPageChange={vi.fn()}
        loading={false}
      />,
    )

    expect(screen.getByLabelText('Page 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Page 2')).toBeInTheDocument()
  })

  it('prev button disabled on first page', () => {
    render(
      <TripsTable
        trips={TRIPS_3}
        total={60}
        page={1}
        pageSize={20}
        onPageChange={vi.fn()}
        loading={false}
      />,
    )
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
  })

  it('prev button enabled on non-first page', () => {
    render(
      <TripsTable
        trips={TRIPS_3}
        total={60}
        page={2}
        pageSize={20}
        onPageChange={vi.fn()}
        loading={false}
      />,
    )
    expect(screen.getByLabelText('Previous page')).not.toBeDisabled()
  })

  it('next button disabled on last page', () => {
    render(
      <TripsTable
        trips={TRIPS_3}
        total={60}
        page={3}
        pageSize={20}
        onPageChange={vi.fn()}
        loading={false}
      />,
    )
    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })

  it('next button enabled on non-last page', () => {
    render(
      <TripsTable
        trips={TRIPS_3}
        total={60}
        page={1}
        pageSize={20}
        onPageChange={vi.fn()}
        loading={false}
      />,
    )
    expect(screen.getByLabelText('Next page')).not.toBeDisabled()
  })

  it('clicking next page button calls onPageChange with page+1', () => {
    const onPageChange = vi.fn()
    render(
      <TripsTable
        trips={TRIPS_3}
        total={60}
        page={2}
        pageSize={20}
        onPageChange={onPageChange}
        loading={false}
      />,
    )
    fireEvent.click(screen.getByLabelText('Next page'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('clicking prev page button calls onPageChange with page-1', () => {
    const onPageChange = vi.fn()
    render(
      <TripsTable
        trips={TRIPS_3}
        total={60}
        page={2}
        pageSize={20}
        onPageChange={onPageChange}
        loading={false}
      />,
    )
    fireEvent.click(screen.getByLabelText('Previous page'))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('summary row shows correct counts and totals', () => {
    const trips = [
      makeTrip({ id: 't1', distanceKm: 10, co2Kg: 1.0 }),
      makeTrip({ id: 't2', distanceKm: 20, co2Kg: 2.5 }),
    ]
    render(<TripsTable {...mkProps({ trips, total: 50 })} />)

    expect(screen.getByText('2 of 50 trips')).toBeInTheDocument()
    expect(screen.getByText(/30\.0 km/)).toBeInTheDocument()
    expect(screen.getByText(/3\.5 kg CO₂/)).toBeInTheDocument()
  })

  it('detected source shows "Detected" badge', () => {
    const trip = makeTrip({ id: 'det', source: 'uber' })
    render(<TripsTable {...mkProps({ trips: [trip], total: 1 })} />)
    expect(screen.getByText('Detected')).toBeInTheDocument()
  })

  it('manual source shows "Manual" badge', () => {
    const trip = makeTrip({ id: 'man', source: 'manual' })
    render(<TripsTable {...mkProps({ trips: [trip], total: 1 })} />)
    expect(screen.getByText('Manual')).toBeInTheDocument()
  })
})
