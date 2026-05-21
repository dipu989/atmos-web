'use client'

// ─── Math helpers ─────────────────────────────────────────────────────────────

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

  const segments = 16
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

// ─── Sparkline ────────────────────────────────────────────────────────────────

export interface SparklineProps {
  data: number[]
  /**
   * Index of the data point to highlight in orange.
   * If omitted, the highest-value point is highlighted.
   */
  highlightIndex?: number
  /** Fixed height in px. Default: 56 */
  height?: number
  /**
   * When true the SVG stretches to fill its container (width="100%").
   * When false (default) the SVG renders at a fixed 220 × height.
   */
  responsive?: boolean
  /** Line / area colour. Default: "#4A90C4" */
  lineColor?: string
}

/**
 * Micro sparkline using Catmull-Rom bezier smoothing.
 * Exported so it can be used in WeeklyDigestHero and InsightCard.
 */
export function Sparkline({
  data,
  highlightIndex,
  height = 56,
  responsive = false,
  lineColor = '#4A90C4',
}: SparklineProps) {
  const W = 220
  const H = height
  const PAD_X = 4
  const PAD_Y = 4

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points: [number, number][] = data.map((v, i) => [
    PAD_X + (i / (data.length - 1)) * (W - PAD_X * 2),
    PAD_Y + (1 - (v - min) / range) * (H - PAD_Y * 2),
  ])

  const linePath = buildCatmullRomPath(points)
  const areaPath =
    linePath +
    ` L ${points[points.length - 1][0].toFixed(2)} ${H} L ${points[0][0].toFixed(2)} ${H} Z`

  // Resolve highlighted index: explicit prop takes priority; else max-value index
  const peakIndex = highlightIndex !== undefined ? highlightIndex : data.indexOf(max)

  const gradientId = `spark-gradient-${lineColor.replace('#', '')}`

  return (
    <svg
      data-testid="sparkline-svg"
      width={responsive ? '100%' : W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.22" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradientId})`} />

      {/* Line */}
      <path d={linePath} stroke={lineColor} strokeWidth="1.75" strokeLinejoin="round" />

      {/* Data points */}
      {points.map(([x, y], i) => {
        const isHighlight = i === peakIndex
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={isHighlight ? 4 : 2.2}
            fill={isHighlight ? '#F0956A' : '#FFFFFF'}
            stroke={isHighlight ? '#F0956A' : lineColor}
            strokeWidth={isHighlight ? 0 : 1.2}
            data-testid={isHighlight ? 'sparkline-peak' : undefined}
          />
        )
      })}
    </svg>
  )
}
