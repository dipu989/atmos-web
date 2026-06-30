import type { InsightType } from '@/types'

// ─── Insight color tokens ──────────────────────────────────────────────────────
// Single source of truth mapping each insight type to a design-token color and
// its derived Tailwind classes. Centralized here because every insights
// component (card, feed, tabs, stats strip, hero) previously duplicated its own
// hardcoded hex constants for the same five-color palette.

export type InsightColorToken = 'blue' | 'sage' | 'peach' | 'red' | 'slate'

export interface InsightColorClasses {
  text: string
  bg: string
  bgTint: string
  bgTintLight: string
  border: string
  borderLeft: string
}

const TOKEN_CLASSES: Record<InsightColorToken, InsightColorClasses> = {
  blue: {
    text: 'text-horizon-blue',
    bg: 'bg-horizon-blue',
    bgTint: 'bg-horizon-blue/10',
    bgTintLight: 'bg-horizon-blue/5',
    border: 'border-horizon-blue',
    borderLeft: 'border-l-horizon-blue',
  },
  sage: {
    text: 'text-sage',
    bg: 'bg-sage',
    bgTint: 'bg-sage/10',
    bgTintLight: 'bg-sage/5',
    border: 'border-sage',
    borderLeft: 'border-l-sage',
  },
  peach: {
    text: 'text-peach',
    bg: 'bg-peach',
    bgTint: 'bg-peach/10',
    bgTintLight: 'bg-peach/5',
    border: 'border-peach',
    borderLeft: 'border-l-peach',
  },
  red: {
    text: 'text-alert-red',
    bg: 'bg-alert-red',
    bgTint: 'bg-alert-red/10',
    bgTintLight: 'bg-alert-red/5',
    border: 'border-alert-red',
    borderLeft: 'border-l-alert-red',
  },
  slate: {
    text: 'text-text-secondary',
    bg: 'bg-text-secondary',
    bgTint: 'bg-text-secondary/10',
    bgTintLight: 'bg-text-secondary/5',
    border: 'border-text-secondary',
    borderLeft: 'border-l-text-secondary',
  },
}

export const INSIGHT_TYPE_TOKEN: Record<InsightType, InsightColorToken> = {
  streak: 'sage',
  milestone: 'blue',
  comparison: 'peach',
  tip: 'sage',
  anomaly: 'red',
  weekly_comparison: 'blue',
  mode_spike: 'peach',
  mode_summary: 'slate',
}

export function insightColorClasses(type: InsightType): InsightColorClasses {
  return TOKEN_CLASSES[INSIGHT_TYPE_TOKEN[type]]
}
