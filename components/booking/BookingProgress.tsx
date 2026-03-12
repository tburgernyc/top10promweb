'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { BookingStep } from '@/types/index'

const STEPS: { step: BookingStep; label: string }[] = [
  { step: 1, label: 'Dress' },
  { step: 2, label: 'Store' },
  { step: 3, label: 'Date' },
  { step: 4, label: 'Info' },
  { step: 5, label: 'Confirm' },
]

interface BookingProgressProps {
  currentStep: BookingStep
}

export function BookingProgress({ currentStep }: BookingProgressProps) {
  const shouldReduce = useReducedMotion()

  return (
    <nav aria-label="Booking steps" className="w-full">
      <ol className="flex items-center justify-between">
        {STEPS.map(({ step, label }, idx) => {
          const isDone = step < currentStep
          const isActive = step === currentStep

          return (
            <li key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  animate={{
                    backgroundColor: isDone || isActive ? '#D4AF37' : 'transparent',
                    borderColor: isDone || isActive ? '#D4AF37' : 'rgb(255 255 255 / 0.2)',
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={shouldReduce ? {} : { type: 'spring', stiffness: 400, damping: 30 }}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ color: isDone || isActive ? '#050505' : 'rgb(255 255 255 / 0.4)' }}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone ? '✓' : step}
                </motion.div>
                <span
                  className={[
                    'text-xs hidden sm:block',
                    isActive ? 'text-gold font-medium' : isDone ? 'text-platinum' : 'text-white/30',
                  ].join(' ')}
                >
                  {label}
                </span>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-2 bg-white/10 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gold"
                    animate={{ width: isDone ? '100%' : '0%' }}
                    transition={shouldReduce ? {} : { type: 'spring', stiffness: 200, damping: 30 }}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
