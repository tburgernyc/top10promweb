'use client'

import { motion, useReducedMotion } from 'motion/react'

export interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

interface AriaBubbleProps {
  message: ChatMessage
  index: number
}

export function AriaBubble({ message, index }: AriaBubbleProps) {
  const shouldReduce = useReducedMotion()
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28, delay: index * 0.02 }}
      className={['flex', isUser ? 'justify-end' : 'justify-start'].join(' ')}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-onyx text-xs font-bold shrink-0 mt-0.5 mr-2">
          A
        </div>
      )}
      <div
        className={[
          'max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-gold text-onyx rounded-tr-sm'
            : 'glass-light text-ivory rounded-tl-sm',
        ].join(' ')}
      >
        {message.text}
      </div>
    </motion.div>
  )
}
