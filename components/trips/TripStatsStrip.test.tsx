// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TripStatsStrip } from '@/components/trips/TripStatsStrip'

const defaultProps = {
  totalTrips: 28,
  totalKm: 145.6,
  totalKg: 12.4,
  activeDays: 18,
  autoCount: 24,
  manualCount: 4,
}

describe('TripStatsStrip', () => {
  it('renders 4 stat cards', () => {
    const { container } = render(<TripStatsStrip {...defaultProps} />)
    // Each CompactStatCard is a div with border-t-[3px]
    const cards = container.querySelectorAll('[class*="border-t"]')
    expect(cards).toHaveLength(4)
  })

  it('shows loading skeletons when loading={true}', () => {
    render(<TripStatsStrip {...defaultProps} loading={true} />)
    const skeletons = screen.getAllByTestId('stat-strip-skeleton')
    expect(skeletons).toHaveLength(4)
  })

  it('does not show skeletons when loading is false', () => {
    render(<TripStatsStrip {...defaultProps} loading={false} />)
    expect(screen.queryByTestId('stat-strip-skeleton')).not.toBeInTheDocument()
  })

  it('displays correct total trips value', () => {
    render(<TripStatsStrip {...defaultProps} />)
    expect(screen.getByText('28')).toBeInTheDocument()
  })

  it('displays correct distance value', () => {
    render(<TripStatsStrip {...defaultProps} />)
    expect(screen.getByText('145.6')).toBeInTheDocument()
  })

  it('displays correct CO₂ value', () => {
    render(<TripStatsStrip {...defaultProps} />)
    expect(screen.getByText('12.4')).toBeInTheDocument()
  })

  it('displays correct active days value', () => {
    render(<TripStatsStrip {...defaultProps} />)
    expect(screen.getByText('18')).toBeInTheDocument()
  })

  it('displays detected and manual counts sub-text', () => {
    render(<TripStatsStrip {...defaultProps} />)
    expect(screen.getByText('24 detected · 4 manual')).toBeInTheDocument()
  })
})
