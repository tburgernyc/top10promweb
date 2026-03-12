'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { X, Send, Loader2 } from 'lucide-react'
import { AriaBubble, type ChatMessage } from './AriaBubble'

function getWelcomeMessage(eventType: 'prom' | 'wedding' | null): ChatMessage {
  if (eventType === 'wedding') {
    return {
      role: 'model',
      text: "Welcome! I'm Aria, your bridal style concierge ✨ Tell me about your vision — silhouette, season, color palette — and I'll guide you to the perfect gown. What does your dream wedding look like?",
    }
  }
  return {
    role: 'model',
    text: "Hi! I'm Aria, your personal style guide ✨ Tell me about your dream prom look — colors, vibe, body style — and I'll help you find the perfect dress. What are you envisioning?",
  }
}

interface AriaPanelProps {
  isOpen: boolean
  onClose: () => void
  boutiqueId?: string | null
  eventType?: 'prom' | 'wedding' | null
}

export function AriaPanel({ isOpen, onClose, boutiqueId, eventType }: AriaPanelProps) {
  const shouldReduce = useReducedMotion()
  const [messages, setMessages] = useState<ChatMessage[]>([getWelcomeMessage(eventType ?? null)])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: ChatMessage = { role: 'user', text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = newMessages.slice(0, -1).map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          boutique_id: boutiqueId,
          event_type: eventType ?? null,
        }),
      })

      const data = await res.json() as { reply?: string; error?: string }

      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'model', text: data.reply! }])
      } else {
        setMessages((prev) => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again in a moment!" }])
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'model', text: "Something went wrong. Please try again!" }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm glass-heavy rounded-2xl shadow-2xl flex flex-col"
          style={{ height: 'min(520px, 60dvh)' }}
          role="dialog"
          aria-label="Aria AI Style Concierge"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-onyx text-sm font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-ivory">Aria</p>
                <p className="text-xs text-green-400">Online · AI Style Concierge</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-platinum hover:text-ivory hover:bg-white/10 transition-colors"
              aria-label="Close Aria"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0"
          >
            {messages.map((msg, i) => (
              <AriaBubble key={i} message={msg} index={i} />
            ))}
            {loading && (
              <div className="flex items-center gap-2 pl-9">
                <div className="glass-light rounded-2xl rounded-tl-sm px-4 py-2.5">
                  <Loader2 size={14} className="text-platinum animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Aria about styles…"
                disabled={loading}
                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-ivory placeholder:text-platinum/40 focus:outline-none focus:border-gold/50 disabled:opacity-50"
                aria-label="Message Aria"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-gold text-onyx hover:bg-[#c9a227] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
