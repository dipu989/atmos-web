import { TodayImpactCards } from '@/components/dashboard/TodayImpactCards'
import { WeeklyTrendCard } from '@/components/dashboard/WeeklyTrendCard'
import { RecentTripsList } from '@/components/dashboard/RecentTripsList'
import { InsightsFeedMini } from '@/components/dashboard/InsightsFeedMini'

export default function DashboardPage() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <TodayImpactCards />
      <WeeklyTrendCard />
      <RecentTripsList />
      <InsightsFeedMini />
    </div>
  )
}
