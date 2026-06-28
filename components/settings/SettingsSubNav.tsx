'use client'

import {
  User,
  Target,
  Bell,
  Shield,
  Plug,
  AlertTriangle,
  Key,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type SettingsSection =
  | 'profile'
  | 'goals'
  | 'notifications'
  | 'privacy'
  | 'connections'
  | 'api-keys'
  | 'account'

interface NavItem {
  id: SettingsSection
  label: string
  icon: React.ComponentType<{ size?: number; color?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'goals', label: 'Goals & tracking', icon: Target },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & data', icon: Shield },
  { id: 'connections', label: 'Connected apps', icon: Plug },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'account', label: 'Account', icon: AlertTriangle },
]

interface SettingsSubNavProps {
  active: SettingsSection
  onChange: (section: SettingsSection) => void
}

export function SettingsSubNav({ active, onChange }: SettingsSubNavProps) {
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Settings navigation">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            data-active={isActive}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex min-h-[44px] w-full items-center gap-2.5 rounded-[9px] px-3 text-left transition-colors duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-horizon-blue/40',
              isActive
                ? 'bg-[rgba(74,144,196,0.10)] font-semibold text-horizon-blue'
                : 'font-medium text-text-secondary hover:bg-bg-page',
            )}
            style={{ padding: '9px 12px', fontSize: '13.5px' }}
          >
            <Icon
              size={15}
              color={isActive ? '#4A90C4' : '#6B7A8D'}
            />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
