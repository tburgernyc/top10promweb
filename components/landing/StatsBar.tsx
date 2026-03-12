'use client'

import { motion, useReducedMotion } from 'motion/react'

const STATS = [
  { value: '1,000+', label: 'Dresses In-Store' },
  { value: '5+',     label: 'Atlanta Boutiques' },
  { value: '0',      label: 'Duplicate Dresses' },
  { value: '15+',    label: 'Top Designers' },
]

export function StatsBar() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="relative z-10 glass-heavy border-y border-white/8">
      <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/8">
        {STATS.map(({ value, label }, i) => (
          <motion.div
            key={label}
            initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, delay: i * 0.07 }}
            className="flex flex-col items-center justify-center px-4 py-2 text-center gap-0.5"
          >
            <span className="text-2xl sm:text-3xl font-black text-gold leading-none">{value}</span>
            <span className="text-[10px] text-platinum/60 tracking-[0.18em] uppercase">{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
