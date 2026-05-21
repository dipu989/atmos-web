'use client'

import { Search, X, Car, Train, Bus, Bike, Footprints, Grid } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Mode config ──────────────────────────────────────────────────────────────

interface ModeConfig {
  key: string
  label: string
  color: string
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
}

const MODES: ModeConfig[] = [
  { key: 'all', label: 'All', color: '#4A90C4', Icon: Grid },
  { key: 'car', label: 'Car', color: '#F0956A', Icon: Car },
  { key: 'train', label: 'Train', color: '#4A90C4', Icon: Train },
  { key: 'bus', label: 'Bus', color: '#3DAB82', Icon: Bus },
  { key: 'cycling', label: 'Bike', color: '#3DAB82', Icon: Bike },
  { key: 'walking', label: 'Walk', color: '#6B7A8D', Icon: Footprints },
]

// ─── SearchInput ──────────────────────────────────────────────────────────────

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div
      className="relative flex items-center bg-white border border-divider"
      style={{ width: 280, height: 36, borderRadius: 9 }}
    >
      <Search
        size={14}
        color="#6B7A8D"
        strokeWidth={2}
        className="absolute left-2.5 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by route or place…"
        className="w-full bg-transparent pl-8 pr-8 text-[13px] text-text-primary placeholder:text-text-secondary outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Clear search"
        >
          <X size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}

// ─── SourceToggle ─────────────────────────────────────────────────────────────

type Source = 'all' | 'auto' | 'manual'

const SOURCE_OPTIONS: { key: Source; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'auto', label: 'Detected' },
  { key: 'manual', label: 'Manual' },
]

interface SourceToggleProps {
  value: Source
  onChange: (source: Source) => void
}

function SourceToggle({ value, onChange }: SourceToggleProps) {
  return (
    <div
      data-testid="source-toggle"
      className="flex"
      style={{ backgroundColor: '#F0F2F5', padding: 3, borderRadius: 9 }}
    >
      {SOURCE_OPTIONS.map(({ key, label }) => {
        const isActive = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              'px-3 py-1 text-[13px] transition-all rounded-[6px]',
              isActive
                ? 'bg-white text-text-primary font-semibold shadow-[0_1px_2px_rgba(26,35,50,0.08)]'
                : 'bg-transparent text-text-secondary font-medium',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

// ─── ModeChips ────────────────────────────────────────────────────────────────

interface ModeChipsProps {
  activeMode: string
  onModeChange: (mode: string) => void
  tripCounts: Record<string, number>
}

function ModeChips({ activeMode, onModeChange, tripCounts }: ModeChipsProps) {
  return (
    <div data-testid="mode-chips" className="flex flex-wrap gap-2">
      {MODES.map(({ key, label, color, Icon }) => {
        const isActive = activeMode === key
        const count = tripCounts[key] ?? 0
        return (
          <button
            key={key}
            type="button"
            data-testid={`mode-chip-${key}`}
            onClick={() => onModeChange(key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-[6px] rounded-[999px] text-[12.5px] border transition-all',
              isActive ? 'font-semibold' : 'bg-white border-divider text-text-primary font-medium',
            )}
            style={
              isActive
                ? {
                    border: `1.5px solid ${color}`,
                    backgroundColor: `${color}14`,
                    color,
                  }
                : undefined
            }
          >
            <Icon
              size={13}
              color={isActive ? color : '#6B7A8D'}
              strokeWidth={2}
              aria-hidden={true}
            />
            <span>{label}</span>
            <span
              className="text-[11px] font-medium"
              style={{ color: isActive ? color : '#6B7A8D' }}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── TripsFilters ─────────────────────────────────────────────────────────────

export interface TripsFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  mode: string
  onModeChange: (mode: string) => void
  source: 'all' | 'auto' | 'manual'
  onSourceChange: (source: 'all' | 'auto' | 'manual') => void
  tripCounts: Record<string, number>
}

export function TripsFilters({
  search,
  onSearchChange,
  mode,
  onModeChange,
  source,
  onSourceChange,
  tripCounts,
}: TripsFiltersProps) {
  return (
    <div className="bg-bg-card rounded-2xl shadow-card p-[18px_20px] flex flex-col gap-3">
      {/* Row 1: Search + Source */}
      <div className="flex items-center justify-between">
        <SearchInput value={search} onChange={onSearchChange} />
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-text-secondary">Source</span>
          <SourceToggle value={source} onChange={onSourceChange} />
        </div>
      </div>
      {/* Row 2: Mode chips */}
      <ModeChips activeMode={mode} onModeChange={onModeChange} tripCounts={tripCounts} />
    </div>
  )
}
