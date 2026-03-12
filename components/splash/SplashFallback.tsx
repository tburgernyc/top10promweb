import { SplashOverlay } from './SplashOverlay'

export function SplashFallback() {
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
      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <SplashOverlay />
    </div>
  )
}
