'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to monitoring service in production
    console.error('[app/error]', error)
  }, [error])

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="glass-light rounded-2xl p-8 max-w-md w-full text-center space-y-5"
      >
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-ivory">Something went wrong</h1>
          <p className="text-sm text-platinum">
            An unexpected error occurred. Our team has been notified.
          </p>
          {error.digest && (
            <p className="text-xs text-platinum/40 font-mono">ref: {error.digest}</p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={() => window.history.back()}>
            Go back
          </Button>
          <Button variant="primary" onClick={reset}>
            <RotateCcw size={14} />
            Try again
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
