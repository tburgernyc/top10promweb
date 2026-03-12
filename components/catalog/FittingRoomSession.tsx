'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { X, Shirt, ChevronLeft, ChevronRight, Upload, Camera, Download, ZoomIn, ShoppingBag } from 'lucide-react'
import { useShopStore } from '@/lib/store/shopStore'
import { Button } from '@/components/ui/Button'
import { DressGridSkeleton } from '@/components/ui/Skeleton'
import type { Dress, DressImage } from '@/types/index'
import { createClient } from '@/lib/supabase/browser'

// ── helpers ──────────────────────────────────────────────────────────────────
function getPrimary(dress: Dress): string | null {
  const imgs = (dress.images as unknown as DressImage[]) ?? []
  return imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null
}

function formatPrice(cents: number | null) {
  if (!cents) return null
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100)
}

// ── TryOnPanel ───────────────────────────────────────────────────────────────
function TryOnPanel({ dress, onClose }: { dress: Dress; onClose: () => void }) {
  const shouldReduce = useReducedMotion()
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const dressImg = getPrimary(dress)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setUserPhoto(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 glass-heavy flex flex-col"
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <div>
          <p className="text-xs text-gold font-semibold tracking-widest uppercase">Virtual Try-On</p>
          <h2 className="text-ivory font-bold truncate max-w-xs">{dress.name}</h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-platinum hover:text-ivory transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto">
        <div className="grid md:grid-cols-2 gap-0 h-full min-h-[500px]">

          {/* Left — your photo */}
          <div className="relative flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/10 bg-white/[0.02]">
            <p className="text-[10px] text-platinum/50 tracking-widest uppercase mb-3 font-semibold">Your Photo</p>
            {userPhoto ? (
              <div className="relative w-full max-w-xs aspect-[3/4] rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={userPhoto} alt="Your photo" className="w-full h-full object-cover object-top" />
                <button
                  onClick={() => setUserPhoto(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full glass-heavy text-ivory hover:bg-red-500/30 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className="w-full max-w-xs aspect-[3/4] rounded-2xl border-2 border-dashed border-white/20 hover:border-gold/40 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors group"
              >
                <Upload size={32} className="text-platinum/30 group-hover:text-gold/60 transition-colors" />
                <div className="text-center">
                  <p className="text-sm text-ivory/60 font-medium">Upload your photo</p>
                  <p className="text-xs text-platinum/40 mt-1">Drag & drop or click to browse</p>
                </div>
                <span className="text-[10px] text-platinum/30 flex items-center gap-1">
                  <Camera size={11} /> Best results: full-length, good lighting
                </span>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
          </div>

          {/* Right — the dress */}
          <div className="relative flex flex-col items-center justify-center p-6 bg-white/[0.02]">
            <p className="text-[10px] text-platinum/50 tracking-widest uppercase mb-3 font-semibold">The Dress</p>
            {dressImg ? (
              <div className="relative w-full max-w-xs aspect-[3/4] rounded-2xl overflow-hidden">
                <Image src={dressImg} alt={dress.name} fill className="object-cover" sizes="400px" />
                {/* Gold shimmer overlay */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 50%)' }} />
              </div>
            ) : (
              <div className="w-full max-w-xs aspect-[3/4] rounded-2xl glass-light flex items-center justify-center">
                <Shirt size={48} className="text-platinum/20" />
              </div>
            )}

            {/* Dress info */}
            <div className="mt-4 text-center space-y-1">
              <p className="text-xs text-gold/70 font-semibold tracking-wider uppercase">{dress.designer}</p>
              <p className="text-ivory font-bold">{dress.name}</p>
              {dress.style_number && <p className="text-xs text-platinum/50">Style #{dress.style_number}</p>}
              {dress.price_cents && <p className="text-gold font-semibold">{formatPrice(dress.price_cents)}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
        <p className="text-xs text-platinum/40 hidden sm:block">
          Upload a full-length photo to compare with this dress side-by-side
        </p>
        <div className="flex gap-2 ml-auto">
          {userPhoto && (
            <button
              onClick={() => {
                const a = document.createElement('a')
                a.href = userPhoto
                a.download = `tryon-${dress.name.replace(/\s+/g, '-')}.jpg`
                a.click()
              }}
              className="inline-flex items-center gap-1.5 text-xs text-platinum hover:text-ivory border border-white/10 rounded-xl px-3 py-2 hover:bg-white/5 transition-colors"
            >
              <Download size={13} /> Save photo
            </button>
          )}
          <Link href={`/catalog/${dress.id}`} onClick={onClose}>
            <Button variant="primary" size="sm">
              <ShoppingBag size={14} /> View dress
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main FittingRoomSession ───────────────────────────────────────────────────
export function FittingRoomSession() {
  const shouldReduce = useReducedMotion()
  const isHydrated = useShopStore((s) => s._hasHydrated)
  const fittingRoomIds = useShopStore((s) => s.fittingRoomIds)
  const removeFromFittingRoom = useShopStore((s) => s.removeFromFittingRoom)
  const clearFittingRoom = useShopStore((s) => s.clearFittingRoom)

  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)
  const [tryOnDress, setTryOnDress] = useState<Dress | null>(null)
  const [zoom, setZoom] = useState(false)

  useEffect(() => {
    if (!isHydrated) return
    if (fittingRoomIds.length === 0) { setLoading(false); return }

    const supabase = createClient()
    supabase.from('dresses').select('*').in('id', fittingRoomIds).then(({ data }) => {
      setDresses((data as Dress[]) ?? [])
      setLoading(false)
    })
  }, [fittingRoomIds, isHydrated])

  // Keep activeIdx in bounds when dresses are removed
  useEffect(() => {
    if (dresses.length > 0 && activeIdx >= dresses.length) {
      setActiveIdx(dresses.length - 1)
    }
  }, [dresses.length, activeIdx])

  if (!isHydrated || loading) return <DressGridSkeleton count={4} />

  if (fittingRoomIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-20 h-20 rounded-full glass-light flex items-center justify-center">
          <Shirt size={36} className="text-platinum/30" />
        </div>
        <div>
          <p className="text-ivory font-semibold mb-1">Your fitting room is empty</p>
          <p className="text-platinum/50 text-sm">Browse the catalog and tap the + icon to add dresses.</p>
        </div>
        <Link href="/catalog"><Button variant="primary" size="md">Browse Catalog</Button></Link>
      </div>
    )
  }

  const active = dresses[activeIdx]
  const activeSrc = active ? getPrimary(active) : null

  return (
    <>
      {/* Try-on overlay */}
      <AnimatePresence>
        {tryOnDress && <TryOnPanel dress={tryOnDress} onClose={() => setTryOnDress(null)} />}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left · Featured viewer ── */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-platinum/60">
              {dresses.length} dress{dresses.length !== 1 ? 'es' : ''} · showing {activeIdx + 1} of {dresses.length}
            </p>
            <Button variant="ghost" size="sm" onClick={clearFittingRoom}>Clear all</Button>
          </div>

          {/* Main image */}
          <div className="relative rounded-3xl overflow-hidden glass-light aspect-[3/4] max-h-[70dvh] group">
            <AnimatePresence mode="wait">
              {activeSrc && (
                <motion.div
                  key={activeIdx}
                  className="absolute inset-0"
                  initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <Image
                    src={activeSrc}
                    alt={active?.name ?? ''}
                    fill
                    className={['object-cover transition-transform duration-500', zoom ? 'scale-150' : 'scale-100'].join(' ')}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Overlay info */}
            {active && (
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-[10px] text-gold font-semibold tracking-widest uppercase">{active.designer}</p>
                <p className="text-ivory font-bold text-lg leading-tight">{active.name}</p>
                {active.style_number && <p className="text-platinum/60 text-xs">Style #{active.style_number}</p>}
                {active.price_cents && <p className="text-gold font-semibold mt-1">{formatPrice(active.price_cents)}</p>}
              </div>
            )}

            {/* Nav arrows */}
            {dresses.length > 1 && (
              <>
                <button
                  onClick={() => setActiveIdx((i) => (i - 1 + dresses.length) % dresses.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass-heavy text-ivory hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setActiveIdx((i) => (i + 1) % dresses.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass-heavy text-ivory hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Zoom toggle */}
            <button
              onClick={() => setZoom((z) => !z)}
              className="absolute top-3 right-3 p-2 rounded-full glass-heavy text-ivory opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Toggle zoom"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Action row */}
          {active && (
            <div className="flex gap-2">
              <Button variant="primary" size="md" fullWidth onClick={() => setTryOnDress(active)}>
                <Camera size={16} /> Virtual Try-On
              </Button>
              <Link href={`/catalog/${active.id}`} className="flex-1">
                <Button variant="secondary" size="md" fullWidth>
                  <ShoppingBag size={16} /> View Details
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* ── Right · Thumbnail strip ── */}
        <div className="lg:w-1/3 flex flex-col gap-3">
          <p className="text-xs text-platinum/50 uppercase tracking-widest font-semibold">Your Selections</p>
          <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
            <AnimatePresence mode="popLayout">
              {dresses.map((dress, i) => {
                const src = getPrimary(dress)
                const isActive = i === activeIdx
                return (
                  <motion.div
                    key={dress.id}
                    layout
                    initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className={[
                      'relative rounded-xl overflow-hidden cursor-pointer group border-2 transition-colors',
                      isActive ? 'border-gold' : 'border-transparent',
                    ].join(' ')}
                    onClick={() => setActiveIdx(i)}
                  >
                    <div className="aspect-[3/4]">
                      {src ? (
                        <Image src={src} alt={dress.name} fill className="object-cover" sizes="200px" />
                      ) : (
                        <div className="w-full h-full glass-light flex items-center justify-center">
                          <Shirt size={20} className="text-platinum/20" />
                        </div>
                      )}
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFromFittingRoom(dress.id) }}
                      className="absolute top-1 right-1 p-1 rounded-full glass-heavy text-ivory opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                      aria-label={`Remove ${dress.name}`}
                    >
                      <X size={11} />
                    </button>
                    {/* Try-on shortcut */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setTryOnDress(dress) }}
                      className="absolute bottom-1 left-1 p-1 rounded-full glass-heavy text-ivory opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Try on ${dress.name}`}
                    >
                      <Camera size={11} />
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Book CTA */}
          <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
            <p className="text-xs text-platinum/50 leading-relaxed">
              Ready? Book a private styling appointment and try these dresses in person.
            </p>
            <Link href="/book">
              <Button variant="primary" size="md" fullWidth>Book Appointment</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
