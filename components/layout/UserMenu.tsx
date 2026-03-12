'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { User, LogOut, LayoutDashboard, Heart, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { logoutAction } from '@/lib/actions/auth'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function UserMenu() {
  const shouldReduce = useReducedMotion()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setReady(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!ready) return null

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 text-sm font-medium text-platinum hover:text-ivory border border-white/10 hover:border-gold/30 rounded-xl px-3 py-1.5 transition-all"
      >
        <User size={15} /> Sign In
      </Link>
    )
  }

  const initials = (user.user_metadata?.full_name as string | undefined)
    ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    ?? user.email?.[0].toUpperCase()
    ?? 'U'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm text-platinum hover:text-ivory transition-colors px-2 py-1.5 rounded-xl hover:bg-white/5"
        aria-expanded={open}
      >
        <span className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs font-bold flex items-center justify-center shrink-0">
          {initials}
        </span>
        <span className="hidden sm:block max-w-[100px] truncate text-xs">
          {(user.user_metadata?.full_name as string | undefined)?.split(' ')[0] ?? user.email}
        </span>
        <ChevronDown size={13} className={['transition-transform duration-200', open ? 'rotate-180' : ''].join(' ')} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute right-0 top-full mt-1 z-50 w-48 glass-heavy rounded-xl overflow-hidden shadow-xl py-1"
              initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="px-4 py-2.5 border-b border-white/10">
                <p className="text-xs text-platinum/50 truncate">{user.email}</p>
              </div>
              <Link href="/profile" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ivory hover:bg-white/10 transition-colors">
                <LayoutDashboard size={14} className="text-gold" /> My Account
              </Link>
              <Link href="/wishlist" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ivory hover:bg-white/10 transition-colors">
                <Heart size={14} className="text-gold" /> Wishlist
              </Link>
              <div className="border-t border-white/10 mt-1">
                <form action={logoutAction}>
                  <button type="submit"
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-platinum hover:text-ivory hover:bg-white/10 transition-colors text-left">
                    <LogOut size={14} /> Sign Out
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
