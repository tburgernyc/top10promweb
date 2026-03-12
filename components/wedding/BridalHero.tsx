'use client'

import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { Flower2, Users, CalendarHeart } from 'lucide-react'

export function BridalHero() {
  const shouldReduce = useReducedMotion()

  const pillars = [
    { icon: Flower2, label: 'Bridal Gowns', sub: 'Curated designer selection' },
    { icon: Users, label: 'Party Coordination', sub: 'Dress your entire party' },
    { icon: CalendarHeart, label: 'Private Appointments', sub: '90-min dedicated sessions' },
  ]

  return (
    <section className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-onyx via-onyx/95 to-onyx" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(212,175,55,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-8">
        {/* Badge */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-medium"
        >
          <Flower2 size={12} />
          Wedding Collections
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ivory leading-tight tracking-tight">
            Your Forever
            <span className="block text-gold">Begins Here.</span>
          </h1>
          <p className="text-lg text-platinum max-w-xl mx-auto leading-relaxed">
            From the first fitting to the final moment — find your perfect bridal gown
            and coordinate your entire wedding party at one boutique.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/catalog?event_type=wedding"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gold text-onyx font-semibold text-base hover:bg-[#c9a227] transition-colors"
          >
            <Flower2 size={18} />
            Browse Bridal Gowns
          </Link>
          <Link
            href="/wedding/bridal-party"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl glass-light border border-white/10 text-ivory font-medium text-base hover:bg-white/10 transition-colors"
          >
            <Users size={18} />
            Coordinate My Party
          </Link>
        </motion.div>

        {/* Pillars */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4"
        >
          {pillars.map(({ icon: Icon, label, sub }, idx) => (
            <motion.div
              key={label}
              initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.4 + idx * 0.07 }}
              className="glass-light rounded-xl p-4 text-left"
            >
              <Icon size={18} className="text-gold mb-2" />
              <p className="text-sm font-semibold text-ivory">{label}</p>
              <p className="text-xs text-platinum/70 mt-0.5">{sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
