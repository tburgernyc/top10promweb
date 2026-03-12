import type { Metadata } from 'next'
import { Hero } from '@/components/landing/Hero'
import { StatsBar } from '@/components/landing/StatsBar'
import { FeaturedDresses } from '@/components/landing/FeaturedDresses'
import { NoDuplicatePromo } from '@/components/landing/NoDuplicatePromo'
import { TrustSection } from '@/components/landing/TrustSection'
import { DesignerStrip } from '@/components/landing/DesignerStrip'
import { DesignersSection } from '@/components/landing/DesignersSection'

export const metadata: Metadata = {
  title: 'Top 10 Prom | Digital Showroom',
  description:
    'Your moment. Your dress. Your night. Shop prom dresses with our no-duplicate guarantee — one dress per school, guaranteed. 5+ boutique locations in Atlanta.',
}

export default async function HomePage() {
  return (
    <div className="min-h-dvh pb-24">

      {/* Hero — full viewport video parallax */}
      <Hero />

      {/* Stats strip — glass bar anchored directly below hero */}
      <StatsBar />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 mt-20 space-y-24">

        {/* Featured dress grid */}
        <FeaturedDresses />

        {/* No-Duplicate guarantee — editorial split */}
        <NoDuplicatePromo />

        {/* Why Top 10 Prom — bento grid */}
        <TrustSection />

        {/* Designer showcase */}
        <DesignersSection />

      </div>

      {/* Designer brand marquee — full bleed */}
      <div className="mt-24">
        <DesignerStrip />
      </div>

    </div>
  )
}
