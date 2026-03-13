'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { DressCard } from '@/components/catalog/DressCard'
import type { Dress } from '@/types/index'

interface FeaturedDressesGridProps {
  dresses: Dress[]
  boutiqueName?: string | null
}

export function FeaturedDressesGrid({ dresses, boutiqueName }: FeaturedDressesGridProps) {
  const shouldReduce = useReducedMotion()

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        >
          <p className="text-xs text-gold font-semibold uppercase tracking-widest mb-1">
            {boutiqueName ? `Now at ${boutiqueName}` : 'New Arrivals'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-ivory">
            Featured Dresses
          </h2>
        </motion.div>
        <Link
          href="/catalog"
          className="shrink-0 text-sm text-gold hover:text-gold/80 transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {dresses.map((dress, index) => (
          <motion.div
            key={dress.id}
            initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 28,
              delay: Math.min(index * 0.07, 0.35),
            }}
          >
            <DressCard dress={dress} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
