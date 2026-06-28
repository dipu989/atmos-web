// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import SettingsPage from './page'

// ─── Mock PageShell ────────────────────────────────────────────────────────────

vi.mock('@/components/layout/PageShell', () => ({
  PageShell: ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <div data-testid="page-shell">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))

// ─── Mock settings sub-components ─────────────────────────────────────────────

vi.mock('@/components/settings/SettingsSubNav', () => ({
  SettingsSubNav: ({
    active,
    onChange,
  }: {
    active: string
    onChange: (s: string) => void
  }) => (
    <nav data-testid="settings-sub-nav" data-active={active}>
      <button data-testid="nav-profile"       onClick={() => onChange('profile')}>Profile</button>
      <button data-testid="nav-goals"         onClick={() => onChange('goals')}>Goals</button>
      <button data-testid="nav-notifications" onClick={() => onChange('notifications')}>Notifications</button>
    </nav>
  ),
}))

vi.mock('@/components/settings/SettingsMobileNav', () => ({
  SettingsMobileNav: ({
    active,
    onChange,
  }: {
    active: string
    onChange: (s: string) => void
  }) => (
    <nav data-testid="settings-mobile-nav" data-active={active}>
      <button data-testid="chip-profile" onClick={() => onChange('profile')}>Profile</button>
      <button data-testid="chip-goals"   onClick={() => onChange('goals')}>Goals</button>
    </nav>
  ),
}))

vi.mock('@/components/settings/ProfileSection',       () => ({ ProfileSection:       () => <div data-testid="section-profile" /> }))
vi.mock('@/components/settings/GoalsSection',         () => ({ GoalsSection:         () => <div data-testid="section-goals" /> }))
vi.mock('@/components/settings/NotificationsSection', () => ({ NotificationsSection: () => <div data-testid="section-notifications" /> }))
vi.mock('@/components/settings/ConnectionsSection',   () => ({ ConnectionsSection:   () => <div data-testid="section-connections" /> }))
vi.mock('@/components/settings/AccountSection',       () => ({ AccountSection:       () => <div data-testid="section-account" /> }))

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Settings title', () => {
    render(<SettingsPage />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders both desktop sub-nav and mobile chip nav', () => {
    render(<SettingsPage />)
    expect(screen.getByTestId('settings-sub-nav')).toBeInTheDocument()
    expect(screen.getByTestId('settings-mobile-nav')).toBeInTheDocument()
  })

  it('shows Profile section by default', () => {
    render(<SettingsPage />)
    expect(screen.getByTestId('section-profile')).toBeInTheDocument()
  })

  it('switches to Goals section when desktop nav item clicked', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByTestId('nav-goals'))
    expect(screen.getByTestId('section-goals')).toBeInTheDocument()
    expect(screen.queryByTestId('section-profile')).not.toBeInTheDocument()
  })

  it('switches section when mobile chip clicked', () => {
    render(<SettingsPage />)
    fireEvent.click(screen.getByTestId('chip-goals'))
    expect(screen.getByTestId('section-goals')).toBeInTheDocument()
  })

  it('renders without crash at 375px mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 })
    expect(() => render(<SettingsPage />)).not.toThrow()
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
  })
})
