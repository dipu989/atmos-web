'use client'

import { useState, useEffect } from 'react'
import { Camera, CheckCircle } from 'lucide-react'
import { SettingsSection } from './SettingsSection'
import { FormRow } from './FormRow'
import { Select } from '@/components/ui/Select'
import { Segmented } from '@/components/ui/Segmented'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useMe, usePreferences } from '@/lib/hooks/useTrips'
import { useUpdateMe, useUpdatePreferences } from '@/lib/hooks/useMutations'

// ─── Timezone options (common subset) ─────────────────────────────────────────
const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST, +5:30)' },
  { value: 'Asia/Colombo', label: 'Asia/Colombo (+5:30)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST, +4:00)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT, +8:00)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST, +9:00)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST, +8:00)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET, +1:00)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET, +1:00)' },
  { value: 'America/New_York', label: 'America/New_York (EST, -5:00)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST, -6:00)' },
  { value: 'America/Denver', label: 'America/Denver (MST, -7:00)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST, -8:00)' },
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (BRT, -3:00)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEDT, +11:00)' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland (NZDT, +13:00)' },
  { value: 'UTC', label: 'UTC (±0:00)' },
]

const UNIT_OPTIONS = [
  { value: 'km', label: 'km' },
  { value: 'miles', label: 'mi' },
] as const

type Toast = { type: 'success' | 'error'; message: string }

// ─── ProfileSection ────────────────────────────────────────────────────────────

export function ProfileSection() {
  const { data: user, isLoading: userLoading, isError: userError } = useMe()
  const { data: prefs, isLoading: prefsLoading, isError: prefsError } = usePreferences()
  const updateMe = useUpdateMe()
  const updatePrefs = useUpdatePreferences()

  // Form state — initialised from API data
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km')
  const [toast, setToast] = useState<Toast | null>(null)

  // Populate form when API data first loads.
  // Use primitive value deps so a new object reference (e.g. from a mock on every render)
  // doesn't reset user edits on re-render.
  const userName = user?.display_name
  const userTimezone = user?.timezone
  useEffect(() => {
    if (userName !== undefined) setName(userName ?? '')
    if (userTimezone !== undefined) setTimezone(userTimezone ?? 'UTC')
  }, [userName, userTimezone])

  const prefsUnit = prefs?.distance_unit
  useEffect(() => {
    if (prefsUnit !== undefined) setDistanceUnit(prefsUnit)
  }, [prefsUnit])

  // Auto-dismiss toast after 3 s
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const isSubmitting = updateMe.isPending || updatePrefs.isPending

  async function handleSave() {
    try {
      const mePayload: Parameters<typeof updateMe.mutateAsync>[0] = {}
      if (user && name !== user.display_name) mePayload.display_name = name
      if (user && timezone !== user.timezone) mePayload.timezone = timezone

      const prefsPayload: Parameters<typeof updatePrefs.mutateAsync>[0] = {}
      if (prefs && distanceUnit !== prefs.distance_unit)
        prefsPayload.distance_unit = distanceUnit

      const ops: Promise<unknown>[] = []
      if (Object.keys(mePayload).length > 0) ops.push(updateMe.mutateAsync(mePayload))
      if (Object.keys(prefsPayload).length > 0) ops.push(updatePrefs.mutateAsync(prefsPayload))

      if (ops.length === 0) {
        setToast({ type: 'success', message: 'No changes to save.' })
        return
      }

      await Promise.all(ops)
      setToast({ type: 'success', message: 'Changes saved' })
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save changes',
      })
    }
  }

  if (userLoading || prefsLoading) {
    return (
      <div className="rounded-2xl bg-white shadow-card" style={{ padding: '28px 32px' }}>
        <div className="space-y-4 animate-pulse">
          <div className="h-5 w-32 rounded bg-divider" />
          <div className="h-10 rounded bg-divider" />
          <div className="h-10 rounded bg-divider" />
          <div className="h-10 rounded bg-divider" />
        </div>
      </div>
    )
  }

  if (userError || prefsError) {
    return (
      <div className="rounded-2xl bg-white shadow-card" style={{ padding: '28px 32px' }}>
        <p className="text-[14px] text-alert-red">Failed to load profile settings.</p>
      </div>
    )
  }

  return (
    <SettingsSection
      title="Profile"
      description="Update your personal information and preferences."
      footer={
        <>
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={() => {
              if (user) {
                setName(user.display_name ?? '')
                setTimezone(user.timezone ?? 'UTC')
              }
              if (prefs) setDistanceUnit(prefs.distance_unit ?? 'km')
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

      {/* Avatar */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8DCC7] text-[22px] font-semibold text-[#5A4A2A]">
          {name ? name.charAt(0).toUpperCase() : '?'}
        </div>
        <div>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-[9px] border border-divider bg-white px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:bg-bg-page"
            onClick={() =>
              setToast({ type: 'success', message: 'Avatar upload coming soon.' })
            }
          >
            <Camera size={13} />
            Change photo
          </button>
          <p className="mt-1 text-[11px] text-text-secondary">JPG, PNG up to 5 MB</p>
        </div>
      </div>

      {/* Name */}
      <FormRow label="Full name" hint="Your display name across the app.">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="h-9 w-[280px] rounded-[9px] text-[13px]"
        />
      </FormRow>

      {/* Email */}
      <FormRow label="Email">
        <div className="flex items-center gap-2">
          <Input
            value={user?.email ?? ''}
            readOnly
            disabled
            className="h-9 w-[280px] rounded-[9px] text-[13px]"
          />
          <span className="flex items-center gap-1 text-[12px] font-medium text-sage">
            <CheckCircle size={13} />
            Verified
          </span>
        </div>
      </FormRow>

      {/* City — UI only: city is not in the current API spec */}
      <FormRow label="City" hint="Not synced to server yet.">
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Bengaluru"
          className="h-9 w-[280px] rounded-[9px] text-[13px]"
        />
      </FormRow>

      {/* Timezone — goes to PUT /users/me */}
      <FormRow label="Time zone">
        <Select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          options={TIMEZONE_OPTIONS}
        />
      </FormRow>

      {/* Distance unit — goes to PUT /users/me/preferences */}
      <FormRow label="Distance unit" divider={false}>
        <Segmented
          value={distanceUnit}
          onChange={(v) => setDistanceUnit(v as 'km' | 'miles')}
          options={UNIT_OPTIONS}
        />
      </FormRow>
    </SettingsSection>
  )
}
