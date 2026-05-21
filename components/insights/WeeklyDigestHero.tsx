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

  const bg = isImprovement ? 'rgba(61,171,130,0.18)' : 'rgba(240,149,106,0.18)'
  const color = isImprovement ? '#3DAB82' : '#F0956A'
  const Icon = isImprovement ? ArrowDown : ArrowUp
  const label = isImprovement ? 'delta-down' : 'delta-up'

  return (
    <span
      data-testid={label}
      className="inline-flex items-center gap-0.5"
      style={{
        backgroundColor: bg,
        color,
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
    <div
      style={{
        backgroundColor: '#1A2332',
        borderRadius: 20,
        padding: '28px 32px',
      }}
    >
      <div className="flex items-start justify-between gap-6">
        {/* ── Left column ──────────────────────────────────────────────────── */}
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

        {/* ── Right column: sparkline ───────────────────────────────────────── */}
        <div className="flex shrink-0 items-center self-center">
          <Sparkline data={spark} />
        </div>
      </div>
    </div>
  )
}
