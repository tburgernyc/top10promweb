import type { Metadata } from 'next'
import { Suspense } from 'react'
import { FilterBar } from '@/components/catalog/FilterBar'
import { DressCardGrid } from '@/components/catalog/DressCardGrid'
import { DressGridSkeleton } from '@/components/ui/Skeleton'

export const metadata: Metadata = {
  title: 'Catalog',
  description: 'Browse our full collection of prom dresses. Filter by designer, color, and size. Reserve yours before another student at your school does.',
}

interface CatalogPageProps {
  searchParams: Promise<{
    designer?: string
    color?: string
    size?: string
    boutique?: string
  }>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { designer, color, boutique } = await searchParams

  return (
    <div className="min-h-dvh pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-[11px] text-gold font-semibold tracking-[0.22em] uppercase mb-1.5">Digital Showroom</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-ivory">
            The <span className="text-gold">Collection</span>
          </h1>
          <p className="text-platinum/70 text-sm mt-1">
            Every dress reserved exclusively for your school.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Suspense fallback={null}>
            <FilterBar />
          </Suspense>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Suspense fallback={<DressGridSkeleton count={12} />}>
            <DressCardGrid
              boutiqueId={boutique ?? null}
              color={color ?? null}
              designer={designer ?? null}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
