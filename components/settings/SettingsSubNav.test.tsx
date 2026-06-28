// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SettingsSubNav } from './SettingsSubNav'

const NAV_LABELS = [
  'Profile',
  'Goals & tracking',
  'Notifications',
  'Privacy & data',
  'Connected apps',
  'Account',
]

describe('SettingsSubNav', () => {
  it('renders all 6 nav items', () => {
    render(<SettingsSubNav active="profile" onChange={vi.fn()} />)
    for (const label of NAV_LABELS) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('active item has data-active=true', () => {
    render(<SettingsSubNav active="goals" onChange={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    const goalsBtn = buttons.find((b) => b.textContent?.includes('Goals & tracking'))
    expect(goalsBtn).toHaveAttribute('data-active', 'true')
  })

  it('inactive items do not have data-active=true', () => {
    render(<SettingsSubNav active="profile" onChange={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    const goalsBtn = buttons.find((b) => b.textContent?.includes('Goals & tracking'))
    expect(goalsBtn).toHaveAttribute('data-active', 'false')
  })

  it('calls onChange with the correct section id when clicked', () => {
    const onChange = vi.fn()
    render(<SettingsSubNav active="profile" onChange={onChange} />)
    fireEvent.click(screen.getByText('Notifications'))
    expect(onChange).toHaveBeenCalledWith('notifications')
  })
})
