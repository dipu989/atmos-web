import * as React from 'react'
import { cn } from '@/lib/utils'

interface FormRowProps {
  label: string
  hint?: string
  divider?: boolean
  children: React.ReactNode
}

export function FormRow({ label, hint, divider = true, children }: FormRowProps) {
  return (
    <div
      className={cn(
        'grid items-center gap-4',
        divider && 'border-b border-divider',
      )}
      style={{
        gridTemplateColumns: '140px 1fr',
        padding: '18px 0',
      }}
    >
      {/* Label column */}
      <div>
        <p className="text-[14px] font-medium text-text-primary">{label}</p>
        {hint && (
          <p className="mt-0.5 text-[12px] text-text-secondary">{hint}</p>
        )}
      </div>

      {/* Control column */}
      <div>{children}</div>
    </div>
  )
}
