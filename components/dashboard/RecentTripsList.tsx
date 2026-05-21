'use client'

import Link from 'next/link'
import { isToday, isYesterday, format, parseISO } from 'date-fns'
import { Car, Train, Bus, Bike, Footprints, Plane, MapPin } from 'lucide-react'
import { useTrips } from '@/lib/hooks/useTrips'
import { cn } from '@/lib/utils'
import type { Trip, TransportMode } from '@/types/index'

// ─── Constants ────────────────────────────────────────────────────────────────

const MODE_COLORS: Record<string, string> = {
  car:    '#F0956A',
  train:  '#4A90C4',
  bus:    '#7BA9D4',
  bike:   '#3DAB82',
  walk:   '#8AC9A8',
  flight: '#E05252',
}

/** Map backend TransportMode values to display keys used in MODE_COLORS / MODE_ICONS */
const MODE_DISPLAY_KEY: Record<TransportMode, string> = {
  car:           'car',
  cab:           'car',
  two_wheeler:   'bike',
  cycling:       'bike',
  train:         'train',
  metro:         'train',
  bus:           'bus',
  walking:       'walk',
  flight:        'flight',
  auto_rickshaw: 'car',
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTripDate(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`
  if (isYesterday(date)) return `Yesterday, ${format(date, 'h:mm a')}`
  return format(date, 'MMM d, h:mm a')
}

function getCo2Color(co2Kg: number): string {
  if (co2Kg === 0) return '#3DAB82'
  if (co2Kg > 2.0) return '#F0956A'
  return '#1A2332'
}

// ─── Trip Row (local — not a separate file per task spec) ─────────────────────

function TripRow({ trip, isLast }: { trip: Trip; isLast: boolean }) {
  const modeKey = trip.transportMode ? (MODE_DISPLAY_KEY[trip.transportMode] ?? 'car') : 'car'
  const modeColor = MODE_COLORS[modeKey] ?? '#6B7A8D'
  const ModeIcon: ModeIconComponent = MODE_ICONS[modeKey] ?? Car

  const from = trip.from ?? '—'
  const to   = trip.to   ?? '—'
  const co2Kg   = trip.co2Kg ?? 0
  const co2Color = getCo2Color(co2Kg)
  const dateLabel = formatTripDate(trip.startedAt)

  return (
    <div
      className={cn(
        'flex items-center gap-3 py-3',
        !isLast && 'border-b border-divider',
      )}
    >
      {/* Mode icon badge — 32×32, border-radius 10px, bg at 12% opacity */}
      <div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px]"
        style={{ backgroundColor: `${modeColor}1F` }}
      >
        <ModeIcon size={16} color={modeColor} />
      </div>

      {/* Route + date */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-text-primary">
          <span>{from}</span>
          <span className="mx-1 text-[12px] text-text-secondary">→</span>
          <span>{to}</span>
        </p>
        <p className="text-[12.5px] text-text-secondary">{dateLabel}</p>
      </div>

      {/* CO₂ — right-aligned */}
      <div className="flex-shrink-0 text-right">
        <span
          data-testid="co2-value"
          className="text-[13px] font-semibold"
          style={{ color: co2Color }}
        >
          {co2Kg.toFixed(1)}
        </span>
        <span className="ml-0.5 text-[13px] text-text-secondary">kg</span>
      </div>
    </div>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function TripRowSkeleton({ isLast }: { isLast: boolean }) {
  return (
    <div
      data-testid="trip-row-skeleton"
      className={cn(
        'flex items-center gap-3 py-3',
        !isLast && 'border-b border-divider',
      )}
    >
      <div className="h-8 w-8 flex-shrink-0 animate-pulse rounded-[10px] bg-gray-100" />
      <div className="flex-1 space-y-1.5">
        <div className="h-[13px] w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="h-[12px] w-1/2 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="h-[13px] w-12 flex-shrink-0 animate-pulse rounded bg-gray-100" />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RecentTripsList() {
  const { data, isLoading, isError } = useTrips({ limit: 5 })
  const trips = data?.items ?? []

  return (
    <div className="rounded-2xl bg-bg-card p-5 shadow-card">
      {/* Card header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-text-primary">Recent trips</h2>
        <Link
          href="/trips"
          className="text-[13px] text-horizon-blue hover:underline"
        >
          View all →
        </Link>
      </div>

      {/* ── Loading ─────────────────────────────────────────────────────────── */}
      {isLoading && (
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <TripRowSkeleton key={i} isLast={i === 4} />
          ))}
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────────────────────── */}
      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center gap-2 py-8">
          <MapPin size={24} className="text-text-secondary" />
          <p className="text-[13px] text-text-secondary">Could not load recent trips</p>
        </div>
      )}

      {/* ── Empty ───────────────────────────────────────────────────────────── */}
      {!isLoading && !isError && trips.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-8">
          <MapPin size={24} className="text-text-secondary" />
          <p className="text-[13px] font-medium text-text-primary">No trips yet</p>
          <p className="text-[12px] text-text-secondary">Start by adding your first trip</p>
        </div>
      )}

      {/* ── Trip rows ───────────────────────────────────────────────────────── */}
      {!isLoading && !isError && trips.length > 0 && (
        <div>
          {trips.map((trip, i) => (
            <TripRow key={trip.id} trip={trip} isLast={i === trips.length - 1} />
          ))}
        </div>
      )}
    </div>
  )
}
