'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useInView } from 'motion/react'

const STATS = [
  { label: 'Dresses In-Store', num: 1000, suffix: '+', thousands: true },
  { label: 'Atlanta Boutiques', num: 5, suffix: '+', thousands: false },
  { label: 'Duplicate Dresses', num: 0, suffix: '', thousands: false },
  { label: 'Top Designers', num: 15, suffix: '+', thousands: false },
]

function CountUp({
  to,
  suffix,
  thousands,
  inView,
  shouldReduce,
}: {
  to: number
  suffix: string
  thousands: boolean
  inView: boolean
  shouldReduce: boolean
}) {
  const [value, setValue] = useState(shouldReduce ? to : 0)

  useEffect(() => {
    if (!inView) return
    if (shouldReduce) { setValue(to); return }
    let start: number | null = null
    const duration = 1400
    const raf = (timestamp: number) => {
      if (start === null) start = timestamp
      const t = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * to))
      if (t < 1) requestAnimationFrame(raf)
    }
    const id = requestAnimationFrame(raf)
    return () => cancelAnimationFrame(id)
  }, [inView, to, shouldReduce])

  const display = thousands ? value.toLocaleString('en-US') : value
  return <>{display}{suffix}</>
}

export function StatsBar() {
  const shouldReduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })

  return (
    <div className="relative z-10 glass-heavy border-y border-white/8" ref={containerRef}>
      <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/8">
        {STATS.map(({ num, suffix, thousands, label }, i) => (
          <motion.div
            key={label}
            initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            whileHover={shouldReduce ? {} : { scale: 1.04, y: -2 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, delay: i * 0.07 }}
            className="flex flex-col items-center justify-center px-4 py-2 text-center gap-0.5 cursor-default"
          >
            <span className="text-2xl sm:text-3xl font-black text-gold leading-none">
              <CountUp to={num} suffix={suffix} thousands={thousands} inView={isInView} shouldReduce={!!shouldReduce} />
            </span>
            <span className="text-[10px] text-platinum/60 tracking-[0.18em] uppercase">{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
