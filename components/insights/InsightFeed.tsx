'use client'

import { Lightbulb } from 'lucide-react'
import { InsightCard } from '@/components/insights/InsightCard'
import { EmptyState } from '@/components/ui/EmptyState'
import type { InsightCardInsight } from '@/components/insights/InsightCard'
import type { Insight, InsightType } from '@/types'

// ─── Label map for empty-state titles ────────────────────────────────────────

const INSIGHT_TYPE_LABELS: Record<InsightType, string> = {
  streak:            'streak',
  milestone:         'milestone',
  comparison:        'comparison',
  tip:               'tip',
  anomaly:           'anomaly',
  weekly_comparison: 'weekly comparison',
  mode_spike:        'mode spike',
  mode_summary:      'mode summary',
}

// ─── Visual config per insight type ──────────────────────────────────────────

const INSIGHT_VISUAL: Record<InsightType, { color: string; icon: string }> = {
  streak:            { color: '#3DAB82', icon: '🔥' },
  milestone:         { color: '#4A90C4', icon: '🏆' },
  comparison:        { color: '#F0956A', icon: '📊' },
  tip:               { color: '#3DAB82', icon: '💡' },
  anomaly:           { color: '#E05252', icon: '⚠️' },
  weekly_comparison: { color: '#4A90C4', icon: '📅' },
  mode_spike:        { color: '#F0956A', icon: '🚀' },
  mode_summary:      { color: '#6B7A8D', icon: '🗺️' },
}

// ─── Mapper: Insight → InsightCardInsight ─────────────────────────────────────

function mapToCardInsight(insight: Insight): InsightCardInsight {
  const visual = INSIGHT_VISUAL[insight.insightType] ?? { color: '#6B7A8D', icon: '💡' }
  const meta = insight.metadata

  const progressMeta = meta.progress as
    | { current: number; target: number; label: string }
    | undefined

  return {
    id: insight.id,
    type: insight.insightType,
    color: visual.color,
    icon: visual.icon,
    date: new Date(insight.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    new: !insight.isRead,
    title: insight.title,
    body: insight.body,
    spark: meta.spark_data as number[] | undefined,
    sparkHighlight: meta.spark_highlight as number | undefined,
    impact: meta.impact as string | undefined,
    progress: progressMeta
      ? {
          current: progressMeta.current,
          target: progressMeta.target,
          label: progressMeta.label,
        }
      : undefined,
    actions: insight.ctaLabel ? [insight.ctaLabel] : [],
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface InsightFeedProps {
  insights: Insight[]
  onRead: (id: string) => void
  loading?: boolean
  /** Active filter tab — used to tailor the empty state copy. Defaults to 'all'. */
  activeType?: InsightType | 'all'
  /** Called when the user clicks "View all" in the filtered empty state. */
  onViewAll?: () => void
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function FeedSkeleton() {
  return (
    <div
      data-testid="feed-skeleton"
      className="animate-pulse rounded-2xl bg-gray-100"
      style={{ minHeight: 100 }}
    />
  )
}

// ─── InsightFeed ──────────────────────────────────────────────────────────────

export function InsightFeed({
  insights,
  onRead,
  loading,
  activeType = 'all',
  onViewAll,
}: InsightFeedProps) {
  if (loading) {
    return (
      <div data-testid="insight-feed" className="mt-3 flex flex-col" style={{ gap: 12 }}>
        <FeedSkeleton />
        <FeedSkeleton />
        <FeedSkeleton />
      </div>
    )
  }

  if (insights.length === 0) {
    const isFiltered = activeType !== 'all'
    const typeLabel = isFiltered
      ? (INSIGHT_TYPE_LABELS[activeType as InsightType] ?? (activeType as string).replace(/_/g, ' '))
      : null

    return (
      <div data-testid="insight-feed">
        {isFiltered ? (
          <EmptyState
            icon={<Lightbulb size={48} color="#C5CCD6" aria-hidden="true" />}
            title={`No ${typeLabel} insights`}
            description="Nothing here yet."
            action={onViewAll ? { label: 'View all', onClick: onViewAll } : undefined}
          />
        ) : (
          <EmptyState
            icon={<Lightbulb size={48} color="#C5CCD6" aria-hidden="true" />}
            title="No insights yet"
            description="Keep logging trips — Atmos will analyze your patterns soon."
          />
        )}
      </div>
    )
  }

  return (
    <div data-testid="insight-feed" className="mt-3 flex flex-col" style={{ gap: 12 }}>
      {insights.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={mapToCardInsight(insight)}
          onRead={onRead}
        />
      ))}
    </div>
  )
}
