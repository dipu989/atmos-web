import { type ReactNode } from 'react'

interface Feature {
  iconBg: string
  iconColor: string
  icon: ReactNode
  title: string
  body: string
}

const FEATURES: Feature[] = [
  {
    iconBg: 'bg-[rgba(74,144,196,0.12)]',
    iconColor: 'text-horizon-blue',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3" /><path d="M12 19v3" />
        <path d="M4.2 4.2l2.1 2.1" /><path d="M17.7 17.7l2.1 2.1" />
        <path d="M2 12h3" /><path d="M19 12h3" />
        <path d="M4.2 19.8l2.1-2.1" /><path d="M17.7 6.3l2.1-2.1" />
      </svg>
    ),
    title: 'Auto-detection',
    body: 'On-device motion classifiers tell walking from cycling from driving from transit — without draining your battery or pinging GPS every minute.',
  },
  {
    iconBg: 'bg-[rgba(61,171,130,0.12)]',
    iconColor: 'text-sage',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 12l4-8 5 8 4-6 5 8" /><path d="M3 20h18" />
      </svg>
    ),
    title: 'Honest math',
    body: 'CO₂ estimates use country-specific grid mixes, vehicle class, and time of day — not generic averages. Methodology is documented, not magic.',
  },
  {
    iconBg: 'bg-[rgba(240,149,106,0.14)]',
    iconColor: 'text-peach',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 18h6" /><path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
      </svg>
    ),
    title: 'One weekly nudge',
    body: 'Friday afternoon: one tip, modelled against your own week. Not "drive less." Specifically: "the 8:12 Caltrain would cut your Friday in half."',
  },
  {
    iconBg: 'bg-[rgba(123,169,212,0.16)]',
    iconColor: 'text-[#7BA9D4]',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Yours, on device',
    body: 'Trip data never leaves your phone unless you choose to back it up. No ad tech. No third-party SDKs.',
  },
  {
    iconBg: 'bg-[rgba(232,220,199,0.6)]',
    iconColor: 'text-[#5A4A2A]',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 3h7v7H3z" /><path d="M14 3h7v7h-7z" />
        <path d="M14 14h7v7h-7z" /><path d="M3 14h7v7H3z" />
      </svg>
    ),
    title: 'The dashboard',
    body: 'A clean web view of the same data: weekly trend, transport mix, full trip log, and analytics deep-dives. Export to CSV anytime.',
  },
  {
    iconBg: 'bg-[rgba(141,201,168,0.25)]',
    iconColor: 'text-sage',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Goals that flex',
    body: 'Set a daily cap. Atmos adjusts to your routine: harder on a quiet week, gentler when life happens. Streaks without the pressure.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-[110px]">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-10">

        {/* Section header */}
        <div className="mx-auto mb-14 max-w-[720px] text-center">
          <p className="text-[11.5px] font-semibold uppercase tracking-[1.4px] text-horizon-blue">
            What makes it work
          </p>
          <h2 className="mt-3.5 font-serif text-[44px] font-medium leading-[1.05] tracking-[-1.2px] text-text-primary [text-wrap:balance]">
            Smart where it counts.{' '}
            <em className="italic text-sage">Quiet everywhere else.</em>
          </h2>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-2.5 rounded-[18px] border border-divider bg-white p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E8ECF1]"
            >
              {/* Icon */}
              <div className={`mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl ${f.iconBg} ${f.iconColor}`}>
                {f.icon}
              </div>

              <h3 className="text-[18px] font-semibold leading-tight tracking-[-0.3px] text-text-primary">
                {f.title}
              </h3>
              <p className="text-[14px] leading-[1.55] text-text-secondary">
                {f.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
