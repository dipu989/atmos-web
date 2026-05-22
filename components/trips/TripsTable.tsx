'use client'

import { useState, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import {
  Car,
  Train,
  Bus,
  Bike,
  Footprints,
  Plane,
  Navigation,
  Filter,
  ChevronRight,
  ChevronsUpDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Trip, TransportMode, ActivitySource } from '@/types/index'

// ─── Constants ─────────────────────────────────────────────────────────────────

const COLS = '36px minmax(0, 1.6fr) 150px 90px 90px 90px 104px 28px'

type SortKey = 'route' | 'date' | 'distance' | 'duration' | 'co2' | 'source'

const SORT_KEY_LABELS: Record<SortKey, string> = {
  route:    'Route',
  date:     'Date',
  distance: 'Distance',
  duration: 'Duration',
  co2:      'CO₂',
  source:   'Source',
}

const MODE_COLORS: Record<string, string> = {
  car:    '#F0956A',
  train:  '#4A90C4',
  bus:    '#7BA9D4',
  bike:   '#3DAB82',
  walk:   '#8AC9A8',
  flight: '#E05252',
}

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

// ─── Props ─────────────────────────────────────────────────────────────────────

interface TripsTableProps {
  trips: Trip[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  loading: boolean
  /**
   * Pass `true` when any filter (search, mode, or source) is active.
   * Controls whether the empty state says "no trips logged" vs "no matches".
   */
  hasActiveFilter?: boolean
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getCo2Color(co2Kg: number): string {
  if (co2Kg === 0) return '#3DAB82'
  if (co2Kg > 2) return '#F0956A'
  return '#1A2332'
}

function isDetectedSource(source: ActivitySource): boolean {
  return source !== 'manual'
}

function formatTripDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

// ─── Sort logic ────────────────────────────────────────────────────────────────

function sortTrips(trips: Trip[], key: SortKey, dir: 'asc' | 'desc'): Trip[] {
  return [...trips].sort((a, b) => {
    let cmp = 0
    switch (key) {
      case 'route':
        cmp = `${a.from ?? ''}${a.to ?? ''}`.localeCompare(`${b.from ?? ''}${b.to ?? ''}`)
        break
      case 'date':
        cmp = a.dateLocal.localeCompare(b.dateLocal)
        break
      case 'distance':
        cmp = (a.distanceKm ?? 0) - (b.distanceKm ?? 0)
        break
      case 'duration':
        cmp = (a.durationMinutes ?? 0) - (b.durationMinutes ?? 0)
        break
      case 'co2':
        cmp = (a.co2Kg ?? 0) - (b.co2Kg ?? 0)
        break
      case 'source':
        cmp = a.source.localeCompare(b.source)
        break
    }
    return dir === 'asc' ? cmp : -cmp
  })
}

// ─── SortHeader ────────────────────────────────────────────────────────────────

interface SortHeaderProps {
  label: string
  colKey: SortKey
  activeSortKey: SortKey
  align?: 'left' | 'right'
  onSort: (key: SortKey) => void
}

function SortHeader({ label, colKey, activeSortKey, align = 'left', onSort }: SortHeaderProps) {
  const isActive = colKey === activeSortKey

  return (
    <button
      type="button"
      onClick={() => onSort(colKey)}
      className={cn(
        'flex items-center gap-1 text-[12px] font-medium focus:outline-none',
        align === 'right' && 'ml-auto',
        isActive ? 'text-[#1A2332]' : 'text-[#6B7A8D]',
      )}
    >
      {label}
      <ChevronsUpDown
        size={10}
        className={cn(
          'flex-shrink-0',
          isActive ? 'opacity-100' : 'opacity-40',
        )}
      />
    </button>
  )
}

// ─── SkeletonRow ───────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div
      data-testid="trip-skeleton-row"
      className="grid items-center gap-3 border-b border-divider px-5 py-3"
      style={{ gridTemplateColumns: COLS }}
    >
      <div className="h-[30px] w-[30px] animate-pulse rounded-[9px] bg-gray-100" />
      <div className="min-w-0 space-y-1.5">
        <div className="h-[13px] w-3/4 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="h-[12px] w-2/3 animate-pulse rounded bg-gray-100" />
      <div className="ml-auto h-[12px] w-10 animate-pulse rounded bg-gray-100" />
      <div className="ml-auto h-[12px] w-8 animate-pulse rounded bg-gray-100" />
      <div className="ml-auto h-[12px] w-10 animate-pulse rounded bg-gray-100" />
      <div className="h-[20px] w-16 animate-pulse rounded-full bg-gray-100" />
      <div className="h-[14px] w-[14px] animate-pulse rounded bg-gray-100" />
    </div>
  )
}

// ─── TripRow ───────────────────────────────────────────────────────────────────

function TripRow({ trip }: { trip: Trip }) {
  const modeKey   = trip.transportMode ? (MODE_DISPLAY_KEY[trip.transportMode] ?? 'car') : 'car'
  const modeColor = MODE_COLORS[modeKey] ?? '#6B7A8D'
  const ModeIcon: ModeIconComponent = MODE_ICONS[modeKey] ?? Car

  const from     = trip.from ?? '—'
  const to       = trip.to ?? '—'
  const co2Kg    = trip.co2Kg ?? 0
  const co2Color = getCo2Color(co2Kg)
  const detected = isDetectedSource(trip.source)
  const dateLabel = formatTripDate(trip.dateLocal)

  return (
    <div
      className="grid cursor-pointer items-center gap-3 border-b border-divider px-5 py-3 transition-colors hover:bg-[#F5F7FA]"
      style={{ gridTemplateColumns: COLS }}
    >
      {/* Mode icon badge — 30×30, border-radius 9px */}
      <div
        className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[9px]"
        style={{ backgroundColor: `${modeColor}1F` }}
      >
        <ModeIcon size={16} color={modeColor} />
      </div>

      {/* Route */}
      <p className="min-w-0 truncate text-[13.5px] font-medium text-text-primary">
        <span>{from}</span>
        <span className="mx-1 text-[12px] text-text-secondary">→</span>
        <span>{to}</span>
      </p>

      {/* Date */}
      <p className="text-[12.5px] text-text-secondary">{dateLabel}</p>

      {/* Distance — right-aligned */}
      <div className="text-right">
        <span className="text-[13px] text-text-primary">
          {trip.distanceKm != null ? trip.distanceKm.toFixed(1) : '—'}
        </span>
        {trip.distanceKm != null && (
          <span className="ml-0.5 text-[12px] text-text-secondary">km</span>
        )}
      </div>

      {/* Duration — right-aligned */}
      <div className="text-right">
        <span className="text-[12.5px] text-text-secondary">
          {trip.durationMinutes != null ? trip.durationMinutes : '—'}
        </span>
        {trip.durationMinutes != null && (
          <span className="ml-0.5 text-[12px] text-text-secondary">min</span>
        )}
      </div>

      {/* CO₂ — right-aligned, colored */}
      <div className="text-right">
        <span className="text-[13px] font-semibold" style={{ color: co2Color }}>
          {co2Kg.toFixed(1)}
        </span>
        <span className="ml-0.5 text-[12px] text-text-secondary">kg</span>
      </div>

      {/* Source badge */}
      <div>
        {detected ? (
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: 'rgba(74,144,196,0.10)', color: '#4A90C4' }}
          >
            Detected
          </span>
        ) : (
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: '#F0F2F5', color: '#6B7A8D' }}
          >
            Manual
          </span>
        )}
      </div>

      {/* Chevron */}
      <ChevronRight size={16} color="#C5CCD6" />
    </div>
  )
}

// ─── Pagination ────────────────────────────────────────────────────────────────

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | 'ellipsis')[] = [1]

  if (current > 3) pages.push('ellipsis')

  const rangeStart = Math.max(2, current - 1)
  const rangeEnd   = Math.min(total - 1, current + 1)
  for (let p = rangeStart; p <= rangeEnd; p++) pages.push(p)

  if (current < total - 2) pages.push('ellipsis')

  pages.push(total)
  return pages
}

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const start      = (page - 1) * pageSize + 1
  const end        = Math.min(page * pageSize, total)
  const pageNums   = getPageNumbers(page, totalPages)

  const isPrevDisabled = page <= 1
  const isNextDisabled = page >= totalPages

  if (total === 0 || totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between rounded-b-2xl bg-[#FAFBFC] px-5 py-3">
      <p className="text-[12.5px] text-text-secondary">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={isPrevDisabled}
          aria-label="Previous page"
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded border text-[13px] text-text-primary',
            isPrevDisabled
              ? 'cursor-not-allowed opacity-50 border-[#F0F2F5] bg-white'
              : 'border-[#F0F2F5] bg-white hover:border-[rgba(74,144,196,0.25)]',
          )}
        >
          ‹
        </button>

        {/* Page numbers */}
        {pageNums.map((p, i) =>
          p === 'ellipsis' ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: static ellipsis placement
            <span key={`ellipsis-${i}`} className="px-1 text-[12px] text-text-secondary">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={page === p ? 'page' : undefined}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded border text-[12px]',
                page === p
                  ? 'border-[rgba(74,144,196,0.25)] text-[#4A90C4]'
                  : 'border-[#F0F2F5] bg-white text-text-primary',
              )}
              style={page === p ? { backgroundColor: 'rgba(74,144,196,0.10)' } : undefined}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={isNextDisabled}
          aria-label="Next page"
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded border text-[13px] text-text-primary',
            isNextDisabled
              ? 'cursor-not-allowed opacity-50 border-[#F0F2F5] bg-white'
              : 'border-[#F0F2F5] bg-white hover:border-[rgba(74,144,196,0.25)]',
          )}
        >
          ›
        </button>
      </div>
    </div>
  )
}

// ─── TripsTable ────────────────────────────────────────────────────────────────

export function TripsTable({
  trips,
  total,
  page,
  pageSize,
  onPageChange,
  loading,
  hasActiveFilter = false,
}: TripsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedTrips = useMemo(() => sortTrips(trips, sortKey, sortDir), [trips, sortKey, sortDir])

  const totalKm = useMemo(
    () => trips.reduce((sum, t) => sum + (t.distanceKm ?? 0), 0),
    [trips],
  )
  const totalCo2 = useMemo(
    () => trips.reduce((sum, t) => sum + (t.co2Kg ?? 0), 0),
    [trips],
  )

  const sortDirLabel  = sortDir === 'asc' ? 'ascending' : 'descending'
  const sortKeyLabel  = SORT_KEY_LABELS[sortKey]

  return (
    <div className="overflow-hidden rounded-2xl bg-bg-card shadow-card">
      {/* ── Result summary ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[15px] font-semibold text-text-primary">
            {trips.length} of {total} trips
          </span>
          <span className="text-[12.5px] text-text-secondary">
            {totalKm.toFixed(1)} km · {totalCo2.toFixed(1)} kg CO₂ in current filter
          </span>
        </div>
        <span className="shrink-0 text-[12px] text-text-secondary">
          Sorted by {sortKeyLabel} ({sortDirLabel})
        </span>
      </div>

      {/* ── Header row ─────────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 grid items-center gap-3 border-b border-divider bg-[#FAFBFC] px-5 py-2.5"
        style={{ gridTemplateColumns: COLS }}
      >
        <div /> {/* icon column — no sort */}
        <SortHeader label="Route"    colKey="route"    activeSortKey={sortKey} onSort={handleSort} />
        <SortHeader label="Date"     colKey="date"     activeSortKey={sortKey} onSort={handleSort} />
        <SortHeader label="Distance" colKey="distance" activeSortKey={sortKey} align="right" onSort={handleSort} />
        <SortHeader label="Duration" colKey="duration" activeSortKey={sortKey} align="right" onSort={handleSort} />
        <SortHeader label="CO₂"      colKey="co2"      activeSortKey={sortKey} align="right" onSort={handleSort} />
        <SortHeader label="Source"   colKey="source"   activeSortKey={sortKey} onSort={handleSort} />
        <div /> {/* chevron column — no sort */}
      </div>

      {/* ── Loading: 12 skeleton rows ───────────────────────────────────────── */}
      {loading && (
        <div>
          {Array.from({ length: 12 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            <SkeletonRow key={i} />
          ))}
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────────────────────── */}
      {!loading && trips.length === 0 && (
        hasActiveFilter ? (
          <EmptyState
            icon={<Filter size={48} color="#C5CCD6" aria-hidden="true" />}
            title="No trips match these filters"
            description="Try widening the date range or clearing the search."
          />
        ) : (
          <EmptyState
            icon={<Navigation size={48} color="#C5CCD6" aria-hidden="true" />}
            title="No trips logged yet"
            description="Trips detected by Atmos will appear here automatically."
          />
        )
      )}

      {/* ── Trip rows ──────────────────────────────────────────────────────── */}
      {!loading && sortedTrips.length > 0 && (
        <div>
          {sortedTrips.map(trip => (
            <TripRow key={trip.id} trip={trip} />
          ))}
        </div>
      )}

      {/* ── Pagination ─────────────────────────────────────────────────────── */}
      {!loading && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}
