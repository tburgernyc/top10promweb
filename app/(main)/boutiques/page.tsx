import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { StoreLocator } from '@/components/location/StoreLocator'
import storesRaw from '@/public/data/stores.json'

export const metadata: Metadata = {
  title: 'Store Locations | Top 10 Prom',
  description: 'Find your nearest Top 10 Prom authorized retailer. 50+ locations nationwide.',
}

// Fallback parser for static JSON — used only if Supabase returns nothing.
function parseAddress(formatted: string) {
  const decoded = formatted.replace(/&amp;/g, '&')
  const parts = decoded.split(',').map((p) => p.trim())
  let city = '', state = '', zip = '', addressParts: string[] = []
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]
    if (/^USA$/i.test(p)) continue
    const stateZip = p.match(/^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/)
    if (stateZip) {
      state = stateZip[1]; zip = stateZip[2]
      city = parts[i - 1] ?? ''; addressParts = parts.slice(0, i - 1)
      break
    }
    const stateOnly = p.match(/^([A-Z]{2})$/)
    if (stateOnly) {
      state = stateOnly[1]
      city = parts[i - 1] ?? ''; addressParts = parts.slice(0, i - 1)
      break
    }
  }
  if (!state) addressParts = parts
  return { address: addressParts.join(', '), city, state, zip }
}

const STATIC_STORES = storesRaw.map((s) => {
  const { address, city, state, zip } = parseAddress(s.FormattedAddress)
  return {
    name: s.Name.replace(/&amp;/g, '&'),
    address,
    city,
    state,
    zip,
    website: s.Website?.trim() ?? '',
    lat: s.Lat,
    lng: s.Lng,
  }
})

export default async function BoutiquesPage() {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('boutiques')
    .select('name, address, city, state, zip, lat, lng')
    .eq('is_active', true)
    .order('state', { ascending: true })
    .order('name', { ascending: true }) as {
      data: Array<{
        name: string
        address: string | null
        city: string | null
        state: string | null
        zip: string | null
        lat: number | null
        lng: number | null
      }> | null
    }

  const stores =
    data && data.length > 0
      ? data.map((b) => ({
          name: b.name,
          address: b.address ?? '',
          city: b.city ?? '',
          state: b.state ?? '',
          zip: b.zip ?? '',
          website: '',
          lat: b.lat ?? 0,
          lng: b.lng ?? 0,
        }))
      : STATIC_STORES

  return (
    <div className="min-h-dvh pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-ivory">
            Store <span className="text-gold">Locations</span>
          </h1>
          <p className="text-platinum text-sm mt-2">
            50+ authorized Top 10 Prom retailers nationwide — each offering an exclusive curated selection with our no-duplicate school guarantee.
          </p>
        </div>

        <StoreLocator stores={stores} />
      </div>
    </div>
  )
}
