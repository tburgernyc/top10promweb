'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { Heart, Plus, Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useShopStore } from '@/lib/store/shopStore'
import type { Dress } from '@/types/index'
import type { DressImage } from '@/types/index'

interface DressCardProps {
  dress: Dress
  isDuplicate?: boolean
}

function formatPrice(cents: number | null) {
  if (!cents) return null
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100)
}

export function DressCard({ dress, isDuplicate = false }: DressCardProps) {
  const shouldReduce = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = useState(false)

  const isHydrated = useShopStore((s) => s._hasHydrated)
  const isWishlisted = useShopStore((s) => s.isWishlisted(dress.id))
  const isInFitting = useShopStore((s) => s.isInFittingRoom(dress.id))
  const toggleWishlist = useShopStore((s) => s.toggleWishlist)
  const addToFittingRoom = useShopStore((s) => s.addToFittingRoom)
  const removeFromFittingRoom = useShopStore((s) => s.removeFromFittingRoom)

  // Play video on hover
  useEffect(() => {
    const video = videoRef.current
    if (!video || shouldReduce) return
    if (hovered && dress.video_url) {
      video.play().catch(() => null)
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [hovered, dress.video_url, shouldReduce])

  const images = (dress.images as unknown as DressImage[]) ?? []
  const primaryImage = images.find((i) => i.is_primary) ?? images[0]

  return (
    <motion.article
      className="group relative rounded-2xl overflow-hidden glass-light cursor-pointer"
      whileHover={shouldReduce ? {} : { y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Image / Video */}
      <Link href={`/catalog/${dress.id}`} className="block relative aspect-[3/4] bg-onyx overflow-hidden">
        {primaryImage && (
          <motion.div
            className="absolute inset-0"
            animate={shouldReduce ? {} : { scale: hovered ? 1.07 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt ?? dress.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </motion.div>
        )}

        {/* Hover video overlay */}
        {dress.video_url && !shouldReduce && (
          <video
            ref={videoRef}
            src={dress.video_url}
            muted
            loop
            playsInline
            className={[
              'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
              hovered ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
        )}

        {/* Duplicate badge */}
        {isDuplicate && (
          <div className="absolute top-3 left-3">
            <Badge variant="red">Reserved at your school</Badge>
          </div>
        )}

        {/* Wishlist button */}
        {isHydrated && (
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist(dress.id)
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isWishlisted}
            className="absolute top-3 right-3 p-2 rounded-full glass-heavy text-ivory opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          >
            <Heart
              size={16}
              className={isWishlisted ? 'fill-gold text-gold' : ''}
            />
          </button>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-platinum/60 truncate">{dress.designer}</p>
            <h3 className="text-sm font-semibold text-ivory truncate">{dress.name}</h3>
            {dress.price_cents && (
              <p className="text-sm text-gold mt-0.5">{formatPrice(dress.price_cents)}</p>
            )}
          </div>

          {/* Add to fitting room */}
          {isHydrated && (
            <motion.button
              onClick={() =>
                isInFitting
                  ? removeFromFittingRoom(dress.id)
                  : addToFittingRoom(dress.id)
              }
              aria-label={isInFitting ? 'Remove from fitting room' : 'Add to fitting room'}
              aria-pressed={isInFitting}
              whileTap={shouldReduce ? {} : { scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={[
                'shrink-0 p-2 rounded-xl border transition-colors',
                isInFitting
                  ? 'bg-gold/20 border-gold/40 text-gold'
                  : 'border-white/10 text-platinum hover:border-gold/30 hover:text-gold',
              ].join(' ')}
            >
              {isInFitting ? <Check size={15} /> : <Plus size={15} />}
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  )
}
