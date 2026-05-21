'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { TooltipProps } from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DailyBarChartDataPoint {
  date: string
  co2_kg: number
  label: string // e.g. "May 1"
}

export interface DailyBarChartProps {
  data: DailyBarChartDataPoint[]
  goal: number
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

interface CustomTooltipPayload {
  date: string
  co2_kg: number
  label: string
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  const point = payload[0].payload as CustomTooltipPayload
  const isOverGoal = payload[0].value !== undefined && payload[0].value > (payload[0].payload as CustomTooltipPayload & { goal?: number }).goal!

  return (
    <div className="rounded-xl bg-white shadow-card px-3 py-2">
      <p className="text-[13px] font-medium text-[#1A2332]">{point.label}</p>
      <p className="text-[13px] text-[#6B7A8D]">{point.co2_kg.toFixed(1)} kg CO₂</p>
      {isOverGoal && (
        <p className="text-[12px] font-medium text-[#F0956A]">Over goal</p>
      )}
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
    <text x={x} y={y - 6} fill="#3DAB82" fontSize={11} textAnchor="end">
      Goal
    </text>
  )
}

// ─── Chart ────────────────────────────────────────────────────────────────────

export function DailyBarChart({ data, goal }: DailyBarChartProps) {
  // Attach goal to each data point so the tooltip can access it
  const dataWithGoal = data.map((d) => ({ ...d, goal }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={dataWithGoal}
        margin={{ top: 24, right: 36, bottom: 0, left: 0 }}
        barCategoryGap="30%"
      >
        <CartesianGrid vertical={false} stroke="#F0F2F5" />

        <XAxis
          dataKey="label"
          tick={({ x, y, index, value }: { x: number; y: number; index: number; value: string }) => {
            // Show every 5th label only to avoid crowding
            if (index % 5 !== 0) return <g key={`x-tick-${index}`} />
            return (
              <text
                key={`x-tick-${index}`}
                x={x}
                y={y + 12}
                fill="#6B7A8D"
                fontSize={11}
                textAnchor="middle"
              >
                {value}
              </text>
            )
          }}
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

        <ReferenceLine
          y={goal}
          stroke="#3DAB82"
          strokeDasharray="6 4"
          strokeOpacity={0.7}
          label={<GoalLabel />}
        />

        <Bar dataKey="co2_kg" radius={[4, 4, 0, 0]}>
          {dataWithGoal.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.co2_kg > goal ? '#F0956A' : '#4A90C4'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
