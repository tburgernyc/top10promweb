'use client'

import { motion, useReducedMotion } from 'motion/react'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduce ? 0 : -8 }}
      transition={
        shouldReduce
          ? { duration: 0 }
          : { type: 'spring', stiffness: 300, damping: 30 }
      }
    >
      {children}
    </motion.div>
  )
}
