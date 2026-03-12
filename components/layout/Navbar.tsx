'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Heart, Shirt, ChevronDown, Check, LocateFixed } from 'lucide-react'
import { UserMenu } from './UserMenu'
import { useShopStore } from '@/lib/store/shopStore'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { requestGeolocation, sortByProximity, type BoutiqueGeo } from '@/lib/geo'

function StoreSelector() {
  const shouldReduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [boutiques, setBoutiques] = useState<BoutiqueGeo[]>([])
  const [detecting, setDetecting] = useState(false)
  const { activeBoutiqueSlug, activeBoutiqueId, setActiveBoutique } = useShopStore()
  const isHydrated = useShopStore((s) => s._hasHydrated)

  const current = boutiques.find((b) => b.slug === activeBoutiqueSlug)

  // Fetch real boutique list on mount
  useEffect(() => {
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function fetchBoutiques() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('boutiques')
        .select('id, name, slug, city, state, lat, lng')
        .eq('is_active', true)
        .order('name')

      if (data) setBoutiques(data as BoutiqueGeo[])
    }

    fetchBoutiques()
  }, [])

  async function handleAutoDetect() {
    setDetecting(true)
    const coords = await requestGeolocation()
    if (coords && boutiques.length > 0) {
      const sorted = sortByProximity(boutiques, coords)
      const nearest = sorted[0]
      if (nearest) {
        setActiveBoutique(nearest.slug, nearest.id)
        setOpen(false)
      }
    }
    setDetecting(false)
  }

  if (!isHydrated) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-platinum hover:text-ivory transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
        {current?.name ?? (activeBoutiqueId ? 'My Store' : 'Select Store')}
        <ChevronDown
          size={14}
          className={['transition-transform duration-200', open ? 'rotate-180' : ''].join(' ')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              role="listbox"
              aria-label="Select store location"
              className="absolute right-0 top-full mt-1 z-50 w-52 glass-heavy rounded-xl overflow-hidden shadow-xl py-1"
              initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Auto-detect button */}
              <button
                onClick={handleAutoDetect}
                disabled={detecting}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gold hover:bg-white/10 transition-colors text-left border-b border-white/10"
              >
                <LocateFixed size={13} className="shrink-0" />
                {detecting ? 'Detecting…' : 'Nearest to me'}
              </button>

              {boutiques.map((b) => (
                <div key={b.slug} role="option" aria-selected={b.slug === activeBoutiqueSlug}>
                  <button
                    onClick={() => {
                      setActiveBoutique(b.slug, b.id)
                      setOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-ivory hover:bg-white/10 transition-colors text-left"
                  >
                    {b.slug === activeBoutiqueSlug
                      ? <Check size={13} className="text-gold shrink-0" />
                      : <span className="w-[13px]" />}
                    <span className="flex-1 min-w-0">
                      <span className="block truncate">{b.name}</span>
                      {b.city && (
                        <span className="block text-xs text-platinum/50 truncate">{b.city}</span>
                      )}
                    </span>
                  </button>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar() {
  const fittingCount = useShopStore((s) => s.fittingRoomIds.length)
  const wishlistCount = useShopStore((s) => s.wishlistIds.length)

  return (
    <header className="fixed top-0 inset-x-0 z-30 h-16 glass-heavy border-b border-white/10">
      <nav className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-gold font-bold text-xl tracking-tight">
            Top<span className="text-ivory">10</span>Prom
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-platinum">
          <Link href="/catalog" className="hover:text-ivory transition-colors">Catalog</Link>
          <Link href="/try-on" className="hover:text-ivory transition-colors text-gold/80 hover:text-gold">Virtual Try-On</Link>
          <Link href="/boutiques" className="hover:text-ivory transition-colors">Locations</Link>
          <Link href="/about" className="hover:text-ivory transition-colors">About</Link>
          <Link href="/book" className="hover:text-ivory transition-colors">Book Appointment</Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <StoreSelector />
          <UserMenu />

          <Link
            href="/wishlist"
            aria-label={`Wishlist (${wishlistCount})`}
            className="relative p-2 rounded-lg text-platinum hover:text-ivory hover:bg-white/5 transition-colors"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-gold text-onyx text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/fitting-room"
            aria-label={`Fitting Room (${fittingCount})`}
            className="relative p-2 rounded-lg text-platinum hover:text-ivory hover:bg-white/5 transition-colors"
          >
            <Shirt size={20} />
            {fittingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-gold text-onyx text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                {fittingCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}
