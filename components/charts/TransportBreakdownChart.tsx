'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Sector } from 'recharts'
import type { TooltipProps } from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TransportModeData {
  id: string
  name: string
  co2_kg: number
  color: string
}

export interface TransportBreakdownChartProps {
  data: TransportModeData[]
}

// ─── Color mapping ────────────────────────────────────────────────────────────

export const TRANSPORT_COLORS: Record<string, string> = {
  car: '#F0956A',
  cab: '#F0956A',
  auto_rickshaw: '#F0956A',
  train: '#4A90C4',
  metro: '#4A90C4',
  bus: '#7BA9D4',
  cycling: '#3DAB82',
  two_wheeler: '#3DAB82',
  walking: '#8AC9A8',
  flight: '#E05252',
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  total,
}: TooltipProps<number, string> & { total: number }) {
  if (!active || !payload?.length) return null

  const entry = payload[0].payload as TransportModeData
  const pct = total > 0 ? ((entry.co2_kg / total) * 100).toFixed(0) : '0'

  return (
    <div className="rounded-xl bg-white shadow-card px-3 py-2 min-w-[120px]">
      <p className="text-[13px] font-medium text-[#1A2332]">{entry.name}</p>
      <p className="text-[13px] text-[#6B7A8D]">
        {entry.co2_kg.toFixed(2)} kg · {pct}%
      </p>
    </div>
  )
}

// ─── Active slice (grows on hover) ────────────────────────────────────────────

// Recharts passes sector geometry as `unknown` in activeShape callbacks;
// we cast to the known shape to access geometry props.
interface SectorGeometry {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
}

function renderActiveSlice(props: unknown) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props as SectorGeometry
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 4}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  )
}

// ─── Chart ────────────────────────────────────────────────────────────────────

export function TransportBreakdownChart({ data }: TransportBreakdownChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const total = data.reduce((sum, d) => sum + d.co2_kg, 0)

  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      {/* Center label — absolutely positioned over the donut hole */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          data-testid="chart-total"
          style={{ fontSize: 22, fontWeight: 600, color: '#1A2332', lineHeight: 1.1 }}
        >
          {total.toFixed(1)}
        </span>
        <span style={{ fontSize: 12, color: '#6B7A8D', lineHeight: 1.4 }}>kg CO₂</span>
      </div>

      <PieChart width={200} height={200}>
        <Pie
          data={data}
          dataKey="co2_kg"
          cx={99}
          cy={99}
          innerRadius={58}
          outerRadius={90}
          paddingAngle={0}
          activeIndex={activeIndex ?? undefined}
          activeShape={renderActiveSlice}
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {data.map((entry) => (
            <Cell key={entry.id} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={<CustomTooltip total={total} />}
          cursor={false}
        />
      </PieChart>
    </div>
  )
}
