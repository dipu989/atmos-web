'use client'

import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { differenceInDays, format, parseISO } from 'date-fns'
import { StatCard } from '@/components/dashboard/StatCard'
import {
  useDailySummaries,
  useInsights,
  useMe,
  useMonthlySummaries,
  usePreferences,
} from '@/lib/hooks/useTrips'
import type { Insight, TrendData } from '@/types/index'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStreakFromInsights(insights: Insight[]): { current: number; longest: number } {
  const streakInsight = insights.find((i) => i.insightType === 'streak')
  if (!streakInsight) return { current: 0, longest: 0 }
  const meta = streakInsight.metadata
  const current = typeof meta['current_streak'] === 'number' ? meta['current_streak'] : 0
  const longest = typeof meta['longest_streak'] === 'number' ? meta['longest_streak'] : 0
  return { current, longest }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrendBadge({ trend }: { trend: TrendData }) {
  const { change_pct, direction } = trend

  if (change_pct === null) {
    return <span className="text-[12px] text-text-secondary">No trend data</span>
  }

  const isDown = direction === 'down'
  const isFlat = direction === 'flat'
  const colorClass = isFlat ? 'text-text-secondary' : isDown ? 'text-sage' : 'text-peach'

  return (
    <div className="flex items-center gap-1">
      <span className={`flex items-center gap-0.5 text-[12px] font-medium ${colorClass}`}>
        {isFlat ? null : isDown ? (
          <ArrowDownRight size={12} strokeWidth={2.5} />
        ) : (
          <ArrowUpRight size={12} strokeWidth={2.5} />
        )}
        {Math.abs(change_pct).toFixed(1)}%
      </span>
      <span className="text-[12px] text-text-secondary">vs last month</span>
    </div>
  )
}

interface ProgressBarSubProps {
  todayKg: number
  goalKg: number
}

function ProgressBarSub({ todayKg, goalKg }: ProgressBarSubProps) {
  const progressPct = goalKg > 0 ? Math.min(100, (todayKg / goalKg) * 100) : 0
  const isUnderGoal = todayKg <= goalKg
  const diff = Math.abs(goalKg - todayKg)
  const label = isUnderGoal
    ? `${diff.toFixed(1)} kg under today`
    : `${diff.toFixed(1)} kg over today`

  return (
    <div className="flex flex-col gap-1">
      <div className="h-[6px] rounded-full bg-gray-100 overflow-hidden">
        <div
          data-testid="progress-fill"
          className={`h-full rounded-full transition-all ${isUnderGoal ? 'bg-sage' : 'bg-peach'}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <span className="text-[12px] text-text-secondary">{label}</span>
    </div>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      data-testid="stat-card-skeleton"
      className="bg-gray-100 rounded-2xl min-h-[128px] animate-pulse"
    />
  )
}

// ─── Error card sub ──────────────────────────────────────────────────────────

const ERROR_SUB = (
  <span className="text-[12px] text-text-secondary">Data unavailable</span>
)

// ─── Main component ───────────────────────────────────────────────────────────

export function TodayImpactCards() {
  const monthlyQuery = useMonthlySummaries()
  const dailyQuery = useDailySummaries()
  const prefsQuery = usePreferences()
  const insightsQuery = useInsights()
  const meQuery = useMe()

  const isLoading =
    monthlyQuery.isLoading ||
    dailyQuery.isLoading ||
    prefsQuery.isLoading ||
    insightsQuery.isLoading ||
    meQuery.isLoading

  const isError =
    monthlyQuery.isError ||
    dailyQuery.isError ||
    prefsQuery.isError ||
    insightsQuery.isError ||
    meQuery.isError

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard accent="blue" label="CO₂ this month" value="—" sub={ERROR_SUB} />
        <StatCard accent="sage" label="Daily goal" value="—" sub={ERROR_SUB} />
        <StatCard accent="peach" label="Current streak" value="—" sub={ERROR_SUB} />
        <StatCard accent="slate" label="Days tracked" value="—" sub={ERROR_SUB} />
      </div>
    )
  }

  // ── Derive values ──────────────────────────────────────────────────────────

  // Card 1: CO₂ this month
  const monthlySummary = monthlyQuery.data?.[0]
  const monthlyCO2 = monthlySummary?.totalKgCo2e ?? 0
  const monthlyTrend = monthlySummary?.trend ?? {
    prev_total_kg_co2e: 0,
    change_pct: null,
    direction: 'flat' as const,
  }

  // Card 2: Daily goal
  const todayKg = dailyQuery.data?.[0]?.totalKgCo2e ?? 0
  const goalKg = prefsQuery.data?.daily_goal_kg_co2e ?? 5

  // Card 3: Current streak
  const { current: streakCurrent, longest: streakLongest } = getStreakFromInsights(
    insightsQuery.data ?? [],
  )

  // Card 4: Days tracked
  const me = meQuery.data
  const sinceDate = me ? parseISO(me.created_at) : new Date()
  const daysTracked = differenceInDays(new Date(), sinceDate) + 1
  const sinceFormatted = format(sinceDate, 'MMM d, yyyy')

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* Card 1: CO₂ this month */}
      <StatCard
        accent="blue"
        icon="leaf"
        label="CO₂ this month"
        value={monthlyCO2.toFixed(1)}
        unit="kg"
        sub={<TrendBadge trend={monthlyTrend} />}
      />

      {/* Card 2: Daily goal */}
      <StatCard
        accent="sage"
        icon="target"
        label="Daily goal"
        value={todayKg.toFixed(1)}
        unit={`/ ${goalKg.toFixed(1)} kg`}
        sub={<ProgressBarSub todayKg={todayKg} goalKg={goalKg} />}
      />

      {/* Card 3: Current streak */}
      <StatCard
        accent="peach"
        icon="flame"
        label="Current streak"
        value={streakCurrent}
        unit="days"
        sub={
          <span className="text-[12px] text-text-secondary">
            Longest: {streakLongest} days
          </span>
        }
      />

      {/* Card 4: Days tracked */}
      <StatCard
        accent="slate"
        icon="calendar"
        label="Days tracked"
        value={daysTracked}
        unit="total"
        sub={
          <span className="text-[12px] text-text-secondary">Since {sinceFormatted}</span>
        }
      />
    </div>
  )
}
