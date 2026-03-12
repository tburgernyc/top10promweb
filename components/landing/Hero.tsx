'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

// ── Deterministic config (no Math.random at render — hydration safe) ──────────
const BOKEH = [
  { size: 640, x: 16, y: 2,  color: 'rgba(212,175,55,0.08)',  blur: 140 },
  { size: 440, x: 78, y: 18, color: 'rgba(212,175,55,0.10)',  blur: 95  },
  { size: 300, x: 52, y: 62, color: 'rgba(192,192,192,0.05)', blur: 65  },
  { size: 540, x: 88, y: 65, color: 'rgba(212,175,55,0.06)',  blur: 115 },
  { size: 230, x: 6,  y: 78, color: 'rgba(212,175,55,0.09)',  blur: 55  },
  { size: 370, x: 36, y: 42, color: 'rgba(192,192,192,0.04)', blur: 85  },
]

const PARTICLES = [
  { x: 13, y: 21, s: 2.5 }, { x: 83, y: 12, s: 2.0 },
  { x: 47, y: 37, s: 3.0 }, { x: 70, y: 57, s: 1.5 },
  { x: 26, y: 71, s: 2.0 }, { x: 63, y: 83, s: 2.5 },
  { x: 92, y: 43, s: 1.5 }, { x: 4,  y: 54, s: 2.0 },
  { x: 56, y: 14, s: 1.5 }, { x: 34, y: 89, s: 2.0 },
  { x: 75, y: 31, s: 1.5 }, { x: 20, y: 48, s: 2.5 },
]

const RUNWAY_LINES = [-3, -2, -1, 0, 1, 2, 3]
const RUNWAY_SCANS = [0.18, 0.32, 0.47, 0.62]
const STATS = [
  { value: '1,000+', label: 'Dresses' },
  { value: '5+',     label: 'Boutiques' },
  { value: '100%',   label: 'No Duplicates' },
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef      = useRef<HTMLDivElement>(null)
  const bokehRef   = useRef<HTMLDivElement>(null)
  const runwayRef  = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const section = sectionRef.current
    if (!section) return

    // ── Reduced-motion: just show everything ────────────────────────────────
    if (shouldReduce) {
      gsap.set(
        [bgRef.current, bokehRef.current, runwayRef.current, contentRef.current],
        { opacity: 1, clearProps: 'transform' }
      )
      return
    }

    const ctx = gsap.context(() => {

      // ── ENTRANCE TIMELINE ──────────────────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl
        // Atmosphere zooms in
        .from(bgRef.current, { scale: 1.14, opacity: 0, duration: 2.2 })
        .from(bokehRef.current, { scale: 0.82, opacity: 0, duration: 1.8 }, '<0.1')
        // Runway lines draw up from bottom
        .from('.rl', {
          scaleY: 0,
          opacity: 0,
          transformOrigin: 'bottom center',
          duration: 1.3,
          stagger: 0.07,
        }, '-=1.4')
        .from('.rscan', { scaleX: 0, opacity: 0, transformOrigin: 'center', duration: 0.8, stagger: 0.1 }, '-=0.8')
        // Badge drops in
        .from('.hbadge', { y: -32, opacity: 0, duration: 0.65, ease: 'back.out(1.8)' }, '-=0.4')
        // Title lines clip-reveal up
        .from('.hl1', { y: 100, opacity: 0, duration: 0.9 }, '-=0.3')
        .from('.hl2', { y: 100, opacity: 0, duration: 0.9 }, '-=0.72')
        .from('.hl3', { y: 100, opacity: 0, duration: 0.9 }, '-=0.72')
        // Subtext + CTAs + stats cascade
        .from('.hsub',  { y: 26, opacity: 0, duration: 0.75 }, '-=0.55')
        .from('.hcta',  { y: 20, opacity: 0, duration: 0.65, stagger: 0.13 }, '-=0.5')
        .from('.hstat', { y: 16, opacity: 0, duration: 0.55, stagger: 0.10 }, '-=0.45')
        // Particles pop in
        .from('.hparticle', {
          scale: 0, opacity: 0, duration: 1.1,
          ease: 'back.out(2.2)',
          stagger: { amount: 1.4, from: 'random' },
        }, '-=0.9')

      // ── SCROLL PARALLAX ────────────────────────────────────────────────────
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.6,
        onUpdate: ({ progress: p }) => {
          gsap.set(bgRef.current,      { y: p * 65 })
          gsap.set(bokehRef.current,   { y: p * 120 })
          gsap.set(runwayRef.current,  { y: p * 195, opacity: 1 - p * 2.1 })
          gsap.set(contentRef.current, { y: p * 230, opacity: 1 - p * 2.4 })
        },
      })

      // ── MOUSE 3D PARALLAX ──────────────────────────────────────────────────
      let mx = 0, my = 0
      let bgX = 0, bgY = 0
      let obX = 0, obY = 0
      let rwX = 0, rwY = 0
      let rafId: number

      const lerp = (a: number, b: number, t: number) => a + (b - a) * t

      function onMouse(e: MouseEvent) {
        const r = section!.getBoundingClientRect()
        mx = ((e.clientX - r.left) / r.width  - 0.5) * 2  // -1 → +1
        my = ((e.clientY - r.top)  / r.height - 0.5) * 2
      }

      function tick() {
        // Smooth lerp toward target
        bgX = lerp(bgX, mx * 14, 0.032)
        bgY = lerp(bgY, my *  9, 0.032)
        obX = lerp(obX, mx * 30, 0.050)
        obY = lerp(obY, my * 20, 0.050)
        rwX = lerp(rwX, mx * 50, 0.068)
        rwY = lerp(rwY, my * 34, 0.068)

        // Background: subtle 3D perspective tilt
        gsap.set(bgRef.current, {
          rotateY:  bgX * 1.1,
          rotateX: -bgY * 0.7,
        })
        // Bokeh orbs: 2D drift
        gsap.set(bokehRef.current, { x: obX, y: obY })
        // Runway: slightly faster drift
        gsap.set(runwayRef.current, { x: rwX * 0.5, y: rwY * 0.3 })

        rafId = requestAnimationFrame(tick)
      }

      section.addEventListener('mousemove', onMouse, { passive: true })
      rafId = requestAnimationFrame(tick)

      // ── FLOATING PARTICLES (continuous) ────────────────────────────────────
      gsap.to('.hparticle', {
        y: 'random(-20, 20)',
        x: 'random(-14, 14)',
        opacity: 'random(0.15, 0.65)',
        duration: 'random(3, 6)',
        ease: 'sine.inOut',
        stagger: { amount: 5, from: 'random' },
        repeat: -1,
        yoyo: true,
      })

      return () => {
        section.removeEventListener('mousemove', onMouse)
        cancelAnimationFrame(rafId)
      }
    }, section)

    return () => ctx.revert()
  }, [shouldReduce])

  return (
    <section
      ref={sectionRef}
      className="relative h-dvh min-h-[600px] flex items-center justify-center overflow-hidden bg-onyx"
      style={{ perspective: '1100px' }}
    >

      {/* ── Layer 1 · Atmospheric depth hazes ── */}
      <div
        ref={bgRef}
        className="absolute inset-[-8%] pointer-events-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Gold crown haze */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 78% 58% at 50% -2%, rgba(212,175,55,0.22) 0%, transparent 65%)',
        }} />
        {/* Platinum corner shimmer */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 48% 42% at 88% 88%, rgba(192,192,192,0.07) 0%, transparent 55%)',
        }} />
        {/* Warm left accent */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 32% 32% at 8% 52%, rgba(212,175,55,0.05) 0%, transparent 60%)',
        }} />
      </div>

      {/* ── Layer 2 · Bokeh depth orbs ── */}
      <div ref={bokehRef} className="absolute inset-0 pointer-events-none">
        {BOKEH.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.size, height: b.size,
              left: `${b.x}%`, top: `${b.y}%`,
              background: b.color,
              filter: `blur(${b.blur}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* ── Layer 3 · Runway perspective grid ── */}
      <div ref={runwayRef} className="absolute inset-0 pointer-events-none">
        {/* Converging vertical lines */}
        {RUNWAY_LINES.map((i) => (
          <div
            key={i}
            className="rl absolute bottom-0"
            style={{
              left: `calc(50% + ${i * 5.8}%)`,
              width: '1px',
              height: '60%',
              background: `linear-gradient(to top, rgba(212,175,55,${0.24 - Math.abs(i) * 0.032}), transparent)`,
              transform: `perspective(600px) rotateX(28deg) skewX(${i * 3.8}deg)`,
              transformOrigin: 'bottom center',
            }}
          />
        ))}
        {/* Horizontal scan lines */}
        {RUNWAY_SCANS.map((y, i) => (
          <div
            key={i}
            className="rscan absolute w-full"
            style={{
              bottom: `${y * 60}%`,
              height: '1px',
              opacity: 0.55 - i * 0.1,
              background:
                'linear-gradient(to right, transparent 4%, rgba(212,175,55,0.14) 28%, rgba(212,175,55,0.22) 50%, rgba(212,175,55,0.14) 72%, transparent 96%)',
            }}
          />
        ))}
      </div>

      {/* ── Layer 4 · Gold dust particles ── */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="hparticle absolute rounded-full bg-gold"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, opacity: 0.38 }}
          />
        ))}
      </div>

      {/* ── Layer 5 · Hero content ── */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-6"
      >
        {/* Eyebrow badge */}
        <div className="hbadge inline-flex items-center gap-2 text-[11px] font-semibold text-gold tracking-[0.2em] uppercase bg-gold/10 border border-gold/25 rounded-full px-5 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          5+ Boutique Locations · Atlanta Metro
        </div>

        {/* Title — each line clipped for wipe-up reveal */}
        <div className="space-y-0">
          <div className="overflow-hidden leading-none">
            <h1 className="hl1 font-black tracking-tight text-[clamp(2.8rem,8vw,6rem)] text-ivory leading-[0.92]">
              Your Moment.
            </h1>
          </div>
          <div className="overflow-hidden leading-none">
            <h1 className="hl2 font-black tracking-tight text-[clamp(2.8rem,8vw,6rem)] text-gold italic leading-[0.92]">
              Your Dress.
            </h1>
          </div>
          <div className="overflow-hidden leading-none">
            <h1 className="hl3 font-black tracking-tight text-[clamp(2.8rem,8vw,6rem)] text-ivory leading-[0.92]">
              Your Night.
            </h1>
          </div>
        </div>

        {/* Sub copy */}
        <p className="hsub text-platinum/75 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
          Premium prom boutiques with a no-duplicate guarantee.
          <br className="hidden sm:block" />
          One dress. One school. One night to remember.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <Link
            href="/catalog"
            className="hcta inline-flex items-center justify-center font-semibold text-sm px-9 py-4 rounded-2xl bg-gold text-onyx hover:bg-[#c9a227] active:scale-[0.97] transition-all min-w-[190px]"
          >
            Shop the Collection
          </Link>
          <Link
            href="/book"
            className="hcta inline-flex items-center justify-center font-medium text-sm px-9 py-4 rounded-2xl glass-light border border-white/10 text-ivory hover:bg-white/10 active:scale-[0.97] transition-all min-w-[190px]"
          >
            Book Appointment
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-10 pt-1">
          {STATS.map(({ value, label }) => (
            <div key={label} className="hstat text-center">
              <p className="text-2xl font-black text-gold">{value}</p>
              <p className="text-[10px] text-platinum/55 tracking-[0.15em] uppercase mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      {!shouldReduce && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 select-none pointer-events-none">
          <span className="text-[9px] text-platinum tracking-[0.35em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      )}
    </section>
  )
}
