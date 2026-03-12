'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { RunwayFallback } from '@/components/runway/RunwayFallback'

// 3D scene: dynamically imported, NO SSR
const RunwayScene = dynamic(
  () =>
    import('@/components/runway/RunwayScene').then((m) => ({
      default: m.RunwayScene,
    })),
  {
    ssr: false,
    loading: () => (
      // Loading state: onyx bg + centered logo + gold progress ring
      <div className="w-full h-dvh bg-onyx flex flex-col items-center justify-center gap-6">
        <p className="text-gold text-3xl font-bold tracking-[0.3em]">TOP 10 PROM</p>
        <div
          className="w-12 h-12 rounded-full border-2 border-gold/20 border-t-gold animate-spin"
          aria-label="Loading 3D runway…"
          role="status"
        />
      </div>
    ),
  }
)

export default function SplashPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [useWebGL, setUseWebGL] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Returning visitor — skip directly to home
    if (sessionStorage.getItem('has_entered')) {
      router.replace('/home')
      return
    }

    // WebGL2 detection
    let webGLSupported = false
    try {
      const canvas = document.createElement('canvas')
      webGLSupported = !!(
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        (canvas.getContext as (id: string) => unknown | null)('experimental-webgl')
      )
    } catch {
      webGLSupported = false
    }

    const mobile = window.innerWidth < 768
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Use 3D scene only when: WebGL available, no reduced motion preference
    setUseWebGL(webGLSupported && !reducedMotion)
    setIsMobile(mobile)
    setReady(true)
  }, [router])

  // Blank while checking sessionStorage (avoids flash of splash on return visits)
  if (!ready) return null

  if (!useWebGL) return <RunwayFallback />

  return <RunwayScene isMobile={isMobile} />
}
