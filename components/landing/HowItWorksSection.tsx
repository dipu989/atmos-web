const TRIPS = [
  { emoji: '🚗', bg: 'bg-[rgba(240,149,106,0.16)]', color: 'text-peach',  label: 'Home → Office',              kg: '2.8 kg', kgColor: 'text-peach' },
  { emoji: '🚆', bg: 'bg-[rgba(74,144,196,0.16)]',  color: 'text-horizon-blue', label: 'Mission St → Civic Center', kg: '0.5 kg', kgColor: 'text-text-primary' },
  { emoji: '🚲', bg: 'bg-[rgba(61,171,130,0.16)]',  color: 'text-sage',   label: 'Office → Lunch · Mira\'s',   kg: '0.0 kg', kgColor: 'text-sage' },
]

const STEPS = [
  {
    num: 'Step 01',
    title: 'Move like you normally do',
    body: 'Open the app once. From then on, Atmos detects when you\'re walking, biking, driving, or on transit — using motion sensors, not constant GPS.',
    visual: (
      <svg viewBox="0 0 320 160" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id="ping" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#4A90C4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4A90C4" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="80" r="60" fill="url(#ping)" />
        <circle cx="160" cy="80" r="42" fill="none" stroke="#4A90C4" strokeOpacity="0.35" strokeDasharray="3 5" />
        <rect x="138" y="44" width="44" height="72" rx="8" fill="#fff" stroke="#E8ECF1" />
        <rect x="144" y="54" width="32" height="50" rx="3" fill="#F5F7FA" />
        <circle cx="160" cy="111" r="2" fill="#E8ECF1" />
        <circle cx="160" cy="80" r="4" fill="#4A90C4" />
      </svg>
    ),
    visBg: 'bg-bg-page',
  },
  {
    num: 'Step 02',
    title: 'See trips appear automatically',
    body: 'Each trip is labelled with mode, distance, and a CO₂ estimate calibrated to your country\'s grid. Tweak anything that\'s off in one tap.',
    visual: (
      <div className="flex flex-col gap-1.5 p-4">
        {TRIPS.map((t) => (
          <div key={t.label} className="flex items-center gap-2.5 rounded-lg bg-bg-page px-2.5 py-2">
            <div className={`flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md text-[11px] ${t.bg} ${t.color}`}>
              {t.emoji}
            </div>
            <span className="flex-1 text-[11px] font-medium text-text-primary">{t.label}</span>
            <span className={`text-[11px] font-semibold ${t.kgColor}`}>{t.kg}</span>
          </div>
        ))}
      </div>
    ),
    visBg: 'bg-white',
  },
  {
    num: 'Step 03',
    title: 'Get one useful nudge a week',
    body: 'No streaks. No shaming. Just a quiet weekly read of your patterns, plus one realistic switch you could try — modelled against your own routes.',
    visual: (
      <div className="p-3.5">
        <div className="h-full rounded-[10px] border-l-4 border-sage bg-[#FAFBFC] p-3.5">
          <div className="text-[9.5px] font-bold uppercase tracking-[0.5px] text-sage">
            Tip · Week of May 11
          </div>
          <div className="mt-1.5 text-[13px] font-semibold text-text-primary">
            Try the train on Fridays
          </div>
          <div className="mt-1 text-[11px] leading-[1.45] text-text-secondary">
            Your Friday commute is 40% above average. The 8:12 Caltrain would cut it roughly in half.
          </div>
          <div className="mt-2.5">
            <span className="rounded-full bg-[rgba(61,171,130,0.12)] px-2 py-0.5 text-[10px] font-semibold text-sage">
              Save ~3.2 kg/wk
            </span>
          </div>
        </div>
      </div>
    ),
    visBg: 'bg-white',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how" className="bg-bg-page py-[110px]">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-10">

        {/* Section header */}
        <div className="mx-auto mb-14 max-w-[720px] text-center">
          <p className="text-[11.5px] font-semibold uppercase tracking-[1.4px] text-horizon-blue">
            How it works
          </p>
          <h2 className="mt-3.5 font-serif text-[44px] font-medium leading-[1.05] tracking-[-1.2px] text-text-primary [text-wrap:balance]">
            Three quiet steps.{' '}
            <em className="italic text-sage">No homework.</em>
          </h2>
          <p className="mt-4 text-[16px] leading-[1.55] text-text-secondary">
            Atmos runs in the background. You go about your day. We do the math and the
            modelling — you get the picture.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="relative rounded-[18px] border border-divider bg-white p-7"
            >
              {/* Step number with leading line */}
              <span className="inline-flex items-center gap-2 font-serif text-[14px] font-semibold text-horizon-blue">
                <span aria-hidden className="block h-px w-[22px] bg-horizon-blue" />
                {step.num}
              </span>

              <h3 className="mt-3.5 mb-2.5 text-[20px] font-semibold leading-tight tracking-[-0.4px] text-text-primary">
                {step.title}
              </h3>
              <p className="text-[14px] leading-[1.55] text-text-secondary">
                {step.body}
              </p>

              {/* Visual block */}
              <div className={`relative mt-6 h-[160px] overflow-hidden rounded-xl border border-divider ${step.visBg}`}>
                {step.visual}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
