// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('renders in off state', () => {
    render(<Toggle value={false} onChange={vi.fn()} aria-label="Test toggle" />)
    const btn = screen.getByRole('switch', { name: 'Test toggle' })
    expect(btn).toHaveAttribute('aria-checked', 'false')
  })

  it('renders in on state', () => {
    render(<Toggle value={true} onChange={vi.fn()} aria-label="Test toggle" />)
    const btn = screen.getByRole('switch', { name: 'Test toggle' })
    expect(btn).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onChange with toggled value when clicked (off → on)', () => {
    const onChange = vi.fn()
    render(<Toggle value={false} onChange={onChange} aria-label="Test toggle" />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange with toggled value when clicked (on → off)', () => {
    const onChange = vi.fn()
    render(<Toggle value={true} onChange={onChange} aria-label="Test toggle" />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('visual state: off state has grey track class', () => {
    render(<Toggle value={false} onChange={vi.fn()} aria-label="Test toggle" />)
    const btn = screen.getByRole('switch')
    expect(btn.className).toContain('bg-[#C5CCD6]')
  })

  it('visual state: on state has blue track class', () => {
    render(<Toggle value={true} onChange={vi.fn()} aria-label="Test toggle" />)
    const btn = screen.getByRole('switch')
    expect(btn.className).toContain('bg-horizon-blue')
  })

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn()
    render(<Toggle value={false} onChange={onChange} disabled aria-label="Test toggle" />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onChange).not.toHaveBeenCalled()
  })
})
