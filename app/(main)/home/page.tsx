import type { Metadata } from 'next'
import { Hero } from '@/components/landing/Hero'
import { NoDuplicatePromo } from '@/components/landing/NoDuplicatePromo'
import { FeaturedDresses } from '@/components/landing/FeaturedDresses'
import { TrustSection } from '@/components/landing/TrustSection'

export const metadata: Metadata = {
  title: 'Top 10 Prom | Digital Showroom',
  description:
    'Your moment. Your dress. Your night. Shop prom dresses with our no-duplicate guarantee — one dress per school, guaranteed. 5+ boutique locations in Atlanta.',
}

export default async function HomePage() {
  return (
    <div className="min-h-dvh pb-24">
      {/* Hero — full viewport */}
      <Hero />

      {/* NoDuplicate promo — ABOVE FOLD (directly after hero) */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 relative z-10">
        <NoDuplicatePromo />
      </div>

      {/* Featured dresses — nearest store context handled client-side via Suspense */}
      <div className="max-w-7xl mx-auto px-4 mt-16 space-y-16">
        <FeaturedDresses />
        <TrustSection />
      </div>
    </div>
  )
}
