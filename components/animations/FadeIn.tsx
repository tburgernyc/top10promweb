'use client'

import { motion, useReducedMotion } from 'motion/react'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
  once?: boolean
}

export function FadeIn({ children, delay = 0, className = '', once = true }: FadeInProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once }}
      transition={
        shouldReduce
          ? { duration: 0 }
          : { type: 'spring', stiffness: 280, damping: 28, delay }
      }
    >
      {children}
    </motion.div>
  )
}
