'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Mail, Send, X, Check } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface ShareWithParentProps {
  shareUrl: string
  dressName: string
  boutiqueName?: string
}

export function ShareWithParent({ shareUrl, dressName, boutiqueName }: ShareWithParentProps) {
  const shouldReduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setSending(true)
    setError('')

    try {
      const res = await fetch('/api/share/parent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_email: email,
          parent_name: name || 'Parent/Guardian',
          dress_name: dressName,
          boutique_name: boutiqueName,
          share_url: shareUrl,
        }),
      })

      if (!res.ok) throw new Error('Failed to send')
      setSent(true)
    } catch {
      setError('Failed to send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  function handleClose() {
    setOpen(false)
    setSent(false)
    setEmail('')
    setName('')
    setError('')
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5"
      >
        <Mail size={15} />
        Share with Parent
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
            <motion.div
              initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="fixed z-50 inset-x-4 bottom-4 sm:inset-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-sm glass-heavy rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-ivory">Share with Parent</h2>
                <button onClick={handleClose} className="p-1 rounded-lg text-platinum hover:text-ivory hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {sent ? (
                <motion.div
                  initial={shouldReduce ? {} : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  className="text-center py-6 space-y-3"
                >
                  <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto">
                    <Check size={28} className="text-gold" />
                  </div>
                  <p className="text-ivory font-medium">Email sent!</p>
                  <p className="text-sm text-platinum">
                    Your parent/guardian will receive a link to view and approve your pick.
                  </p>
                  <Button variant="ghost" onClick={handleClose} className="mt-2">
                    Done
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-platinum">
                    Send your parent or guardian a link to view{' '}
                    <span className="text-ivory font-medium">{dressName}</span> with an
                    &ldquo;Approve &amp; Book&rdquo; button.
                  </p>

                  <Input
                    label="Parent / guardian email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    placeholder="parent@example.com"
                    required
                    error={error}
                  />

                  <Input
                    label="Their name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mom, Dad"
                  />

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleSend}
                    disabled={sending || !email}
                  >
                    {sending ? (
                      'Sending…'
                    ) : (
                      <>
                        <Send size={15} />
                        Send Email
                      </>
                    )}
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
