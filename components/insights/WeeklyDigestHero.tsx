'use client'

import { ArrowDown, ArrowUp } from 'lucide-react'

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

// ─── Sparkline ────────────────────────────────────────────────────────────────
// Raw SVG micro-chart — Catmull-Rom bezier curve with area fill + data points.

interface SparklineProps {
  data: number[]
}

function catmullRomPoint(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  t: number,
): [number, number] {
  const t2 = t * t
  const t3 = t2 * t
  const x =
    0.5 *
    (2 * p1[0] +
      (-p0[0] + p2[0]) * t +
      (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
      (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
  const y =
    0.5 *
    (2 * p1[1] +
      (-p0[1] + p2[1]) * t +
      (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
      (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
  return [x, y]
}

/** Build a smoothed SVG path string using Catmull-Rom splines. */
function buildCatmullRomPath(points: [number, number][]): string {
  if (points.length < 2) return ''

  const segments = 16 // steps per segment
  const parts: string[] = [`M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`]

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    for (let s = 1; s <= segments; s++) {
      const t = s / segments
      const [x, y] = catmullRomPoint(p0, p1, p2, p3, t)
      parts.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`)
    }
  }

  return parts.join(' ')
}

function Sparkline({ data }: SparklineProps) {
  const W = 220
  const H = 56
  const PAD_X = 4
  const PAD_Y = 4

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  // Map data → SVG coordinates (y is inverted — top = 0)
  const points: [number, number][] = data.map((v, i) => [
    PAD_X + (i / (data.length - 1)) * (W - PAD_X * 2),
    PAD_Y + (1 - (v - min) / range) * (H - PAD_Y * 2),
  ])

  const linePath = buildCatmullRomPath(points)

  // Area path: line + vertical drop to bottom + close
  const areaPath =
    linePath +
    ` L ${points[points.length - 1][0].toFixed(2)} ${H} L ${points[0][0].toFixed(2)} ${H} Z`

  // Highlighted point = highest value (lowest y)
  const peakIndex = data.indexOf(max)

  const gradientId = 'spark-gradient'

  return (
    <svg
      data-testid="sparkline-svg"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A90C4" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#4A90C4" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradientId})`} />

      {/* Line */}
      <path d={linePath} stroke="#4A90C4" strokeWidth="1.75" strokeLinejoin="round" />

      {/* Data points */}
      {points.map(([x, y], i) => {
        const isPeak = i === peakIndex
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={isPeak ? 4 : 2.2}
            fill={isPeak ? '#F0956A' : '#FFFFFF'}
            stroke={isPeak ? '#F0956A' : '#4A90C4'}
            strokeWidth={isPeak ? 0 : 1.2}
            data-testid={isPeak ? 'sparkline-peak' : undefined}
          />
        )
      })}
    </svg>
  )
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
