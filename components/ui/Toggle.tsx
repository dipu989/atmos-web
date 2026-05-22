'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ToggleProps {
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  'aria-label'?: string
}

export function Toggle({ value, onChange, disabled = false, 'aria-label': ariaLabel }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!value)}
      className={cn(
        'relative inline-flex h-[22px] w-[40px] flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-horizon-blue/40 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        value ? 'bg-horizon-blue' : 'bg-[#C5CCD6]',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out',
          value ? 'translate-x-[19px]' : 'translate-x-[2px]',
        )}
      />
    </button>
  )
}
