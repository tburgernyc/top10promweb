'use client'

const DESIGNERS = [
  'Jovani', 'Sherri Hill', 'La Femme', 'Mac Duggal', 'Terani Couture',
  'Faviana', 'Ellie Wilde', 'Portia & Scarlett', 'Vienna', 'Alyce Paris',
  'Morilee', 'Jasz Couture', 'Amarra', 'Ava Presley', 'Rachel Allan',
]

// Duplicate for seamless loop
const TRACK = [...DESIGNERS, ...DESIGNERS]

export function DesignerStrip() {
  return (
    <div className="relative overflow-hidden border-y border-white/6 py-4 bg-gradient-to-r from-onyx via-white/[0.02] to-onyx">
      {/* Fade masks on both edges */}
      <div className="pointer-events-none absolute left-0 inset-y-0 w-24 z-10"
        style={{ background: 'linear-gradient(to right, #050505, transparent)' }} />
      <div className="pointer-events-none absolute right-0 inset-y-0 w-24 z-10"
        style={{ background: 'linear-gradient(to left, #050505, transparent)' }} />

      <div className="marquee-track flex items-center gap-0 whitespace-nowrap w-max">
        {TRACK.map((name, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-8">
            <span className="text-sm font-semibold text-platinum/50 tracking-widest uppercase hover:text-gold transition-colors cursor-default">
              {name}
            </span>
            <span className="w-1 h-1 rounded-full bg-gold/30 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}
