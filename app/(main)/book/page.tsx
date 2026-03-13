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
