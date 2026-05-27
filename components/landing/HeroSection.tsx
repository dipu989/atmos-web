'use client'

import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-[84px] pb-[96px] [background:radial-gradient(1100px_480px_at_78%_-10%,rgba(74,144,196,0.10),transparent_60%),radial-gradient(900px_420px_at_8%_30%,rgba(61,171,130,0.08),transparent_60%),#FFFFFF]"
    >
      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(26,35,50,0.06)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(closest-side_at_60%_50%,#000_35%,transparent_80%)] [-webkit-mask-image:radial-gradient(closest-side_at_60%_50%,#000_35%,transparent_80%)]"
      />

      <div className="relative mx-auto max-w-[1240px] px-5 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">

          {/* ── Copy ── */}
          <div>
            {/* Eyebrow */}
            <span className="inline-flex h-7 items-center gap-2 rounded-full border border-[#E8ECF1] bg-white px-3 text-[12px] font-medium text-text-secondary">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-horizon-blue to-sage text-[9px] font-bold leading-none text-white">
                a
              </span>
              <strong className="font-semibold text-text-primary">New</strong>
              <span>·</span>
              Auto-detect trips on iOS and Android
            </span>

            {/* Headline */}
            <h1 className="mt-[22px] font-serif text-[42px] font-medium leading-[1.06] tracking-[-1.5px] text-text-primary [text-wrap:balance] lg:text-[68px] lg:leading-[1.02] lg:tracking-[-2px]">
              Know the carbon cost of{' '}
              <em className="bg-gradient-to-br from-horizon-blue to-sage bg-clip-text text-transparent">
                every trip
              </em>{' '}
              you take.
            </h1>

            {/* Lede */}
            <p className="mt-[22px] max-w-[520px] text-[16px] leading-[1.55] text-text-secondary [text-wrap:pretty] lg:text-[17.5px]">
              Atmos quietly tracks how you move — car, train, bike, walk — and turns it into a
              clear picture of your daily footprint. No spreadsheets. No guesswork.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex h-12 items-center gap-2 rounded-[11px] bg-gradient-to-br from-horizon-blue to-sage px-[22px] text-[14.5px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(74,144,196,0.65)] transition-all hover:-translate-y-px hover:shadow-[0_12px_28px_-10px_rgba(61,171,130,0.7)]"
              >
                Open the dashboard
                <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
              </Link>
              <a
                href="#product"
                className="inline-flex h-12 items-center gap-2 rounded-[11px] border border-[#E8ECF1] bg-white px-[22px] text-[14.5px] font-medium text-text-primary transition-colors hover:border-text-primary"
              >
                <Play size={14} strokeWidth={2} aria-hidden />
                See what it looks like
              </a>
            </div>

            {/* Meta */}
            <div className="mt-[22px] flex flex-wrap items-center gap-4 text-[12.5px] text-text-secondary">
              <span>A personal project · in active development</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-divider" />
              <a href="mailto:hi@atmos.app" className="font-medium text-horizon-blue hover:underline">
                Send feedback →
              </a>
            </div>
          </div>

          {/* ── Preview cards (desktop only) ── */}
          <div className="relative hidden min-h-[540px] lg:block">

            {/* Main CO₂ stat card */}
            <div className="absolute inset-x-0 top-3 rounded-2xl border border-divider bg-white pt-[22px] pr-6 pb-5 pl-6 shadow-[0_1px_2px_rgba(26,35,50,0.06),0_24px_60px_-28px_rgba(26,35,50,0.25)]">
              <div className="mb-3.5 flex items-start justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-text-primary">CO₂ this month</div>
                  <div className="mt-0.5 text-[11.5px] text-text-secondary">May 2026 · 18 days tracked</div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(74,144,196,0.10)] px-2.5 py-[5px] text-[11px] font-semibold uppercase tracking-[0.3px] text-horizon-blue">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="6 9 12 15 18 9" /></svg>
                  8.3% down
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-[44px] font-medium leading-none tracking-[-1.2px] text-text-primary">
                  162.4
                </span>
                <span className="text-[13px] font-medium text-text-secondary">kg CO₂</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[12.5px] font-medium text-sage">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="6 9 12 15 18 9" /></svg>
                14.7 kg lower than April
              </div>
              {/* Mini chart */}
              <div className="mt-4">
                <svg viewBox="0 0 440 130" width="100%" height="130" preserveAspectRatio="none" aria-hidden>
                  <defs>
                    <linearGradient id="heroFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#4A90C4" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#4A90C4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="62" x2="440" y2="62" stroke="#3DAB82" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path d="M0,80 L62,40 L124,90 L186,55 L248,30 L310,100 L372,82 L440,55 L440,130 L0,130 Z" fill="url(#heroFill)" />
                  <path d="M0,80 L62,40 L124,90 L186,55 L248,30 L310,100 L372,82 L440,55" fill="none" stroke="#4A90C4" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                  <circle cx="248" cy="30" r="4" fill="#fff" stroke="#4A90C4" strokeWidth="2" />
                  <circle cx="372" cy="82" r="3" fill="#4A90C4" />
                  <g fontFamily="Inter" fontSize="9" fill="#6B7A8D">
                    <text x="0" y="124">Mon</text>
                    <text x="58" y="124">Tue</text>
                    <text x="118" y="124">Wed</text>
                    <text x="180" y="124">Thu</text>
                    <text x="244" y="124">Fri</text>
                    <text x="306" y="124">Sat</text>
                    <text x="368" y="124">Sun</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Floating trip card */}
            <div className="absolute bottom-[90px] left-[-28px] w-[280px] rounded-2xl border border-divider bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(26,35,50,0.06),0_24px_60px_-28px_rgba(26,35,50,0.25)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[rgba(61,171,130,0.12)] text-sage">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" />
                    <path d="M15 6h3" /><path d="M5.5 17.5l3-9 4 6h6" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-text-primary">
                    Office
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B7A8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></svg>
                    Lunch · Mira&apos;s
                  </div>
                  <div className="mt-0.5 text-[11px] text-text-secondary">Just detected · 2.1 km</div>
                </div>
                <div className="text-[13px] font-semibold text-sage">0.0 kg</div>
              </div>
            </div>

            {/* Floating insight card */}
            <div className="absolute right-[-16px] bottom-[-12px] w-[296px] rounded-2xl border border-divider bg-white p-4 shadow-[0_1px_2px_rgba(26,35,50,0.06),0_24px_60px_-28px_rgba(26,35,50,0.25)]">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[9px] bg-[rgba(61,171,130,0.12)] text-sage">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M9 18h6" /><path d="M10 22h4" />
                    <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.6px] text-sage">
                    Weekly insight
                  </div>
                  <div className="mt-1 text-[13.5px] font-semibold text-text-primary">
                    Try the train on Fridays
                  </div>
                  <div className="mt-1 text-[12px] leading-[1.5] text-text-secondary">
                    Your Friday commute is 40% higher than average. The 8:12 Caltrain would cut it in half.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
