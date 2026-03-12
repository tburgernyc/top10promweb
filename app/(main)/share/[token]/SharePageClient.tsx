'use client'

import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { VoteOnDress } from '@/components/social/VoteOnDress'
import { Button } from '@/components/ui/Button'
import type { Dress, DressImage } from '@/types/index'
import { Calendar } from 'lucide-react'

interface SharePageClientProps {
  token: string
  dresses: Dress[]
}

function getPrimaryImage(dress: Dress): DressImage | null {
  const images = dress.images as DressImage[] | null
  if (!Array.isArray(images) || images.length === 0) return null
  return images.find((img) => img.is_primary) ?? images[0] ?? null
}

function formatPrice(cents: number | null): string | null {
  if (!cents) return null
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100)
}

export function SharePageClient({ token, dresses }: SharePageClientProps) {
  const shouldReduce = useReducedMotion()

  return (
    <div className="min-h-dvh pb-24">
      {/* Header */}
      <div className="text-center pt-12 pb-8 px-4 space-y-3">
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Link href="/" className="text-gold font-bold text-2xl tracking-tight">
            Top<span className="text-ivory">10</span>Prom
          </Link>
        </motion.div>

        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 30, delay: 0.08 }}
          className="space-y-1"
        >
          <h1 className="text-2xl font-bold text-ivory">My Prom Picks ✨</h1>
          <p className="text-platinum text-sm">
            Help me choose! Vote on your favorites below.
          </p>
        </motion.div>
      </div>

      {/* Dress cards */}
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        {dresses.map((dress, idx) => {
          const primary = getPrimaryImage(dress)
          const price = formatPrice(dress.price_cents)

          return (
            <motion.div
              key={dress.id}
              initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28, delay: idx * 0.1 }}
              className="glass-light rounded-2xl overflow-hidden"
            >
              {/* Image */}
              {primary && (
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={primary.url}
                    alt={primary.alt ?? dress.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 672px) 100vw, 672px"
                    priority={idx === 0}
                  />
                </div>
              )}

              {/* Info */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-ivory">{dress.name}</h2>
                    {dress.designer && (
                      <p className="text-sm text-platinum">{dress.designer}</p>
                    )}
                    {price && <p className="text-sm text-gold font-medium">{price}</p>}
                  </div>
                </div>

                {/* Voting */}
                <div className="space-y-2">
                  <p className="text-xs text-platinum font-medium uppercase tracking-wider">
                    Your vote
                  </p>
                  <VoteOnDress
                    shareToken={token}
                    dressId={dress.id}
                  />
                </div>

                {/* CTA */}
                <Link href={`/book?dress=${dress.id}`} className="block">
                  <Button variant="primary" className="w-full">
                    <Calendar size={15} />
                    Approve &amp; Book Appointment
                  </Button>
                </Link>
              </div>
            </motion.div>
          )
        })}

        {dresses.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <p className="text-platinum">No dresses in this fitting room.</p>
            <Link href="/catalog">
              <Button variant="primary">Browse Catalog</Button>
            </Link>
          </div>
        )}

        <div className="text-center pb-8">
          <Link href="/" className="text-sm text-platinum hover:text-gold transition-colors">
            Create your own fitting room at Top 10 Prom →
          </Link>
        </div>
      </div>
    </div>
  )
}
