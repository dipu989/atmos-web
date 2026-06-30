'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChartDataPoint {
  day: string
  date: string
  co2_kg: number
}

export interface WeeklyTrendChartProps {
  data: ChartDataPoint[]
  goal: number
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  const point = payload[0].payload as ChartDataPoint

  return (
    <div className="rounded-xl bg-white shadow-card px-3 py-2">
      <p className="text-[13px] font-medium text-text-primary">
        {point.day}, {point.date}
      </p>
      <p className="text-[13px] text-text-secondary">{point.co2_kg.toFixed(1)} kg CO₂</p>
    </div>
  )
}

// ─── Goal reference line label ────────────────────────────────────────────────

interface GoalLabelProps {
  viewBox?: {
    x?: number
    y?: number
    width?: number
    height?: number
  }
}

function GoalLabel({ viewBox }: GoalLabelProps) {
  const x = (viewBox?.x ?? 0) + (viewBox?.width ?? 0)
  const y = viewBox?.y ?? 0
  return (
    <text x={x} y={y - 6} fill="#3DAB82" fontSize={12} textAnchor="end">
      Goal
    </text>
  )
}

// ─── Chart ────────────────────────────────────────────────────────────────────

export function WeeklyTrendChart({ data, goal }: WeeklyTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 28, right: 28, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A90C4" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#4A90C4" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke="#F0F2F5" />

        <XAxis
          dataKey="day"
          tick={{ fill: '#6B7A8D', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fill: '#6B7A8D', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={28}
          tickFormatter={(v: number) => String(v)}
        />

        <Tooltip content={<CustomTooltip />} cursor={false} />

        <ReferenceLine
          y={goal}
          stroke="#3DAB82"
          strokeDasharray="6 4"
          strokeOpacity={0.6}
          label={<GoalLabel />}
        />

        <Area
          type="monotone"
          dataKey="co2_kg"
          stroke="#4A90C4"
          strokeWidth={2}
          fill="url(#areaFill)"
          activeDot={{ r: 6, fill: 'white', stroke: '#4A90C4', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
