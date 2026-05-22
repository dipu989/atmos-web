'use client'

import { cn } from '@/lib/utils'

export interface SegmentedOption<T extends string = string> {
  value: T
  label: string
}

export interface SegmentedProps<T extends string = string> {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<SegmentedOption<T>>
  className?: string
}

export function Segmented<T extends string = string>({
  value,
  onChange,
  options,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex rounded-[9px] border border-divider bg-bg-page p-0.5',
        className,
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-[7px] px-4 py-1.5 text-[13px] font-medium transition-colors duration-150',
            value === opt.value
              ? 'bg-white font-semibold text-text-primary shadow-card'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
