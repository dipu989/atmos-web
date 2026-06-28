'use client'

import { useState, useEffect } from 'react'
import { SettingsSection } from './SettingsSection'
import { Toggle } from '@/components/ui/Toggle'
import { Tooltip } from '@/components/ui/Tooltip'
import { usePreferences } from '@/lib/hooks/useTrips'
import { useUpdatePreferences } from '@/lib/hooks/useMutations'

type Toast = { type: 'success' | 'error'; message: string }

export function NotificationsSection() {
  const { data: prefs, isLoading, isError } = usePreferences()
  const updatePrefs = useUpdatePreferences()

  const [pushEnabled, setPushEnabled] = useState(true)
  const [toast, setToast] = useState<Toast | null>(null)

  const prefsPushEnabled = prefs?.push_notifications_enabled
  useEffect(() => {
    if (prefsPushEnabled !== undefined) setPushEnabled(prefsPushEnabled)
  }, [prefsPushEnabled])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  async function handleToggle(next: boolean) {
    setPushEnabled(next)
    try {
      await updatePrefs.mutateAsync({ push_notifications_enabled: next })
      setToast({ type: 'success', message: 'Notification settings saved' })
    } catch (err) {
      setPushEnabled(!next)
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update notification settings',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white shadow-card" style={{ padding: '28px 32px' }}>
        <div className="space-y-4 animate-pulse">
          <div className="h-5 w-32 rounded bg-divider" />
          <div className="h-10 rounded bg-divider" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-white shadow-card" style={{ padding: '28px 32px' }}>
        <p className="text-[14px] text-alert-red">Failed to load notification settings.</p>
      </div>
    )
  }

  return (
    <SettingsSection
      title="Notifications"
      description="Control how and when Atmos notifies you."
    >
      {toast && (
        <div
          role="status"
          className={`mb-4 rounded-[9px] px-4 py-2.5 text-[13px] font-medium ${
            toast.type === 'success'
              ? 'bg-sage/10 text-sage'
              : 'bg-alert-red/10 text-alert-red'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 py-3">
        <p className="flex items-center gap-1.5 text-[14px] font-medium text-text-primary">
          Push notifications
          <Tooltip
            aria-label="What does push notifications do?"
            content="Sends alerts to your mobile devices for new insights and possible-duplicate activity reviews. Turning this off stops all push notifications until you switch it back on — it doesn't affect anything in this web dashboard."
          />
        </p>
        <Toggle
          value={pushEnabled}
          onChange={handleToggle}
          disabled={updatePrefs.isPending}
          aria-label="Push notifications toggle"
        />
      </div>
    </SettingsSection>
  )
}
