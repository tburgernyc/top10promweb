'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import {
  Upload, Camera, X, ChevronLeft, ChevronRight,
  Sparkles, ZoomIn, ZoomOut, Download, ShoppingBag, Plus,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/Button'
import type { Dress, DressImage } from '@/types/index'

function getPrimary(dress: Dress): string | null {
  const imgs = (dress.images as unknown as DressImage[]) ?? []
  return imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null
}

function formatPrice(cents: number | null) {
  if (!cents) return null
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100)
}

// ── Photo upload zone ─────────────────────────────────────────────────────────
function PhotoZone({ photo, onPhoto, onClear }: {
  photo: string | null
  onPhoto: (src: string) => void
  onClear: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => onPhoto(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col items-center h-full">
      <p className="text-[10px] text-platinum/50 tracking-[0.2em] uppercase font-semibold mb-3">Your Photo</p>

      {photo ? (
        <div className="relative w-full flex-1 rounded-2xl overflow-hidden min-h-[320px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="Your photo" className="w-full h-full object-cover object-top" />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 p-1.5 rounded-full glass-heavy text-ivory hover:bg-red-500/30 transition-colors"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
            <button
              onClick={() => fileRef.current?.click()}
              className="text-[10px] text-platinum/60 hover:text-gold transition-colors"
            >
              Change photo
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }}
          onDragOver={(e) => e.preventDefault()}
          className="w-full flex-1 min-h-[320px] rounded-2xl border-2 border-dashed border-white/20 hover:border-gold/50 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group"
        >
          <div className="w-14 h-14 rounded-full glass-light flex items-center justify-center group-hover:border-gold/30 transition-colors">
            <Upload size={24} className="text-platinum/40 group-hover:text-gold/70 transition-colors" />
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-semibold text-ivory/70 group-hover:text-ivory transition-colors">Upload your photo</p>
            <p className="text-xs text-platinum/40 mt-1">Full-length · good lighting · plain background</p>
          </div>
          <span className="text-[10px] text-platinum/30 flex items-center gap-1.5">
            <Camera size={11} /> Drag & drop or click to browse
          </span>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
    </div>
  )
}

// ── Dress picker panel ────────────────────────────────────────────────────────
function DressPicker({ dresses, selectedIdx, onSelect, loading }: {
  dresses: Dress[]
  selectedIdx: number
  onSelect: (i: number) => void
  loading: boolean
}) {
  if (loading) return (
    <div className="flex items-center justify-center h-32 text-platinum/40 text-sm">Loading dresses…</div>
  )
  if (dresses.length === 0) return (
    <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
      <p className="text-platinum/40 text-sm">No dresses in catalog yet.</p>
      <Link href="/catalog" className="text-xs text-gold hover:text-gold/80 transition-colors">Browse catalog →</Link>
    </div>
  )

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 max-h-[340px] overflow-y-auto pr-1">
      {dresses.map((dress, i) => {
        const src = getPrimary(dress)
        const active = i === selectedIdx
        return (
          <button
            key={dress.id}
            onClick={() => onSelect(i)}
            className={[
              'relative rounded-xl overflow-hidden border-2 transition-all text-left group',
              active ? 'border-gold scale-[0.97]' : 'border-transparent hover:border-white/20',
            ].join(' ')}
          >
            <div className="aspect-[3/4] bg-white/5">
              {src ? (
                <Image src={src} alt={dress.name} fill className="object-cover" sizes="120px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag size={16} className="text-platinum/20" />
                </div>
              )}
            </div>
            {active && (
              <div className="absolute inset-0 bg-gold/10 pointer-events-none" />
            )}
            <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[9px] text-ivory truncate font-medium">{dress.name}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function VirtualTryOn() {
  const shouldReduce = useReducedMotion()
  const [photo, setPhoto] = useState<string | null>(null)
  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [zoom, setZoom] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('dresses').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(24)
      .then(({ data }) => {
        setDresses((data as Dress[]) ?? [])
        setLoading(false)
      })
  }, [])

  const selected = dresses[selectedIdx] ?? null
  const selectedSrc = selected ? getPrimary(selected) : null

  function prev() { setSelectedIdx((i) => (i - 1 + dresses.length) % dresses.length) }
  function next() { setSelectedIdx((i) => (i + 1) % dresses.length) }

  const handleDownload = useCallback(() => {
    if (!photo) return
    const a = document.createElement('a')
    a.href = photo
    a.download = `top10prom-tryon.jpg`
    a.click()
  }, [photo])

  return (
    <div className="space-y-6">

      {/* How it works */}
      <div className="glass-light rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4 sm:gap-8 border border-gold/10">
        {[
          { n: '1', text: 'Upload your full-length photo' },
          { n: '2', text: 'Browse and select a dress' },
          { n: '3', text: 'Compare side-by-side' },
        ].map(({ n, text }) => (
          <div key={n} className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-black flex items-center justify-center shrink-0">{n}</span>
            <span className="text-sm text-platinum/70">{text}</span>
          </div>
        ))}
      </div>

      {/* Main try-on area */}
      <div className="grid lg:grid-cols-[1fr_1fr_280px] gap-4">

        {/* Photo panel */}
        <div className="glass-light rounded-3xl p-5 flex flex-col min-h-[420px]">
          <PhotoZone photo={photo} onPhoto={setPhoto} onClear={() => setPhoto(null)} />
        </div>

        {/* Dress viewer */}
        <div className="glass-light rounded-3xl p-5 flex flex-col min-h-[420px]">
          <p className="text-[10px] text-platinum/50 tracking-[0.2em] uppercase font-semibold mb-3">Selected Dress</p>

          <div className="relative flex-1 rounded-2xl overflow-hidden group min-h-[320px]">
            <AnimatePresence mode="wait">
              {selectedSrc ? (
                <motion.div
                  key={selectedIdx}
                  className="absolute inset-0"
                  initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: zoom ? 1.45 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                >
                  <Image src={selectedSrc} alt={selected?.name ?? ''} fill
                    className="object-cover" sizes="500px" priority />
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Sparkles size={32} className="text-gold/30" />
                  <p className="text-platinum/40 text-sm">Select a dress →</p>
                </div>
              )}
            </AnimatePresence>

            {/* Dress info overlay */}
            {selected && (
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-[10px] text-gold font-semibold tracking-widest uppercase">{selected.designer}</p>
                <p className="text-ivory font-bold leading-tight">{selected.name}</p>
                {selected.price_cents && <p className="text-gold text-sm font-semibold mt-0.5">{formatPrice(selected.price_cents)}</p>}
              </div>
            )}

            {/* Arrow nav */}
            {dresses.length > 1 && (
              <>
                <button onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full glass-heavy text-ivory opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full glass-heavy text-ivory opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20">
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Zoom */}
            <button onClick={() => setZoom((z) => !z)}
              className="absolute top-2 right-2 p-1.5 rounded-full glass-heavy text-ivory opacity-0 group-hover:opacity-100 transition-opacity">
              {zoom ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
            </button>
          </div>
        </div>

        {/* Dress picker sidebar */}
        <div className="glass-light rounded-3xl p-5 flex flex-col gap-4 min-h-[420px]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-platinum/50 tracking-[0.2em] uppercase font-semibold">Choose a Dress</p>
            <Link href="/catalog" className="text-[10px] text-gold hover:text-gold/80 transition-colors flex items-center gap-1">
              More <Plus size={10} />
            </Link>
          </div>

          <DressPicker dresses={dresses} selectedIdx={selectedIdx} onSelect={setSelectedIdx} loading={loading} />
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-xs text-platinum/40">
          Your photo stays on your device — nothing is uploaded to our servers.
        </p>
        <div className="flex gap-2">
          {photo && (
            <Button variant="secondary" size="sm" onClick={handleDownload}>
              <Download size={14} /> Save comparison
            </Button>
          )}
          {selected && (
            <Link href={`/catalog/${selected.id}`}>
              <Button variant="primary" size="sm">
                <ShoppingBag size={14} /> View {selected.name.split(' ')[0]}
              </Button>
            </Link>
          )}
          <Link href="/book">
            <Button variant="primary" size="sm">
              <Camera size={14} /> Book fitting
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
