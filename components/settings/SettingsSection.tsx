import * as React from 'react'

interface SettingsSectionProps {
  title: string
  description?: string
  footer?: React.ReactNode
  children: React.ReactNode
}

export function SettingsSection({ title, description, footer, children }: SettingsSectionProps) {
  return (
    <div className="rounded-2xl bg-white shadow-card" style={{ padding: '28px 32px' }}>
      {/* Header */}
      <div className={description ? 'mb-6' : 'mb-5'}>
        <h2 className="text-[17px] font-semibold text-text-primary">{title}</h2>
        {description && (
          <p className="mt-1 text-[13px] text-text-secondary">{description}</p>
        )}
      </div>

      {/* Content */}
      <div>{children}</div>

      {/* Footer */}
      {footer && (
        <div
          className="mt-4 flex justify-end gap-3 border-t border-divider"
          style={{ paddingTop: 16 }}
        >
          {footer}
        </div>
      )}
    </div>
  )
}
