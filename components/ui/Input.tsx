import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-label font-medium text-text-primary">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2.5 text-[14px] text-text-primary placeholder:text-text-secondary',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-horizon-blue/20',
            error
              ? 'border-alert-red focus:border-alert-red'
              : 'border-divider focus:border-horizon-blue',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />
        {error && <p className="text-[13px] text-alert-red">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
