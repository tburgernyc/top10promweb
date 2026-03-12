'use client'

import { useState, useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { MapPin, ExternalLink, Search, ChevronDown } from 'lucide-react'

interface Store {
  name: string
  address: string
  city: string
  state: string
  zip: string
  website: string
  lat: number
  lng: number
}

interface StoreLocatorProps {
  stores: Store[]
}

const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AR: 'Arkansas', FL: 'Florida', GA: 'Georgia',
  IA: 'Iowa', IL: 'Illinois', IN: 'Indiana', KY: 'Kentucky',
  LA: 'Louisiana', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  NC: 'North Carolina', ND: 'North Dakota', NE: 'Nebraska', NH: 'New Hampshire',
  NY: 'New York', OH: 'Ohio', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', TN: 'Tennessee', TX: 'Texas', VT: 'Vermont',
  WI: 'Wisconsin',
}

export function StoreLocator({ stores }: StoreLocatorProps) {
  const shouldReduce = useReducedMotion()
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('')

  const states = useMemo(() => {
    const s = new Set(stores.map((st) => st.state).filter(Boolean))
    return Array.from(s).sort()
  }, [stores])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return stores.filter((s) => {
      if (stateFilter && s.state !== stateFilter) return false
      if (!q) return true
      return (
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
      )
    })
  }, [stores, search, stateFilter])

  const spring = { type: 'spring' as const, stiffness: 300, damping: 28 }

  return (
    <div className="space-y-6">
      {/* Search + Filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-platinum/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-ivory placeholder:text-platinum/30 focus:outline-none focus:border-gold/40 transition-colors"
          />
        </div>

        <div className="relative">
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-platinum/40 pointer-events-none" />
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-9 py-2.5 text-sm text-ivory focus:outline-none focus:border-gold/40 transition-colors cursor-pointer"
          >
            <option value="">All States</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {STATE_NAMES[st] ?? st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-platinum/40">
        {filtered.length} location{filtered.length !== 1 ? 's' : ''} found
        {stateFilter ? ` in ${STATE_NAMES[stateFilter] ?? stateFilter}` : ''}
      </p>

      {/* Store cards */}
      <div className="space-y-3">
        {filtered.map((store, i) => {
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${store.name}, ${store.address}, ${store.city}, ${store.state}`
          )}`

          return (
            <motion.div
              key={`${store.name}-${store.city}`}
              initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: Math.min(i * 0.03, 0.3) }}
              className="glass-light rounded-2xl p-4 flex items-start gap-4 border border-white/10 hover:border-gold/20 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={15} className="text-gold" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-ivory font-semibold text-sm leading-snug">{store.name}</h3>
                <p className="text-platinum/60 text-xs mt-0.5">
                  {store.address}
                  {store.city ? `, ${store.city}` : ''}
                  {store.state ? `, ${store.state}` : ''}
                  {store.zip ? ` ${store.zip}` : ''}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-platinum/60 hover:text-gold transition-colors"
                >
                  <ExternalLink size={11} />
                  Directions
                </a>
                {store.website && (
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gold/70 hover:text-gold transition-colors"
                  >
                    Website →
                  </a>
                )}
              </div>
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <div className="glass-light rounded-2xl p-10 text-center border border-white/10">
            <MapPin size={28} className="text-platinum/20 mx-auto mb-3" />
            <p className="text-ivory font-semibold text-sm">No locations found</p>
            <p className="text-platinum/50 text-xs mt-1">Try a different search or state filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
