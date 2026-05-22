'use client'

import { cn } from '@/lib/utils'
import type { Insight, InsightType } from '@/types'

// ─── Config ───────────────────────────────────────────────────────────────────

const TAB_LABELS: Record<InsightType, string> = {
  streak:            'Streak',
  milestone:         'Milestone',
  comparison:        'Comparison',
  tip:               'Tip',
  anomaly:           'Anomaly',
  weekly_comparison: 'Weekly',
  mode_spike:        'Mode Spike',
  mode_summary:      'Mode Summary',
}

// weekly_comparison is shown in the hero card, not in feed tabs
const HERO_TYPES: InsightType[] = ['weekly_comparison']

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InsightTypeTabsProps {
  /** Full insight list — used to compute per-type counts */
  insights: Insight[]
  activeTab: 'all' | InsightType
  onChange: (tab: 'all' | InsightType) => void
}

// ─── Count badge ──────────────────────────────────────────────────────────────

interface CountBadgeProps {
  count: number
  active: boolean
}

function CountBadge({ count, active }: CountBadgeProps) {
  return (
    <span
      style={{
        backgroundColor: active ? '#4A90C4' : '#E8EDF2',
        color: active ? '#FFFFFF' : '#6B7A8D',
        borderRadius: 999,
        padding: '1px 7px',
        fontSize: 11,
        fontWeight: 600,
        lineHeight: 1.6,
      }}
    >
      {count}
    </span>
  )
}

// ─── InsightTypeTabs ──────────────────────────────────────────────────────────

export function InsightTypeTabs({
  insights,
  activeTab,
  onChange,
}: InsightTypeTabsProps) {
  // Feed insights = exclude hero types
  const feedInsights = insights.filter((i) => !HERO_TYPES.includes(i.insightType))

  // Compute per-type counts from feed insights only
  const typeCounts = feedInsights.reduce<Partial<Record<InsightType, number>>>(
    (acc, i) => {
      acc[i.insightType] = (acc[i.insightType] ?? 0) + 1
      return acc
    },
    {},
  )

  // Present types in a stable order (order of first appearance)
  const presentTypes = Object.keys(typeCounts) as InsightType[]
  const allCount = feedInsights.length

  return (
    <div
      role="tablist"
      data-testid="insight-type-tabs"
      className="flex overflow-x-auto border-b"
      style={{ borderColor: '#E8EDF2', scrollbarWidth: 'none' }}
    >
      {/* All tab */}
      <button
        role="tab"
        type="button"
        data-testid="tab-all"
        aria-selected={activeTab === 'all'}
        onClick={() => onChange('all')}
        className={cn(
          'relative mr-5 flex shrink-0 items-center gap-1.5 pb-3 pt-1',
          'text-[13.5px] transition-colors',
          activeTab === 'all'
            ? 'font-semibold text-[#1A2332]'
            : 'font-medium text-[#6B7A8D] hover:text-[#1A2332]',
        )}
      >
        All
        <CountBadge count={allCount} active={activeTab === 'all'} />
        {activeTab === 'all' && (
          <span
            className="absolute inset-x-0 rounded-full"
            style={{ bottom: -1, height: 2, backgroundColor: '#4A90C4' }}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Per-type tabs */}
      {presentTypes.map((type) => {
        const isActive = activeTab === type
        const count = typeCounts[type] ?? 0
        return (
          <button
            key={type}
            role="tab"
            type="button"
            data-testid={`tab-${type}`}
            aria-selected={isActive}
            onClick={() => onChange(type)}
            className={cn(
              'relative mr-5 flex shrink-0 items-center gap-1.5 pb-3 pt-1',
              'text-[13.5px] transition-colors',
              isActive
                ? 'font-semibold text-[#1A2332]'
                : 'font-medium text-[#6B7A8D] hover:text-[#1A2332]',
            )}
          >
            {TAB_LABELS[type] ?? type}
            <CountBadge count={count} active={isActive} />
            {isActive && (
              <span
                className="absolute inset-x-0 rounded-full"
                style={{ bottom: -1, height: 2, backgroundColor: '#4A90C4' }}
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
