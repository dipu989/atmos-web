import * as React from 'react'
import { cn } from '@/lib/utils'

interface FormRowProps {
  label: React.ReactNode
  hint?: string
  divider?: boolean
  children: React.ReactNode
}

export function FormRow({ label, hint, divider = true, children }: FormRowProps) {
  return (
    <div
      className={cn(
        // Mobile: single column (label above input). Desktop: 2-column side-by-side.
        'grid items-center gap-4',
        'grid-cols-1 lg:grid-cols-[140px_1fr]',
        divider && 'border-b border-divider',
      )}
      style={{ padding: '18px 0' }}
    >
      {/* Label column */}
      <div>
        <p className="flex items-center gap-1.5 text-[14px] font-medium text-text-primary">{label}</p>
        {hint && (
          <p className="mt-0.5 text-[12px] text-text-secondary">{hint}</p>
        )}
      </div>

      {/* Control column */}
      <div>{children}</div>
    </div>
  )
}
