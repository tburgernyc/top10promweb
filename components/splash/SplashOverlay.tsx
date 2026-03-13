'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useShopStore } from '@/lib/store/shopStore'

export function SplashOverlay() {
  const router = useRouter()
  const shouldReduce = useReducedMotion()
  const setEventType = useShopStore((s) => s.setEventType)
  const [exiting, setExiting] = useState(false)

  async function enter(eventType: 'prom' | 'wedding') {
    if (exiting) return
    setEventType(eventType)
    sessionStorage.setItem('has_entered', 'true')
    sessionStorage.setItem('fresh_enter', '1')
    setExiting(true)

    // Let the curtain animation complete before navigating
    const delay = shouldReduce ? 0 : 750
    await new Promise((r) => setTimeout(r, delay))
    router.push('/home')
  }

  function skip() {
    sessionStorage.setItem('has_entered', 'true')
    router.push('/catalog')
  }

  return (
    <>
      {/* ── Exit curtain: gold flash → onyx black ── */}
      <AnimatePresence>
        {exiting && (
          <>
            {/* Gold pulse layer */}
            <motion.div
              className="fixed inset-0 z-50 pointer-events-none"
              style={{ background: 'rgba(212,175,55,0.18)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.45, times: [0, 0.35, 1], ease: 'easeInOut' }}
            />
            {/* Solid black curtain */}
            <motion.div
              className="fixed inset-0 z-50 bg-onyx pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Overlay content ── */}
      <motion.div
        className="absolute inset-0 z-30 flex flex-col items-center justify-between py-10 px-6 pointer-events-none"
        animate={exiting ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={exiting
          ? { duration: 0.3, ease: 'easeIn' }
          : { duration: 0 }
        }
        aria-label="Splash overlay"
      >
        {/* Skip link */}
        <div className="w-full flex justify-end pointer-events-auto">
          <button
            onClick={skip}
            className="text-platinum text-sm hover:text-ivory transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            tabIndex={1}
            disabled={exiting}
          >
            Skip to Showroom →
          </button>
        </div>

        {/* Center content */}
        <div className="flex flex-col items-center gap-6 pointer-events-auto">
          <motion.p
            initial={shouldReduce ? {} : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20, delay: 1 }}
            className="text-gold text-5xl font-bold tracking-[0.3em] text-center select-none"
          >
            TOP 10 PROM
          </motion.p>

          <motion.p
            initial={shouldReduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 100, damping: 24, delay: 1.5 }}
            className="text-ivory font-light text-lg text-center"
          >
            Your Night. Your Runway.
          </motion.p>

          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 100, damping: 20, delay: 2 }}
            className="flex gap-3"
            role="group"
            aria-label="Select event type"
          >
            <EventPill label="Prom" onClick={() => enter('prom')} tabIndex={2} shouldReduce={!!shouldReduce} disabled={exiting} />
            <EventPill label="Wedding" onClick={() => enter('wedding')} tabIndex={3} shouldReduce={!!shouldReduce} disabled={exiting} />
          </motion.div>

          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 22, delay: 2.5 }}
          >
            <motion.button
              onClick={() => enter('prom')}
              disabled={exiting}
              className="bg-gold text-onyx text-lg font-semibold px-10 py-4 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ivory disabled:cursor-not-allowed"
              whileHover={shouldReduce || exiting ? {} : { scale: 1.05 }}
              whileTap={shouldReduce || exiting ? {} : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              tabIndex={4}
            >
              Enter the Showroom
            </motion.button>
          </motion.div>
        </div>

        <motion.p
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 80, damping: 20, delay: 3 }}
          className="text-platinum text-xs text-center"
        >
          5+ Boutique Locations Nationwide
        </motion.p>
      </motion.div>
    </>
  )
}

function EventPill({
  label,
  onClick,
  tabIndex,
  shouldReduce,
  disabled,
}: {
  label: string
  onClick: () => void
  tabIndex: number
  shouldReduce: boolean
  disabled: boolean
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="glass-light border border-gold/40 hover:border-gold text-ivory text-sm px-6 py-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed"
      whileHover={shouldReduce || disabled ? {} : { scale: 1.04 }}
      whileTap={shouldReduce || disabled ? {} : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      tabIndex={tabIndex}
    >
      {label}
    </motion.button>
  )
}
