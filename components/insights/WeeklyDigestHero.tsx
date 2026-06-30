'use client'

import { ArrowDown, ArrowUp } from 'lucide-react'
import { Sparkline } from '@/components/charts/Sparkline'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WeeklyDigestHeroProps {
  insight: {
    type: string       // "WEEKLY DIGEST"
    title: string
    body: string
    metric: {
      primary: string  // "33.5 kg"
      sub: string      // "21 trips · 7 days"
      delta: number    // -8 means -8% (negative = improvement)
    }
    spark: number[]    // 7 values for sparkline
  }
}

// ─── Delta badge ──────────────────────────────────────────────────────────────

interface DeltaBadgeProps {
  delta: number // negative = improvement (green), positive = worse (orange)
}

function DeltaBadge({ delta }: DeltaBadgeProps) {
  const isImprovement = delta < 0
  const abs = Math.abs(delta)
  const Icon = isImprovement ? ArrowDown : ArrowUp
  const label = isImprovement ? 'delta-down' : 'delta-up'

  return (
    <span
      data-testid={label}
      className={`inline-flex items-center gap-0.5 ${isImprovement ? 'bg-sage/18 text-sage' : 'bg-peach/18 text-peach'}`}
      style={{
        borderRadius: '999px',
        padding: '3px 8px',
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
      <Icon size={10} strokeWidth={2.5} aria-hidden="true" />
      {abs}% vs last week
    </span>
  )
}

// ─── WeeklyDigestHero ─────────────────────────────────────────────────────────

export function WeeklyDigestHero({ insight }: WeeklyDigestHeroProps) {
  const { type, title, body, metric, spark } = insight

  return (
    <div className="rounded-[20px] bg-text-primary p-5 lg:p-[28px_32px]">
      {/* On mobile: single-column. On lg+: side-by-side with sparkline */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        {/* ── Left / main column ───────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Type chip */}
          <span
            className="inline-block self-start text-[10px] font-semibold uppercase"
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.70)',
              borderRadius: '999px',
              padding: '3px 10px',
              letterSpacing: '0.06em',
            }}
          >
            {type}
          </span>

          {/* Title */}
          <h2
            className="font-semibold text-white"
            style={{
              fontSize: 22,
              marginTop: 12,
              letterSpacing: '-0.4px',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h2>

          {/* Body */}
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.65)',
              marginTop: 8,
              lineHeight: 1.5,
            }}
          >
            {body}
          </p>

          {/* Metric block */}
          <div style={{ marginTop: 20 }}>
            {/* Primary metric + delta badge */}
            <div className="flex items-baseline gap-3">
              <span
                className="font-bold text-white"
                style={{ fontSize: 36, letterSpacing: '-0.8px', lineHeight: 1 }}
              >
                {metric.primary}
              </span>
              <DeltaBadge delta={metric.delta} />
            </div>

            {/* Sub text */}
            <p
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.55)',
                marginTop: 2,
              }}
            >
              {metric.sub}
            </p>
          </div>
        </div>

        {/* ── Right column: sparkline — hidden on mobile (decorative) ──────── */}
        <div className="hidden shrink-0 items-center self-center lg:flex">
          <Sparkline data={spark} />
        </div>
      </div>
    </div>
  )
}
