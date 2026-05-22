import { Shield } from 'lucide-react'
import { SettingsSection } from './SettingsSection'

export function PrivacySection() {
  return (
    <SettingsSection
      title="Privacy & data"
      description="Manage how your data is used and shared."
    >
      <div className="flex flex-col items-center py-10 text-center">
        <Shield size={36} color="#C5CCD6" aria-hidden="true" />
        <p className="mt-3 text-[14px] font-medium text-text-secondary">Coming soon</p>
        <p className="mt-1 text-[13px] text-text-secondary">
          Data privacy controls will be available here.
        </p>
      </div>
    </SettingsSection>
  )
}
