'use client'

import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const DESIGNERS = [
  {
    name: 'Johnathan Kayne',
    tag: 'Glamour & Innovation',
    bio: 'Project Runway finalist celebrated for intricate details, luxurious fabrics, and dramatic silhouettes. Vibrant colors and sparkling embellishments define every gown.',
  },
  {
    name: 'Ashley Lauren',
    tag: 'Fully Hand-Beaded',
    bio: 'Premier formal wear renowned for luxurious, fully hand-beaded gowns. Timeless elegance with meticulous attention to detail in every stitch.',
  },
  {
    name: 'Jessica Angel',
    tag: 'Bold & Striking',
    bio: 'Dynamic designs built on bold colors and striking silhouettes. Dramatic beadwork and voluminous skirts make every entrance unforgettable.',
  },
  {
    name: 'Kate Parker',
    tag: 'Vibrant & Youthful',
    bio: 'Playful and trendy with bright colors, modern patterns, and eye-catching details. The go-to label for a fresh, fashion-forward prom look.',
  },
  {
    name: 'Chandalier',
    tag: 'LA-Made Sleek',
    bio: 'Designed and manufactured in Los Angeles. Fluid lines, high-quality fabrics, daring necklines, and dramatic slits for the confident wearer.',
  },
  {
    name: '2Cute Homecoming',
    tag: 'Homecoming Faves',
    bio: 'Playful short styles built for homecoming season — flirty cuts, vibrant colors, and trend-right silhouettes at every price point.',
  },
]

export function DesignersSection() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="space-y-6">

      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] text-gold font-semibold tracking-[0.22em] uppercase mb-1">Exclusive Labels</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-ivory">Our Designers</h2>
        </div>
        <Link
          href="/catalog"
          className="shrink-0 text-sm text-gold hover:text-gold/80 transition-colors flex items-center gap-1"
        >
          Shop all <ArrowRight size={14} />
        </Link>
      </div>

      {/* Designer grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DESIGNERS.map(({ name, tag, bio }, i) => (
          <motion.div
            key={name}
            initial={shouldReduce ? {} : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 28, delay: i * 0.06 }}
            className="glass-light rounded-2xl p-6 flex flex-col gap-3 group hover:border-gold/20 transition-colors"
          >
            <div>
              <span className="text-[10px] text-gold/70 font-semibold tracking-[0.18em] uppercase">{tag}</span>
              <h3 className="text-ivory font-bold text-lg mt-0.5 group-hover:text-gold transition-colors">{name}</h3>
            </div>
            <p className="text-platinum/55 text-xs leading-relaxed flex-1">{bio}</p>
            <Link
              href={`/catalog?designer=${encodeURIComponent(name)}`}
              className="text-xs text-gold/70 hover:text-gold transition-colors flex items-center gap-1 mt-auto"
            >
              Browse {name.split(' ')[0]} <ArrowRight size={11} />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
