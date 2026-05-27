const ITEMS = [
  { icon: '♥', text: 'Made with love for the planet' },
  { icon: '🔢', text: 'Carbon math, not estimates' },
  { icon: '🔒', text: 'Your data stays yours' },
  { icon: '🚫', text: 'No ads. Ever.' },
  { icon: '🌍', text: 'A personal project, in active development' },
]

export function LoveStrip() {
  return (
    <div className="border-y border-divider bg-[#FAFBFC] py-[22px]">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-10">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-between">
          {ITEMS.map((item) => (
            <span
              key={item.text}
              className="flex items-center gap-2 text-[12.5px] font-medium text-text-secondary"
            >
              <span aria-hidden className="text-[13px]">{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
