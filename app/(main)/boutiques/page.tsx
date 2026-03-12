import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Boutique } from '@/types/index'
import { MapPin, Phone, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Locations',
  description: 'Find your nearest Top 10 Prom boutique. 5+ locations across the Atlanta metro area.',
}

export default async function BoutiquesPage() {
  const supabase = await createClient()

  const { data: boutiques } = await supabase
    .from('boutiques')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const list = (boutiques as Boutique[]) ?? []

  return (
    <div className="min-h-dvh pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-ivory">
            Our <span className="text-gold">Locations</span>
          </h1>
          <p className="text-platinum text-sm mt-2">
            Visit any of our boutiques — each carrying an exclusive curated selection.
          </p>
        </div>

        <div className="space-y-4">
          {list.map((boutique) => {
            const mapsUrl = boutique.address
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${boutique.address}, ${boutique.city}, ${boutique.state}`
                )}`
              : null

            return (
              <div
                key={boutique.id}
                className="glass-light rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-gold" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-ivory font-semibold">{boutique.name}</h2>
                      {boutique.address && (
                        <p className="text-sm text-platinum mt-0.5">
                          {boutique.address}
                          {boutique.city && `, ${boutique.city}`}
                          {boutique.state && `, ${boutique.state}`}
                          {boutique.zip && ` ${boutique.zip}`}
                        </p>
                      )}
                      {boutique.phone && (
                        <p className="text-sm text-platinum flex items-center gap-1.5 mt-1">
                          <Phone size={12} />
                          <a href={`tel:${boutique.phone}`} className="hover:text-gold transition-colors">
                            {boutique.phone}
                          </a>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {mapsUrl && (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-platinum hover:text-gold transition-colors"
                        >
                          <ExternalLink size={12} />
                          Directions
                        </a>
                      )}
                      <Link
                        href={`/boutiques/${boutique.slug}`}
                        className="text-xs text-gold hover:text-gold/80 transition-colors"
                      >
                        View store →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {list.length === 0 && (
            <p className="text-platinum text-center py-12">
              No boutiques found. Please check back soon.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
