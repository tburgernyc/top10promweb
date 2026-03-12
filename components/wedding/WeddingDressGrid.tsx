'use client'

import { useState } from 'react'
import { useShopStore } from '@/lib/store/shopStore'
import type { Dress } from '@/types/index'
import type { DressImage } from '@/types/index'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { Heart } from 'lucide-react'

interface WeddingDressGridProps {
  dresses: Dress[]
}

type WeddingFilter = 'all' | 'a-line' | 'ball-gown' | 'mermaid' | 'sheath' | 'trumpet'

const SILHOUETTE_FILTERS: { value: WeddingFilter; label: string }[] = [
  { value: 'all', label: 'All Styles' },
  { value: 'a-line', label: 'A-Line' },
  { value: 'ball-gown', label: 'Ball Gown' },
  { value: 'mermaid', label: 'Mermaid' },
  { value: 'sheath', label: 'Sheath' },
  { value: 'trumpet', label: 'Trumpet' },
]

function getPrimaryImage(dress: Dress): string | null {
  const imgs = dress.images as DressImage[] | null
  if (!Array.isArray(imgs) || imgs.length === 0) return null
  return imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null
}

export function WeddingDressGrid({ dresses }: WeddingDressGridProps) {
  const shouldReduce = useReducedMotion()
  const [activeFilter, setActiveFilter] = useState<WeddingFilter>('all')
  const isHydrated = useShopStore((s) => s._hasHydrated)
  const wishlistIds = useShopStore((s) => s.wishlistIds)
  const toggleWishlist = useShopStore((s) => s.toggleWishlist)

  const filtered = activeFilter === 'all'
    ? dresses
    : dresses.filter((d) =>
        d.description?.toLowerCase().includes(activeFilter.replace('-', ' ')) ||
        d.name.toLowerCase().includes(activeFilter.replace('-', ' '))
      )

  return (
    <div className="space-y-6">
      {/* Silhouette filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SILHOUETTE_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            className={[
              'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
              activeFilter === value
                ? 'bg-gold text-onyx border-gold'
                : 'border-white/10 text-platinum hover:border-white/30 hover:text-ivory',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((dress, idx) => {
          const img = getPrimaryImage(dress)
          const wishlisted = isHydrated && wishlistIds.includes(dress.id)

          return (
            <motion.div
              key={dress.id}
              initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28, delay: idx * 0.04 }}
              className="group relative glass-light rounded-2xl overflow-hidden"
            >
              <Link href={`/catalog/${dress.id}`} className="block">
                <div className="relative aspect-[3/4] bg-white/5">
                  {img && (
                    <Image
                      src={img}
                      alt={dress.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-platinum/60 truncate">{dress.designer}</p>
                  <p className="text-sm font-semibold text-ivory truncate">{dress.name}</p>
                </div>
              </Link>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(dress.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full glass-heavy text-ivory opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  size={14}
                  className={wishlisted ? 'fill-gold text-gold' : ''}
                />
              </button>
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-platinum/50 text-sm">
            No wedding dresses found for this filter.
          </div>
        )}
      </div>
    </div>
  )
}
