'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { Check } from 'lucide-react'

interface Boutique {
  id: string
  name: string
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  phone: string | null
  email: string | null
  website: string | null
}

interface BoutiqueSettings {
  boutique_id: string
  lead_time_hours: number | null
  max_appointments_per_day: number | null
  appointment_duration_minutes: number | null
  auto_confirm: boolean | null
  business_hours: Record<string, { open: string; close: string; closed: boolean }> | null
}

interface BoutiqueSettingsFormProps {
  boutique: Boutique | null
  settings: BoutiqueSettings | null
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
type Day = typeof DAYS[number]

const DEFAULT_HOURS: Record<Day, { open: string; close: string; closed: boolean }> = {
  monday: { open: '10:00', close: '18:00', closed: false },
  tuesday: { open: '10:00', close: '18:00', closed: false },
  wednesday: { open: '10:00', close: '18:00', closed: false },
  thursday: { open: '10:00', close: '18:00', closed: false },
  friday: { open: '10:00', close: '18:00', closed: false },
  saturday: { open: '10:00', close: '16:00', closed: false },
  sunday: { open: '12:00', close: '16:00', closed: true },
}

export function BoutiqueSettingsForm({ boutique, settings }: BoutiqueSettingsFormProps) {
  const shouldReduce = useReducedMotion()

  const existingHours = settings?.business_hours as Record<Day, { open: string; close: string; closed: boolean }> | null

  const [hours, setHours] = useState<Record<Day, { open: string; close: string; closed: boolean }>>(
    existingHours ?? DEFAULT_HOURS
  )
  const [leadTime, setLeadTime] = useState(settings?.lead_time_hours ?? 48)
  const [maxAppts, setMaxAppts] = useState(settings?.max_appointments_per_day ?? 8)
  const [duration, setDuration] = useState(settings?.appointment_duration_minutes ?? 60)
  const [autoConfirm, setAutoConfirm] = useState(settings?.auto_confirm ?? false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function updateHours(day: Day, field: 'open' | 'close' | 'closed', value: string | boolean) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }))
  }

  async function handleSave() {
    if (!boutique) return
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        boutique_id: boutique.id,
        business_hours: hours,
        lead_time_hours: leadTime,
        max_appointments_per_day: maxAppts,
        appointment_duration_minutes: duration,
        auto_confirm: autoConfirm,
      }),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setError('Failed to save settings. Please try again.')
    }
    setSaving(false)
  }

  if (!boutique) return null

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="space-y-6"
    >
      {/* Boutique Info */}
      <div className="glass-light rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-ivory">Boutique Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-platinum mb-1">Name</p>
            <p className="text-ivory">{boutique.name}</p>
          </div>
          <div>
            <p className="text-xs text-platinum mb-1">Email</p>
            <p className="text-ivory">{boutique.email ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-platinum mb-1">Phone</p>
            <p className="text-ivory">{boutique.phone ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-platinum mb-1">Address</p>
            <p className="text-ivory">
              {[boutique.address, boutique.city, boutique.state, boutique.zip].filter(Boolean).join(', ') || '—'}
            </p>
          </div>
        </div>
        <p className="text-xs text-platinum/50">Contact support to update boutique info.</p>
      </div>

      {/* Business Hours */}
      <div className="glass-light rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-ivory">Business Hours</h2>
        <div className="space-y-3">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-3">
              <div className="w-24 shrink-0">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!hours[day].closed}
                    onChange={(e) => updateHours(day, 'closed', !e.target.checked)}
                    className="accent-gold"
                  />
                  <span className="text-sm text-ivory capitalize">{day.slice(0, 3)}</span>
                </label>
              </div>
              {!hours[day].closed ? (
                <div className="flex items-center gap-2 text-sm">
                  <input
                    type="time"
                    value={hours[day].open}
                    onChange={(e) => updateHours(day, 'open', e.target.value)}
                    className="rounded-lg bg-white/5 border border-white/10 text-ivory px-2 py-1 text-xs focus:outline-none focus:border-gold/50"
                  />
                  <span className="text-platinum/50">to</span>
                  <input
                    type="time"
                    value={hours[day].close}
                    onChange={(e) => updateHours(day, 'close', e.target.value)}
                    className="rounded-lg bg-white/5 border border-white/10 text-ivory px-2 py-1 text-xs focus:outline-none focus:border-gold/50"
                  />
                </div>
              ) : (
                <span className="text-xs text-platinum/40">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Rules */}
      <div className="glass-light rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-ivory">Booking Rules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-platinum mb-1 block">Lead Time (hours)</label>
            <input
              type="number"
              value={leadTime}
              onChange={(e) => setLeadTime(Number(e.target.value))}
              min={0}
              className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2 focus:outline-none focus:border-gold/50"
            />
            <p className="text-xs text-platinum/40 mt-1">Minimum hours before appointment</p>
          </div>
          <div>
            <label className="text-xs text-platinum mb-1 block">Max Appointments/Day</label>
            <input
              type="number"
              value={maxAppts}
              onChange={(e) => setMaxAppts(Number(e.target.value))}
              min={1}
              className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2 focus:outline-none focus:border-gold/50"
            />
          </div>
          <div>
            <label className="text-xs text-platinum mb-1 block">Duration (minutes)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2 focus:outline-none focus:border-gold/50"
            >
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
              <option value={90}>90 min</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoConfirm}
              onChange={(e) => setAutoConfirm(e.target.checked)}
              className="accent-gold"
            />
            <div>
              <p className="text-sm text-ivory">Auto-confirm appointments</p>
              <p className="text-xs text-platinum/50">Automatically confirm bookings without manual review</p>
            </div>
          </label>
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex justify-end gap-3">
        {saved && (
          <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
            <Check size={14} />
            Saved
          </div>
        )}
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Settings'}
        </Button>
      </div>
    </motion.div>
  )
}
