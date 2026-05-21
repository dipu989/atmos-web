'use client'

import { StatCard } from '@/components/dashboard/StatCard'
import { useWeeklySummaries, useMonthlySummaries } from '@/lib/hooks/useTrips'

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
  <span className="text-[12px] text-[#6B7A8D]">Data unavailable</span>
)

// ─── Main component ───────────────────────────────────────────────────────────

export function AnalyticsSummaryCards() {
  const weeklyQuery = useWeeklySummaries(4)
  const monthlyQuery = useMonthlySummaries(3)

  const isLoading = weeklyQuery.isLoading || monthlyQuery.isLoading
  const isError = weeklyQuery.isError || monthlyQuery.isError

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="grid grid-cols-4 gap-4">
        <StatCard accent="#4A90C4" label="Total trips" value="—" sub={ERROR_SUB} />
        <StatCard accent="#3DAB82" label="Total distance" value="—" sub={ERROR_SUB} />
        <StatCard accent="#F0956A" label="Total CO₂" value="—" sub={ERROR_SUB} />
        <StatCard accent="#6B7A8D" label="Avg per trip" value="—" sub={ERROR_SUB} />
      </div>
    )
  }

  // ── Derive values ────────────────────────────────────────────────────────

  // Use the most recent monthly summary for KPI data
  const monthly = monthlyQuery.data?.[0]
  const totalTrips = monthly?.activityCount ?? 0
  const totalDistanceKm = monthly?.totalDistanceKm ?? 0
  const totalCo2 = monthly?.totalKgCo2e ?? 0
  const avgPerTrip = totalTrips > 0 ? totalCo2 / totalTrips : 0

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Card 1: Total trips */}
      <StatCard
        accent="#4A90C4"
        icon="map-pin"
        label="Total trips"
        value={totalTrips}
        unit="trips"
        sub={
          <span className="text-[12px] text-[#6B7A8D]">This month</span>
        }
      />

      {/* Card 2: Total distance */}
      <StatCard
        accent="#3DAB82"
        icon="route"
        label="Total distance"
        value={totalDistanceKm.toFixed(1)}
        unit="km"
        sub={
          <span className="text-[12px] text-[#6B7A8D]">This month</span>
        }
      />

      {/* Card 3: Total CO₂ */}
      <StatCard
        accent="#F0956A"
        icon="leaf"
        label="Total CO₂"
        value={totalCo2.toFixed(1)}
        unit="kg"
        sub={
          <span className="text-[12px] text-[#6B7A8D]">This month</span>
        }
      />

      {/* Card 4: Avg per trip */}
      <StatCard
        accent="#6B7A8D"
        icon="bar-chart-2"
        label="Avg per trip"
        value={avgPerTrip.toFixed(2)}
        unit="kg CO₂"
        sub={
          <span className="text-[12px] text-[#6B7A8D]">Per trip avg</span>
        }
      />
    </div>
  )
}
