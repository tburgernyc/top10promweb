'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Flower2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface BridalPartyFormData {
  bride_name: string
  wedding_date: string
  venue_name: string
  party_size: number
  notes: string
}

interface BridalPartyFormProps {
  onSubmit: (data: BridalPartyFormData) => Promise<void>
}

export function BridalPartyForm({ onSubmit }: BridalPartyFormProps) {
  const shouldReduce = useReducedMotion()
  const [data, setData] = useState<BridalPartyFormData>({
    bride_name: '',
    wedding_date: '',
    venue_name: '',
    party_size: 4,
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update<K extends keyof BridalPartyFormData>(key: K, value: BridalPartyFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!data.bride_name || !data.wedding_date) {
      setError('Bride name and wedding date are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSubmit(data)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setSaving(false)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="glass-light rounded-2xl p-6 max-w-lg mx-auto space-y-5"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
          <Flower2 size={18} className="text-gold" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ivory">Create Your Bridal Party</h2>
          <p className="text-xs text-platinum">Coordinate dresses for your entire wedding party.</p>
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="space-y-3">
        <div>
          <label className="text-xs text-platinum mb-1 block">Bride&apos;s Name *</label>
          <input
            type="text"
            value={data.bride_name}
            onChange={(e) => update('bride_name', e.target.value)}
            placeholder="Your name"
            required
            className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2.5 placeholder:text-platinum/40 focus:outline-none focus:border-gold/50"
          />
        </div>

        <div>
          <label className="text-xs text-platinum mb-1 block">Wedding Date *</label>
          <input
            type="date"
            value={data.wedding_date}
            onChange={(e) => update('wedding_date', e.target.value)}
            required
            className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2.5 focus:outline-none focus:border-gold/50"
          />
        </div>

        <div>
          <label className="text-xs text-platinum mb-1 block">Venue Name</label>
          <input
            type="text"
            value={data.venue_name}
            onChange={(e) => update('venue_name', e.target.value)}
            placeholder="The Grand Ballroom at…"
            className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2.5 placeholder:text-platinum/40 focus:outline-none focus:border-gold/50"
          />
        </div>

        <div>
          <label className="text-xs text-platinum mb-1 block">Estimated Party Size</label>
          <input
            type="number"
            value={data.party_size}
            onChange={(e) => update('party_size', Number(e.target.value))}
            min={1}
            max={30}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2.5 focus:outline-none focus:border-gold/50"
          />
          <p className="text-xs text-platinum/40 mt-1">Including bridesmaids, flower girls, mothers, etc.</p>
        </div>

        <div>
          <label className="text-xs text-platinum mb-1 block">Notes (optional)</label>
          <textarea
            value={data.notes}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="Color scheme, style preferences, special requirements…"
            rows={3}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2.5 placeholder:text-platinum/40 focus:outline-none focus:border-gold/50 resize-none"
          />
        </div>
      </div>

      <Button type="submit" variant="primary" fullWidth disabled={saving}>
        {saving ? 'Creating…' : 'Create Bridal Party'}
      </Button>
    </motion.form>
  )
}
