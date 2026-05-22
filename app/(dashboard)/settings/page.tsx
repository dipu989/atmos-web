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
import { SettingsMobileNav } from '@/components/settings/SettingsMobileNav'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')

  return (
    <PageShell title="Settings">
      {/* ── Responsive layout: chips on mobile, side-nav on desktop ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">

        {/* Sub-nav — mobile chips (below lg) + desktop sidebar (lg+) */}
        <div>
          {/* Mobile: horizontal scrollable chips */}
          <div className="lg:hidden">
            <SettingsMobileNav active={activeSection} onChange={setActiveSection} />
          </div>
          {/* Desktop: vertical side-nav */}
          <div className="hidden lg:block">
            <SettingsSubNav active={activeSection} onChange={setActiveSection} />
          </div>
        </div>

        {/* Section content */}
        <div>
          {activeSection === 'profile'       && <ProfileSection />}
          {activeSection === 'goals'         && <GoalsSection />}
          {activeSection === 'notifications' && <NotificationsSection />}
          {activeSection === 'privacy'       && <PrivacySection />}
          {activeSection === 'connections'   && <ConnectionsSection />}
          {activeSection === 'billing'       && <BillingSection />}
          {activeSection === 'account'       && <AccountSection />}
        </div>
      </div>
    </PageShell>
  )
}
