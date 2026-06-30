'use client'

import { Search, X, Car, Train, Bus, Bike, Footprints, Grid } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Mode config ──────────────────────────────────────────────────────────────

type ModeColorToken = 'blue' | 'peach' | 'sage' | 'slate'

const MODE_TOKEN_CLASSES: Record<ModeColorToken, { border: string; bgTint: string; text: string }> = {
  blue:  { border: 'border-horizon-blue',     bgTint: 'bg-horizon-blue/[0.08]',     text: 'text-horizon-blue' },
  peach: { border: 'border-peach',            bgTint: 'bg-peach/[0.08]',            text: 'text-peach' },
  sage:  { border: 'border-sage',             bgTint: 'bg-sage/[0.08]',             text: 'text-sage' },
  slate: { border: 'border-text-secondary',   bgTint: 'bg-text-secondary/[0.08]',   text: 'text-text-secondary' },
}

interface ModeConfig {
  key: string
  label: string
  colorToken: ModeColorToken
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number; className?: string }>
}

const MODES: ModeConfig[] = [
  { key: 'all', label: 'All', colorToken: 'blue', Icon: Grid },
  { key: 'car', label: 'Car', colorToken: 'peach', Icon: Car },
  { key: 'train', label: 'Train', colorToken: 'blue', Icon: Train },
  { key: 'bus', label: 'Bus', colorToken: 'sage', Icon: Bus },
  { key: 'cycling', label: 'Bike', colorToken: 'sage', Icon: Bike },
  { key: 'walking', label: 'Walk', colorToken: 'slate', Icon: Footprints },
]

// ─── SearchInput ──────────────────────────────────────────────────────────────

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div
      className="relative flex w-full items-center bg-white border border-divider sm:w-[280px]"
      style={{ height: 36, borderRadius: 9 }}
    >
      <Search
        size={14}
        strokeWidth={2}
        className="absolute left-2.5 pointer-events-none text-text-secondary"
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
      className="flex bg-divider"
      style={{ padding: 3, borderRadius: 9 }}
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
      {MODES.map(({ key, label, colorToken, Icon }) => {
        const isActive = activeMode === key
        const count = tripCounts[key] ?? 0
        const classes = MODE_TOKEN_CLASSES[colorToken]
        return (
          <button
            key={key}
            type="button"
            data-testid={`mode-chip-${key}`}
            onClick={() => onModeChange(key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-[6px] rounded-[999px] text-[12.5px] border transition-all',
              isActive
                ? cn('font-semibold border-[1.5px]', classes.border, classes.bgTint, classes.text)
                : 'bg-white border-divider text-text-primary font-medium',
            )}
          >
            <Icon
              size={13}
              strokeWidth={2}
              aria-hidden={true}
              className={isActive ? classes.text : 'text-text-secondary'}
            />
            <span>{label}</span>
            <span
              className={cn('text-[11px] font-medium', isActive ? classes.text : 'text-text-secondary')}
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
      {/* Row 1: Search + Source — stack on mobile, side-by-side on sm+ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
