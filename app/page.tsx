'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SplashOverlay } from '@/components/splash/SplashOverlay'

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    // Returning visitor — skip directly to home
    if (sessionStorage.getItem('has_entered')) {
      router.replace('/home')
    }
  }, [router])

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-onyx">

      {/* Full-screen video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/video/splash.mp4" type="video/mp4" />
      </video>

      {/* Multi-stop dark scrim — keeps text readable over any video frame */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,5,5,0.45) 0%, rgba(5,5,5,0.20) 40%, rgba(5,5,5,0.55) 80%, rgba(5,5,5,0.80) 100%)',
        }}
      />

      {/* Gold vignette edge */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(5,5,5,0.65) 100%)',
        }}
      />

      {/* 2D overlay — logo, event selector, Enter CTA */}
      <SplashOverlay />
    </div>
  )
}
