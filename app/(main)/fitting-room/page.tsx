import type { Metadata } from 'next'
import { Suspense } from 'react'
import { FittingRoomSession } from '@/components/catalog/FittingRoomSession'
import { DressGridSkeleton } from '@/components/ui/Skeleton'

export const metadata: Metadata = {
  title: 'My Fitting Room',
  description: 'Review your shortlisted dresses and book your appointment.',
}

export default async function FittingRoomPage() {
  return (
    <div className="min-h-dvh pb-24">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ivory">
            Virtual <span className="text-gold">Fitting Room</span>
          </h1>
          <p className="text-platinum text-sm mt-1">
            Try on your shortlisted dresses — upload a photo to see yourself in each look.
          </p>
        </div>

        <Suspense fallback={<DressGridSkeleton count={4} />}>
          <FittingRoomSession />
        </Suspense>
      </div>
    </div>
  )
}
