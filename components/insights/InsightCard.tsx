'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sparkline } from '@/components/charts/Sparkline'
import { insightColorClasses } from '@/components/insights/insightColors'
import type { InsightType } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InsightCardInsight {
  id: string
  type: InsightType
  /** Emoji or short text rendered inside the icon badge */
  icon: string
  /** Formatted date string shown top-right */
  date: string
  /** Whether this insight has not yet been read */
  new: boolean
  title: string
  body: string
  /** ANOMALY type: data points for the mini sparkline */
  spark?: number[]
  /** ANOMALY type: index of the data point to highlight in orange */
  sparkHighlight?: number
  /** TIP type: e.g. "Potential save: 8.8 kg/month" */
  impact?: string
  /** STREAK type: progress towards a goal */
  progress?: { current: number; target: number; label: string }
  /** Labels for CTA buttons (first = primary outline, rest = ghost) */
  actions?: string[]
  /** In-app path the primary CTA button navigates to, e.g. "/trips/new" */
  ctaTarget?: string
}

export interface InsightCardProps {
  insight: InsightCardInsight
  onRead?: (id: string) => void
}

// ─── InsightCard ──────────────────────────────────────────────────────────────

export function InsightCard({ insight, onRead }: InsightCardProps) {
  const router = useRouter()
  const classes = insightColorClasses(insight.type)

  // Optimistic "read" state — removes the New dot immediately on click
  const [isNew, setIsNew] = useState(insight.new)

  function handleClick() {
    if (isNew) {
      setIsNew(false)
      onRead?.(insight.id)
    }
  }

  const pct =
    insight.progress
      ? Math.min(100, Math.round((insight.progress.current / insight.progress.target) * 100))
      : 0

  return (
    <div
      role="article"
      onClick={handleClick}
      className={cn('bg-bg-card border-l-4', classes.borderLeft, isNew && 'cursor-pointer')}
      style={{
        borderRadius: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
        padding: '18px 20px',
      }}
    >
      {/* ── Header row ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: icon badge + type chip */}
        <div className="flex items-center gap-2">
          {/* Icon badge */}
          <div
            aria-hidden="true"
            className={cn('flex shrink-0 items-center justify-center', classes.bgTint)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              fontSize: 15,
            }}
          >
            {insight.icon}
          </div>

          {/* Type chip */}
          <span
            className={cn('font-semibold uppercase', classes.text, classes.bgTintLight)}
            style={{
              fontSize: 10,
              borderRadius: 999,
              padding: '2px 8px',
              letterSpacing: '0.04em',
            }}
          >
            {insight.type.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>

        {/* Right: date + New dot */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-text-secondary" style={{ fontSize: 12 }}>
            {insight.date}
          </span>
          {isNew && (
            <span
              data-testid="new-dot"
              aria-label="Unread"
              className="bg-horizon-blue"
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </div>

      {/* ── Title ─────────────────────────────────────────────────────────── */}
      <p
        className="font-semibold text-text-primary"
        style={{ fontSize: 15, marginTop: 10 }}
      >
        {insight.title}
      </p>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <p
        className="text-text-secondary"
        style={{ fontSize: 13.5, marginTop: 6, lineHeight: 1.5 }}
      >
        {insight.body}
      </p>

      {/* ── Type-specific extras ──────────────────────────────────────────── */}

      {/* TIP — impact banner */}
      {insight.type === 'tip' && insight.impact && (
        <div
          data-testid="impact-banner"
          className="mt-3 inline-flex items-center gap-1.5 bg-sage/10 text-sage"
          style={{
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <Leaf size={14} aria-hidden="true" />
          {insight.impact}
        </div>
      )}

      {/* ANOMALY — mini sparkline */}
      {insight.type === 'anomaly' && insight.spark && (
        <div data-testid="anomaly-sparkline" className="mt-3 w-full">
          <Sparkline
            data={insight.spark}
            highlightIndex={insight.sparkHighlight}
            height={48}
            responsive
          />
        </div>
      )}

      {/* STREAK — progress bar */}
      {insight.type === 'streak' && insight.progress && (
        <div data-testid="streak-progress" className="mt-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-text-secondary" style={{ fontSize: 12 }}>
              {insight.progress.label}: {insight.progress.current}/{insight.progress.target}
            </span>
            <span className="text-text-secondary" style={{ fontSize: 12 }}>
              {pct}%
            </span>
          </div>
          <div className="overflow-hidden rounded-full bg-divider" style={{ height: 6 }}>
            <div
              data-testid="progress-fill"
              className={cn('h-full rounded-full transition-all duration-500 ease-out', classes.bg)}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Actions row ───────────────────────────────────────────────────── */}
      {insight.actions && insight.actions.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-2">
          {insight.actions.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (i === 0 && insight.ctaTarget) {
                  router.push(insight.ctaTarget)
                }
              }}
              className={cn(
                'font-medium transition-opacity hover:opacity-80',
                i === 0
                  ? cn('rounded-lg border bg-transparent', classes.border, classes.text)
                  : 'rounded-lg border-transparent bg-transparent text-text-secondary',
              )}
              style={{ padding: '6px 14px', fontSize: 13 }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
