'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useShopStore } from '@/lib/store/shopStore'
import { requestGeolocation, sortByProximity, formatDistance, type BoutiqueGeo } from '@/lib/geo'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

const FIRST_VISIT_KEY = 'top10prom_store_prompted'

export function NearestStorePrompt() {
  const shouldReduce = useReducedMotion()
  const [show, setShow] = useState(false)
  const [nearest, setNearest] = useState<(BoutiqueGeo & { distance_miles: number | null }) | null>(null)
  const { activeBoutiqueId, setActiveBoutique } = useShopStore()
  const isHydrated = useShopStore((s) => s._hasHydrated)

  useEffect(() => {
    if (!isHydrated) return

    // Only show on first visit, and only if no store is already selected
    const hasPrompted = sessionStorage.getItem(FIRST_VISIT_KEY)
    if (hasPrompted || activeBoutiqueId) return

    async function detect() {
      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: boutiques } = await (supabase as any)
        .from('boutiques')
        .select('id, name, slug, city, state, lat, lng')
        .eq('is_active', true)

      if (!boutiques?.length) return

      const coords = await requestGeolocation()
      const sorted = sortByProximity(boutiques as BoutiqueGeo[], coords)

      if (sorted.length > 0 && sorted[0].distance_miles != null) {
        setNearest(sorted[0])
        setShow(true)
      }
    }

    // Small delay to avoid blocking initial render
    const timer = setTimeout(detect, 1500)
    return () => clearTimeout(timer)
  }, [isHydrated, activeBoutiqueId])

  function handleAccept() {
    if (!nearest) return
    setActiveBoutique(nearest.slug, nearest.id)
    sessionStorage.setItem(FIRST_VISIT_KEY, '1')
    setShow(false)
  }

  function handleDismiss() {
    sessionStorage.setItem(FIRST_VISIT_KEY, '1')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && nearest && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40" onClick={handleDismiss} />
          <motion.div
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed z-50 inset-x-4 bottom-24 sm:bottom-8 sm:right-8 sm:left-auto sm:w-80 glass-heavy rounded-2xl p-5 shadow-2xl"
          >
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-lg text-platinum hover:text-ivory hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-gold" />
              </div>
              <div>
                <p className="text-ivory font-semibold text-sm">Store Near You</p>
                <p className="text-platinum text-sm">{nearest.name}</p>
                {nearest.city && (
                  <p className="text-xs text-white/40">
                    {nearest.city}{nearest.state ? `, ${nearest.state}` : ''}
                    {nearest.distance_miles != null
                      ? ` · ${formatDistance(nearest.distance_miles)}`
                      : ''}
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-platinum mb-4">
              Shop this boutique&apos;s inventory and book appointments at your nearest location.
            </p>

            <div className="flex gap-2">
              <Button variant="primary" className="flex-1 text-sm" onClick={handleAccept}>
                Shop {nearest.name}
              </Button>
              <Button variant="ghost" className="text-sm" onClick={handleDismiss}>
                Browse All
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
