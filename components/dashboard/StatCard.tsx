'use client'

import { Icon } from '@/components/ui/Icon'

export type StatCardAccent = 'blue' | 'sage' | 'peach' | 'slate'

const ACCENT_CLASSES: Record<StatCardAccent, { border: string; iconBg: string; iconText: string }> = {
  blue:  { border: 'border-t-horizon-blue', iconBg: 'bg-horizon-blue/10', iconText: 'text-horizon-blue' },
  sage:  { border: 'border-t-sage',         iconBg: 'bg-sage/10',         iconText: 'text-sage' },
  peach: { border: 'border-t-peach',        iconBg: 'bg-peach/10',        iconText: 'text-peach' },
  slate: { border: 'border-t-text-secondary', iconBg: 'bg-text-secondary/10', iconText: 'text-text-secondary' },
}

export interface StatCardProps {
  accent: StatCardAccent
  label: string
  value: string | number
  unit?: string
  sub?: React.ReactNode
  icon?: string
}

export function StatCard({ accent, label, value, unit, sub, icon }: StatCardProps) {
  const classes = ACCENT_CLASSES[accent]
  return (
    <div
      className={`bg-white rounded-2xl border-t-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-[20px_22px] flex flex-col gap-1.5 min-h-[128px] ${classes.border}`}
    >
      {/* Top row: label + icon badge */}
      <div className="flex justify-between items-center">
        <span className="text-[12px] font-medium text-text-secondary tracking-[0.4px] uppercase">
          {label}
        </span>
        {icon && (
          <div className={`w-7 h-7 rounded-[8px] flex items-center justify-center ${classes.iconBg}`}>
            <span className={classes.iconText}>
              <Icon name={icon} size={15} color="currentColor" />
            </span>
          </div>
        )}
      </div>

      {/* Value + unit */}
      <div className="flex items-baseline gap-1">
        <span className="text-[24px] font-semibold text-text-primary tracking-[-0.6px] leading-none lg:text-[30px]">
          {value}
        </span>
        {unit && (
          <span className="text-[13px] font-medium text-text-secondary">{unit}</span>
        )}
      </div>

      {/* Sub slot */}
      {sub !== undefined && (
        <div className="mt-auto pt-1">{sub}</div>
      )}
    </div>
  )
}
