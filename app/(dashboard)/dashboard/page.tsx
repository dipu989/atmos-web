'use client'

import { useState } from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { TodayImpactCards } from '@/components/dashboard/TodayImpactCards'
import { WeeklyTrendCard } from '@/components/dashboard/WeeklyTrendCard'
import { TransportBreakdownCard } from '@/components/dashboard/TransportBreakdownCard'
import { RecentTripsList } from '@/components/dashboard/RecentTripsList'
import { InsightsFeedMini } from '@/components/dashboard/InsightsFeedMini'
import { useMe } from '@/lib/hooks/useTrips'
import { getStoredUser } from '@/lib/auth'

const RANGE_TO_PERIOD: Record<string, { days: number; period: 'daily' | 'weekly' | 'monthly' }> = {
  Today: { days: 1, period: 'daily' },
  'This week': { days: 7, period: 'weekly' },
  'This month': { days: 30, period: 'monthly' },
}

export default function DashboardPage() {
  const [range, setRange] = useState('This month')
  const { data: meData } = useMe()
  const storedUser = getStoredUser()
  const firstName = (meData?.display_name ?? storedUser?.display_name)?.split(' ')[0] ?? null

  const subtitle = firstName ? `Welcome back, ${firstName}` : undefined
  const { days, period } = RANGE_TO_PERIOD[range] ?? RANGE_TO_PERIOD['This month']

  return (
    <PageShell
      title="Dashboard"
      subtitle={subtitle}
      rangePicker={{ value: range, onChange: setRange }}
    >
      {/* Row 1: 4 stat cards — full width */}
      <TodayImpactCards />

      {/* Row 2: Weekly trend (left) + Transport breakdown (right 360px) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <WeeklyTrendCard days={days} />
        <TransportBreakdownCard period={period} label={range} />
      </div>

      {/* Row 3: Recent trips (left) + Insights feed (right 360px) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <RecentTripsList />
        <InsightsFeedMini />
      </div>
    </PageShell>
  )
}
