import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { Sparkles, ShieldCheck } from 'lucide-react'
import { DressCardGrid } from '@/components/catalog/DressCardGrid'
import { DressGridSkeleton } from '@/components/ui/Skeleton'
import { NoDuplicatePromo } from '@/components/landing/NoDuplicatePromo'

export const metadata: Metadata = {
  title: 'Prom Dresses | Top 10 Prom',
  description:
    'Shop prom dresses with our no-duplicate guarantee — one dress per school, guaranteed. Book your private fitting appointment today.',
}

export default async function PromPage() {
  return (
    <div className="min-h-dvh pb-24">
      {/* Hero */}
      <section className="relative min-h-[60dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-onyx via-onyx/95 to-onyx" />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(212,175,55,0.15) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-medium">
            <Sparkles size={12} />
            Prom 2026 Collection
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ivory leading-tight tracking-tight">
              Your Night.
              <span className="block text-gold">Your Dress.</span>
              <span className="block">Only Yours.</span>
            </h1>
            <p className="text-lg text-platinum max-w-xl mx-auto leading-relaxed">
              Every dress reserved exclusively for your school — so no one else
              shows up in the same gown.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/catalog?event_type=prom"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gold text-onyx font-semibold text-base hover:bg-[#c9a227] transition-colors"
            >
              <Sparkles size={18} />
              Browse Prom Dresses
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl glass-light border border-white/10 text-ivory font-medium text-base hover:bg-white/10 transition-colors"
            >
              Book a Fitting
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-platinum/60">
            <ShieldCheck size={14} className="text-gold/60" />
            No-duplicate guarantee — one dress per school, per prom night
          </div>
        </div>
      </section>

      {/* NoDuplicate promo */}
      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
        <NoDuplicatePromo />
      </div>

      {/* Dress grid */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ivory">
            Prom <span className="text-gold">Collection</span>
          </h2>
          <p className="text-platinum text-sm mt-1">
            Gowns reserved exclusively for your school.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Suspense fallback={<DressGridSkeleton count={12} />}>
            <DressCardGrid eventType="prom" limit={24} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
