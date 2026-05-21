'use client'

import { Car, Train, Bus, Bike, Footprints, Plane } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TransportMode } from '@/types/index'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TopRoute {
  mode: TransportMode
  from: string
  to: string
  count: number
  total_km: number
  total_kg: number
}

export interface TopRoutesTableProps {
  routes: TopRoute[]
  loading?: boolean
}

// ─── Grid layout ──────────────────────────────────────────────────────────────

const COLS = '36px minmax(0, 1fr) 60px 80px 90px'

// ─── Mode helpers ─────────────────────────────────────────────────────────────

const MODE_DISPLAY_KEY: Partial<Record<TransportMode, string>> = {
  car:           'car',
  cab:           'car',
  auto_rickshaw: 'car',
  train:         'train',
  metro:         'train',
  bus:           'bus',
  cycling:       'bike',
  two_wheeler:   'bike',
  walking:       'walk',
  flight:        'flight',
}

const MODE_COLORS: Record<string, string> = {
  car:    '#F0956A',
  train:  '#4A90C4',
  bus:    '#7BA9D4',
  bike:   '#3DAB82',
  walk:   '#8AC9A8',
  flight: '#E05252',
}

type ModeIconComponent = React.ComponentType<{ size?: number; color?: string }>

const MODE_ICONS: Record<string, ModeIconComponent> = {
  car:    Car,
  train:  Train,
  bus:    Bus,
  bike:   Bike,
  walk:   Footprints,
  flight: Plane,
}

// ─── Table header ─────────────────────────────────────────────────────────────

function TableHeader() {
  return (
    <div
      className="grid items-center gap-3 border-b border-[#F0F2F5] bg-[#FAFBFC] px-4 py-2.5"
      style={{ gridTemplateColumns: COLS }}
    >
      <div /> {/* icon column */}
      <span className="text-[12px] font-medium text-[#6B7A8D]">Route</span>
      <span className="text-right text-[12px] font-medium text-[#6B7A8D]">Trips</span>
      <span className="text-right text-[12px] font-medium text-[#6B7A8D]">Distance</span>
      <span className="text-right text-[12px] font-medium text-[#6B7A8D]">CO₂</span>
    </div>
  )
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div
      data-testid="route-skeleton-row"
      className="grid items-center gap-3 border-b border-[#F0F2F5] px-4 py-3"
      style={{ gridTemplateColumns: COLS }}
    >
      <div className="h-[30px] w-[30px] animate-pulse rounded-[9px] bg-gray-100" />
      <div className="space-y-1.5">
        <div className="h-[12px] w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="h-[4px] w-full animate-pulse rounded-full bg-gray-100" />
      </div>
      <div className="ml-auto h-[12px] w-6 animate-pulse rounded bg-gray-100" />
      <div className="ml-auto h-[12px] w-10 animate-pulse rounded bg-gray-100" />
      <div className="ml-auto h-[12px] w-10 animate-pulse rounded bg-gray-100" />
    </div>
  )
}

// ─── Route row ────────────────────────────────────────────────────────────────

interface RouteRowProps {
  route: TopRoute
  maxKm: number
}

function RouteRow({ route, maxKm }: RouteRowProps) {
  const displayKey  = MODE_DISPLAY_KEY[route.mode] ?? 'car'
  const modeColor   = MODE_COLORS[displayKey] ?? '#6B7A8D'
  const ModeIcon: ModeIconComponent = MODE_ICONS[displayKey] ?? Car
  const barWidthPct = maxKm > 0 ? Math.round((route.total_km / maxKm) * 100) : 0

  return (
    <div
      data-testid="route-row"
      className="grid items-center gap-3 border-b border-[#F0F2F5] px-4 py-3"
      style={{ gridTemplateColumns: COLS }}
    >
      {/* Mode icon badge */}
      <div
        className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[9px]"
        style={{ backgroundColor: `${modeColor}1F` }}
      >
        <ModeIcon size={16} color={modeColor} />
      </div>

      {/* Route + progress bar */}
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-[#1A2332]">
          <span>{route.from}</span>
          <span className="mx-1 text-[12px] text-[#6B7A8D]">→</span>
          <span>{route.to}</span>
        </p>
        {/* Thin progress bar */}
        <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-[#F0F2F5]">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${barWidthPct}%`, backgroundColor: modeColor }}
          />
        </div>
      </div>

      {/* Trip count */}
      <div className="text-right">
        <span className="text-[13px] text-[#1A2332]">{route.count}</span>
      </div>

      {/* Distance */}
      <div className="text-right">
        <span className="text-[13px] text-[#1A2332]">{route.total_km.toFixed(1)}</span>
        <span className="ml-0.5 text-[11px] text-[#6B7A8D]">km</span>
      </div>

      {/* CO₂ */}
      <div className="text-right">
        <span className="text-[13px] text-[#1A2332]">{route.total_kg.toFixed(1)}</span>
        <span className="ml-0.5 text-[11px] text-[#6B7A8D]">kg</span>
      </div>
    </div>
  )
}

// ─── TopRoutesTable ───────────────────────────────────────────────────────────

export function TopRoutesTable({ routes, loading = false }: TopRoutesTableProps) {
  const maxKm = routes.reduce((max, r) => Math.max(max, r.total_km), 0)

  return (
    <div
      data-testid="top-routes-table"
      className={cn('overflow-hidden rounded-2xl bg-white shadow-card')}
    >
      <TableHeader />

      {/* Loading: 5 skeleton rows */}
      {loading && (
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            <SkeletonRow key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && routes.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-10">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="20" cy="20" r="18" stroke="#C5CCD6" strokeWidth="2" />
            <path
              d="M14 20h12M20 14v12"
              stroke="#C5CCD6"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-[14px] font-medium text-[#1A2332]">No routes yet</p>
          <p className="text-[12.5px] text-[#6B7A8D]">
            Start logging trips to see your top routes.
          </p>
        </div>
      )}

      {/* Route rows */}
      {!loading && routes.length > 0 && (
        <div>
          {routes.map((route, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: routes may lack unique id
            <RouteRow key={i} route={route} maxKm={maxKm} />
          ))}
        </div>
      )}
    </div>
  )
}
