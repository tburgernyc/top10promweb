import type { Metadata } from 'next'
import { VirtualTryOn } from '@/components/tryon/VirtualTryOn'

export const metadata: Metadata = {
  title: 'Virtual Try-On | Top 10 Prom',
  description: 'Upload your photo and see yourself in any prom dress. Our virtual try-on lets you compare looks side-by-side before booking your fitting appointment.',
}

export default function TryOnPage() {
  return (
    <div className="min-h-dvh pb-24">
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
