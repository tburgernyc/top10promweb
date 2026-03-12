'use client'

import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ChevronDown } from 'lucide-react'

export function Hero() {
  const shouldReduce = useReducedMotion()

  const stagger = (i: number) =>
    shouldReduce ? {} : { type: 'spring' as const, stiffness: 260, damping: 28, delay: i * 0.1 }

  return (
    <section className="relative min-h-[90dvh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212,175,55,0.15) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Label */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(0)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gold tracking-widest uppercase bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          5+ Boutique Locations · Atlanta Metro
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(1)}
          className="text-4xl sm:text-6xl font-bold text-ivory leading-tight tracking-tight"
        >
          Your Moment.{' '}
          <span className="text-gold">Your Dress.</span>
          <br />
          Your Night.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(2)}
          className="text-platinum text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
        >
          Premium prom dress boutiques with a no-duplicate guarantee.
          One dress. One school. One night to remember.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={stagger(3)}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <Link href="/catalog">
            <Button variant="primary" size="lg">
              Shop the Collection
            </Button>
          </Link>
          <Link href="/book">
            <Button variant="secondary" size="lg">
              Book Appointment
            </Button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={stagger(4)}
          className="flex items-center justify-center gap-8 pt-4"
        >
          {[
            { value: '1,000+', label: 'Dresses' },
            { value: '5+', label: 'Boutiques' },
            { value: '100%', label: 'No Duplicates' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold text-gold">{value}</p>
              <p className="text-xs text-platinum">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {!shouldReduce && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ChevronDown size={24} className="text-platinum/40" />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
