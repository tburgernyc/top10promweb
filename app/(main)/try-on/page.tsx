import type { Metadata } from 'next'
import { VirtualTryOn } from '@/components/tryon/VirtualTryOn'

export const metadata: Metadata = {
  title: 'Virtual Try-On | Top 10 Prom',
  description: 'Upload your photo and see yourself in any prom dress. Our virtual try-on lets you compare looks side-by-side before booking your fitting appointment.',
}

export default function TryOnPage() {
  return (
    <div className="relative min-h-dvh pb-24">

      {/* Ambient video background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <video autoPlay muted loop playsInline aria-hidden="true"
          className="w-full h-full object-cover opacity-[0.12]">
          <source src="/video/splash.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0.82) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.88) 100%)' }} />
      </div>
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <p className="text-[11px] text-gold font-semibold tracking-[0.22em] uppercase mb-1">New Feature</p>
          <h1 className="text-3xl sm:text-4xl font-black text-ivory">
            Virtual <span className="text-gold">Try-On</span>
          </h1>
          <p className="text-platinum/70 text-sm mt-2 max-w-lg">
            Upload a full-length photo, browse our catalog, and see yourself in any dress — side-by-side — before you ever step in the store.
          </p>
        </div>
        <VirtualTryOn />
      </div>
    </div>
  )
}
