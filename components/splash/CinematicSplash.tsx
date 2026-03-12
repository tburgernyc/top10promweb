'use client'

import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplashOverlay } from './SplashOverlay'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

const LAYERS = [
  { src: '/splash/layer-bg.avif',         dataZEnd: 0,    alt: '' },
  { src: '/splash/layer-mid.png',          dataZEnd: 400,  alt: '' },
  { src: '/splash/layer-model.png',        dataZEnd: 900,  alt: '' },
  { src: '/splash/layer-foreground.png',   dataZEnd: 1400, alt: '' },
]

export function CinematicSplash() {
  const smoother = useRef<ScrollSmoother | null>(null)

  useGSAP(() => {
    smoother.current = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.4,
      effects: true,
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#landingScene',
        start: 'top top',
        end: '+=280%',
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
      },
    })

    // Phase 1→2 (pos 0): Fly through layers
    const layers = gsap.utils.toArray<HTMLElement>('.z-layer')
    layers.forEach((layer) => {
      const zEnd = Number(layer.dataset.zEnd ?? 0)
      tl.to(layer, { z: zEnd, ease: 'none' }, 0)
    })

    // Phase 2 (pos 0): Title splits
    tl.to('.title-left',  { x: '-40vw', opacity: 0, ease: 'power2.in' }, 0)
    tl.to('.title-right', { x: '40vw',  opacity: 0, ease: 'power2.in' }, 0)

    // Phase 3 (pos 0.62): Gold flash break-through
    tl.to('#flashOverlay', { opacity: 1, duration: 0.08, ease: 'power2.in' }, 0.62)

    // Phase 3 (pos 0.70): Flash fades
    tl.to('#flashOverlay', { opacity: 0, duration: 0.15, ease: 'power2.out' }, 0.70)

    // Phase 3→4 (pos 0.72): Scene dissolves
    tl.to('#zStage', { opacity: 0, scale: 1.08, ease: 'power1.in' }, 0.72)

    // Phase 4 (pos 0.80): Homepage reveals
    tl.to('.homepage-content', { opacity: 1, y: 0, ease: 'power2.out' }, 0.80)

    return () => {
      smoother.current?.kill()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  })

  // Mouse parallax — desktop
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (window.scrollY > 50) return
      const layers = document.querySelectorAll<HTMLElement>('.z-layer')
      layers.forEach((layer, i) => {
        const depth = i + 1
        const x = (e.clientX / window.innerWidth  - 0.5) * depth * 0.015 * 60
        const y = (e.clientY / window.innerHeight - 0.5) * depth * 0.015 * 40
        gsap.to(layer, { x, y, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
      })
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  // Gyroscope parallax — mobile
  useEffect(() => {
    function onOrientation(e: DeviceOrientationEvent) {
      const beta  = e.beta  ?? 0  // front-back tilt
      const gamma = e.gamma ?? 0  // left-right tilt
      const layers = document.querySelectorAll<HTMLElement>('.z-layer')
      layers.forEach((layer, i) => {
        const depth = i + 1
        const x = gamma * depth * 0.8 * 12 * 0.01
        const y = beta  * depth * 0.8 * 12 * 0.01
        gsap.to(layer, { x, y, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
      })
    }

    async function requestGyro() {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        // @ts-expect-error — iOS 13+ permission API
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        try {
          // @ts-expect-error — iOS 13+ permission API
          const perm = await DeviceOrientationEvent.requestPermission()
          if (perm === 'granted') {
            window.addEventListener('deviceorientation', onOrientation)
          }
        } catch {
          // permission denied or unavailable — silent fallback
        }
      } else {
        window.addEventListener('deviceorientation', onOrientation)
      }
    }

    requestGyro()
    return () => window.removeEventListener('deviceorientation', onOrientation)
  }, [])

  return (
    <div id="smooth-wrapper" className="overflow-hidden">
      <div id="smooth-content">
        {/* ── Landing scene ─────────────────────────────── */}
        <section
          id="landingScene"
          className="landing-scene"
          aria-label="Top 10 Prom cinematic entrance"
        >
          <div id="zStage" className="z-stage">
            {LAYERS.map((layer, i) => (
              <div
                key={layer.src}
                className="z-layer"
                data-z-end={layer.dataZEnd}
                aria-hidden="true"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={layer.src} alt={layer.alt} loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
            ))}
          </div>

          {/* Gold flash overlay */}
          <div id="flashOverlay" className="flash-overlay" aria-hidden="true" />

          {/* Title that splits apart */}
          <div className="landing-title" aria-hidden="true">
            <span className="title-left">YOUR MOMENT.</span>
            <span className="title-right">YOUR DRESS.</span>
          </div>

          {/* Interactive overlay: logo, CTA, event selector */}
          <SplashOverlay />
        </section>

        {/* ── Homepage content revealed after animation ── */}
        <section
          className="homepage-content"
          aria-label="Welcome to Top 10 Prom"
        >
          <div className="flex flex-col items-center justify-center min-h-dvh gap-8 px-6 text-center">
            <p className="text-gold text-4xl font-bold tracking-widest">TOP 10 PROM</p>
            <p className="text-ivory/80 text-lg max-w-md">
              Browse our exclusive collection — one dress per school, guaranteed.
            </p>
            <a
              href="/catalog"
              className="bg-gold text-onyx font-semibold px-10 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Browse the Collection
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
