'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Share2, Copy, Check, Twitter, Instagram, Mail, QrCode, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ShareFittingRoomProps {
  shareToken: string | null
  onRequestShare: () => Promise<string | null>
}

export function ShareFittingRoom({ shareToken: initialToken, onRequestShare }: ShareFittingRoomProps) {
  const shouldReduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState(initialToken)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const shareUrl = token
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${token}`
    : null

  async function handleOpen() {
    setOpen(true)
    if (!token) {
      setGenerating(true)
      const newToken = await onRequestShare()
      setToken(newToken)
      setGenerating(false)
    }
  }

  async function handleCopy() {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareVia(platform: 'twitter' | 'instagram' | 'email') {
    if (!shareUrl) return
    const text = "Check out my prom dress picks! 👗✨"
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent('My prom dress picks!')}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`,
    }
    if (platform === 'instagram') {
      handleCopy()
      return
    }
    window.open(urls[platform], '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleOpen}
        className="flex items-center gap-1.5"
      >
        <Share2 size={15} />
        Share
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="fixed z-50 inset-x-4 bottom-4 sm:inset-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-sm glass-heavy rounded-2xl p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ivory">Share Your Picks</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg text-platinum hover:text-ivory hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {generating || !shareUrl ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-7 h-7 rounded-full border-2 border-gold border-t-transparent animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Share link */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                      <p className="text-sm text-platinum truncate">{shareUrl}</p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="p-2.5 rounded-xl bg-gold text-onyx hover:bg-[#c9a227] transition-colors shrink-0"
                      aria-label="Copy link"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>

                  {copied && (
                    <p className="text-xs text-gold text-center">Link copied!</p>
                  )}

                  {/* Social buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => shareVia('twitter')}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-xl glass-light hover:border-white/20 transition-colors border border-white/10"
                    >
                      <Twitter size={18} className="text-sky-400" />
                      <span className="text-xs text-platinum">Twitter</span>
                    </button>
                    <button
                      onClick={() => shareVia('instagram')}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-xl glass-light hover:border-white/20 transition-colors border border-white/10"
                    >
                      <Instagram size={18} className="text-pink-400" />
                      <span className="text-xs text-platinum">Instagram</span>
                    </button>
                    <button
                      onClick={() => shareVia('email')}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-xl glass-light hover:border-white/20 transition-colors border border-white/10"
                    >
                      <Mail size={18} className="text-gold" />
                      <span className="text-xs text-platinum">Email</span>
                    </button>
                  </div>

                  {/* QR toggle */}
                  <button
                    onClick={() => setShowQR((v) => !v)}
                    className="flex items-center gap-2 text-sm text-platinum hover:text-ivory transition-colors mx-auto"
                  >
                    <QrCode size={16} />
                    {showQR ? 'Hide QR code' : 'Show QR code'}
                  </button>

                  <AnimatePresence>
                    {showQR && (
                      <motion.div
                        initial={shouldReduce ? {} : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={shouldReduce ? {} : { opacity: 0, height: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="overflow-hidden"
                      >
                        <div className="flex justify-center pt-2">
                          <div className="p-3 bg-white rounded-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`}
                              alt="QR code for share link"
                              width={180}
                              height={180}
                              className="rounded"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
