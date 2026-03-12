'use client'

import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NoDuplicatePromo() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden rounded-2xl glass-heavy border border-gold/20 px-6 py-10 sm:px-10 sm:py-14 text-center">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(212,175,55,0.12) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="relative z-10 space-y-5"
      >
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck size={20} className="text-gold" />
          <span className="text-gold text-sm font-semibold tracking-wider uppercase">
            The No-Duplicate Guarantee
          </span>
          <Sparkles size={16} className="text-gold" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-ivory leading-tight max-w-xl mx-auto">
          Be the <span className="text-gold">Only One</span> in Your Dress
        </h2>

        <p className="text-platinum text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          When you reserve a dress at Top 10 Prom, no other student at your school
          can book the same one for the same night. Your moment is truly yours.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {['One dress per school', 'Per prom night', 'Guaranteed'].map((item, i) => (
            <motion.div
              key={item}
              initial={shouldReduce ? {} : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 26, delay: i * 0.08 }}
              className="flex items-center gap-1.5 text-xs text-gold/80 bg-gold/10 border border-gold/20 rounded-full px-3 py-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              {item}
            </motion.div>
          ))}
        </div>

        <Link href="/catalog">
          <Button variant="primary" size="lg" className="mt-2">
            Shop Your One-of-a-Kind Look
          </Button>
        </Link>
      </motion.div>
    </section>
  )
}
