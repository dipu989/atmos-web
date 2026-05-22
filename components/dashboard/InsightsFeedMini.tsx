'use client'

import Link from 'next/link'
import { Lightbulb } from 'lucide-react'
import { useInsights } from '@/lib/hooks/useTrips'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Insight } from '@/types/index'

// ─── Constants ────────────────────────────────────────────────────────────────

const INSIGHT_COLORS: Record<string, string> = {
  streak:            '#4A90C4',
  tip:               '#3DAB82',
  anomaly:           '#F0956A',
  comparison:        '#7BA9D4',
  milestone:         '#4A90C4',
  mode_summary:      '#8AC9A8',
  weekly_comparison: '#4A90C4',
  mode_spike:        '#F0956A',
}

function getInsightColor(insightType: string): string {
  return INSIGHT_COLORS[insightType] ?? '#4A90C4'
}

function formatChipLabel(insightType: string): string {
  return insightType.replace(/_/g, ' ').toUpperCase()
}

// ─── Mini insight card (local — not exported) ─────────────────────────────────

function MiniInsightCard({ insight }: { insight: Insight }) {
  const color = getInsightColor(insight.insightType)

  return (
    <div
      className="relative bg-bg-card"
      style={{
        borderLeft: `3px solid ${color}`,
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Unread dot — top-right corner */}
      {!insight.isRead && (
        <div
          data-testid="unread-dot"
          className="absolute right-3 top-3 rounded-full"
          style={{ width: 6, height: 6, backgroundColor: '#4A90C4' }}
        />
      )}

      {/* Type chip */}
      <span
        className="inline-block text-[10px] font-semibold"
        style={{
          color,
          backgroundColor: `${color}14`,
          padding: '2px 8px',
          borderRadius: '999px',
          letterSpacing: '0.04em',
        }}
      >
        {formatChipLabel(insight.insightType)}
      </span>

      {/* Title */}
      <p
        className="text-[14px] font-semibold text-text-primary"
        style={{ marginTop: 6 }}
      >
        {insight.title}
      </p>

      {/* Body — 2-line clamp */}
      <p
        className="line-clamp-2 text-[13px] font-normal text-text-secondary"
        style={{ marginTop: 4 }}
      >
        {insight.body}
      </p>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function MiniInsightCardSkeleton() {
  return (
    <div
      data-testid="insight-skeleton"
      className="relative bg-bg-card"
      style={{
        borderLeft: '3px solid #E5E7EB',
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Chip skeleton */}
      <div className="h-[18px] w-16 animate-pulse rounded-full bg-gray-100" />
      {/* Title skeleton */}
      <div className="mt-[6px] h-[14px] w-3/4 animate-pulse rounded bg-gray-100" />
      {/* Body skeletons */}
      <div className="mt-[4px] h-[13px] w-full animate-pulse rounded bg-gray-100" />
      <div className="mt-1 h-[13px] w-2/3 animate-pulse rounded bg-gray-100" />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InsightsFeedMini() {
  const { data: insights, isLoading, isError } = useInsights()

  const unreadCount = insights ? insights.filter((i) => !i.isRead).length : 0

  // Show first 3 unread; fall back to first 3 overall if all are read
  const displayInsights = (() => {
    if (!insights) return []
    const unread = insights.filter((i) => !i.isRead)
    const source = unread.length > 0 ? unread : insights
    return source.slice(0, 3)
  })()

  return (
    <div className="rounded-2xl bg-bg-card p-5 shadow-card">
      {/* ── Card header ─────────────────────────────────────────────────────── */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[17px] font-semibold text-text-primary">Insights</h2>

          {/* Unread count badge — only when there are unread items */}
          {!isLoading && unreadCount > 0 && (
            <span
              data-testid="unread-badge"
              className="text-[11px] font-semibold"
              style={{
                color: '#4A90C4',
                backgroundColor: 'rgba(74,144,196,0.10)',
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        <Link href="/insights" className="text-[13px] text-horizon-blue hover:underline">
          See all →
        </Link>
      </div>

      {/* ── Loading ─────────────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <MiniInsightCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────────────────────── */}
      {!isLoading && isError && (
        <div className="flex items-center justify-center py-8">
          <p className="text-[13px] text-text-secondary">Could not load insights</p>
        </div>
      )}

      {/* ── Empty ───────────────────────────────────────────────────────────── */}
      {!isLoading && !isError && displayInsights.length === 0 && (
        <EmptyState
          icon={<Lightbulb size={48} color="#C5CCD6" aria-hidden="true" />}
          title="No insights yet"
          description="Keep tracking trips and insights will appear here."
          action={{ label: 'Go to Insights', href: '/insights' }}
        />
      )}

      {/* ── Insight cards ───────────────────────────────────────────────────── */}
      {!isLoading && !isError && displayInsights.length > 0 && (
        <div className="flex flex-col gap-3">
          {displayInsights.map((insight) => (
            <MiniInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}
    </div>
  )
}
