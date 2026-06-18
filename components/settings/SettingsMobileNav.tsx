'use client'

import {
  User,
  Target,
  Bell,
  Shield,
  Plug,
  CreditCard,
  AlertTriangle,
  Key,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SettingsSection } from './SettingsSubNav'

// Mirrors the items in SettingsSubNav — short labels for chips
const CHIP_ITEMS: {
  id: SettingsSection
  label: string
  icon: React.ComponentType<{ size?: number }>
}[] = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'goals',         label: 'Goals',          icon: Target },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
  { id: 'privacy',       label: 'Privacy',        icon: Shield },
  { id: 'connections',   label: 'Connected apps', icon: Plug },
  { id: 'billing',       label: 'Billing',        icon: CreditCard },
  { id: 'api-keys',      label: 'API Keys',       icon: Key },
  { id: 'account',       label: 'Account',        icon: AlertTriangle },
]

interface SettingsMobileNavProps {
  active: SettingsSection
  onChange: (section: SettingsSection) => void
}

export function SettingsMobileNav({ active, onChange }: SettingsMobileNavProps) {
  return (
    <nav
      aria-label="Settings sections"
      className="flex gap-2 overflow-x-auto pb-1"
    >
      {CHIP_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-medium transition-all',
              isActive
                ? 'border-horizon-blue bg-horizon-blue/10 text-horizon-blue'
                : 'border-divider bg-white text-text-secondary hover:text-text-primary',
            )}
          >
            <Icon size={13} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
