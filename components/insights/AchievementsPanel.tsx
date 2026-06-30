'use client'

import { Check, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'
import { EmptyState } from '@/components/ui/EmptyState'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AchievementColorToken = 'blue' | 'sage'

const ACHIEVEMENT_COLOR: Record<AchievementColorToken, {
  text: string
  bg: string
  bgTint: string
  hex: string
}> = {
  blue: { text: 'text-horizon-blue', bg: 'bg-horizon-blue', bgTint: 'bg-horizon-blue/10', hex: '#4A90C4' },
  sage: { text: 'text-sage',         bg: 'bg-sage',         bgTint: 'bg-sage/10',         hex: '#3DAB82' },
}

export interface Achievement {
  id: string | number
  name: string
  desc: string
  icon: string              // lucide icon name (key in Icon component map)
  colorToken: AchievementColorToken
  earned: boolean
  date?: string             // shown when earned, e.g. "Feb 21"
  progress?: number         // current value (when not yet earned)
  target?: number           // target value (when not yet earned)
}

export interface AchievementsPanelProps {
  achievements: Achievement[]
  loading?: boolean
}

// ─── AchievementBadge ─────────────────────────────────────────────────────────

interface AchievementBadgeProps {
  achievement: Achievement
}

function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const { name, desc, icon, colorToken, earned, date, progress, target } = achievement
  const colors = ACHIEVEMENT_COLOR[colorToken]
  const hasProgress = !earned && progress != null && target != null

  return (
    <div
      data-testid="achievement-badge"
      data-earned={earned ? 'true' : 'false'}
      className={cn('text-center', earned ? 'bg-bg-card shadow-card' : 'bg-bg-page')}
      style={{ borderRadius: 16, padding: '18px 14px' }}
    >
      {/* ── Icon circle ────────────────────────────────────────────────────── */}
      <div className="relative mx-auto" style={{ width: 48, height: 48 }}>
        <div
          aria-hidden="true"
          className={cn('flex h-full w-full items-center justify-center rounded-full', earned ? colors.bgTint : 'bg-[#E8EDF2]')}
        >
          <Icon
            name={icon}
            size={24}
            color={earned ? colors.hex : '#C5CCD6'}
          />
        </div>

        {/* Earned checkmark overlay */}
        {earned && (
          <div
            data-testid="earned-checkmark"
            aria-label="Earned"
            className="absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-sage"
            style={{ width: 14, height: 14 }}
          >
            <Check size={8} color="white" strokeWidth={3} aria-hidden="true" />
          </div>
        )}
      </div>

      {/* ── Badge name ─────────────────────────────────────────────────────── */}
      <p
        className={cn('font-semibold', earned ? 'text-text-primary' : 'text-text-secondary')}
        style={{ fontSize: 13, marginTop: 10 }}
      >
        {name}
      </p>

      {/* ── Badge sub-text ─────────────────────────────────────────────────── */}
      {earned && date && (
        <p
          data-testid="badge-date"
          className={colors.text}
          style={{ fontSize: 11, marginTop: 2 }}
        >
          {date}
        </p>
      )}

      {!earned && !hasProgress && (
        <p
          data-testid="badge-desc"
          className="line-clamp-2"
          style={{ fontSize: 11, color: '#C5CCD6', marginTop: 2 }}
        >
          {desc}
        </p>
      )}

      {hasProgress && (
        <div data-testid="badge-progress" style={{ marginTop: 6 }}>
          {/* Mini progress bar track */}
          <div className="overflow-hidden rounded-full bg-divider" style={{ height: 4 }}>
            <div
              data-testid="progress-fill"
              className={cn('h-full rounded-full', colors.bg)}
              style={{
                width: `${Math.min(100, Math.round(((progress ?? 0) / (target ?? 1)) * 100))}%`,
              }}
            />
          </div>
          {/* Progress label */}
          <p
            data-testid="progress-label"
            className="text-text-secondary"
            style={{ fontSize: 10.5, marginTop: 4 }}
          >
            {progress} / {target}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function BadgeSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse text-center bg-bg-page"
      style={{ borderRadius: 16, padding: '18px 14px' }}
    >
      {/* Circle */}
      <div
        className="mx-auto rounded-full bg-[#E8EDF2]"
        style={{ width: 48, height: 48 }}
      />
      {/* Name */}
      <div
        className="mx-auto mt-3 rounded bg-[#E8EDF2]"
        style={{ height: 10, width: '60%' }}
      />
      {/* Sub */}
      <div
        className="mx-auto mt-2 rounded bg-[#E8EDF2]"
        style={{ height: 8, width: '45%' }}
      />
    </div>
  )
}

// ─── AchievementsPanel ────────────────────────────────────────────────────────

export function AchievementsPanel({
  achievements,
  loading = false,
}: AchievementsPanelProps) {
  const earnedCount = achievements.filter((a) => a.earned).length
  const total = achievements.length

  if (loading) {
    return (
      <div
        data-testid="achievements-panel"
        className="rounded-2xl bg-bg-card p-5 shadow-card"
      >
        {/* Header skeleton */}
        <div className="mb-4 flex animate-pulse flex-col gap-1">
          <div className="rounded bg-[#E8EDF2]" style={{ height: 17, width: 120 }} />
          <div className="rounded bg-divider" style={{ height: 12, width: 90 }} />
        </div>

        {/* Skeleton grid */}
        <div
          data-testid="achievements-skeleton"
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <BadgeSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  // ── Empty state (no achievements at all) ──────────────────────────────────
  if (achievements.length === 0) {
    return (
      <div
        data-testid="achievements-panel"
        className={cn('rounded-2xl bg-bg-card p-5 shadow-card')}
      >
        <h2
          className="font-semibold text-text-primary"
          style={{ fontSize: 17 }}
        >
          Achievements
        </h2>
        <EmptyState
          icon={<Trophy size={48} color="#C5CCD6" aria-hidden="true" />}
          title="No achievements yet"
          description="Complete milestones to earn badges."
        />
      </div>
    )
  }

  return (
    <div
      data-testid="achievements-panel"
      className={cn('rounded-2xl bg-bg-card p-5 shadow-card')}
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="mb-4">
        <h2
          className="font-semibold text-text-primary"
          style={{ fontSize: 17 }}
        >
          Achievements
        </h2>
        <p
          data-testid="earned-count"
          className="text-text-secondary"
          style={{ fontSize: 13, marginTop: 2 }}
        >
          {earnedCount} of {total} earned
        </p>
      </div>

      {/* ── Badge grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  )
}
