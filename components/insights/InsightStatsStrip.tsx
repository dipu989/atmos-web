'use client'

import { Bell, Check, Leaf, Lightbulb } from 'lucide-react'
import type { Insight } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InsightStatsStripProps {
  insights: Insight[]
  loading?: boolean
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonStatCard() {
  return (
    <div
      data-testid="stat-strip-skeleton"
      className="animate-pulse rounded-2xl bg-gray-100"
      style={{ minHeight: 96 }}
    />
  )
}

// ─── CompactStatCard ──────────────────────────────────────────────────────────

interface CompactStatCardProps {
  accentToken: 'blue' | 'sage' | 'peach' | 'slate'
  label: string
  value: string | number
  unit?: string
  icon: React.ReactNode
}

function CompactStatCard({ accentToken, label, value, unit, icon }: CompactStatCardProps) {
  const ACCENT_CLASSES: Record<string, { border: string; text: string }> = {
    blue:  { border: 'border-t-horizon-blue', text: 'text-horizon-blue' },
    sage:  { border: 'border-t-sage',         text: 'text-sage' },
    peach: { border: 'border-t-peach',        text: 'text-peach' },
    slate: { border: 'border-t-text-secondary', text: 'text-text-secondary' },
  }
  const accent = ACCENT_CLASSES[accentToken]
  return (
    <div
      className={`flex flex-col gap-1 rounded-2xl border-t-[3px] bg-bg-card shadow-card ${accent.border}`}
      style={{ minHeight: 96, padding: '18px 20px' }}
    >
      <div className="flex items-center gap-1.5">
        <span className={accent.text} aria-hidden="true">
          {icon}
        </span>
        <span className="text-[12px] font-medium uppercase tracking-[0.4px] text-text-secondary">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-semibold leading-none tracking-[-0.4px] text-text-primary">
          {value}
        </span>
        {unit && (
          <span className="text-[12px] font-medium text-text-secondary">{unit}</span>
        )}
      </div>
    </div>
  )
}

// ─── InsightStatsStrip ────────────────────────────────────────────────────────

export function InsightStatsStrip({ insights, loading }: InsightStatsStripProps) {
  if (loading) {
    return (
      <div
        data-testid="insight-stats-strip"
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>
    )
  }

  const total = insights.length
  const newCount = insights.filter((i) => !i.isRead).length
  // "Actions taken" = insights that are read AND have a CTA label (proxy for acted-upon)
  const acted = insights.filter((i) => i.isRead && !!i.ctaLabel).length
  // "Potential save" = sum of potential_save_kg from tip insights metadata
  const potentialSave = insights
    .filter((i) => i.insightType === 'tip')
    .reduce(
      (sum, i) => sum + ((i.metadata.potential_save_kg as number | undefined) ?? 0),
      0,
    )

  return (
    <div
      data-testid="insight-stats-strip"
      className="grid grid-cols-2 gap-4 sm:grid-cols-4"
    >
      <CompactStatCard
        accentToken="blue"
        label="Total insights"
        value={total}
        icon={<Lightbulb size={13} />}
      />
      <CompactStatCard
        accentToken="peach"
        label="New"
        value={newCount}
        icon={<Bell size={13} />}
      />
      <CompactStatCard
        accentToken="sage"
        label="Actions taken"
        value={acted}
        icon={<Check size={13} />}
      />
      <CompactStatCard
        accentToken="slate"
        label="Potential save"
        value={potentialSave.toFixed(1)}
        unit="kg/mo"
        icon={<Leaf size={13} />}
      />
    </div>
  )
}
