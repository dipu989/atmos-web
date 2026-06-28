'use client'

import * as React from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import { Info } from 'lucide-react'

interface TooltipProps {
  content: React.ReactNode
  children?: React.ReactNode
  'aria-label'?: string
}

export function Tooltip({ content, children, 'aria-label': ariaLabel }: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={150}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          {children ?? (
            <button
              type="button"
              aria-label={ariaLabel ?? 'More information'}
              className="inline-flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-horizon-blue/40"
            >
              <Info size={14} aria-hidden="true" />
            </button>
          )}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            sideOffset={6}
            className="z-50 max-w-[260px] rounded-[9px] bg-text-primary px-3 py-2 text-[12.5px] leading-snug text-white shadow-card"
          >
            {content}
            <RadixTooltip.Arrow className="fill-text-primary" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
