'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { WeeklyDigestHero } from '@/components/insights/WeeklyDigestHero'
import type { WeeklyDigestHeroProps } from '@/components/insights/WeeklyDigestHero'
import { AchievementsPanel } from '@/components/insights/AchievementsPanel'
import type { Achievement } from '@/components/insights/AchievementsPanel'
import { InsightStatsStrip } from '@/components/insights/InsightStatsStrip'
import { InsightTypeTabs } from '@/components/insights/InsightTypeTabs'
import { InsightFeed } from '@/components/insights/InsightFeed'
import { useInsights } from '@/lib/hooks/useTrips'
import { useMarkInsightRead } from '@/lib/hooks/useMutations'
import type { Insight, InsightType } from '@/types'

// ─── Mapper: Insight → WeeklyDigestHero props ─────────────────────────────────
// NOTE: The design referenced 'WEEKLY_DIGEST' as the hero type. In the actual API
// this maps to 'weekly_comparison'. Metric / sparkline data is extracted from
// insight.metadata when provided by the backend.

function mapToHeroInsight(insight: Insight): WeeklyDigestHeroProps['insight'] {
  const meta = insight.metadata
  return {
    type: 'WEEKLY DIGEST',
    title: insight.title,
    body: insight.body,
    metric: {
      primary: (meta.primary_metric as string | undefined) ?? '--',
      sub:     (meta.metric_sub    as string | undefined) ?? '--',
      delta:   (meta.change_pct    as number | undefined) ?? 0,
    },
    spark: (meta.spark_data as number[] | undefined) ?? [],
  }
}

// ─── Hero skeleton ────────────────────────────────────────────────────────────

function HeroSkeleton() {
  return (
    <div
      data-testid="hero-skeleton"
      className="animate-pulse rounded-2xl bg-gray-100"
      style={{ minHeight: 180 }}
    />
  )
}

// ─── InsightsError ────────────────────────────────────────────────────────────

function InsightsError() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10">
      <AlertTriangle size={24} className="text-text-secondary" aria-hidden="true" />
      <p className="text-[13px] text-text-secondary">
        Could not load insights. Please try again.
      </p>
    </div>
  )
}

// ─── Insights Page ─────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<'all' | InsightType>('all')

  const { data: insights, isLoading, isError } = useInsights()
  const { mutate: markRead } = useMarkInsightRead()

  // Featured: first weekly_comparison (= WEEKLY_DIGEST concept), or first insight if none
  const featuredInsight =
    insights?.find((i) => i.insightType === 'weekly_comparison') ?? insights?.[0]

  // Feed: exclude the hero insight and weekly_comparison; when a specific tab is
  // active, also filter by type — but still suppress the featured item so it
  // doesn't appear both in the hero and in the list simultaneously.
  const filteredInsights = (insights ?? []).filter(
    (i) =>
      i.insightType !== 'weekly_comparison' &&
      i.id !== featuredInsight?.id &&
      (activeTab === 'all' || i.insightType === activeTab),
  )

  // Achievements derived from MILESTONE and STREAK insights.
  // NOTE: No dedicated achievements endpoint exists. Using milestone/streak insights as proxy.
  const achievements: Achievement[] = (insights ?? [])
    .filter((i) => i.insightType === 'milestone' || i.insightType === 'streak')
    .map((i) => ({
      id:    i.id,
      name:  i.title,
      desc:  i.body,
      icon:  i.insightType === 'milestone' ? 'trophy' : 'flame',
      colorToken: i.insightType === 'milestone' ? 'blue' as const : 'sage' as const,
      earned: i.isRead,
      date: i.isRead
        ? new Date(i.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day:   'numeric',
          })
        : undefined,
      progress:
        i.insightType === 'streak'
          ? ((i.metadata.progress as { current: number } | undefined)?.current ?? 0)
          : undefined,
      target:
        i.insightType === 'streak'
          ? ((i.metadata.progress as { target: number } | undefined)?.target ?? 30)
          : undefined,
    }))

  function handleMarkRead(id: string) {
    markRead(id)
  }

  return (
    <PageShell
      title="Insights"
      subtitle="What Atmos has learned from your travel patterns."
    >
      {isError ? (
        <InsightsError />
      ) : (
        <>
          {/* Stats strip — 4 compact KPI cards */}
          <InsightStatsStrip insights={insights ?? []} loading={isLoading} />

          {/* Featured hero — most recent WEEKLY_DIGEST insight */}
          {isLoading && <HeroSkeleton />}
          {!isLoading && featuredInsight && (
            <WeeklyDigestHero insight={mapToHeroInsight(featuredInsight)} />
          )}

          {/* Type tabs + feed */}
          <div>
            <InsightTypeTabs
              insights={insights ?? []}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
            <InsightFeed
              insights={filteredInsights}
              onRead={handleMarkRead}
              loading={isLoading}
              activeType={activeTab}
              onViewAll={activeTab !== 'all' ? () => setActiveTab('all') : undefined}
            />
          </div>

          {/* Achievements panel — full width at bottom */}
          <AchievementsPanel achievements={achievements} loading={isLoading} />
        </>
      )}
    </PageShell>
  )
}
