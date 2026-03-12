'use client'

import { useState } from 'react'
import { Carousel } from '@/components/ui/Carousel'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SizeGuide } from './SizeGuide'
import { DuplicateCheck } from './DuplicateCheck'
import { AvailabilityForm } from './AvailabilityForm'
import { Heart, Plus, Check } from 'lucide-react'
import { useShopStore } from '@/lib/store/shopStore'
import type { Dress, DressImage, SizeChart } from '@/types/index'

interface DressDetailPanelProps {
  dress: Dress
}

function formatPrice(cents: number | null) {
  if (!cents) return null
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100)
}

export function DressDetailPanel({ dress }: DressDetailPanelProps) {
  const [showBooking, setShowBooking] = useState(false)

  const isHydrated = useShopStore((s) => s._hasHydrated)
  const activeBoutiqueId = useShopStore((s) => s.activeBoutiqueId)
  const isWishlisted = useShopStore((s) => s.isWishlisted(dress.id))
  const isInFitting = useShopStore((s) => s.isInFittingRoom(dress.id))
  const toggleWishlist = useShopStore((s) => s.toggleWishlist)
  const addToFittingRoom = useShopStore((s) => s.addToFittingRoom)
  const removeFromFittingRoom = useShopStore((s) => s.removeFromFittingRoom)

  const images = (dress.images as unknown as DressImage[]) ?? []
  const sizeChart = dress.size_chart as unknown as SizeChart | null
  const price = formatPrice(dress.price_cents)

  return (
    <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-8 md:gap-12">
      {/* ── Left: Image carousel (7 columns) ─────────────────────────────── */}
      <div>
        <Carousel images={images} alt={dress.name} aspectRatio="portrait" />
      </div>

      {/* ── Right: Details (5 columns) ────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          {dress.designer && (
            <p className="text-sm text-platinum/60 mb-1">{dress.designer}</p>
          )}
          <h1 className="text-3xl font-bold text-ivory mb-2">{dress.name}</h1>

          <div className="flex items-center gap-3 flex-wrap">
            {price && <span className="text-2xl text-gold font-semibold">{price}</span>}
            {dress.color && <Badge variant="platinum">{dress.color}</Badge>}
            {dress.style_number && (
              <span className="text-xs text-platinum/40">Style #{dress.style_number}</span>
            )}
          </div>
        </div>

        {/* Description */}
        {dress.description && (
          <p className="text-sm text-platinum/70 leading-relaxed">{dress.description}</p>
        )}

        {/* Size guide */}
        <div className="flex items-center gap-3">
          <SizeGuide sizeChart={sizeChart} />
        </div>

        {/* CTA buttons */}
        {isHydrated && (
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setShowBooking((v) => !v)}
            >
              Book Appointment
            </Button>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => isInFitting ? removeFromFittingRoom(dress.id) : addToFittingRoom(dress.id)}
              >
                {isInFitting ? <Check size={16} /> : <Plus size={16} />}
                {isInFitting ? 'In Fitting Room' : 'Add to Fitting Room'}
              </Button>

              <Button
                variant="ghost"
                size="md"
                onClick={() => toggleWishlist(dress.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart size={18} className={isWishlisted ? 'fill-gold text-gold' : ''} />
              </Button>
            </div>
          </div>
        )}

        {/* Booking form */}
        {showBooking && activeBoutiqueId && (
          <div className="border-t border-white/10 pt-6">
            <AvailabilityForm dressId={dress.id} boutiqueId={activeBoutiqueId} />
          </div>
        )}

        {showBooking && !activeBoutiqueId && (
          <p className="text-sm text-platinum/50 rounded-xl bg-white/5 p-4 border border-white/10">
            Select a store location from the top nav to book an appointment.
          </p>
        )}

        {/* Duplicate check — The Moat */}
        <DuplicateCheck dressId={dress.id} dressName={dress.name} />
      </div>
    </div>
  )
}
