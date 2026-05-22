'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value' | 'min' | 'max' | 'step'> {
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
}

export function Slider({ min, max, step = 1, value, onChange, className, ...props }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className={cn('relative flex items-center', className)}>
      <div className="relative h-1.5 w-full rounded-full bg-divider">
        {/* Filled track */}
        <div
          className="absolute left-0 top-0 h-1.5 rounded-full bg-horizon-blue"
          style={{ width: `${pct}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="absolute w-full cursor-pointer opacity-0"
        style={{ height: 24 }}
        {...props}
      />
      {/* Custom thumb */}
      <div
        className="pointer-events-none absolute h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-horizon-blue bg-white shadow-card"
        style={{ left: `${pct}%`, top: '50%' }}
      />
    </div>
  )
}
