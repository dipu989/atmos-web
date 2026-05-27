/* ─────────────────────────────────────────────────────────────────
   Mini sidebar nav items
───────────────────────────────────────────────────────────────── */
const NAV = [
  {
    label: 'Dashboard', active: true,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  },
  {
    label: 'Trips', active: false,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 18L19 6"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/></svg>,
  },
  {
    label: 'Analytics', active: false,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 20L3 4"/><path d="M3 20L21 20"/><path d="M7 16L11 11L14 13L20 6"/></svg>,
  },
  {
    label: 'Insights', active: false,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/></svg>,
  },
  {
    label: 'Settings', active: false,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/></svg>,
  },
]

/* ─────────────────────────────────────────────────────────────────
   Stat cards
───────────────────────────────────────────────────────────────── */
function StatCards() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {/* CO₂ this month */}
      <div className="flex min-h-[96px] flex-col gap-1 rounded-xl border-t-[3px] border-t-horizon-blue bg-white p-[14px_16px]">
        <div className="text-[10px] font-semibold uppercase tracking-[0.4px] text-text-secondary">CO₂ this month</div>
        <div className="mt-0.5 leading-none"><span className="font-serif text-[28px] font-medium tracking-[-0.8px] text-text-primary">162.4</span><span className="ml-1 text-[11px] font-medium text-text-secondary">kg</span></div>
        <div className="mt-auto text-[11px] font-medium text-sage">↓ 8.3% vs last month</div>
      </div>
      {/* Daily goal */}
      <div className="flex min-h-[96px] flex-col gap-1 rounded-xl border-t-[3px] border-t-sage bg-white p-[14px_16px]">
        <div className="text-[10px] font-semibold uppercase tracking-[0.4px] text-text-secondary">Daily goal</div>
        <div className="mt-0.5 leading-none"><span className="font-serif text-[28px] font-medium tracking-[-0.8px] text-text-primary">2.8</span><span className="ml-1 text-[11px] font-medium text-text-secondary">/ 5.0 kg</span></div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-divider"><div className="h-full w-[56%] rounded-full bg-sage" /></div>
      </div>
      {/* Streak */}
      <div className="flex min-h-[96px] flex-col gap-1 rounded-xl border-t-[3px] border-t-peach bg-white p-[14px_16px]">
        <div className="text-[10px] font-semibold uppercase tracking-[0.4px] text-text-secondary">Streak</div>
        <div className="mt-0.5 leading-none"><span className="font-serif text-[28px] font-medium tracking-[-0.8px] text-text-primary">12</span><span className="ml-1 text-[11px] font-medium text-text-secondary">days</span></div>
        <div className="mt-auto text-[11px] text-text-secondary">Longest: 21 days</div>
      </div>
      {/* Days tracked */}
      <div className="flex min-h-[96px] flex-col gap-1 rounded-xl border-t-[3px] border-t-text-secondary bg-white p-[14px_16px]">
        <div className="text-[10px] font-semibold uppercase tracking-[0.4px] text-text-secondary">Days tracked</div>
        <div className="mt-0.5 leading-none"><span className="font-serif text-[28px] font-medium tracking-[-0.8px] text-text-primary">87</span><span className="ml-1 text-[11px] font-medium text-text-secondary">total</span></div>
        <div className="mt-auto text-[11px] text-text-secondary">Since Feb 21</div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Weekly trend chart
───────────────────────────────────────────────────────────────── */
function WeeklyChart() {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-[18px]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[13px] font-semibold text-text-primary">Weekly CO₂ trend</div>
          <div className="text-[11px] text-text-secondary">Last 7 days · kg CO₂ per day</div>
        </div>
        <div className="flex gap-3 text-[11px] text-text-secondary">
          <span className="flex items-center gap-1.5"><span className="block h-0.5 w-3.5 bg-horizon-blue" />Daily CO₂</span>
          <span className="flex items-center gap-1.5"><span className="block w-3.5 border-t-2 border-dashed border-sage" />Goal</span>
        </div>
      </div>
      <svg viewBox="0 0 540 180" width="100%" height="180" aria-hidden>
        <defs>
          <linearGradient id="prodFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4A90C4" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4A90C4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="#F0F2F5">
          <line x1="0" y1="30" x2="540" y2="30" /><line x1="0" y1="70" x2="540" y2="70" />
          <line x1="0" y1="110" x2="540" y2="110" /><line x1="0" y1="150" x2="540" y2="150" />
        </g>
        <line x1="0" y1="80" x2="540" y2="80" stroke="#3DAB82" strokeWidth="1.5" strokeDasharray="5 5" />
        <path d="M30,110 L110,70 L190,130 L270,90 L350,40 L430,148 L510,118 L540,118 L540,180 L30,180 Z" fill="url(#prodFill)" />
        <path d="M30,110 L110,70 L190,130 L270,90 L350,40 L430,148 L510,118" fill="none" stroke="#4A90C4" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <g fill="#4A90C4">
          <circle cx="30" cy="110" r="3" /><circle cx="110" cy="70" r="3" /><circle cx="190" cy="130" r="3" />
          <circle cx="270" cy="90" r="3" /><circle cx="350" cy="40" r="4" fill="#fff" stroke="#4A90C4" strokeWidth="2.5" />
          <circle cx="430" cy="148" r="3" /><circle cx="510" cy="118" r="3" />
        </g>
        <g fontFamily="Inter" fontSize="10" fill="#6B7A8D">
          <text x="20" y="172">Mon</text><text x="100" y="172">Tue</text><text x="182" y="172">Wed</text>
          <text x="262" y="172">Thu</text><text x="345" y="172">Fri</text><text x="425" y="172">Sat</text><text x="505" y="172">Sun</text>
        </g>
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Transport mix donut + list
───────────────────────────────────────────────────────────────── */
const MODES = [
  { label: 'Car',   kg: '38.4', color: 'bg-peach',         iconColor: 'text-peach',        iconBg: 'bg-[rgba(240,149,106,0.16)]', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 17h14"/><path d="M5 11l2-5h10l2 5"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg> },
  { label: 'Train', kg: '12.1', color: 'bg-horizon-blue',  iconColor: 'text-horizon-blue', iconBg: 'bg-[rgba(74,144,196,0.16)]',  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="5" y="3" width="14" height="14" rx="2"/><path d="M5 9h14"/><path d="M9 21l-2-4"/><path d="M15 21l2-4"/></svg> },
  { label: 'Bus',   kg: '8.6',  color: 'bg-[#7BA9D4]',     iconColor: 'text-[#7BA9D4]',    iconBg: 'bg-[rgba(123,169,212,0.18)]', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 10h16"/><circle cx="8" cy="20" r="1.5"/><circle cx="16" cy="20" r="1.5"/></svg> },
  { label: 'Bike',  kg: '0.0',  color: 'bg-sage',           iconColor: 'text-sage',         iconBg: 'bg-[rgba(61,171,130,0.16)]',  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M5.5 17.5l3-9 4 6h6"/></svg> },
]

function TransportMix() {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-[18px]">
      <div className="text-[13px] font-semibold text-text-primary">Transport mix</div>
      <div className="flex justify-center py-1.5">
        <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden>
          <circle cx="60" cy="60" r="44" fill="none" stroke="#F0F2F5" strokeWidth="14" />
          <circle cx="60" cy="60" r="44" fill="none" stroke="#F0956A" strokeWidth="14" strokeDasharray="180 276" strokeDashoffset="0" transform="rotate(-90 60 60)" />
          <circle cx="60" cy="60" r="44" fill="none" stroke="#4A90C4" strokeWidth="14" strokeDasharray="55 276" strokeDashoffset="-180" transform="rotate(-90 60 60)" />
          <circle cx="60" cy="60" r="44" fill="none" stroke="#7BA9D4" strokeWidth="14" strokeDasharray="42 276" strokeDashoffset="-235" transform="rotate(-90 60 60)" />
          <text x="60" y="58" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="20" fontWeight="500" fill="#1A2332">59.1</text>
          <text x="60" y="72" textAnchor="middle" fontFamily="Inter" fontSize="9" fill="#6B7A8D">kg total</text>
        </svg>
      </div>
      <div className="flex flex-col gap-2 mt-1">
        {MODES.map((m) => (
          <div key={m.label} className="grid grid-cols-[22px_1fr_auto] items-center gap-2.5">
            <div className={`flex h-[22px] w-[22px] items-center justify-center rounded-[6px] ${m.iconBg} ${m.iconColor}`}>{m.icon}</div>
            <div className="text-[12px] font-medium text-text-primary">{m.label}</div>
            <div className="text-[11.5px] font-semibold text-text-primary">{m.kg} <span className="text-[10px] font-normal text-text-secondary">kg</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────────── */
export function ProductSection() {
  return (
    <section
      id="product"
      className="py-[110px] [background:radial-gradient(1100px_460px_at_50%_0%,rgba(74,144,196,0.07),transparent_60%),#FFFFFF]"
    >
      <div className="mx-auto max-w-[1240px] px-5 lg:px-10">

        {/* Section header */}
        <div className="mx-auto mb-4 max-w-[720px] text-center">
          <p className="text-[11.5px] font-semibold uppercase tracking-[1.4px] text-horizon-blue">
            The Atmos dashboard
          </p>
          <h2 className="mt-3.5 font-serif text-[44px] font-medium leading-[1.05] tracking-[-1.2px] text-text-primary [text-wrap:balance]">
            Your week, your modes,{' '}
            <em className="italic text-sage">your numbers.</em>
          </h2>
          <p className="mt-4 text-[16px] leading-[1.55] text-text-secondary">
            Every screen built around one question:{' '}
            <em className="italic">did today move me closer to where I want to be?</em>{' '}
            One glance answers it.
          </p>
        </div>

        {/* Browser frame */}
        <div className="mt-4 rounded-[22px] border border-[#E8ECF1] bg-bg-page p-3.5 shadow-[0_1px_2px_rgba(26,35,50,0.04),0_40px_80px_-40px_rgba(26,35,50,0.30)]">
          <div className="overflow-hidden rounded-[14px] border border-divider bg-bg-page">

            {/* Browser chrome bar */}
            <div className="flex h-9 items-center gap-1.5 border-b border-divider bg-white px-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-alert-red" />
              <span className="h-2.5 w-2.5 rounded-full bg-peach" />
              <span className="h-2.5 w-2.5 rounded-full bg-sage" />
              <span className="ml-3.5 font-mono text-[11.5px] text-text-secondary">
                atmosapp.dev/dashboard
              </span>
            </div>

            {/* Browser body */}
            <div className="grid min-h-[540px] grid-cols-[200px_1fr]">

              {/* Mini sidebar */}
              <aside className="flex flex-col gap-1 border-r border-divider bg-white px-3 py-[18px]">
                <div className="mb-[18px] flex items-center gap-2 px-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-gradient-to-br from-horizon-blue to-sage text-[13px] font-bold leading-none text-white">a</span>
                  <span className="text-[15px] font-semibold tracking-[-0.3px] text-text-primary">atmos</span>
                </div>
                <nav className="flex flex-col gap-0.5">
                  {NAV.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium ${
                        item.active
                          ? 'bg-[rgba(74,144,196,0.10)] font-semibold text-horizon-blue'
                          : 'text-text-secondary'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </div>
                  ))}
                </nav>
              </aside>

              {/* Main content */}
              <div className="overflow-hidden bg-bg-page p-[22px_24px]">
                {/* Page title */}
                <div className="mb-[18px] flex items-start justify-between">
                  <div>
                    <h4 className="text-[18px] font-semibold tracking-[-0.3px] text-text-primary">Dashboard</h4>
                    <div className="mt-0.5 text-[12px] text-text-secondary">Welcome back, Maya — here&apos;s your impact this month.</div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-divider bg-white px-2.5 py-1.5 text-[11px] text-text-primary">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B7A8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    This month
                  </div>
                </div>

                <StatCards />

                {/* Chart row */}
                <div className="mt-3.5 grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-3.5">
                  <WeeklyChart />
                  <TransportMix />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
