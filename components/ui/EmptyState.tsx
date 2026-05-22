'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmptyStateAction {
  label: string
  href?: string
  onClick?: () => void
}

export interface EmptyStateProps {
  /**
   * Icon to display — pass a lucide icon with size={48} color="#C5CCD6".
   * e.g. <MapPin size={48} color="#C5CCD6" aria-hidden="true" />
   */
  icon: React.ReactNode
  title: string
  description?: string
  action?: EmptyStateAction
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center text-center"
      style={{ padding: '48px 24px' }}
    >
      {/* Icon — callers are responsible for size={48} color="#C5CCD6" */}
      <div className="flex items-center justify-center">
        {icon}
      </div>

      {/* Title */}
      <p
        className="font-semibold text-text-primary"
        style={{ fontSize: 15, marginTop: 14 }}
      >
        {title}
      </p>

      {/* Description */}
      {description && (
        <p
          className="text-center text-text-secondary"
          style={{ fontSize: 13, marginTop: 6, maxWidth: 320 }}
        >
          {description}
        </p>
      )}

      {/* Action — link or button */}
      {action && (
        <div style={{ marginTop: 16 }}>
          {action.href ? (
            <Link href={action.href}>
              <Button variant="secondary" size="sm">
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
