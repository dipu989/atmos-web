'use client'

import { TrendingUp } from 'lucide-react'
import { format, parseISO, subDays } from 'date-fns'
import { WeeklyTrendChart } from '@/components/charts/WeeklyTrendChart'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { useDailySummaries, usePreferences } from '@/lib/hooks/useTrips'
import { EmptyState } from '@/components/ui/EmptyState'

// ─── Skeleton ────────────────────────────────────────────────────────────────

function WeeklyTrendSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-5 w-40 rounded bg-gray-100 animate-pulse" />
        <div className="h-4 w-28 rounded bg-gray-100 animate-pulse mt-1" />
      </CardHeader>
      <CardContent>
        <div
          data-testid="weekly-trend-skeleton"
          className="h-[280px] rounded-xl bg-gray-100 animate-pulse"
        />
      </CardContent>
    </Card>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface WeeklyTrendCardProps {
  days?: number
}

export function WeeklyTrendCard({ days = 7 }: WeeklyTrendCardProps) {
  const dailyQuery = useDailySummaries(days)
  const prefsQuery = usePreferences()

  const isLoading = dailyQuery.isLoading || prefsQuery.isLoading
  const isError = dailyQuery.isError || prefsQuery.isError

  // Date range subtitle: "May 12 – May 18"
  const today = new Date()
  const startOfRange = subDays(today, days - 1)
  const dateRange =
    days <= 1
      ? format(today, 'MMM d')
      : `${format(startOfRange, 'MMM d')} – ${format(today, 'MMM d')}`

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return <WeeklyTrendSkeleton />
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-subheading font-semibold text-text-primary">Weekly CO₂ trend</h2>
          <p className="text-label text-text-secondary">{dateRange}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[280px]">
            <p className="text-label text-text-secondary">Could not load chart data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── Map DailySummary[] → chart data ────────────────────────────────────────
  const chartData = (dailyQuery.data ?? []).map((summary) => {
    const date = parseISO(summary.dateLocal)
    return {
      day: format(date, 'EEE'),
      date: format(date, 'MMM d'),
      co2_kg: summary.totalKgCo2e,
    }
  })

  const goal = prefsQuery.data?.daily_goal_kg_co2e ?? 5

  // ── Empty state ────────────────────────────────────────────────────────────
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-subheading font-semibold text-text-primary">Weekly CO₂ trend</h2>
          <p className="text-label text-text-secondary">{dateRange}</p>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<TrendingUp size={48} color="#C5CCD6" aria-hidden="true" />}
            title="No data this week"
            description="Start tracking to see your weekly trend."
          />
        </CardContent>
      </Card>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="text-subheading font-semibold text-text-primary">Weekly CO₂ trend</h2>
        <p className="text-label text-text-secondary">{dateRange}</p>
      </CardHeader>
      <CardContent>
        <WeeklyTrendChart data={chartData} goal={goal} />
      </CardContent>
    </Card>
  )
}
