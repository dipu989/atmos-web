import { Bell } from 'lucide-react'
import { SettingsSection } from './SettingsSection'

export function NotificationsSection() {
  return (
    <SettingsSection
      title="Notifications"
      description="Control how and when Atmos notifies you."
    >
      <div className="flex flex-col items-center py-10 text-center">
        <Bell size={36} color="#C5CCD6" aria-hidden="true" />
        <p className="mt-3 text-[14px] font-medium text-text-secondary">Coming soon</p>
        <p className="mt-1 text-[13px] text-text-secondary">
          Notification preferences will be configurable here.
        </p>
      </div>
    </SettingsSection>
  )
}
