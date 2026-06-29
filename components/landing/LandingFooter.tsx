import Link from 'next/link'

const PRODUCT_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Trips',     href: '/trips' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Insights',  href: '/insights' },
  { label: 'Settings',  href: '/settings' },
]

const CONTACT_LINKS = [
  { label: 'Send feedback',    href: 'mailto:hi@atmos.app' },
  { label: 'Report a bug',     href: 'mailto:hi@atmos.app?subject=Bug%20report' },
  { label: 'Request a feature',href: 'mailto:hi@atmos.app?subject=Feature%20request' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy',   href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-divider bg-[#FAFBFC] pb-10 pt-14">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr]">

          {/* Brand + blurb */}
          <div>
            <Link href="/" className="inline-flex items-center gap-[10px]">
              <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-br from-horizon-blue to-sage text-[17px] font-bold leading-none text-white">
                a
              </span>
              <span className="text-[18px] font-semibold tracking-[-0.3px] text-text-primary">
                atmos
              </span>
            </Link>
            <p className="mt-3.5 max-w-[280px] text-[13px] leading-[1.55] text-text-secondary">
              A quiet carbon tracker for people who&apos;d rather act than scroll. A personal
              project, in active development.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h5 className="mb-3.5 text-[11.5px] font-semibold uppercase tracking-[0.4px] text-text-primary">
              Product
            </h5>
            {PRODUCT_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block py-[5px] text-[13.5px] text-text-secondary transition-colors hover:text-text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact links */}
          <div>
            <h5 className="mb-3.5 text-[11.5px] font-semibold uppercase tracking-[0.4px] text-text-primary">
              Get in touch
            </h5>
            {CONTACT_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block py-[5px] text-[13.5px] text-text-secondary transition-colors hover:text-text-primary"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Legal links */}
          <div>
            <h5 className="mb-3.5 text-[11.5px] font-semibold uppercase tracking-[0.4px] text-text-primary">
              Legal
            </h5>
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block py-[5px] text-[13.5px] text-text-secondary transition-colors hover:text-text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex items-center justify-between border-t border-divider pt-[22px] text-[12.5px] text-text-secondary">
          <span>© {new Date().getFullYear()} Atmos · made with ♥ for the planet</span>
          <a href="mailto:hi@atmos.app" className="transition-colors hover:text-text-primary">
            hi@atmos.app
          </a>
        </div>

      </div>
    </footer>
  )
}
