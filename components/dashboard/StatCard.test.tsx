// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatCard } from '@/components/dashboard/StatCard'

describe('StatCard', () => {
  it('renders label, value, and unit', () => {
    render(
      <StatCard accent="#4A90C4" label="CO₂ this month" value={42.5} unit="kg" />,
    )
    expect(screen.getByText('CO₂ this month')).toBeInTheDocument()
    expect(screen.getByText('42.5')).toBeInTheDocument()
    expect(screen.getByText('kg')).toBeInTheDocument()
  })

  it('renders icon badge when icon prop is provided', () => {
    const { container } = render(
      <StatCard accent="#4A90C4" label="Test" value={10} icon="leaf" />,
    )
    // The icon badge wrapper div should exist
    const badge = container.querySelector('.rounded-\\[8px\\]')
    expect(badge).toBeInTheDocument()
    // lucide Leaf icon renders an svg
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('does not render icon badge when icon prop is absent', () => {
    const { container } = render(
      <StatCard accent="#4A90C4" label="Test" value={10} />,
    )
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('renders sub slot content', () => {
    render(
      <StatCard
        accent="#3DAB82"
        label="Streak"
        value={7}
        sub={<span>Longest: 14 days</span>}
      />,
    )
    expect(screen.getByText('Longest: 14 days')).toBeInTheDocument()
  })

  it('does not render sub slot when sub is not provided', () => {
    const { container } = render(
      <StatCard accent="#3DAB82" label="Streak" value={7} />,
    )
    // The mt-auto pt-1 sub wrapper should not exist
    const subWrapper = container.querySelector('.mt-auto')
    expect(subWrapper).not.toBeInTheDocument()
  })

  it('applies top border color matching the accent prop', () => {
    const { container } = render(
      <StatCard accent="#F0956A" label="Test" value={0} />,
    )
    const card = container.firstChild as HTMLElement
    expect(card.style.borderTopColor).toBe('rgb(240, 149, 106)')
  })

  it('renders value without unit when unit is omitted', () => {
    render(<StatCard accent="#6B7A8D" label="Days" value={30} />)
    expect(screen.getByText('30')).toBeInTheDocument()
    // No unit span rendered
    expect(screen.queryByText('total')).not.toBeInTheDocument()
  })
})
