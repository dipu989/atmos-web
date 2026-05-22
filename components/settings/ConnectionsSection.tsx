import { Plug } from 'lucide-react'
import { SettingsSection } from './SettingsSection'

export function ConnectionsSection() {
  return (
    <SettingsSection
      title="Connected apps"
      description="Link third-party services to import your trips automatically."
    >
      <div className="flex flex-col items-center py-10 text-center">
        <Plug size={36} color="#C5CCD6" aria-hidden="true" />
        <p className="mt-3 text-[14px] font-medium text-text-secondary">Coming soon</p>
        <p className="mt-1 text-[13px] text-text-secondary">
          Connect Uber, Ola, Gmail and more to import trips.
        </p>
      </div>
    </SettingsSection>
  )
}
