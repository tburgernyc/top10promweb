'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { X, Shirt } from 'lucide-react'
import { useShopStore } from '@/lib/store/shopStore'
import { Button } from '@/components/ui/Button'
import { DressGridSkeleton } from '@/components/ui/Skeleton'
import type { Dress, DressImage } from '@/types/index'
import { createClient } from '@/lib/supabase/browser'

export function FittingRoomSession() {
  const shouldReduce = useReducedMotion()
  // Read hydration state directly from store — no local useState needed
  const isHydrated = useShopStore((s) => s._hasHydrated)
  const fittingRoomIds = useShopStore((s) => s.fittingRoomIds)
  const removeFromFittingRoom = useShopStore((s) => s.removeFromFittingRoom)
  const clearFittingRoom = useShopStore((s) => s.clearFittingRoom)
  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isHydrated) return

    async function fetchDresses() {
      if (fittingRoomIds.length === 0) {
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data } = await supabase
        .from('dresses')
        .select('*')
        .in('id', fittingRoomIds)

      setDresses((data as Dress[]) ?? [])
      setLoading(false)
    }

    fetchDresses()
  }, [fittingRoomIds, isHydrated])

  if (!isHydrated || loading) return <DressGridSkeleton count={4} />

  if (fittingRoomIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <Shirt size={48} className="text-platinum/20" />
        <div>
          <p className="text-ivory font-semibold mb-1">Your fitting room is empty</p>
          <p className="text-platinum/50 text-sm">Browse the catalog and add dresses to try on.</p>
        </div>
        <Link href="/catalog">
          <Button variant="primary" size="md">Browse Catalog</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-platinum/60">
          {fittingRoomIds.length} dress{fittingRoomIds.length !== 1 ? 'es' : ''} in your fitting room
        </p>
        <Button variant="ghost" size="sm" onClick={clearFittingRoom}>
          Clear all
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {dresses.map((dress) => {
            const images = (dress.images as unknown as DressImage[]) ?? []
            const primary = images.find((i) => i.is_primary) ?? images[0]

            return (
              <motion.div
                key={dress.id}
                layout
                initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.88, x: -20 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="relative rounded-2xl overflow-hidden glass-light group"
              >
                <Link href={`/catalog/${dress.id}`} className="block relative aspect-[3/4]">
                  {primary && (
                    <Image
                      src={primary.url}
                      alt={primary.alt ?? dress.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  )}
                </Link>

                <button
                  onClick={() => removeFromFittingRoom(dress.id)}
                  aria-label={`Remove ${dress.name} from fitting room`}
                  className="absolute top-2 right-2 p-1.5 rounded-full glass-heavy text-ivory opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                >
                  <X size={14} />
                </button>

                <div className="p-3">
                  <p className="text-xs text-platinum/50 truncate">{dress.designer}</p>
                  <p className="text-sm font-semibold text-ivory truncate">{dress.name}</p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="pt-2 border-t border-white/10">
        <Link href="/book">
          <Button variant="primary" size="lg" fullWidth>Book Appointment</Button>
        </Link>
      </div>
    </div>
  )
}
