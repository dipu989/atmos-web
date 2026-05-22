'use client'

import { useState } from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { SettingsSubNav, type SettingsSection } from '@/components/settings/SettingsSubNav'
import { ProfileSection } from '@/components/settings/ProfileSection'
import { GoalsSection } from '@/components/settings/GoalsSection'
import { NotificationsSection } from '@/components/settings/NotificationsSection'
import { PrivacySection } from '@/components/settings/PrivacySection'
import { ConnectionsSection } from '@/components/settings/ConnectionsSection'
import { BillingSection } from '@/components/settings/BillingSection'
import { AccountSection } from '@/components/settings/AccountSection'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')

  return (
    <PageShell title="Settings">
      <div className="grid gap-6" style={{ gridTemplateColumns: '220px 1fr' }}>
        <SettingsSubNav active={activeSection} onChange={setActiveSection} />

        <div>
          {activeSection === 'profile' && <ProfileSection />}
          {activeSection === 'goals' && <GoalsSection />}
          {activeSection === 'notifications' && <NotificationsSection />}
          {activeSection === 'privacy' && <PrivacySection />}
          {activeSection === 'connections' && <ConnectionsSection />}
          {activeSection === 'billing' && <BillingSection />}
          {activeSection === 'account' && <AccountSection />}
        </div>
      </div>
    </PageShell>
  )
}
