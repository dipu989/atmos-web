'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { PageShell } from '@/components/layout/PageShell'
import { AnalyticsSummaryCards } from '@/components/dashboard/AnalyticsSummaryCards'
import { DailyBarChart } from '@/components/charts/DailyBarChart'
import { MonthOverMonthChart } from '@/components/charts/MonthOverMonthChart'
import { ModeStackedAreaChart } from '@/components/charts/ModeStackedAreaChart'
import { WeekdayAverageChart } from '@/components/charts/WeekdayAverageChart'
import { TopRoutesTable } from '@/components/analytics/TopRoutesTable'
import { SectionCard } from '@/components/ui/Card'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import { useIsMobile } from '@/lib/hooks/useIsMobile'
import type { AnalyticsPeriod } from '@/lib/hooks/useAnalytics'

// ─── Period switcher ──────────────────────────────────────────────────────────

const PERIOD_OPTIONS: { key: AnalyticsPeriod; label: string; shortLabel: string }[] = [
  { key: '30d', label: '30 days',   shortLabel: '30d' },
  { key: '3m',  label: '3 months',  shortLabel: '3m'  },
  { key: '6m',  label: '6 months',  shortLabel: '6m'  },
  { key: '1y',  label: '1 year',    shortLabel: '1y'  },
]

interface PeriodSwitcherProps {
  value: AnalyticsPeriod
  onChange: (v: AnalyticsPeriod) => void
  isMobile: boolean
}

function PeriodSwitcher({ value, onChange, isMobile }: PeriodSwitcherProps) {
  return (
    <div
      data-testid="period-switcher"
      className="flex items-center rounded-xl bg-[#F0F2F5] p-1"
    >
      {PERIOD_OPTIONS.map(({ key, label, shortLabel }) => (
        <button
          key={key}
          type="button"
          data-testid={`period-option-${key}`}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all',
            value === key
              ? 'bg-white text-[#1A2332] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
              : 'text-[#6B7A8D] hover:text-[#1A2332]',
          )}
        >
          {isMobile ? shortLabel : label}
        </button>
      ))}
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div
      data-testid="chart-skeleton"
      className="animate-pulse rounded-xl bg-gray-100"
      style={{ height }}
    />
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="18" stroke="#C5CCD6" strokeWidth="2" />
        <path
          d="M12 28 L20 12 L28 28"
          stroke="#C5CCD6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-[14px] font-medium text-[#1A2332]">No data yet</p>
      <p className="text-[12.5px] text-[#6B7A8D]">{message}</p>
    </div>
  )
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ChartError() {
  return (
    <div className="flex items-center justify-center py-10">
      <p className="text-[13px] text-[#6B7A8D]">Failed to load chart data.</p>
    </div>
  )
}

// ─── Analytics page ───────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d')
  const isMobile = useIsMobile(768)
  const { isLoading, isError, dailyBarData, momData, modeData, weekdayData, routesData, goal } =
    useAnalytics(period)

  const chartHeight = isMobile ? 180 : 240

  const periodSwitcher = (
    <PeriodSwitcher value={period} onChange={setPeriod} isMobile={isMobile} />
  )

  return (
    <PageShell
      title="Analytics"
      subtitle="Understand your travel patterns over time."
      rightExtra={periodSwitcher}
    >
      {/* ── KPI cards ─────────────────────────────────────────────────── */}
      <AnalyticsSummaryCards period={period} />

      {/* ── Daily CO₂ + Month over month ──────────────────────────────── */}
      <div
        data-testid="analytics-section-daily"
        className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]"
      >
        <SectionCard title="Daily CO₂" subtitle="Emissions per day over the selected period">
          {isLoading && <ChartSkeleton height={chartHeight} />}
          {!isLoading && isError && <ChartError />}
          {!isLoading && !isError && dailyBarData.length === 0 && (
            <EmptyChart message="Start logging trips to see your daily CO₂." />
          )}
          {!isLoading && !isError && dailyBarData.length > 0 && (
            <DailyBarChart data={dailyBarData} goal={goal} height={chartHeight} />
          )}
        </SectionCard>

        <SectionCard title="Month over month" subtitle="By week">
          {isLoading && <ChartSkeleton height={chartHeight} />}
          {!isLoading && isError && <ChartError />}
          {!isLoading && !isError && momData.length === 0 && (
            <EmptyChart message="Not enough data yet." />
          )}
          {!isLoading && !isError && momData.length > 0 && (
            <MonthOverMonthChart data={momData} />
          )}
        </SectionCard>
      </div>

      {/* ── CO₂ by mode over time ─────────────────────────────────────── */}
      <SectionCard
        data-testid="analytics-section-mode"
        title="CO₂ by mode over time"
        subtitle="Weekly breakdown by transport mode"
      >
        {isLoading && <ChartSkeleton height={220} />}
        {!isLoading && isError && <ChartError />}
        {!isLoading && !isError && modeData.length === 0 && (
          <EmptyChart message="Start logging trips to see your mode breakdown." />
        )}
        {!isLoading && !isError && modeData.length > 0 && (
          <ModeStackedAreaChart data={modeData} />
        )}
      </SectionCard>

      {/* ── Top routes + Weekday average ──────────────────────────────── */}
      <div
        data-testid="analytics-section-routes"
        className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]"
      >
        <SectionCard title="Top recurring routes" subtitle="Most-repeated this period">
          {isLoading && <ChartSkeleton height={260} />}
          {!isLoading && isError && <ChartError />}
          {!isLoading && !isError && (
            <TopRoutesTable routes={routesData} loading={false} />
          )}
        </SectionCard>

        <SectionCard title="By day of week" subtitle="Average CO₂">
          {isLoading && <ChartSkeleton height={260} />}
          {!isLoading && isError && <ChartError />}
          {!isLoading && !isError && weekdayData.length === 0 && (
            <EmptyChart message="Not enough data yet." />
          )}
          {!isLoading && !isError && weekdayData.length > 0 && (
            <WeekdayAverageChart data={weekdayData} />
          )}
        </SectionCard>
      </div>
    </PageShell>
  )
}
