'use client'

import { Icon } from '@/components/ui/Icon'

export interface StatCardProps {
  accent: string
  label: string
  value: string | number
  unit?: string
  sub?: React.ReactNode
  icon?: string
}

export function StatCard({ accent, label, value, unit, sub, icon }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-2xl border-t-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-[20px_22px] flex flex-col gap-1.5 min-h-[128px]"
      style={{ borderTopColor: accent }}
    >
      {/* Top row: label + icon badge */}
      <div className="flex justify-between items-center">
        <span className="text-[12px] font-medium text-[#6B7A8D] tracking-[0.4px] uppercase">
          {label}
        </span>
        {icon && (
          <div
            className="w-7 h-7 rounded-[8px] flex items-center justify-center"
            style={{ backgroundColor: accent + '1A' }}
          >
            <Icon name={icon} size={15} color={accent} />
          </div>
        )}
      </div>

      {/* Value + unit */}
      <div className="flex items-baseline gap-1">
        <span className="text-[24px] font-semibold text-[#1A2332] tracking-[-0.6px] leading-none lg:text-[30px]">
          {value}
        </span>
        {unit && (
          <span className="text-[13px] font-medium text-[#6B7A8D]">{unit}</span>
        )}
      </div>

      {/* Sub slot */}
      {sub !== undefined && (
        <div className="mt-auto pt-1">{sub}</div>
      )}
    </div>
  )
}
