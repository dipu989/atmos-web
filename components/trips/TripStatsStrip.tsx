'use client'

// ─── TripStatsStrip ───────────────────────────────────────────────────────────

export interface TripStatsStripProps {
  totalTrips: number
  totalKm: number
  totalKg: number
  activeDays: number
  autoCount: number
  manualCount: number
  loading?: boolean
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonStatCard() {
  return (
    <div
      data-testid="stat-strip-skeleton"
      className="bg-gray-100 rounded-2xl animate-pulse"
      style={{ minHeight: 96 }}
    />
  )
}

// ─── CompactStatCard ──────────────────────────────────────────────────────────

interface CompactStatCardProps {
  accent: string
  label: string
  value: string | number
  unit?: string
  sub?: React.ReactNode
}

function CompactStatCard({ accent, label, value, unit, sub }: CompactStatCardProps) {
  return (
    <div
      className="bg-bg-card rounded-2xl shadow-card border-t-[3px] flex flex-col gap-1"
      style={{
        borderTopColor: accent,
        minHeight: 96,
        padding: '18px 20px',
      }}
    >
      <span className="text-[12px] font-medium text-text-secondary uppercase tracking-[0.4px]">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-semibold text-text-primary leading-none tracking-[-0.4px]">
          {value}
        </span>
        {unit && (
          <span className="text-[12px] font-medium text-text-secondary">{unit}</span>
        )}
      </div>
      {sub !== undefined && (
        <div className="mt-auto pt-0.5">{sub}</div>
      )}
    </div>
  )
}

// ─── TripStatsStrip ───────────────────────────────────────────────────────────

export function TripStatsStrip({
  totalTrips,
  totalKm,
  totalKg,
  activeDays,
  autoCount,
  manualCount,
  loading,
}: TripStatsStripProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Card 1: Total trips */}
      <CompactStatCard
        accent="#4A90C4"
        label="Total trips"
        value={totalTrips}
        sub={
          <span className="text-[11px] text-text-secondary">
            {autoCount} detected · {manualCount} manual
          </span>
        }
      />
      {/* Card 2: Distance */}
      <CompactStatCard
        accent="#3DAB82"
        label="Distance"
        value={totalKm.toFixed(1)}
        unit="km"
      />
      {/* Card 3: CO₂ */}
      <CompactStatCard
        accent="#F0956A"
        label="CO₂ emitted"
        value={totalKg.toFixed(1)}
        unit="kg"
      />
      {/* Card 4: Active days */}
      <CompactStatCard
        accent="#6B7A8D"
        label="Active days"
        value={activeDays}
        unit="days"
      />
    </div>
  )
}
