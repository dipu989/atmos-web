import { AlertTriangle } from 'lucide-react'
import { SettingsSection } from './SettingsSection'

export function AccountSection() {
  return (
    <SettingsSection
      title="Account"
      description="Manage your account credentials and deletion."
    >
      <div className="flex flex-col items-center py-10 text-center">
        <AlertTriangle size={36} color="#C5CCD6" aria-hidden="true" />
        <p className="mt-3 text-[14px] font-medium text-text-secondary">Coming soon</p>
        <p className="mt-1 text-[13px] text-text-secondary">
          Password change and account deletion will be available here.
        </p>
      </div>
    </SettingsSection>
  )
}
