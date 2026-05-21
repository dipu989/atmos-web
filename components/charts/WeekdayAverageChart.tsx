'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WeekdayAverageChartProps {
  data: { day: string; avg_kg: number }[] // Mon–Sun
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  const value = payload[0].value as number

  return (
    <div className="rounded-xl bg-white shadow-card px-3 py-2 min-w-[100px]">
      <p className="text-[13px] font-medium text-[#1A2332]">{label}</p>
      <p className="text-[12px] text-[#6B7A8D]">{value.toFixed(2)} kg CO₂</p>
    </div>
  )
}

// ─── Chart ────────────────────────────────────────────────────────────────────

export function WeekdayAverageChart({ data }: WeekdayAverageChartProps) {
  const maxKg   = Math.max(...data.map((d) => d.avg_kg), 0)

  return (
    <div data-testid="weekday-average-chart">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 4, right: 24, bottom: 4, left: 0 }}
          barCategoryGap="25%"
        >
          <CartesianGrid horizontal={false} stroke="#F0F2F5" />

          <XAxis
            type="number"
            tick={{ fill: '#6B7A8D', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}`}
          />

          <YAxis
            type="category"
            dataKey="day"
            tick={{ fill: '#6B7A8D', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F7FA' }} />

          <Bar dataKey="avg_kg" radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.day}
                fill={entry.avg_kg === maxKg && maxKg > 0 ? '#F0956A' : '#4A90C4'}
                data-testid="weekday-bar"
                data-day={entry.day}
                data-is-max={entry.avg_kg === maxKg && maxKg > 0 ? 'true' : 'false'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
