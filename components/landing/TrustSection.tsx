'use client'

import { motion, useReducedMotion } from 'motion/react'
import { ShieldCheck, MapPin, Star, Clock } from 'lucide-react'

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'No-Duplicate Guarantee',
    description: 'Your dress is reserved exclusively for you at your school for prom night.',
  },
  {
    icon: MapPin,
    title: '5+ Atlanta Boutiques',
    description: 'Visit us in Atlanta, Marietta, Alpharetta, Buckhead, and more locations.',
  },
  {
    icon: Star,
    title: 'Premium Designers',
    description: 'Jovani, Sherri Hill, La Femme, Mac Duggal, and hundreds more top labels.',
  },
  {
    icon: Clock,
    title: 'Personal Appointments',
    description: 'One-on-one sessions with our expert stylists. No rushing, just you.',
  },
]

export function TrustSection() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-ivory">
          Why Top 10 Prom?
        </h2>
        <p className="text-platinum text-sm mt-2">
          The premier prom boutique experience in Atlanta.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TRUST_ITEMS.map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={title}
            initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 28, delay: i * 0.06 }}
            className="glass-light rounded-2xl p-5 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
              <Icon size={20} className="text-gold" />
            </div>
            <div>
              <h3 className="text-ivory font-semibold text-sm">{title}</h3>
              <p className="text-platinum text-xs mt-1 leading-relaxed">{description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
