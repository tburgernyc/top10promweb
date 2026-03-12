'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useShopStore } from '@/lib/store/shopStore'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import type { Dress, DressImage } from '@/types/index'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import Image from 'next/image'
import { Check } from 'lucide-react'

interface Step1DressProps {
  selectedDressId: string | null
  onNext: (dressId: string) => void
}

export function Step1Dress({ selectedDressId, onNext }: Step1DressProps) {
  const shouldReduce = useReducedMotion()
  const isHydrated = useShopStore((s) => s._hasHydrated)
  const fittingRoomIds = useShopStore((s) => s.fittingRoomIds)
  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(selectedDressId)

  useEffect(() => {
    if (!isHydrated) return

    async function fetchDresses() {
      if (fittingRoomIds.length === 0) {
        setLoading(false)
        return
      }

      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('dresses')
        .select('*')
        .in('id', fittingRoomIds)

      setDresses(data ?? [])
      setLoading(false)
    }

    fetchDresses()
  }, [isHydrated, fittingRoomIds])

  if (!isHydrated || loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} minHeight="min-h-20" />
        ))}
      </div>
    )
  }

  if (fittingRoomIds.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-platinum">Your fitting room is empty.</p>
        <p className="text-sm text-white/40">
          Browse the catalog and add dresses to your fitting room first.
        </p>
        <Button variant="secondary" onClick={() => window.history.back()}>
          Browse Catalog
        </Button>
      </div>
    )
  }

  function getPrimaryImage(dress: Dress): string | null {
    const images = dress.images as DressImage[] | null
    if (!Array.isArray(images) || images.length === 0) return null
    return images.find((img) => img.is_primary)?.url ?? images[0]?.url ?? null
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-platinum">Select the dress you&apos;d like to book an appointment for:</p>

      <div className="space-y-3">
        {dresses.map((dress, idx) => {
          const isSelected = selected === dress.id
          const imgSrc = getPrimaryImage(dress)

          return (
            <motion.button
              key={dress.id}
              initial={shouldReduce ? {} : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28, delay: idx * 0.05 }}
              onClick={() => setSelected(dress.id)}
              className={[
                'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-colors',
                isSelected
                  ? 'border-gold bg-gold/10'
                  : 'border-white/10 glass-light hover:border-white/20',
              ].join(' ')}
              aria-pressed={isSelected}
            >
              {imgSrc && (
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5">
                  <Image
                    src={imgSrc}
                    alt={dress.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-ivory font-medium truncate">{dress.name}</p>
                {dress.designer && (
                  <p className="text-sm text-platinum truncate">{dress.designer}</p>
                )}
                {dress.color && (
                  <p className="text-xs text-white/40">{dress.color}</p>
                )}
              </div>
              {isSelected && (
                <Check size={20} className="text-gold shrink-0" />
              )}
            </motion.button>
          )
        })}
      </div>

      <div className="pt-4">
        <Button
          variant="primary"
          className="w-full"
          disabled={!selected}
          onClick={() => selected && onNext(selected)}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
