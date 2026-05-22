import { CreditCard } from 'lucide-react'
import { SettingsSection } from './SettingsSection'

export function BillingSection() {
  return (
    <SettingsSection
      title="Plan & billing"
      description="View your current plan and manage billing details."
    >
      <div className="flex flex-col items-center py-10 text-center">
        <CreditCard size={36} color="#C5CCD6" aria-hidden="true" />
        <p className="mt-3 text-[14px] font-medium text-text-secondary">Coming soon</p>
        <p className="mt-1 text-[13px] text-text-secondary">
          Upgrade options and billing history will appear here.
        </p>
      </div>
    </SettingsSection>
  )
}
