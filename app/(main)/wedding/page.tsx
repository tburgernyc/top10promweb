import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BridalHero } from '@/components/wedding/BridalHero'
import { WeddingDressGrid } from '@/components/wedding/WeddingDressGrid'
import { DressGridSkeleton } from '@/components/ui/Skeleton'
import { createClient } from '@/lib/supabase/server'
import type { Dress } from '@/types/index'

export const metadata: Metadata = {
  title: 'Wedding Collections | Top 10 Prom',
  description:
    'Find your perfect bridal gown and coordinate your entire wedding party at Top 10 Prom boutiques. Private 90-minute appointments available.',
}

async function WeddingDresses() {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('dresses')
    .select('*')
    .eq('is_active', true)
    .contains('event_types', '["wedding"]')
    .order('created_at', { ascending: false })
    .limit(24)

  const dresses: Dress[] = data ?? []

  return <WeddingDressGrid dresses={dresses} />
}

export default async function WeddingPage() {
  return (
    <div className="min-h-dvh pb-24">
      <BridalHero />

      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ivory">
            Bridal <span className="text-gold">Collections</span>
          </h2>
          <p className="text-platinum text-sm mt-1">
            Gowns curated for your forever moment.
          </p>
        </div>

        <Suspense fallback={<DressGridSkeleton count={8} />}>
          <WeddingDresses />
        </Suspense>
      </div>
    </div>
  )
}
