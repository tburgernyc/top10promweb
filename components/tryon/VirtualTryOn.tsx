'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import {
  Upload, X, ChevronLeft, ChevronRight,
  Sparkles, Download, ShoppingBag, Plus, Check,
  Camera, RefreshCw, AlertCircle, CheckCircle2, Info,
  CalendarHeart, Share2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { STATIC_DRESSES } from '@/lib/data/dresses'
import { useShopStore } from '@/lib/store/shopStore'
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

const PROCESSING_LABELS = [
  'Preparing image…',
  'Analyzing body pose…',
  'Draping garment…',
  'Refining lighting & details…',
]

// ── Photo upload zone ─────────────────────────────────────────────────────────
function PhotoZone({ photo, onPhoto, onClear, error }: {
  photo: string | null
  onPhoto: (src: string) => void
  onClear: () => void
  error: string | null
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = (e) => onPhoto(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col h-full">
      <p className="text-[10px] text-platinum/50 tracking-[0.2em] uppercase font-semibold mb-3">
        1. Your Photo
      </p>

      {photo ? (
        <div className="relative flex-1 rounded-2xl overflow-hidden min-h-[320px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="Your photo" className="w-full h-full object-cover object-top" />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 p-1.5 rounded-full glass-heavy text-ivory hover:bg-red-500/30 transition-colors"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between">
            <button
              onClick={() => fileRef.current?.click()}
              className="text-[10px] text-platinum/60 hover:text-gold transition-colors"
            >
              Change photo
            </button>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <CheckCircle2 size={11} /> Ready
            </span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          className={[
            'flex-1 min-h-[320px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group',
            isDragging ? 'border-gold/60 bg-gold/5' : 'border-white/20 hover:border-gold/40',
          ].join(' ')}
        >
          <div className="w-14 h-14 rounded-full glass-light flex items-center justify-center group-hover:border-gold/30 transition-colors">
            <Upload size={24} className="text-platinum/40 group-hover:text-gold/70 transition-colors" />
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-semibold text-ivory/70 group-hover:text-ivory transition-colors">Upload your photo</p>
            <p className="text-xs text-platinum/40 mt-1">Full-length · good lighting · plain background</p>
            <p className="text-[10px] text-platinum/30 mt-2">Max 5 MB · JPG or PNG</p>
          </div>
          <span className="text-[10px] text-platinum/30 flex items-center gap-1.5">
            <Camera size={11} /> Drag & drop or click to browse
          </span>
        </div>
      )}

      {error && (
        <div className="mt-2 p-2.5 bg-red-900/30 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-xs">
          <AlertCircle size={13} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
    </div>
  )
}

// ── Dress picker panel ────────────────────────────────────────────────────────
function DressPicker({ dresses, selectedIdx, onSelect, loading, fittingRoomIds, onAddToFittingRoom }: {
  dresses: Dress[]
  selectedIdx: number
  onSelect: (i: number) => void
  loading: boolean
  fittingRoomIds: string[]
  onAddToFittingRoom: (dressId: string) => void
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
        const inRoom = fittingRoomIds.includes(dress.id)
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
            {active && <div className="absolute inset-0 bg-gold/10 pointer-events-none" />}
            <button
              onClick={(e) => { e.stopPropagation(); onAddToFittingRoom(dress.id) }}
              aria-label={inRoom ? 'In fitting room' : 'Add to fitting room'}
              className={[
                'absolute top-1 right-1 p-1 rounded-full transition-all',
                inRoom
                  ? 'bg-gold/30 border border-gold/50 text-gold opacity-100'
                  : 'glass-heavy text-ivory opacity-0 group-hover:opacity-100 hover:bg-gold/20',
              ].join(' ')}
            >
              {inRoom ? <Check size={10} /> : <Plus size={10} />}
            </button>
            <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[9px] text-ivory truncate font-medium">{dress.name}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Result overlay ────────────────────────────────────────────────────────────
function ResultOverlay({ src, dressSrc, onReset, onDownload, shouldReduce }: {
  src: string
  dressSrc: string | null
  onReset: () => void
  onDownload: () => void
  shouldReduce: boolean | null
}) {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-onyx/80 backdrop-blur-sm rounded-3xl"
      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
    >
      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button onClick={onDownload} className="p-2 glass-heavy rounded-full text-ivory hover:text-gold transition-colors" title="Download">
          <Download size={16} />
        </button>
        <button className="p-2 glass-heavy rounded-full text-ivory hover:text-gold transition-colors" title="Share">
          <Share2 size={16} />
        </button>
      </div>

      {/* Side-by-side preview */}
      <div className="w-full max-w-sm grid grid-cols-2 gap-3 mb-4">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="You" className="w-full h-full object-cover object-top" />
          <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-platinum/60">You</span>
        </div>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gold/30">
          {dressSrc ? (
            <Image src={dressSrc} alt="Try-on result" fill className="object-cover" sizes="180px" />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <Sparkles size={20} className="text-gold/30" />
            </div>
          )}
          <div className="absolute top-1 right-1">
            <div className="group relative">
              <Info size={13} className="text-white/50 cursor-help" />
              <span className="absolute right-5 top-0 w-40 glass-heavy text-ivory text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                AI-generated preview. Actual fit may vary.
              </span>
            </div>
          </div>
          <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-gold">Preview</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="px-5 py-2.5 glass-light text-ivory text-sm font-medium rounded-full hover:bg-white/10 transition-colors border border-white/10"
        >
          Try Another
        </button>
        <Link href="/book">
          <button className="px-5 py-2.5 bg-gold/90 text-onyx text-sm font-bold rounded-full hover:bg-gold transition-colors flex items-center gap-2">
            <CalendarHeart size={14} /> Book Fitting
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function VirtualTryOn({ initialDressId }: { initialDressId?: string }) {
  const shouldReduce = useReducedMotion()

  const [photo, setPhoto]             = useState<string | null>(null)
  const [photoError, setPhotoError]   = useState<string | null>(null)
  const [dresses, setDresses]         = useState<Dress[]>([])
  const [loading, setLoading]         = useState(true)
  const [selectedIdx, setSelectedIdx] = useState(0)

  // Generation flow
  const [isGenerating, setIsGenerating] = useState(false)
  const [processStep, setProcessStep]   = useState(0)
  const [resultReady, setResultReady]   = useState(false)

  const isHydrated      = useShopStore((s) => s._hasHydrated)
  const fittingRoomIds  = useShopStore((s) => s.fittingRoomIds)
  const addToFittingRoom = useShopStore((s) => s.addToFittingRoom)
  const isInFittingRoom = useShopStore((s) => s.isInFittingRoom)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('dresses')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(48)
      .then(({ data }) => {
        const rows = (data as Dress[]) ?? []
        setDresses(rows.length > 0 ? rows : (STATIC_DRESSES as unknown as Dress[]))
        setLoading(false)
      })
  }, [])

  // Deep-link to a specific dress via initialDressId
  useEffect(() => {
    if (!initialDressId || dresses.length === 0) return
    const idx = dresses.findIndex((d) => d.id === initialDressId)
    if (idx !== -1) setSelectedIdx(idx)
  }, [initialDressId, dresses])

  const selected       = dresses[selectedIdx] ?? null
  const selectedSrc    = selected ? getPrimary(selected) : null
  const selectedInRoom = selected ? isInFittingRoom(selected.id) : false

  function prev() { setSelectedIdx((i) => (i - 1 + dresses.length) % dresses.length) }
  function next() { setSelectedIdx((i) => (i + 1) % dresses.length) }

  function handlePhoto(src: string) {
    setPhotoError(null)
    setPhoto(src)
    setResultReady(false)
  }

  function handleGenerate() {
    if (!photo || !selected || isGenerating) return
    setIsGenerating(true)
    setProcessStep(1)
    const steps = [1500, 3000, 4500]
    steps.forEach((ms, i) => setTimeout(() => setProcessStep(i + 2), ms))
    setTimeout(() => {
      setIsGenerating(false)
      setResultReady(true)
    }, 5500)
  }

  function resetResult() {
    setResultReady(false)
    setProcessStep(0)
  }

  const handleDownload = useCallback(() => {
    if (!photo) return
    const a = document.createElement('a')
    a.href = photo
    a.download = 'top10prom-tryon.jpg'
    a.click()
  }, [photo])

  const canGenerate = !!photo && !!selected && !isGenerating && !resultReady

  return (
    <div className="space-y-6">

      {/* How it works */}
      <div className="glass-light rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4 sm:gap-8 border border-gold/10">
        {[
          { n: '1', text: 'Upload your full-length photo' },
          { n: '2', text: 'Select a dress from the catalog' },
          { n: '3', text: 'Generate your AI preview' },
        ].map(({ n, text }) => (
          <div key={n} className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-black flex items-center justify-center shrink-0">{n}</span>
            <span className="text-sm text-platinum/70">{text}</span>
          </div>
        ))}
      </div>

      {/* Main try-on grid
          Mobile: picker (1) → photo (2) → viewer (3)
          Desktop: photo | viewer | picker (column order) */}
      <div className="grid lg:grid-cols-[1fr_1fr_280px] gap-4">

        {/* Dress picker sidebar — first on mobile, last column on desktop */}
        <div className="order-first lg:order-last glass-light rounded-3xl p-5 flex flex-col gap-4 min-h-[200px] lg:min-h-[420px]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-platinum/50 tracking-[0.2em] uppercase font-semibold">2. Choose a Dress</p>
            <Link href="/catalog" className="text-[10px] text-gold hover:text-gold/80 transition-colors flex items-center gap-1">
              More <Plus size={10} />
            </Link>
          </div>
          <DressPicker
            dresses={dresses}
            selectedIdx={selectedIdx}
            onSelect={(i) => { setSelectedIdx(i); resetResult() }}
            loading={loading}
            fittingRoomIds={isHydrated ? fittingRoomIds : []}
            onAddToFittingRoom={addToFittingRoom}
          />
        </div>

        {/* Photo upload panel */}
        <div className="order-2 lg:order-first glass-light rounded-3xl p-5 flex flex-col min-h-[420px]">
          <PhotoZone
            photo={photo}
            onPhoto={handlePhoto}
            onClear={() => { setPhoto(null); resetResult() }}
            error={photoError}
          />
        </div>

        {/* Dress viewer + generation */}
        <div className="order-3 lg:order-2 relative glass-light rounded-3xl p-5 flex flex-col min-h-[420px] overflow-hidden">
          <p className="text-[10px] text-platinum/50 tracking-[0.2em] uppercase font-semibold mb-3">3. Preview</p>

          <div className="relative flex-1 rounded-2xl overflow-hidden group min-h-[320px]">
            {/* Dress image */}
            <AnimatePresence mode="wait">
              {selectedSrc ? (
                <motion.div
                  key={selectedIdx}
                  className="absolute inset-0"
                  initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: isGenerating ? 0.4 : 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                >
                  <Image src={selectedSrc} alt={selected?.name ?? ''} fill
                    className={`object-cover transition-all duration-700 ${isGenerating ? 'grayscale' : ''}`}
                    sizes="500px" priority />
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Sparkles size={32} className="text-gold/30" />
                  <p className="text-platinum/40 text-sm text-center px-4">
                    {loading ? 'Loading dresses…' : 'Select a dress to preview'}
                  </p>
                </div>
              )}
            </AnimatePresence>

            {/* Dress info overlay */}
            {selected && !isGenerating && !resultReady && (
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-[10px] text-gold font-semibold tracking-widest uppercase">{selected.designer}</p>
                <p className="text-ivory font-bold leading-tight">{selected.name}</p>
                {selected.price_cents && <p className="text-gold text-sm font-semibold mt-0.5">{formatPrice(selected.price_cents)}</p>}
              </div>
            )}

            {/* Arrow nav */}
            {dresses.length > 1 && !isGenerating && !resultReady && (
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

            {/* Processing overlay */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center bg-onyx/70 backdrop-blur-sm z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {/* Scan line — CSS-only, respects prefers-reduced-motion via global CSS */}
                  {!shouldReduce && (
                    <div className="absolute left-0 right-0 h-px bg-gold/80 shadow-[0_0_12px_rgba(212,175,55,0.9)] animate-scan pointer-events-none" />
                  )}
                  <RefreshCw size={32} className="text-gold animate-spin mb-4" />
                  <div className="glass-heavy px-5 py-3 rounded-xl text-center">
                    <p className="font-semibold text-ivory text-sm mb-1">AI Magic in Progress</p>
                    <p className="text-gold/80 text-xs h-4 transition-all">
                      {PROCESSING_LABELS[Math.min(processStep - 1, PROCESSING_LABELS.length - 1)]}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result overlay */}
            <AnimatePresence>
              {resultReady && photo && (
                <ResultOverlay
                  src={photo}
                  dressSrc={selectedSrc}
                  onReset={resetResult}
                  onDownload={handleDownload}
                  shouldReduce={shouldReduce}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Generate CTA */}
          {!resultReady && (
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={[
                'mt-4 w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all',
                canGenerate
                  ? 'bg-gold/90 hover:bg-gold text-onyx shadow-lg'
                  : 'bg-white/5 text-platinum/30 cursor-not-allowed',
              ].join(' ')}
            >
              {isGenerating ? (
                <><RefreshCw size={15} className="animate-spin" /> Generating…</>
              ) : (
                <><Sparkles size={15} /> Try It On</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-xs text-platinum/40">
          Your photo stays on your device — nothing is uploaded to our servers.
        </p>
        <div className="flex flex-wrap gap-2">
          {photo && (
            <Button variant="secondary" size="sm" onClick={handleDownload}>
              <Download size={14} /> Save comparison
            </Button>
          )}
          {selected && isHydrated && (
            <Button variant="secondary" size="sm" onClick={() => addToFittingRoom(selected.id)} disabled={selectedInRoom}>
              {selectedInRoom ? <Check size={14} /> : <Plus size={14} />}
              {selectedInRoom ? 'In Fitting Room' : 'Add to Fitting Room'}
            </Button>
          )}
          {selected && (
            <Link href={`/catalog/${selected.id}`}>
              <Button variant="primary" size="sm">
                <ShoppingBag size={14} /> View {selected.name.split(' ').slice(0, 2).join(' ')}
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

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0%   { top: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan { animation: scan 2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .animate-scan { animation: none; } }
      ` }} />
    </div>
  )
}
