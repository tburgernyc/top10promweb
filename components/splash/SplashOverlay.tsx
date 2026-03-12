'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { useShopStore } from '@/lib/store/shopStore'

export function SplashOverlay() {
  const router = useRouter()
  const setEventType = useShopStore((s) => s.setEventType)

  function enter(eventType: 'prom' | 'wedding') {
    setEventType(eventType)
    sessionStorage.setItem('has_entered', 'true')
    router.push('/home')
  }

  function skip() {
    sessionStorage.setItem('has_entered', 'true')
    router.push('/catalog')
  }

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-between py-10 px-6 pointer-events-none"
      aria-label="Splash overlay"
    >
      {/* Skip link — always visible, top right */}
      <div className="w-full flex justify-end pointer-events-auto">
        <button
          onClick={skip}
          className="text-platinum text-sm hover:text-ivory transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          tabIndex={1}
        >
          Skip to Showroom →
        </button>
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center gap-6 pointer-events-auto">
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 1 }}
          className="text-gold text-5xl font-bold tracking-[0.3em] text-center select-none"
        >
          TOP 10 PROM
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 24, delay: 1.5 }}
          className="text-ivory font-light text-lg text-center"
        >
          Your Night. Your Runway.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 2 }}
          className="flex gap-3"
          role="group"
          aria-label="Select event type"
        >
          <EventPill label="Prom" onClick={() => enter('prom')} tabIndex={2} />
          <EventPill label="Wedding" onClick={() => enter('wedding')} tabIndex={3} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 2.5 }}
        >
          <motion.button
            onClick={() => enter('prom')}
            className="bg-gold text-onyx text-lg font-semibold px-10 py-4 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            tabIndex={4}
          >
            Enter the Showroom
          </motion.button>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 3 }}
        className="text-platinum text-xs text-center"
      >
        5+ Boutique Locations Nationwide
      </motion.p>
    </div>
  )
}

function EventPill({
  label,
  onClick,
  tabIndex,
}: {
  label: string
  onClick: () => void
  tabIndex: number
}) {
  return (
    <motion.button
      onClick={onClick}
      className="glass-light border border-gold/40 hover:border-gold text-ivory text-sm px-6 py-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      tabIndex={tabIndex}
    >
      {label}
    </motion.button>
  )
}
