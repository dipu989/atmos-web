'use client'

import { useState, useEffect } from 'react'
import { SettingsSection } from './SettingsSection'
import { FormRow } from './FormRow'
import { Slider } from '@/components/ui/Slider'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { usePreferences } from '@/lib/hooks/useTrips'
import { useUpdatePreferences } from '@/lib/hooks/useMutations'

type Toast = { type: 'success' | 'error'; message: string }

export function GoalsSection() {
  const { data: prefs, isLoading, isError } = usePreferences()
  const updatePrefs = useUpdatePreferences()

  const [dailyGoal, setDailyGoal] = useState(5)
  const [notifyEnabled, setNotifyEnabled] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  // Use primitive value deps so a new object reference doesn't reset edits.
  const prefsGoal = prefs?.daily_goal_kg_co2e
  const prefsNotify = prefs?.push_notifications_enabled
  useEffect(() => {
    if (prefsGoal !== undefined) setDailyGoal(prefsGoal)
    if (prefsNotify !== undefined) setNotifyEnabled(prefsNotify)
  }, [prefsGoal, prefsNotify])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const isSubmitting = updatePrefs.isPending

  async function handleSave() {
    try {
      await updatePrefs.mutateAsync({
        daily_goal_kg_co2e: dailyGoal,
        push_notifications_enabled: notifyEnabled,
      })
      setToast({ type: 'success', message: 'Goals saved' })
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save goals',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white shadow-card" style={{ padding: '28px 32px' }}>
        <div className="space-y-4 animate-pulse">
          <div className="h-5 w-32 rounded bg-divider" />
          <div className="h-10 rounded bg-divider" />
          <div className="h-10 rounded bg-divider" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-white shadow-card" style={{ padding: '28px 32px' }}>
        <p className="text-[14px] text-alert-red">Failed to load goals settings.</p>
      </div>
    )
  }

  return (
    <SettingsSection
      title="Goals & tracking"
      description="Set your daily CO₂ target and reminder preferences."
      footer={
        <>
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={() => {
              if (prefs) {
                setDailyGoal(prefs.daily_goal_kg_co2e ?? 5)
                setNotifyEnabled(prefs.push_notifications_enabled ?? false)
              }
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="button"
            loading={isSubmitting}
            disabled={isSubmitting}
            onClick={handleSave}
          >
            Save changes
          </Button>
        </>
      }
    >
      {/* Toast */}
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

      {/* Daily CO₂ goal slider */}
      <FormRow
        label="Daily CO₂ goal"
        hint="Target kg of CO₂ per day."
      >
        <div className="flex items-center gap-4">
          <div className="w-[220px]">
            <Slider
              min={1}
              max={10}
              step={0.5}
              value={dailyGoal}
              onChange={setDailyGoal}
              aria-label="Daily CO₂ goal"
            />
          </div>
          <span className="w-14 text-[13px] font-semibold text-text-primary">
            {dailyGoal.toFixed(1)} kg
          </span>
        </div>
      </FormRow>

      {/* Reminder toggle */}
      <FormRow
        label="Daily reminder"
        hint="Remind me if I haven't logged by 9 pm."
        divider={false}
      >
        <Toggle
          value={notifyEnabled}
          onChange={setNotifyEnabled}
          aria-label="Daily reminder toggle"
        />
      </FormRow>
    </SettingsSection>
  )
}
