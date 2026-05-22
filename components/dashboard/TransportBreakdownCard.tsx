'use client'

import { Navigation } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import {
  TransportBreakdownChart,
  TRANSPORT_COLORS,
  type TransportModeData,
} from '@/components/charts/TransportBreakdownChart'
import { useTransportBreakdown } from '@/lib/hooks/useTrips'
import { EmptyState } from '@/components/ui/EmptyState'
import type { TransportMode } from '@/types/index'

// ─── Mode display names ───────────────────────────────────────────────────────

const MODE_LABELS: Record<TransportMode, string> = {
  walking: 'Walking',
  cycling: 'Cycling',
  metro: 'Metro',
  train: 'Train',
  car: 'Car',
  cab: 'Cab',
  flight: 'Flight',
  bus: 'Bus',
  auto_rickshaw: 'Auto-rickshaw',
  two_wheeler: 'Two-wheeler',
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TransportBreakdownSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-5 w-44 rounded bg-gray-100 animate-pulse" />
        <div className="h-4 w-20 rounded bg-gray-100 animate-pulse mt-1" />
      </CardHeader>
      <CardContent>
        <div
          data-testid="transport-breakdown-skeleton"
          className="flex items-center gap-6"
        >
          {/* Donut skeleton */}
          <div className="w-[200px] h-[200px] rounded-full bg-gray-100 animate-pulse shrink-0" />
          {/* Legend skeleton */}
          <div className="flex flex-col gap-3 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-[10px] h-[10px] rounded-full bg-gray-100 animate-pulse shrink-0" />
                <div className="h-4 rounded bg-gray-100 animate-pulse flex-1" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Legend row ───────────────────────────────────────────────────────────────

interface LegendRowProps {
  mode: TransportModeData & { distance_km: number }
}

function LegendRow({ mode }: LegendRowProps) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      {/* Colored dot */}
      <div
        className="shrink-0 rounded-full"
        style={{ width: 10, height: 10, backgroundColor: mode.color }}
      />
      {/* Mode name */}
      <span
        className="truncate"
        style={{ fontSize: 13, fontWeight: 500, color: '#1A2332', flex: 1 }}
      >
        {mode.name}
      </span>
      {/* Values: kg + km */}
      <div className="flex flex-col items-end shrink-0">
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1A2332' }}>
          {mode.co2_kg.toFixed(2)} kg
        </span>
        <span style={{ fontSize: 12, color: '#6B7A8D' }}>
          {mode.distance_km.toFixed(1)} km
        </span>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TransportBreakdownCard() {
  const query = useTransportBreakdown('month')

  // ── Loading ────────────────────────────────────────────────────────────────
  if (query.isLoading) {
    return <TransportBreakdownSkeleton />
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (query.isError) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-subheading font-semibold text-text-primary">Transport breakdown</h2>
          <p className="text-label text-text-secondary">This month</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-label text-text-secondary">Could not load transport data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const rawData = query.data ?? []

  // Filter out zero-emission modes, sort by co2_kg descending
  const sorted = rawData
    .filter((d) => d.co2_kg > 0)
    .sort((a, b) => b.co2_kg - a.co2_kg)

  // ── Empty state ────────────────────────────────────────────────────────────
  if (sorted.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-subheading font-semibold text-text-primary">Transport breakdown</h2>
          <p className="text-label text-text-secondary">This month</p>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Navigation size={48} color="#C5CCD6" aria-hidden="true" />}
            title="No trips this month"
            description="Add trips to see your transport breakdown."
          />
        </CardContent>
      </Card>
    )
  }

  // Map to chart-ready shape
  const chartData: (TransportModeData & { distance_km: number })[] = sorted.map((d) => ({
    id: d.mode,
    name: MODE_LABELS[d.mode] ?? d.mode,
    co2_kg: d.co2_kg,
    distance_km: d.distance_km,
    color: TRANSPORT_COLORS[d.mode] ?? '#CBD5E1',
  }))

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="text-subheading font-semibold text-text-primary">Transport breakdown</h2>
        <p className="text-label text-text-secondary">This month</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Donut chart */}
          <div className="shrink-0">
            <TransportBreakdownChart data={chartData} />
          </div>
          {/* Legend */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            {chartData.map((mode) => (
              <LegendRow key={mode.id} mode={mode} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
