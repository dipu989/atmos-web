import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { type ReactNode } from 'react'

interface InsightItem {
  type: 'streak' | 'tip' | 'anomaly'
  label: string
  title: string
  body: string
  icon: ReactNode
}

const INSIGHTS: InsightItem[] = [
  {
    type: 'streak',
    label: 'Streak',
    title: '12-day tracking streak',
    body: "You've logged trips every day for nearly two weeks — your longest yet. Last streak was 8 days in April.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M8.5 14.5A5 5 0 1 0 12 6.5a4 4 0 0 0-4 4 4 4 0 0 0 .5 2" />
        <path d="M12 22s-4-3.5-4-9 4-9 4-9 4 3.5 4 9-4 9-4 9z" />
      </svg>
    ),
  },
  {
    type: 'tip',
    label: 'Tip',
    title: 'Try the train on Fridays',
    body: 'Your Friday commute is 40% higher than weekday average. The 8:12 Caltrain would cut it in half — about 3.2 kg saved per week.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 18h6" /><path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
      </svg>
    ),
  },
  {
    type: 'anomaly',
    label: 'Anomaly',
    title: 'Unusual spike on Friday',
    body: '7.9 kg CO₂ on May 16 — 58% above your weekly average. Two longer car trips (Home → Stinson, return) contributed most.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
]

const TYPE_STYLES = {
  streak: {
    border: 'border-l-horizon-blue',
    iconBg: 'bg-[rgba(74,144,196,0.12)]',
    iconColor: 'text-horizon-blue',
    labelColor: 'text-horizon-blue',
  },
  tip: {
    border: 'border-l-sage',
    iconBg: 'bg-[rgba(61,171,130,0.12)]',
    iconColor: 'text-sage',
    labelColor: 'text-sage',
  },
  anomaly: {
    border: 'border-l-peach',
    iconBg: 'bg-[rgba(240,149,106,0.12)]',
    iconColor: 'text-peach',
    labelColor: 'text-peach',
  },
}

export function InsightsSection() {
  return (
    <section id="insights" className="bg-bg-page py-[110px]">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.1fr]">

          {/* ── Copy ── */}
          <div>
            <p className="text-[11.5px] font-semibold uppercase tracking-[1.4px] text-sage">
              Weekly insights
            </p>
            <h2 className="mt-3.5 font-serif text-[44px] font-medium leading-[1.05] tracking-[-1.2px] text-text-primary [text-wrap:balance]">
              The part nobody else gets right.
            </h2>
            <p className="mt-[18px] max-w-[480px] text-[16px] leading-[1.55] text-text-secondary">
              Most apps drown you in charts. Atmos reads your week and surfaces three things,
              max: a pattern, a tip, and anything unusual. That&apos;s the whole feed.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-text-primary px-[18px] text-[14px] font-medium text-white shadow-[0_6px_16px_-8px_rgba(26,35,50,0.55)] transition-all hover:-translate-y-px hover:bg-[#0F1828]"
              >
                Open Insights
                <ArrowRight size={14} strokeWidth={2.2} aria-hidden />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-[10px] border border-[#E8ECF1] bg-white px-[18px] text-[14px] font-medium text-text-primary transition-colors hover:border-text-primary"
              >
                See Analytics
              </Link>
            </div>
          </div>

          {/* ── Insight cards ── */}
          <div className="flex flex-col gap-2.5">
            {INSIGHTS.map((item) => {
              const s = TYPE_STYLES[item.type]
              return (
                <div
                  key={item.type}
                  className={`flex gap-3.5 rounded-[14px] border-l-4 bg-white px-[18px] py-4 shadow-[0_1px_2px_rgba(26,35,50,0.04)] ${s.border}`}
                >
                  <div className={`flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[9px] ${s.iconBg} ${s.iconColor}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.5px] ${s.labelColor}`}>
                      {item.label}
                    </p>
                    <p className="mt-[3px] text-[14px] font-semibold text-text-primary">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-[1.5] text-text-secondary">
                      {item.body}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
