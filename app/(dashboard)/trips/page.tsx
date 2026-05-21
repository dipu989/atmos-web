'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Download } from 'lucide-react'
import { useTrips } from '@/lib/hooks/useTrips'
import { PageShell } from '@/components/layout/PageShell'
import { TripStatsStrip } from '@/components/trips/TripStatsStrip'
import { TripsFilters } from '@/components/trips/TripsFilters'
import { TripsTable } from '@/components/trips/TripsTable'
import type { TransportMode } from '@/types/index'

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Maps a backend TransportMode value to the corresponding TripsFilters chip key.
 * Multiple backend modes share a single chip (e.g. car + cab + auto_rickshaw → 'car').
 */
function modeToChipKey(tm: TransportMode): string {
  switch (tm) {
    case 'car':
    case 'cab':
    case 'auto_rickshaw':
      return 'car'
    case 'train':
    case 'metro':
      return 'train'
    case 'bus':
      return 'bus'
    case 'cycling':
    case 'two_wheeler':
      return 'cycling'
    case 'walking':
      return 'walking'
    default:
      return tm
  }
}

// ─── ExportButton ─────────────────────────────────────────────────────────────

function ExportButton() {
  return (
    <button
      type="button"
      data-testid="export-button"
      onClick={() => alert('CSV export coming soon')}
      className="flex items-center gap-1.5 rounded-lg border border-divider bg-white px-3 py-2 text-[13px] font-medium text-text-primary transition-colors hover:bg-bg-page"
    >
      <Download size={14} aria-hidden="true" />
      Export CSV
    </button>
  )
}

// ─── TripsPageContent ─────────────────────────────────────────────────────────
// Separate component so useSearchParams() runs inside a Suspense boundary.

function TripsPageContent() {
  const searchParams = useSearchParams()

  // Initialise from URL params: ?q=<search>&?mode=<mode>
  const [search, setSearch] = useState<string>(() => searchParams.get('q') ?? '')
  const [mode, setMode] = useState<string>(() => searchParams.get('mode') ?? 'all')
  const [source, setSource] = useState<'all' | 'auto' | 'manual'>('all')
  const [page, setPage] = useState<number>(1)

  // Reset page to 1 whenever search / mode / source changes
  useEffect(() => {
    setPage(1)
  }, [search, mode, source])

  // ── Paginated query: current page, filtered by mode (API-side) ──────────────
  const { data, isLoading } = useTrips({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    transport_mode: mode === 'all' ? undefined : mode,
  })

  // ── Full-dataset query: stats strip + mode chip counts ──────────────────────
  // NOTE: Trip counts per chip are approximate — derived from up to 1 000 trips,
  // not the true total. Acceptable for the initial build.
  const { data: allData, isLoading: allLoading } = useTrips({ limit: 1000 })

  const allTrips = useMemo(() => allData?.items ?? [], [allData])
  const pagedTrips = useMemo(() => data?.items ?? [], [data])
  const total = data?.total ?? 0

  // ── Client-side filtering: search (from/to) + source ───────────────────────
  const filteredTrips = useMemo(() => {
    let trips = pagedTrips

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      trips = trips.filter(
        t => t.from?.toLowerCase().includes(q) || t.to?.toLowerCase().includes(q),
      )
    }

    if (source !== 'all') {
      trips = trips.filter(t =>
        source === 'manual' ? t.source === 'manual' : t.source !== 'manual',
      )
    }

    return trips
  }, [pagedTrips, search, source])

  // ── Stats derived from full dataset ────────────────────────────────────────
  const stats = useMemo(() => {
    const totalKm = allTrips.reduce((sum, t) => sum + (t.distanceKm ?? 0), 0)
    const totalKg = allTrips.reduce((sum, t) => sum + (t.co2Kg ?? 0), 0)
    const activeDays = new Set(allTrips.map(t => t.dateLocal)).size
    const autoCount = allTrips.filter(t => t.source !== 'manual').length
    const manualCount = allTrips.filter(t => t.source === 'manual').length
    return { totalKm, totalKg, activeDays, autoCount, manualCount }
  }, [allTrips])

  // ── Mode chip counts derived from full dataset ──────────────────────────────
  const tripCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allTrips.length }
    for (const trip of allTrips) {
      if (trip.transportMode) {
        const key = modeToChipKey(trip.transportMode)
        counts[key] = (counts[key] ?? 0) + 1
      }
    }
    return counts
  }, [allTrips])

  return (
    <PageShell
      title="Trips"
      subtitle="Browse and filter every trip Atmos has logged for you."
      rightExtra={<ExportButton />}
    >
      <TripStatsStrip
        totalTrips={allData?.total ?? 0}
        totalKm={stats.totalKm}
        totalKg={stats.totalKg}
        activeDays={stats.activeDays}
        autoCount={stats.autoCount}
        manualCount={stats.manualCount}
        loading={allLoading}
      />

      <TripsFilters
        search={search}
        onSearchChange={setSearch}
        mode={mode}
        onModeChange={setMode}
        source={source}
        onSourceChange={setSource}
        tripCounts={tripCounts}
      />

      <TripsTable
        trips={filteredTrips}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        loading={isLoading}
      />
    </PageShell>
  )
}

// ─── TripsPage ────────────────────────────────────────────────────────────────
// useSearchParams() requires a Suspense boundary in Next.js App Router.

export default function TripsPage() {
  return (
    <Suspense>
      <TripsPageContent />
    </Suspense>
  )
}
