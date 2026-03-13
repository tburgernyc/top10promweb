'use client'

import { motion, useReducedMotion } from 'motion/react'
import { ShieldCheck, Sparkles, MapPin, Star, Users } from 'lucide-react'

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'No-Duplicate Guarantee',
    body: 'Your dress is reserved exclusively for you at your school for prom night. No other student can book the same gown for the same event.',
  },
  {
    icon: Sparkles,
    title: 'Exclusive Designs',
    body: 'Hard-to-find, limited-edition dresses that can only be found at a Top 10 Prom store. Our designers create styles you won\'t see anywhere else.',
  },
  {
    icon: MapPin,
    title: '5+ Atlanta Boutiques',
    body: 'Multiple locations across the Atlanta metro area — Marietta, Alpharetta, Buckhead, Smyrna, and Kennesaw — so finding your dream dress is never far away.',
  },
  {
    icon: Star,
    title: 'Premium Designers',
    body: 'Carrying Johnathan Kayne, Ashley Lauren, Jessica Angel, Kate Parker, Chandalier, and 2Cute Homecoming — the top names in prom fashion.',
  },
  {
    icon: Users,
    title: 'Personal Styling',
    body: 'One-on-one appointments with expert stylists. No rushing, no crowds — just you and the perfect dress for your night.',
  },
]

export function AboutValues() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="space-y-4">
      <motion.h2
        initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="text-2xl font-bold text-ivory"
      >
        What Sets Us Apart
      </motion.h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {VALUES.map(({ icon: Icon, title, body }, i) => (
          <motion.div
            key={title}
            initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 28,
              delay: Math.min(i * 0.07, 0.35),
            }}
            className="glass-light rounded-2xl p-5 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
              <Icon size={18} className="text-gold" />
            </div>
            <div>
              <h3 className="text-ivory font-semibold text-sm">{title}</h3>
              <p className="text-platinum/55 text-xs mt-1 leading-relaxed">{body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
