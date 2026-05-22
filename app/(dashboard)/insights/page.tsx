'use client'

import { useState } from 'react'
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
      className="animate-pulse rounded-2xl"
      style={{ backgroundColor: '#1A2332', minHeight: 180 }}
    />
  )
}

// ─── Insights Page ─────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<'all' | InsightType>('all')

  const { data: insights, isLoading } = useInsights()
  const { mutate: markRead } = useMarkInsightRead()

  // Featured: first weekly_comparison (= WEEKLY_DIGEST concept), or first insight if none
  const featuredInsight =
    insights?.find((i) => i.insightType === 'weekly_comparison') ?? insights?.[0]

  // Feed: exclude weekly_comparison (it's shown in the hero)
  const filteredInsights =
    activeTab === 'all'
      ? (insights ?? []).filter((i) => i.insightType !== 'weekly_comparison')
      : (insights ?? []).filter((i) => i.insightType === activeTab)

  // Achievements derived from MILESTONE and STREAK insights.
  // NOTE: No dedicated achievements endpoint exists. Using milestone/streak insights as proxy.
  const achievements: Achievement[] = (insights ?? [])
    .filter((i) => i.insightType === 'milestone' || i.insightType === 'streak')
    .map((i) => ({
      id:    i.id,
      name:  i.title,
      desc:  i.body,
      icon:  i.insightType === 'milestone' ? 'trophy' : 'flame',
      color: i.insightType === 'milestone' ? '#4A90C4' : '#3DAB82',
      earned: i.isRead,
      date: i.isRead
        ? new Date(i.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day:   'numeric',
          })
        : undefined,
      progress:
        i.insightType === 'streak'
          ? ((i.metadata.current as number | undefined) ?? 0)
          : undefined,
      target:
        i.insightType === 'streak'
          ? ((i.metadata.target as number | undefined) ?? 30)
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
        />
      </div>

      {/* Achievements panel — full width at bottom */}
      <AchievementsPanel achievements={achievements} loading={isLoading} />
    </PageShell>
  )
}
