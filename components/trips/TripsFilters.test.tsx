// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TripsFilters } from '@/components/trips/TripsFilters'

const defaultProps = {
  search: '',
  onSearchChange: vi.fn(),
  mode: 'all',
  onModeChange: vi.fn(),
  source: 'all' as const,
  onSourceChange: vi.fn(),
  tripCounts: { all: 28, car: 10, train: 8, bus: 4, cycling: 3, walking: 3 },
}

describe('TripsFilters', () => {
  it('renders search input', () => {
    render(<TripsFilters {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search by route or place…')).toBeInTheDocument()
  })

  it('renders 6 mode chips (All + 5 modes)', () => {
    render(<TripsFilters {...defaultProps} />)
    const container = screen.getByTestId('mode-chips')
    const chips = container.querySelectorAll('button')
    expect(chips).toHaveLength(6)
  })

  it('renders source toggle with 3 options', () => {
    render(<TripsFilters {...defaultProps} />)
    const toggle = screen.getByTestId('source-toggle')
    const buttons = toggle.querySelectorAll('button')
    expect(buttons).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Detected' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Manual' })).toBeInTheDocument()
  })

  it('clicking mode chip calls onModeChange', () => {
    const onModeChange = vi.fn()
    render(<TripsFilters {...defaultProps} onModeChange={onModeChange} />)
    const carChip = screen.getByTestId('mode-chip-car')
    fireEvent.click(carChip)
    expect(onModeChange).toHaveBeenCalledWith('car')
  })

  it('typing in search calls onSearchChange', () => {
    const onSearchChange = vi.fn()
    render(<TripsFilters {...defaultProps} onSearchChange={onSearchChange} />)
    const input = screen.getByPlaceholderText('Search by route or place…')
    fireEvent.change(input, { target: { value: 'London' } })
    expect(onSearchChange).toHaveBeenCalledWith('London')
  })

  it('source toggle calls onSourceChange', () => {
    const onSourceChange = vi.fn()
    render(<TripsFilters {...defaultProps} onSourceChange={onSourceChange} />)
    const detectedBtn = screen.getByRole('button', { name: 'Detected' })
    fireEvent.click(detectedBtn)
    expect(onSourceChange).toHaveBeenCalledWith('auto')
  })

  it('clear button in search resets value', () => {
    const onSearchChange = vi.fn()
    render(<TripsFilters {...defaultProps} search="London" onSearchChange={onSearchChange} />)
    const clearBtn = screen.getByLabelText('Clear search')
    fireEvent.click(clearBtn)
    expect(onSearchChange).toHaveBeenCalledWith('')
  })

  it('clear button is not shown when search is empty', () => {
    render(<TripsFilters {...defaultProps} search="" />)
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('active mode chip is highlighted', () => {
    render(<TripsFilters {...defaultProps} mode="car" />)
    const carChip = screen.getByTestId('mode-chip-car')
    expect(carChip).toHaveStyle({ color: '#F0956A' })
  })
})
