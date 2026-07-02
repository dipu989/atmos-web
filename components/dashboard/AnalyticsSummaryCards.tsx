'use client'

import { StatCard } from '@/components/dashboard/StatCard'
import { useDailySummaries } from '@/lib/hooks/useTrips'
import type { AnalyticsPeriod } from '@/lib/hooks/useAnalytics'
import { PERIOD_DAYS } from '@/lib/hooks/useAnalytics'

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      data-testid="analytics-card-skeleton"
      className="bg-gray-100 rounded-2xl min-h-[128px] animate-pulse"
    />
  )
}

// ─── Error sub ────────────────────────────────────────────────────────────────

const ERROR_SUB = (
  <span className="text-[12px] text-text-secondary">Data unavailable</span>
)

// ─── Main component ───────────────────────────────────────────────────────────

interface AnalyticsSummaryCardsProps {
  period?: AnalyticsPeriod
}

export function AnalyticsSummaryCards({ period = '30d' }: AnalyticsSummaryCardsProps) {
  const days = PERIOD_DAYS[period]
  const dailyQuery = useDailySummaries(days)

  // ── Loading ──────────────────────────────────────────────────────────────
  if (dailyQuery.isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (dailyQuery.isError) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard accent="blue" label="Total trips" value="—" sub={ERROR_SUB} />
        <StatCard accent="sage" label="Total distance" value="—" sub={ERROR_SUB} />
        <StatCard accent="peach" label="Total CO₂" value="—" sub={ERROR_SUB} />
        <StatCard accent="slate" label="Avg per trip" value="—" sub={ERROR_SUB} />
      </div>
    )
  }

  // ── Derive values from daily summaries ───────────────────────────────────

  const summaries = dailyQuery.data ?? []
  const totalTrips = summaries.reduce((sum, d) => sum + d.activityCount, 0)
  const totalDistanceKm = summaries.reduce((sum, d) => sum + d.totalDistanceKm, 0)
  const totalCo2 = summaries.reduce((sum, d) => sum + d.totalKgCo2e, 0)
  const avgPerTrip = totalTrips > 0 ? totalCo2 / totalTrips : 0

  // ── Period label ─────────────────────────────────────────────────────────

  const periodLabels: Record<AnalyticsPeriod, string> = {
    '30d': 'Last 30 days',
    '3m':  'Last 3 months',
    '6m':  'Last 6 months',
    '1y':  'Last year',
  }
  const periodSub = (
    <span className="text-[12px] text-text-secondary">{periodLabels[period]}</span>
  )

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* Card 1: Total trips */}
      <StatCard
        accent="blue"
        icon="map-pin"
        label="Total trips"
        value={totalTrips}
        unit="trips"
        sub={periodSub}
      />

      {/* Card 2: Total distance */}
      <StatCard
        accent="sage"
        icon="route"
        label="Total distance"
        value={totalDistanceKm.toFixed(1)}
        unit="km"
        sub={periodSub}
      />

      {/* Card 3: Total CO₂ */}
      <StatCard
        accent="peach"
        icon="leaf"
        label="Total CO₂"
        value={totalCo2.toFixed(1)}
        unit="kg"
        sub={periodSub}
      />

      {/* Card 4: Avg per trip */}
      <StatCard
        accent="slate"
        icon="bar-chart-2"
        label="Avg per trip"
        value={avgPerTrip.toFixed(2)}
        unit="kg CO₂"
        sub={<span className="text-[12px] text-text-secondary">Per trip avg</span>}
      />
    </div>
  )
}
