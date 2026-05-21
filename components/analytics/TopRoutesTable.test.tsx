// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  TopRoutesTable,
  type TopRoute,
} from '@/components/analytics/TopRoutesTable'

// ─── Mock data ─────────────────────────────────────────────────────────────────

const mockRoutes: TopRoute[] = [
  {
    mode:     'car',
    from:     'Home',
    to:       'Office',
    count:    15,
    total_km: 120.5,
    total_kg: 22.4,
  },
  {
    mode:     'train',
    from:     'Central Station',
    to:       'Airport',
    count:    8,
    total_km: 64.0,
    total_kg: 5.1,
  },
  {
    mode:     'bus',
    from:     'Market',
    to:       'Park',
    count:    5,
    total_km: 12.3,
    total_kg: 1.8,
  },
]

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('TopRoutesTable', () => {
  it('renders without crash', () => {
    render(<TopRoutesTable routes={mockRoutes} />)
    expect(screen.getByTestId('top-routes-table')).toBeInTheDocument()
  })

  it('renders correct number of rows', () => {
    render(<TopRoutesTable routes={mockRoutes} />)
    const rows = screen.getAllByTestId('route-row')
    expect(rows).toHaveLength(mockRoutes.length)
  })

  it('shows loading state with 5 skeleton rows', () => {
    render(<TopRoutesTable routes={[]} loading />)
    const skeletons = screen.getAllByTestId('route-skeleton-row')
    expect(skeletons).toHaveLength(5)
  })

  it('does not show data rows while loading', () => {
    render(<TopRoutesTable routes={mockRoutes} loading />)
    const rows = screen.queryAllByTestId('route-row')
    expect(rows).toHaveLength(0)
  })

  it('shows empty state when no routes and not loading', () => {
    render(<TopRoutesTable routes={[]} />)
    expect(screen.getByText('No routes yet')).toBeInTheDocument()
  })

  it('does not show empty state when routes are present', () => {
    render(<TopRoutesTable routes={mockRoutes} />)
    expect(screen.queryByText('No routes yet')).not.toBeInTheDocument()
  })

  it('renders route from/to labels', () => {
    render(<TopRoutesTable routes={mockRoutes} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Office')).toBeInTheDocument()
  })
})
