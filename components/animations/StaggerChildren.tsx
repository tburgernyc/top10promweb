'use client'

import { motion, useReducedMotion, type Variants } from 'motion/react'

interface StaggerChildrenProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}

const containerVariants = (stagger: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
})

// Two separate variant objects avoids union type complexity
const itemVariantsSpring: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 280, damping: 28 },
  },
}

const itemVariantsReduced: Variants = {
  hidden: { opacity: 0, y: 0 },
  show: { opacity: 1, y: 0 },
}

export function StaggerChildren({
  children,
  staggerDelay = 0.07,
  className = '',
}: StaggerChildrenProps) {
  const shouldReduce = useReducedMotion()
  const itemVars = shouldReduce ? itemVariantsReduced : itemVariantsSpring

  return (
    <motion.div
      className={className}
      variants={containerVariants(staggerDelay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {Array.isArray(children)
        ? children.map((child_, i) => (
            <motion.div key={i} variants={itemVars}>
              {child_}
            </motion.div>
          ))
        : <motion.div variants={itemVars}>{children}</motion.div>}
    </motion.div>
  )
}
