import type { Metadata } from 'next'
import { StoreLocator } from '@/components/location/StoreLocator'
import storesRaw from '@/public/data/stores.json'

export const metadata: Metadata = {
  title: 'Store Locations | Top 10 Prom',
  description: 'Find your nearest Top 10 Prom authorized retailer. 50+ locations nationwide.',
}

function parseAddress(formatted: string) {
  // Decode HTML entities
  const decoded = formatted.replace(/&amp;/g, '&')
  // Try to extract "Street, City, STATE ZIP" or "Street, City, STATE ZIP, USA"
  const parts = decoded.split(',').map((p) => p.trim())
  // Last parts pattern: "STATE ZIP" or "STATE ZIP, USA"
  // Find the state/zip part
  let city = ''
  let state = ''
  let zip = ''
  let addressParts: string[] = []

  // Walk backwards to find state abbreviation (2 caps) + optional zip
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]
    // Skip "USA"
    if (/^USA$/i.test(p)) continue
    // Match "STATE ZIP" or "STATE"
    const stateZip = p.match(/^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/)
    if (stateZip) {
      state = stateZip[1]
      zip = stateZip[2]
      city = parts[i - 1] ?? ''
      addressParts = parts.slice(0, i - 1)
      break
    }
    // Match bare state abbreviation
    const stateOnly = p.match(/^([A-Z]{2})$/)
    if (stateOnly) {
      state = stateOnly[1]
      city = parts[i - 1] ?? ''
      addressParts = parts.slice(0, i - 1)
      break
    }
  }

  // If no state found, treat everything as address
  if (!state) {
    addressParts = parts
  }

  return {
    address: addressParts.join(', '),
    city,
    state,
    zip,
  }
}

const stores = storesRaw.map((s) => {
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

export default function BoutiquesPage() {
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
