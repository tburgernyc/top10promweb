'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'bottom'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const shouldReduce = useReducedMotion()

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            role="tooltip"
            className={[
              'absolute z-50 pointer-events-none px-2.5 py-1.5 rounded-lg text-xs text-ivory',
              'glass-heavy whitespace-nowrap shadow-lg left-1/2 -translate-x-1/2',
              side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
            ].join(' ')}
            initial={{ opacity: 0, y: shouldReduce ? 0 : side === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
