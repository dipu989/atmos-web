'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'How it works', href: '#how' },
  { label: 'Product', href: '#product' },
  { label: 'Insights', href: '#insights' },
]

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-30 border-b border-divider bg-white/80 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-10">
        <div className="flex h-[68px] items-center justify-between">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-[10px]">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-br from-horizon-blue to-sage text-[17px] font-bold leading-none text-white">
              a
            </span>
            <span className="text-[18px] font-semibold tracking-[-0.3px] text-text-primary">
              atmos
            </span>
          </Link>

          {/* Desktop anchor links */}
          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/login"
              className="flex h-10 items-center rounded-[10px] px-[18px] text-[14px] font-medium text-text-primary transition-colors hover:bg-bg-page"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="flex h-10 items-center gap-2 rounded-[10px] bg-text-primary px-[18px] text-[14px] font-medium text-white shadow-[0_6px_16px_-8px_rgba(26,35,50,0.55)] transition-all hover:-translate-y-px hover:bg-[#0F1828]"
            >
              Get started
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14"/><path d="M13 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-page lg:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-divider bg-white px-5 pb-5 lg:hidden">
          <div className="flex flex-col pt-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex h-11 items-center text-[14px] font-medium text-text-secondary"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-divider pt-4">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex h-11 items-center justify-center rounded-[10px] border border-[#E8ECF1] text-[14px] font-medium text-text-primary"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex h-11 items-center justify-center rounded-[10px] bg-text-primary text-[14px] font-medium text-white"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
