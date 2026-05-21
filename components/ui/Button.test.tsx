// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Submit</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('is disabled when the disabled prop is set', () => {
    render(<Button disabled>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when loading={true}', () => {
    render(<Button loading>Saving</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not call onClick when loading', () => {
    const handleClick = vi.fn()
    render(<Button loading onClick={handleClick}>Save</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders a spinner svg when loading={true}', () => {
    render(<Button loading>Saving</Button>)
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument()
  })

  it('does not render a spinner when not loading', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button').querySelector('svg')).toBeNull()
  })

  it('applies the primary variant class', () => {
    render(<Button variant="primary">Save</Button>)
    expect(screen.getByRole('button').className).toContain('bg-horizon-blue')
  })

  it('applies the destructive variant class', () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button').className).toContain('bg-alert-red')
  })

  it('forwards extra HTML button attributes', () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>)
    expect(screen.getByTestId('submit-btn')).toHaveAttribute('type', 'submit')
  })
})
