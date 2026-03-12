'use client'

// No React hooks needed — store selectors handle hydration state
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Shirt } from 'lucide-react'
import { useShopStore } from '@/lib/store/shopStore'
import { usePathname } from 'next/navigation'

export function FittingRoomWidget() {
  const shouldReduce = useReducedMotion()
  const pathname = usePathname()
  const isHydrated = useShopStore((s) => s._hasHydrated)
  const count = useShopStore((s) => s.fittingRoomIds.length)

  // Hide on fitting room page and on mobile (BottomNav handles it there)
  const hidden = pathname === '/fitting-room' || count === 0 || !isHydrated

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="fixed bottom-20 md:bottom-6 left-4 z-40 hidden md:flex"
          initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 12 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        >
          <Link
            href="/fitting-room"
            aria-label={`Fitting Room — ${count} dress${count !== 1 ? 'es' : ''}`}
            className="flex items-center gap-2.5 glass-heavy rounded-full px-4 py-3 text-ivory shadow-xl hover:bg-black/80 transition-colors"
          >
            <div className="relative">
              <Shirt size={20} className="text-gold" />
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-gold text-onyx text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                {count}
              </span>
            </div>
            <span className="text-sm font-medium">Fitting Room</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
