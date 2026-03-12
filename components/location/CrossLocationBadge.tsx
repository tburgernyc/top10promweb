'use client'

import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import type { BoutiqueGeo } from '@/lib/geo'
import { sortByProximity, requestGeolocation, formatDistance } from '@/lib/geo'
import { useShopStore } from '@/lib/store/shopStore'

interface CrossLocationBadgeProps {
  dressId: string
  /** Current active boutique — if the dress is here, don't show the badge */
  activeBoutiqueId: string | null
}

interface AlternateLocation {
  boutique: Pick<BoutiqueGeo, 'id' | 'name' | 'slug' | 'lat' | 'lng' | 'city' | 'state'>
  distance_miles: number | null
}

export function CrossLocationBadge({ dressId, activeBoutiqueId }: CrossLocationBadgeProps) {
  const [alternate, setAlternate] = useState<AlternateLocation | null>(null)
  const isHydrated = useShopStore((s) => s._hasHydrated)

  useEffect(() => {
    if (!isHydrated || !dressId) return

    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function findAlternate() {
      // Find boutiques that carry this dress (excluding current)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: inventory } = await (supabase as any)
        .from('dress_inventory')
        .select(`
          boutique_id,
          boutiques!inner(id, name, slug, city, state, lat, lng, is_active)
        `)
        .eq('dress_id', dressId)
        .eq('is_active', true)
        .eq('boutiques.is_active', true)
        .neq('boutique_id', activeBoutiqueId ?? '')

      if (!inventory?.length) return

      const otherBoutiques: BoutiqueGeo[] = inventory.map((item: {
        boutiques: { id: string; name: string; slug: string; city: string | null; state: string | null; lat: number | null; lng: number | null }
      }) => ({
        id: item.boutiques.id,
        name: item.boutiques.name,
        slug: item.boutiques.slug,
        city: item.boutiques.city,
        state: item.boutiques.state,
        lat: item.boutiques.lat,
        lng: item.boutiques.lng,
      }))

      const coords = await requestGeolocation()
      const sorted = sortByProximity(otherBoutiques, coords)

      if (sorted.length > 0) {
        setAlternate({
          boutique: sorted[0],
          distance_miles: sorted[0].distance_miles,
        })
      }
    }

    findAlternate()
  }, [dressId, activeBoutiqueId, isHydrated])

  if (!alternate) return null

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-platinum">
      <MapPin size={11} className="text-gold shrink-0" />
      <span>
        Available at{' '}
        <span className="text-ivory font-medium">{alternate.boutique.name}</span>
        {alternate.distance_miles != null && (
          <> · {formatDistance(alternate.distance_miles)}</>
        )}
      </span>
    </div>
  )
}
