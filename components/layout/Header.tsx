'use client';

import { useState } from 'react';
import { Menu, Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';

const RANGE_OPTIONS = [
  'Today',
  'This week',
  'This month',
  'Last 30 days',
  'This year',
] as const;

export type RangeOption = (typeof RANGE_OPTIONS)[number];

interface HeaderProps {
  title: string;
  subtitle?: string;
  showRangePicker?: boolean;
  rangeValue?: string;
  onRangeChange?: (value: string) => void;
  rightExtra?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  showRangePicker,
  rangeValue = 'This month',
  onRangeChange,
  rightExtra,
}: HeaderProps) {
  const { toggle } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-divider bg-bg-page">
      <div className="flex items-center justify-between py-5 px-9">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Open navigation"
            className="rounded-lg p-1.5 text-text-secondary hover:bg-divider lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className="text-[24px] font-semibold leading-tight text-text-primary">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[13px] text-text-secondary">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: extra slot + date range picker */}
        <div className="flex items-center gap-3">
          {rightExtra}

          {showRangePicker && (
            <div className="relative">
              <button
                data-testid="range-picker-button"
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-divider bg-bg-card px-3 py-2 text-[13px] font-medium text-text-primary hover:bg-bg-page"
              >
                <Calendar size={14} className="text-text-secondary" />
                <span>{rangeValue}</span>
                <ChevronDown
                  size={14}
                  className={cn(
                    'text-text-secondary transition-transform duration-150',
                    dropdownOpen && 'rotate-180',
                  )}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-divider bg-bg-card shadow-card">
                  {RANGE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        onRangeChange?.(option);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full px-4 py-2.5 text-left text-[13px] hover:bg-bg-page',
                        rangeValue === option
                          ? 'font-semibold text-horizon-blue'
                          : 'font-medium text-text-primary',
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
