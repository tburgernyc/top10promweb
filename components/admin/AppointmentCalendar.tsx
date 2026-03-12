'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Badge } from '@/components/ui/Badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Appointment {
  id: string
  customer_name: string
  customer_email: string
  preferred_date: string | null
  preferred_time: string | null
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: string | null
  dress: { name: string } | null
  boutique: { name: string } | null
}

interface AppointmentCalendarProps {
  appointments: Appointment[]
}

const STATUS_COLOR = {
  pending: 'border-l-amber-400 bg-amber-400/5',
  confirmed: 'border-l-emerald-400 bg-emerald-400/5',
  cancelled: 'border-l-red-400 bg-red-400/5',
  completed: 'border-l-sky-400 bg-sky-400/5',
} as const

const STATUS_VARIANT = {
  pending: 'platinum', confirmed: 'green', cancelled: 'red', completed: 'blue',
} as const

export function AppointmentCalendar({ appointments }: AppointmentCalendarProps) {
  const shouldReduce = useReducedMotion()
  const [weekOffset, setWeekOffset] = useState(0)

  // Build 7-day week starting from today + offset
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + weekOffset * 7 + i)
    return d
  })

  const grouped: Record<string, Appointment[]> = {}
  for (const appt of appointments) {
    if (!appt.preferred_date) continue
    const key = appt.preferred_date
    grouped[key] = [...(grouped[key] ?? []), appt]
  }

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekOffset((v) => v - 1)}
          className="p-2 rounded-lg text-platinum hover:text-ivory hover:bg-white/10 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm text-ivory font-medium">
          {MONTHS[days[0].getMonth()]} {days[0].getDate()} – {MONTHS[days[6].getMonth()]} {days[6].getDate()}, {days[6].getFullYear()}
        </span>
        <button
          onClick={() => setWeekOffset((v) => v + 1)}
          className="p-2 rounded-lg text-platinum hover:text-ivory hover:bg-white/10 transition-colors"
          aria-label="Next week"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
        {days.map((day, idx) => {
          const dateKey = day.toISOString().split('T')[0]
          const isToday = dateKey === today
          const dayAppts = grouped[dateKey] ?? []

          return (
            <motion.div
              key={dateKey}
              initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28, delay: idx * 0.04 }}
              className={[
                'rounded-xl p-2 min-h-[100px]',
                isToday ? 'bg-gold/5 border border-gold/20' : 'glass-light',
              ].join(' ')}
            >
              {/* Day header */}
              <div className={['text-center mb-2', isToday ? 'text-gold' : 'text-platinum'].join(' ')}>
                <p className="text-xs font-medium">{DAY_NAMES[day.getDay()]}</p>
                <p className={['text-lg font-bold leading-none', isToday ? 'text-gold' : 'text-ivory'].join(' ')}>
                  {day.getDate()}
                </p>
              </div>

              {/* Appointments */}
              <div className="space-y-1.5">
                {dayAppts.map((appt) => (
                  <div
                    key={appt.id}
                    className={[
                      'rounded-lg border-l-2 px-2 py-1.5 text-xs',
                      STATUS_COLOR[appt.status],
                    ].join(' ')}
                    title={`${appt.customer_name} — ${appt.dress?.name ?? 'No dress'}`}
                  >
                    <p className="font-medium text-ivory truncate">{appt.customer_name}</p>
                    {appt.preferred_time && (
                      <p className="text-white/40">{appt.preferred_time}</p>
                    )}
                    <Badge variant={STATUS_VARIANT[appt.status]} className="mt-1">
                      {appt.status}
                    </Badge>
                  </div>
                ))}
                {dayAppts.length === 0 && (
                  <p className="text-xs text-white/20 text-center pt-2">—</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
