'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Navigation,
  BarChart2,
  Lightbulb,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { clearAuth, getStoredUser } from '@/lib/auth';
import { useSidebar } from './SidebarContext';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Trips', href: '/trips', icon: Navigation },
  { label: 'Analytics', href: '/analytics', icon: BarChart2 },
  { label: 'Insights', href: '/insights', icon: Lightbulb },
  { label: 'Settings', href: '/settings', icon: Settings },
] as const;

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface SidebarContentProps {
  onNavClick?: () => void;
}

function SidebarContent({ onNavClick }: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getStoredUser();

  function handleLogout() {
    clearAuth();
    router.replace('/login');
  }

  return (
    <div className="flex h-full w-[240px] flex-shrink-0 flex-col border-r border-divider bg-bg-card py-6 px-4">
      {/* Logo block */}
      <div className="px-2 pb-7">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[9px] text-[17px] font-bold tracking-[-0.5px] text-white"
            style={{ background: 'linear-gradient(135deg, #4A90C4, #3DAB82)' }}
          >
            a
          </div>
          <span className="text-[18px] font-semibold tracking-[-0.3px] text-text-primary">
            atmos
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== '/dashboard' && (pathname?.startsWith(href) ?? false));
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavClick}
              data-active={isActive}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-h-[44px] items-center gap-3 rounded-[10px] py-2.5 px-3 text-[14px]',
                isActive
                  ? 'bg-horizon-blue/10 font-semibold text-horizon-blue'
                  : 'font-medium text-text-secondary hover:bg-bg-page',
              )}
            >
              <Icon size={19} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User block */}
      <div className="mt-auto border-t border-divider pt-4">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-[#E8DCC7] text-[12px] font-semibold text-[#5A4A2A]">
            {user?.display_name ? getInitials(user.display_name) : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold text-text-primary">
              {user?.display_name ?? 'User'}
            </p>
            <p className="text-[11.5px] text-text-secondary">Free plan</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-page hover:text-alert-red"
            aria-label="Log out"
          >
            <LogOut size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="sticky top-0 hidden h-screen lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile: overlay drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={close}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="absolute left-0 top-0 h-full shadow-lg">
            <button
              onClick={close}
              aria-label="Close navigation"
              className="absolute right-3 top-4 z-10 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-text-secondary hover:bg-bg-page"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavClick={close} />
          </div>
        </div>
      )}
    </>
  );
}
