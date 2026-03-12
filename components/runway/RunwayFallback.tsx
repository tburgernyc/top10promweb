import { SplashOverlay } from '@/components/splash/SplashOverlay'

/**
 * Full-bleed fallback for when:
 * - WebGL2 is unavailable
 * - prefers-reduced-motion is set
 * - RunwayScene fails to load
 *
 * Uses the same 2D overlay as the interactive splash.
 *
 * Asset note: Place runway fallback images at:
 *   /public/splash/fallback.avif  (< 500 KB)
 *   /public/splash/fallback.webp  (< 500 KB)
 *   /public/splash/fallback.jpg   (progressive JPEG fallback)
 */
export function RunwayFallback() {
  return (
    <div className="relative w-full h-dvh overflow-hidden bg-onyx">
      <picture>
        <source srcSet="/splash/fallback.avif" type="image/avif" />
        <source srcSet="/splash/fallback.webp" type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/splash/fallback.jpg"
          alt="Top 10 Prom runway"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
      </picture>
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <SplashOverlay />
    </div>
  )
}
