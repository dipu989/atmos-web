'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MonthOverMonthDataPoint {
  week: string
  current: number
  previous: number
}

export interface MonthOverMonthChartProps {
  data: MonthOverMonthDataPoint[]
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl bg-white shadow-card px-3 py-2">
      <p className="text-[13px] font-medium text-[#1A2332] mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-[12px]" style={{ color: entry.color }}>
          {entry.name === 'current' ? 'This month' : 'Last month'}:{' '}
          {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value} kg
        </p>
      ))}
    </div>
  )
}

// ─── Custom legend ────────────────────────────────────────────────────────────

function CustomLegend() {
  return (
    <div className="flex items-center gap-4 justify-center mt-2">
      <div className="flex items-center gap-1.5" data-testid="legend-current">
        <span
          className="inline-block rounded-full"
          style={{ width: 8, height: 8, backgroundColor: '#4A90C4' }}
        />
        <span className="text-[12px] text-[#6B7A8D]">This month</span>
      </div>
      <div className="flex items-center gap-1.5" data-testid="legend-previous">
        <span
          className="inline-block rounded-full"
          style={{ width: 8, height: 8, backgroundColor: '#C5CCD6' }}
        />
        <span className="text-[12px] text-[#6B7A8D]">Last month</span>
      </div>
    </div>
  )
}

// ─── Chart ────────────────────────────────────────────────────────────────────

export function MonthOverMonthChart({ data }: MonthOverMonthChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 12, right: 16, bottom: 0, left: 0 }}
          barGap={4}
          barCategoryGap="30%"
        >
          <CartesianGrid vertical={false} stroke="#F0F2F5" />

          <XAxis
            dataKey="week"
            tick={{ fill: '#6B7A8D', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: '#6B7A8D', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={28}
            tickFormatter={(v: number) => String(v)}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />

          {/* Hidden Legend to keep Recharts aware of keys — we render our own */}
          <Legend content={() => null} />

          <Bar dataKey="current" fill="#4A90C4" radius={[4, 4, 0, 0]} name="current" />
          <Bar dataKey="previous" fill="#C5CCD6" radius={[4, 4, 0, 0]} name="previous" />
        </BarChart>
      </ResponsiveContainer>

      <CustomLegend />
    </div>
  )
}
