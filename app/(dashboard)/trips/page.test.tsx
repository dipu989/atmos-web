// @vitest-environment jsdom
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import * as authModule from '@/lib/auth'
import TripsPage from './page'

function makeOkBlobResponse(body = 'date,distance\n2024-01-15,10') {
  return {
    ok: true,
    status: 200,
    blob: () => Promise.resolve(new Blob([body], { type: 'text/csv' })),
  } as unknown as Response
}

// ─── Mock next/navigation ─────────────────────────────────────────────────────

const mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

// ─── Mock useTrips ─────────────────────────────────────────────────────────────

const mockUseTrips = vi.fn()

vi.mock('@/lib/hooks/useTrips', () => ({
  useTrips: (params: unknown) => mockUseTrips(params),
}))

// ─── Mock child components ─────────────────────────────────────────────────────

vi.mock('@/components/layout/PageShell', () => ({
  PageShell: ({
    title,
    subtitle,
    rightExtra,
    children,
  }: {
    title: string
    subtitle?: string
    rightExtra?: React.ReactNode
    children: React.ReactNode
  }) => (
    <div data-testid="page-shell">
      <h1>{title}</h1>
      {subtitle && <p data-testid="subtitle">{subtitle}</p>}
      {rightExtra && <div data-testid="right-extra">{rightExtra}</div>}
      {children}
    </div>
  ),
}))

vi.mock('@/components/trips/TripStatsStrip', () => ({
  TripStatsStrip: ({
    totalTrips,
    loading,
  }: {
    totalTrips: number
    loading?: boolean
  }) => (
    <div
      data-testid="trip-stats-strip"
      data-total={totalTrips}
      data-loading={loading ? 'true' : 'false'}
    />
  ),
}))

vi.mock('@/components/trips/TripsFilters', () => ({
  TripsFilters: ({
    mode,
    search,
    source,
    onModeChange,
    onSearchChange,
    onSourceChange,
  }: {
    mode: string
    search: string
    source: string
    onModeChange: (m: string) => void
    onSearchChange: (s: string) => void
    onSourceChange: (s: 'all' | 'auto' | 'manual') => void
  }) => (
    <div data-testid="trips-filters" data-mode={mode} data-search={search} data-source={source}>
      <button data-testid="set-car-mode" onClick={() => onModeChange('car')}>
        Car
      </button>
      <button data-testid="set-search" onClick={() => onSearchChange('London')}>
        Search London
      </button>
      <button data-testid="set-source-manual" onClick={() => onSourceChange('manual')}>
        Manual
      </button>
    </div>
  ),
}))

vi.mock('@/components/trips/TripsTable', () => ({
  TripsTable: ({
    trips,
    total,
    page,
    onPageChange,
    loading,
  }: {
    trips: unknown[]
    total: number
    page: number
    pageSize: number
    onPageChange: (p: number) => void
    loading: boolean
  }) => (
    <div
      data-testid="trips-table"
      data-page={page}
      data-total={total}
      data-loading={loading ? 'true' : 'false'}
      data-trip-count={trips.length}
    >
      <button data-testid="go-page-2" onClick={() => onPageChange(2)}>
        Page 2
      </button>
    </div>
  ),
}))

// ─── Shared mock data ──────────────────────────────────────────────────────────

const MOCK_TRIPS = [
  {
    id: 't1',
    userId: 'u1',
    activityType: 'transport',
    transportMode: 'car',
    distanceKm: 10,
    durationMinutes: 20,
    source: 'manual',
    startedAt: '2024-01-15T10:00:00Z',
    dateLocal: '2024-01-15',
    status: 'processed',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    from: 'Home',
    to: 'Office',
    co2Kg: 1.2,
  },
  {
    id: 't2',
    userId: 'u1',
    activityType: 'transport',
    transportMode: 'train',
    distanceKm: 25,
    durationMinutes: 45,
    source: 'uber',
    startedAt: '2024-01-16T09:00:00Z',
    dateLocal: '2024-01-16',
    status: 'processed',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    from: 'Station',
    to: 'City',
    co2Kg: 0.5,
  },
]

const DEFAULT_PAGED_RESPONSE = { items: MOCK_TRIPS, total: 2, limit: 12, offset: 0 }
const DEFAULT_ALL_RESPONSE = { items: MOCK_TRIPS, total: 2, limit: 1000, offset: 0 }

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('TripsPage', () => {
  let fetchSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    // Clear URL params between tests
    mockSearchParams.delete('q')
    mockSearchParams.delete('mode')

    // Default: first call (paged) returns paged data, second call (all) returns full data
    mockUseTrips.mockImplementation((params: { limit?: number }) => {
      if (params?.limit === 1000) {
        return { data: DEFAULT_ALL_RESPONSE, isLoading: false, isError: false }
      }
      return { data: DEFAULT_PAGED_RESPONSE, isLoading: false, isError: false }
    })

    fetchSpy = vi.fn().mockResolvedValue(makeOkBlobResponse())
    vi.stubGlobal('fetch', fetchSpy)
    vi.spyOn(authModule, 'getAccessToken').mockReturnValue('mock-bearer-token')
    // jsdom's URL has no createObjectURL/revokeObjectURL — add them without
    // replacing the constructor itself (buildUrl() needs `new URL()` to work).
    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
    URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the page title', () => {
    render(<TripsPage />)
    expect(screen.getByText('Trips')).toBeInTheDocument()
  })

  it('renders PageShell with subtitle', () => {
    render(<TripsPage />)
    expect(screen.getByTestId('subtitle')).toHaveTextContent(
      'Browse and filter every trip Atmos has logged for you.',
    )
  })

  it('renders TripStatsStrip', () => {
    render(<TripsPage />)
    expect(screen.getByTestId('trip-stats-strip')).toBeInTheDocument()
  })

  it('renders TripsFilters', () => {
    render(<TripsPage />)
    expect(screen.getByTestId('trips-filters')).toBeInTheDocument()
  })

  it('renders TripsTable', () => {
    render(<TripsPage />)
    expect(screen.getByTestId('trips-table')).toBeInTheDocument()
  })

  it('renders ExportButton in the header area', () => {
    render(<TripsPage />)
    expect(screen.getByTestId('export-button')).toBeInTheDocument()
    expect(screen.getByText('Export CSV')).toBeInTheDocument()
  })

  it('export button calls the export endpoint with the bearer token', async () => {
    render(<TripsPage />)

    await act(async () => {
      fireEvent.click(screen.getByTestId('export-button'))
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/activities/export'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer mock-bearer-token' }),
      }),
    )
  })

  it('disables the export button and shows "Exporting…" while the request is in flight', async () => {
    let resolveFetch: (response: Response) => void = () => {}
    fetchSpy.mockReturnValue(new Promise((resolve) => { resolveFetch = resolve }))

    render(<TripsPage />)
    fireEvent.click(screen.getByTestId('export-button'))

    expect(screen.getByTestId('export-button')).toBeDisabled()
    expect(screen.getByText('Exporting…')).toBeInTheDocument()

    await act(async () => {
      resolveFetch(makeOkBlobResponse())
    })

    expect(screen.getByTestId('export-button')).not.toBeDisabled()
    expect(screen.getByText('Export CSV')).toBeInTheDocument()
  })

  it('shows an alert when the export request fails', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    fetchSpy.mockResolvedValue({ ok: false, status: 500 } as Response)

    render(<TripsPage />)
    await act(async () => {
      fireEvent.click(screen.getByTestId('export-button'))
    })

    expect(alertSpy).toHaveBeenCalledWith('Export failed. Please try again.')
    alertSpy.mockRestore()
  })

  it('starts on page 1', () => {
    render(<TripsPage />)
    expect(screen.getByTestId('trips-table')).toHaveAttribute('data-page', '1')
  })

  it('shows loading state from full-dataset query in stats strip', () => {
    mockUseTrips.mockImplementation((params: { limit?: number }) => {
      if (params?.limit === 1000) {
        return { data: undefined, isLoading: true, isError: false }
      }
      return { data: DEFAULT_PAGED_RESPONSE, isLoading: false, isError: false }
    })

    render(<TripsPage />)
    expect(screen.getByTestId('trip-stats-strip')).toHaveAttribute('data-loading', 'true')
  })

  it('shows an error message instead of the table when the paged trips query fails', () => {
    mockUseTrips.mockImplementation((params: { limit?: number }) => {
      if (params?.limit === 1000) {
        return { data: DEFAULT_ALL_RESPONSE, isLoading: false, isError: false }
      }
      return { data: undefined, isLoading: false, isError: true }
    })

    render(<TripsPage />)
    expect(screen.getByText('Could not load trips. Please try again.')).toBeInTheDocument()
    expect(screen.queryByTestId('trips-table')).not.toBeInTheDocument()
  })

  it('shows an error message instead of the table when the full-dataset trips query fails', () => {
    mockUseTrips.mockImplementation((params: { limit?: number }) => {
      if (params?.limit === 1000) {
        return { data: undefined, isLoading: false, isError: true }
      }
      return { data: DEFAULT_PAGED_RESPONSE, isLoading: false, isError: false }
    })

    render(<TripsPage />)
    expect(screen.getByText('Could not load trips. Please try again.')).toBeInTheDocument()
    expect(screen.queryByTestId('trips-table')).not.toBeInTheDocument()
  })

  describe('URL params applied on mount', () => {
    it('applies ?mode=car from URL to initial filter state', () => {
      mockSearchParams.set('mode', 'car')

      render(<TripsPage />)

      expect(screen.getByTestId('trips-filters')).toHaveAttribute('data-mode', 'car')
    })

    it('applies ?q=London from URL to initial search state', () => {
      mockSearchParams.set('q', 'London')

      render(<TripsPage />)

      expect(screen.getByTestId('trips-filters')).toHaveAttribute('data-search', 'London')
    })

    it('defaults to mode=all and search="" when no URL params', () => {
      render(<TripsPage />)

      const filters = screen.getByTestId('trips-filters')
      expect(filters).toHaveAttribute('data-mode', 'all')
      expect(filters).toHaveAttribute('data-search', '')
    })
  })

  describe('page resets to 1 when filters change', () => {
    it('resets page to 1 when mode changes', async () => {
      render(<TripsPage />)

      // Navigate to page 2
      act(() => {
        fireEvent.click(screen.getByTestId('go-page-2'))
      })
      expect(screen.getByTestId('trips-table')).toHaveAttribute('data-page', '2')

      // Change mode filter
      act(() => {
        fireEvent.click(screen.getByTestId('set-car-mode'))
      })
      expect(screen.getByTestId('trips-table')).toHaveAttribute('data-page', '1')
    })

    it('resets page to 1 when search changes', async () => {
      render(<TripsPage />)

      act(() => {
        fireEvent.click(screen.getByTestId('go-page-2'))
      })
      expect(screen.getByTestId('trips-table')).toHaveAttribute('data-page', '2')

      act(() => {
        fireEvent.click(screen.getByTestId('set-search'))
      })
      expect(screen.getByTestId('trips-table')).toHaveAttribute('data-page', '1')
    })

    it('resets page to 1 when source changes', async () => {
      render(<TripsPage />)

      act(() => {
        fireEvent.click(screen.getByTestId('go-page-2'))
      })
      expect(screen.getByTestId('trips-table')).toHaveAttribute('data-page', '2')

      act(() => {
        fireEvent.click(screen.getByTestId('set-source-manual'))
      })
      expect(screen.getByTestId('trips-table')).toHaveAttribute('data-page', '1')
    })
  })

  it('renders without crash at 375px mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 })
    expect(() => render(<TripsPage />)).not.toThrow()
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
  })
})
