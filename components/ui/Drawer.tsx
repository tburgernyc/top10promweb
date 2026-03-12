'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Drawer({ open, onClose, title, children, className = '' }: DrawerProps) {
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className={[
              'relative w-full glass-heavy rounded-t-3xl pb-safe pt-2 px-4 pb-6 max-h-[90dvh] overflow-y-auto',
              className,
            ].join(' ')}
            initial={shouldReduce ? { opacity: 0 } : { y: '100%' }}
            animate={{ y: 0, opacity: 1 }}
            exit={shouldReduce ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          >
            {/* Handle bar */}
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {title && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-ivory">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-platinum/60 hover:text-ivory hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
