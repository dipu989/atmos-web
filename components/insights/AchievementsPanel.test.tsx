// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AchievementsPanel } from '@/components/insights/AchievementsPanel'
import type { Achievement } from '@/components/insights/AchievementsPanel'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const earnedBadge: Achievement = {
  id: 'ach-001',
  name: 'First Steps',
  desc: 'Complete your first green trip',
  icon: 'leaf',
  colorToken: 'sage' as const,
  earned: true,
  date: 'Feb 21',
}

const earnedBadge2: Achievement = {
  id: 'ach-002',
  name: 'Streak Master',
  desc: 'Maintain a 7-day green streak',
  icon: 'flame',
  colorToken: 'blue' as const,
  earned: true,
  date: 'Mar 5',
}

const lockedNoProgress: Achievement = {
  id: 'ach-003',
  name: 'Eco Warrior',
  desc: 'Log 100 green trips',
  icon: 'trophy',
  colorToken: 'blue' as const,
  earned: false,
}

const lockedWithProgress: Achievement = {
  id: 'ach-004',
  name: 'Century Cyclist',
  desc: 'Cycle 100 km total',
  icon: 'bike',
  colorToken: 'sage' as const,
  earned: false,
  progress: 42,
  target: 100,
}

const lockedWithProgress2: Achievement = {
  id: 'ach-005',
  name: 'Train Rider',
  desc: 'Take 50 train trips',
  icon: 'train',
  colorToken: 'blue' as const,
  earned: false,
  progress: 10,
  target: 50,
}

const allAchievements: Achievement[] = [
  earnedBadge,
  earnedBadge2,
  lockedNoProgress,
  lockedWithProgress,
  lockedWithProgress2,
]

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AchievementsPanel — renders all badges', () => {
  it('renders the correct number of achievement badges', () => {
    render(<AchievementsPanel achievements={allAchievements} />)
    const badges = screen.getAllByTestId('achievement-badge')
    expect(badges).toHaveLength(allAchievements.length)
  })

  it('renders the panel title "Achievements"', () => {
    render(<AchievementsPanel achievements={allAchievements} />)
    expect(screen.getByText('Achievements')).toBeInTheDocument()
  })

  it('renders each badge name', () => {
    render(<AchievementsPanel achievements={allAchievements} />)
    expect(screen.getByText('First Steps')).toBeInTheDocument()
    expect(screen.getByText('Streak Master')).toBeInTheDocument()
    expect(screen.getByText('Eco Warrior')).toBeInTheDocument()
    expect(screen.getByText('Century Cyclist')).toBeInTheDocument()
    expect(screen.getByText('Train Rider')).toBeInTheDocument()
  })
})

describe('AchievementsPanel — earned count sub-text', () => {
  it('shows correct earned count out of total', () => {
    render(<AchievementsPanel achievements={allAchievements} />)
    // 2 earned out of 5 total
    expect(screen.getByTestId('earned-count')).toHaveTextContent('2 of 5 earned')
  })

  it('shows "0 of N earned" when none are earned', () => {
    const noneEarned = allAchievements.map((a) => ({ ...a, earned: false }))
    render(<AchievementsPanel achievements={noneEarned} />)
    expect(screen.getByTestId('earned-count')).toHaveTextContent('0 of 5 earned')
  })

  it('shows "N of N earned" when all are earned', () => {
    const allEarned = allAchievements.map((a) => ({ ...a, earned: true, date: 'Jan 1' }))
    render(<AchievementsPanel achievements={allEarned} />)
    expect(screen.getByTestId('earned-count')).toHaveTextContent('5 of 5 earned')
  })
})

describe('AchievementsPanel — earned badges', () => {
  it('shows date on earned badges', () => {
    render(<AchievementsPanel achievements={[earnedBadge]} />)
    expect(screen.getByTestId('badge-date')).toHaveTextContent('Feb 21')
  })

  it('shows date for each earned badge', () => {
    render(<AchievementsPanel achievements={[earnedBadge, earnedBadge2]} />)
    const dates = screen.getAllByTestId('badge-date')
    expect(dates).toHaveLength(2)
    expect(dates[0]).toHaveTextContent('Feb 21')
    expect(dates[1]).toHaveTextContent('Mar 5')
  })

  it('shows earned checkmark on earned badges', () => {
    render(<AchievementsPanel achievements={[earnedBadge]} />)
    expect(screen.getByTestId('earned-checkmark')).toBeInTheDocument()
  })

  it('does not show earned checkmark on locked badges', () => {
    render(<AchievementsPanel achievements={[lockedNoProgress]} />)
    expect(screen.queryByTestId('earned-checkmark')).not.toBeInTheDocument()
  })
})

describe('AchievementsPanel — locked badges without progress', () => {
  it('does not show a progress bar for locked badge without progress', () => {
    render(<AchievementsPanel achievements={[lockedNoProgress]} />)
    expect(screen.queryByTestId('badge-progress')).not.toBeInTheDocument()
  })

  it('does not show date for locked badge', () => {
    render(<AchievementsPanel achievements={[lockedNoProgress]} />)
    expect(screen.queryByTestId('badge-date')).not.toBeInTheDocument()
  })

  it('shows desc text for locked badge without progress', () => {
    render(<AchievementsPanel achievements={[lockedNoProgress]} />)
    expect(screen.getByTestId('badge-desc')).toHaveTextContent('Log 100 green trips')
  })
})

describe('AchievementsPanel — locked badges with progress', () => {
  it('shows progress bar for locked badge with progress', () => {
    render(<AchievementsPanel achievements={[lockedWithProgress]} />)
    expect(screen.getByTestId('badge-progress')).toBeInTheDocument()
  })

  it('shows progress label with current/target values', () => {
    render(<AchievementsPanel achievements={[lockedWithProgress]} />)
    expect(screen.getByTestId('progress-label')).toHaveTextContent('42 / 100')
  })

  it('progress fill width reflects progress/target ratio', () => {
    render(<AchievementsPanel achievements={[lockedWithProgress]} />)
    const fill = screen.getByTestId('progress-fill')
    // 42 / 100 = 42%
    expect(fill.style.width).toBe('42%')
  })

  it('shows multiple progress bars when multiple badges have progress', () => {
    render(
      <AchievementsPanel achievements={[lockedWithProgress, lockedWithProgress2]} />,
    )
    const progressBars = screen.getAllByTestId('badge-progress')
    expect(progressBars).toHaveLength(2)
  })

  it('progress fill width for second badge is correct', () => {
    render(<AchievementsPanel achievements={[lockedWithProgress2]} />)
    const fill = screen.getByTestId('progress-fill')
    // 10 / 50 = 20%
    expect(fill.style.width).toBe('20%')
  })

  it('does not show desc for locked badge with progress', () => {
    render(<AchievementsPanel achievements={[lockedWithProgress]} />)
    expect(screen.queryByTestId('badge-desc')).not.toBeInTheDocument()
  })
})

describe('AchievementsPanel — loading state', () => {
  it('renders skeleton grid when loading', () => {
    render(<AchievementsPanel achievements={[]} loading />)
    expect(screen.getByTestId('achievements-skeleton')).toBeInTheDocument()
  })

  it('does not render badges when loading', () => {
    render(<AchievementsPanel achievements={allAchievements} loading />)
    expect(screen.queryByTestId('achievement-badge')).not.toBeInTheDocument()
  })

  it('does not render earned-count text when loading', () => {
    render(<AchievementsPanel achievements={allAchievements} loading />)
    expect(screen.queryByTestId('earned-count')).not.toBeInTheDocument()
  })
})

describe('AchievementsPanel — empty state', () => {
  it('renders EmptyState when achievements array is empty', () => {
    render(<AchievementsPanel achievements={[]} />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('No achievements yet')).toBeInTheDocument()
    expect(screen.getByText('Complete milestones to earn badges.')).toBeInTheDocument()
    // Badge grid and earned-count sub-text should not appear
    expect(screen.queryByTestId('achievement-badge')).not.toBeInTheDocument()
    expect(screen.queryByTestId('earned-count')).not.toBeInTheDocument()
  })

  it('still shows panel heading when empty', () => {
    render(<AchievementsPanel achievements={[]} />)
    expect(screen.getByText('Achievements')).toBeInTheDocument()
  })
})

describe('AchievementsPanel — badge earned attribute', () => {
  it('sets data-earned="true" on earned badges', () => {
    render(<AchievementsPanel achievements={[earnedBadge]} />)
    const badge = screen.getByTestId('achievement-badge')
    expect(badge).toHaveAttribute('data-earned', 'true')
  })

  it('sets data-earned="false" on locked badges', () => {
    render(<AchievementsPanel achievements={[lockedNoProgress]} />)
    const badge = screen.getByTestId('achievement-badge')
    expect(badge).toHaveAttribute('data-earned', 'false')
  })
})

describe('AchievementsPanel — within badge scope', () => {
  it('each earned badge has its own checkmark and date', () => {
    render(<AchievementsPanel achievements={[earnedBadge, lockedNoProgress]} />)
    const badges = screen.getAllByTestId('achievement-badge')

    // First badge is earned — should have checkmark and date
    expect(within(badges[0]).getByTestId('earned-checkmark')).toBeInTheDocument()
    expect(within(badges[0]).getByTestId('badge-date')).toBeInTheDocument()

    // Second badge is locked — should not have checkmark
    expect(within(badges[1]).queryByTestId('earned-checkmark')).not.toBeInTheDocument()
  })
})
