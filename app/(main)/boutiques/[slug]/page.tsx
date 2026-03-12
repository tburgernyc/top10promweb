import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { DressCardGrid } from '@/components/catalog/DressCardGrid'
import { DressGridSkeleton } from '@/components/ui/Skeleton'
import type { Boutique, BoutiqueSettings } from '@/types/index'
import type { WeekHours } from '@/types/index'
import { MapPin, Phone, Clock, ExternalLink, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface BoutiquePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BoutiquePageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('boutiques')
    .select('name, city, state')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Boutique Not Found' }

  return {
    title: `${data.name} Boutique`,
    description: `Visit Top 10 Prom ${data.name} in ${data.city}, ${data.state}. Shop our exclusive prom dress collection.`,
  }
}

const DAY_LABELS: Record<keyof WeekHours, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}

function formatHours(h: WeekHours) {
  return (Object.keys(DAY_LABELS) as (keyof WeekHours)[]).map((day) => {
    const hours = h[day]
    return {
      label: DAY_LABELS[day],
      value: hours?.open ? `${hours.open} – ${hours.close}` : 'Closed',
      closed: !hours?.open,
    }
  })
}

export default async function BoutiquePage({ params }: BoutiquePageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: boutique } = await (supabase as any)
    .from('boutiques')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!boutique) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: settings } = await (supabase as any)
    .from('boutique_settings')
    .select('*')
    .eq('boutique_id', (boutique as Boutique).id)
    .single()

  const b = boutique as Boutique
  const s = settings as BoutiqueSettings | null
  const mapsUrl = b.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.address}, ${b.city}, ${b.state}`)}`
    : null
  const hours = s?.business_hours ? formatHours(s.business_hours as unknown as WeekHours) : null

  return (
    <div className="min-h-dvh pb-24">
      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-platinum">
          <Link href="/boutiques" className="hover:text-gold transition-colors">Locations</Link>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-ivory">{b.name}</span>
        </nav>

        {/* Store header */}
        <div className="glass-light rounded-2xl p-6 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-ivory">
                Top 10 Prom <span className="text-gold">{b.name}</span>
              </h1>
              {b.city && (
                <div className="flex items-center gap-1.5 text-platinum text-sm">
                  <MapPin size={14} className="text-gold" />
                  {b.address && `${b.address}, `}{b.city}{b.state && `, ${b.state}`}{b.zip && ` ${b.zip}`}
                </div>
              )}
              {b.phone && (
                <div className="flex items-center gap-1.5 text-platinum text-sm">
                  <Phone size={14} className="text-gold" />
                  <a href={`tel:${b.phone}`} className="hover:text-gold transition-colors">{b.phone}</a>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
                    <ExternalLink size={13} />
                    Get Directions
                  </Button>
                </a>
              )}
              <Link href={`/book?boutique=${b.id}`}>
                <Button variant="primary" size="sm" className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  Book Here
                </Button>
              </Link>
            </div>
          </div>

          {/* Hours */}
          {hours && (
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center gap-1.5 text-sm text-ivory mb-3">
                <Clock size={14} className="text-gold" />
                <span className="font-medium">Store Hours</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                {hours.map(({ label, value, closed }) => (
                  <div key={label} className="text-center">
                    <p className="text-xs text-platinum">{label}</p>
                    <p className={['text-xs font-medium mt-0.5', closed ? 'text-white/25' : 'text-ivory'].join(' ')}>
                      {closed ? '—' : value.replace(' – ', '\n')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Inventory */}
        <div className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-gold font-semibold uppercase tracking-widest mb-1">
                In Store
              </p>
              <h2 className="text-xl font-bold text-ivory">Available at {b.name}</h2>
            </div>
            <Link href={`/catalog?boutique=${b.id}`} className="text-sm text-gold hover:text-gold/80 transition-colors shrink-0">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Suspense fallback={<DressGridSkeleton count={8} />}>
              <DressCardGrid boutiqueId={b.id} limit={8} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
