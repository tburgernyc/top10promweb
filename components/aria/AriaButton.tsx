'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { MessageCircle, X } from 'lucide-react'
import { AriaPanel } from './AriaPanel'
import { useShopStore } from '@/lib/store/shopStore'

export function AriaButton() {
  const shouldReduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const activeBoutiqueId = useShopStore((s) => s.activeBoutiqueId)
  const eventType = useShopStore((s) => s.eventType)

  return (
    <>
      <AriaPanel
        isOpen={open}
        onClose={() => setOpen(false)}
        boutiqueId={activeBoutiqueId}
        eventType={eventType}
      />

      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close Aria style concierge' : 'Open Aria style concierge'}
        aria-expanded={open}
        whileTap={shouldReduce ? {} : { scale: 0.93 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={[
          'fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full shadow-xl flex items-center justify-center',
          'transition-colors duration-200',
          open
            ? 'bg-white/10 border border-white/20 text-ivory'
            : 'bg-gold text-onyx hover:bg-[#c9a227]',
        ].join(' ')}
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={shouldReduce ? {} : { type: 'spring', stiffness: 300, damping: 26 }}
        >
          {open ? <X size={22} /> : <MessageCircle size={22} />}
        </motion.div>
      </motion.button>
    </>
  )
}
