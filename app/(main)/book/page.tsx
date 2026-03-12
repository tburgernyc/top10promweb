import type { Metadata } from 'next'
import { BookingWizard } from '@/components/booking/BookingWizard'

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Book a fitting appointment at your nearest Top 10 Prom boutique.',
}

interface BookPageProps {
  searchParams: Promise<{ dress?: string }>
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const { dress } = await searchParams

  return (
    <div className="min-h-dvh pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ivory">
            Book Your <span className="text-gold">Appointment</span>
          </h1>
          <p className="text-platinum mt-2 text-sm">
            One dress. One school. One night to remember.
          </p>
        </div>
      </div>
      <BookingWizard initialDressId={dress} />
    </div>
  )
}
