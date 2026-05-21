'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModeWeekData {
  week: string // "Week 1", "Week 2", etc.
  car: number
  train: number
  bus: number
  bike: number
  walk: number
}

export interface ModeStackedAreaChartProps {
  data: ModeWeekData[]
}

// ─── Mode config ──────────────────────────────────────────────────────────────

const MODES = ['car', 'train', 'bus', 'bike', 'walk'] as const
type Mode = (typeof MODES)[number]

const MODE_COLORS: Record<Mode, string> = {
  car:   '#F0956A',
  train: '#4A90C4',
  bus:   '#7BA9D4',
  bike:  '#3DAB82',
  walk:  '#8AC9A8',
}

const MODE_LABELS: Record<Mode, string> = {
  car:   'Car',
  train: 'Train',
  bus:   'Bus',
  bike:  'Bike',
  walk:  'Walk',
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

interface PayloadEntry {
  dataKey: string
  value: number
  color: string
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl bg-white shadow-card px-3 py-2 min-w-[140px]">
      <p className="text-[13px] font-semibold text-[#1A2332] mb-1">{label}</p>
      {(payload as PayloadEntry[]).map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[12px] text-[#6B7A8D]">
              {MODE_LABELS[entry.dataKey as Mode] ?? entry.dataKey}
            </span>
          </div>
          <span className="text-[12px] font-medium text-[#1A2332]">
            {entry.value.toFixed(2)} kg
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Custom legend ────────────────────────────────────────────────────────────

function CustomLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-2">
      {MODES.map((mode) => (
        <div key={mode} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: MODE_COLORS[mode] }}
          />
          <span className="text-[12px] text-[#6B7A8D]">{MODE_LABELS[mode]}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Chart ────────────────────────────────────────────────────────────────────

export function ModeStackedAreaChart({ data }: ModeStackedAreaChartProps) {
  return (
    <div data-testid="mode-stacked-area-chart">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={data}
          stackOffset="none"
          margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#F0F2F5" />

          <XAxis
            dataKey="week"
            tick={{ fill: '#6B7A8D', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: '#6B7A8D', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={32}
            tickFormatter={(v: number) => `${v}`}
          />

          <Tooltip content={<CustomTooltip />} cursor={false} />

          {MODES.map((mode) => (
            <Area
              key={mode}
              type="monotone"
              dataKey={mode}
              stackId="1"
              stroke={MODE_COLORS[mode]}
              strokeWidth={1.5}
              fill={MODE_COLORS[mode]}
              fillOpacity={0.7}
              dot={false}
              activeDot={false}
            />
          ))}

          {/* Legend is rendered below via custom component */}
          <Legend content={<CustomLegend />} verticalAlign="bottom" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
