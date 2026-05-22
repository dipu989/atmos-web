// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Lightbulb } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) => <a href={href}>{children}</a>,
}))

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('EmptyState', () => {
  it('renders icon, title, and description', () => {
    render(
      <EmptyState
        icon={<Lightbulb size={48} color="#C5CCD6" aria-label="No data icon" />}
        title="No items yet"
        description="Add something to get started."
      />,
    )

    expect(screen.getByText('No items yet')).toBeInTheDocument()
    expect(screen.getByText('Add something to get started.')).toBeInTheDocument()
    // Root container is present
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('does not render description when omitted', () => {
    render(
      <EmptyState
        icon={<Lightbulb size={48} color="#C5CCD6" />}
        title="No items yet"
      />,
    )

    expect(screen.getByText('No items yet')).toBeInTheDocument()
    expect(screen.queryByText('Add something to get started.')).not.toBeInTheDocument()
  })

  it('renders action button when onClick provided', () => {
    const handleClick = vi.fn()

    render(
      <EmptyState
        icon={<Lightbulb size={48} color="#C5CCD6" />}
        title="No items yet"
        action={{ label: 'Create one', onClick: handleClick }}
      />,
    )

    const btn = screen.getByRole('button', { name: 'Create one' })
    expect(btn).toBeInTheDocument()
  })

  it('action button triggers onClick', () => {
    const handleClick = vi.fn()

    render(
      <EmptyState
        icon={<Lightbulb size={48} color="#C5CCD6" />}
        title="No items"
        action={{ label: 'Add item', onClick: handleClick }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Add item' }))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('action renders as anchor link when href provided', () => {
    render(
      <EmptyState
        icon={<Lightbulb size={48} color="#C5CCD6" />}
        title="No insights"
        action={{ label: 'Go to Insights', href: '/insights' }}
      />,
    )

    const link = screen.getByRole('link', { name: 'Go to Insights' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/insights')
  })

  it('does not render action when action prop is omitted', () => {
    render(
      <EmptyState
        icon={<Lightbulb size={48} color="#C5CCD6" />}
        title="No items yet"
      />,
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
