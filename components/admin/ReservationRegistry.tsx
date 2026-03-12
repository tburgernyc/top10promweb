'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Badge } from '@/components/ui/Badge'
import { Search, Shield } from 'lucide-react'

interface Reservation {
  id: string
  school_name: string | null
  prom_date: string | null
  confirmed_at: string | null
  created_at: string
  dress: { id: string; name: string; designer: string | null; color: string | null } | null
  boutique: { id: string; name: string } | null
  inquiry: { id: string; customer_name: string; customer_email: string; status: string } | null
}

interface ReservationRegistryProps {
  reservations: Reservation[]
  isPlatformAdmin: boolean
}

export function ReservationRegistry({ reservations, isPlatformAdmin }: ReservationRegistryProps) {
  const shouldReduce = useReducedMotion()
  const [search, setSearch] = useState('')

  const filtered = reservations.filter((r) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      r.school_name?.toLowerCase().includes(q) ||
      r.dress?.name.toLowerCase().includes(q) ||
      r.inquiry?.customer_name.toLowerCase().includes(q) ||
      r.boutique?.name.toLowerCase().includes(q)
    )
  })

  // Group by school → prom_date
  const grouped: Record<string, Record<string, Reservation[]>> = {}
  for (const r of filtered) {
    const school = r.school_name ?? 'Unknown School'
    const date = r.prom_date ?? 'Unknown Date'
    grouped[school] = grouped[school] ?? {}
    grouped[school][date] = [...(grouped[school][date] ?? []), r]
  }

  const schools = Object.keys(grouped).sort()

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-platinum/50" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by school, dress, or customer…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-ivory placeholder:text-platinum/40 focus:outline-none focus:border-gold/50"
        />
      </div>

      {schools.length === 0 && (
        <div className="glass-light rounded-2xl p-12 text-center">
          <Shield size={32} className="mx-auto mb-3 text-platinum/30" />
          <p className="text-platinum/50 text-sm">No reservations found.</p>
        </div>
      )}

      {schools.map((school, schoolIdx) => (
        <motion.div
          key={school}
          initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28, delay: schoolIdx * 0.05 }}
          className="glass-light rounded-2xl overflow-hidden"
        >
          {/* School header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10 bg-white/3">
            <Shield size={14} className="text-gold shrink-0" />
            <h2 className="text-sm font-semibold text-ivory">{school}</h2>
          </div>

          {Object.entries(grouped[school]).sort().map(([date, rows]) => (
            <div key={date}>
              {/* Date sub-header */}
              <div className="px-5 py-2 bg-white/2 border-b border-white/5">
                <p className="text-xs text-platinum font-medium">
                  Prom: {date !== 'Unknown Date' ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : 'Date TBD'}
                </p>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-2 text-xs text-platinum/60 font-medium">Dress</th>
                    <th className="text-left px-5 py-2 text-xs text-platinum/60 font-medium">Customer</th>
                    {isPlatformAdmin && <th className="text-left px-5 py-2 text-xs text-platinum/60 font-medium">Boutique</th>}
                    <th className="text-left px-5 py-2 text-xs text-platinum/60 font-medium">Status</th>
                    <th className="text-left px-5 py-2 text-xs text-platinum/60 font-medium">Reserved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rows.map((r) => (
                    <tr key={r.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-ivory font-medium">{r.dress?.name ?? '—'}</p>
                        {r.dress?.designer && <p className="text-xs text-platinum">{r.dress.designer}</p>}
                        {r.dress?.color && <p className="text-xs text-platinum/50">{r.dress.color}</p>}
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-ivory">{r.inquiry?.customer_name ?? '—'}</p>
                        <p className="text-xs text-platinum/60">{r.inquiry?.customer_email ?? ''}</p>
                      </td>
                      {isPlatformAdmin && (
                        <td className="px-5 py-3 text-platinum text-sm">{r.boutique?.name ?? '—'}</td>
                      )}
                      <td className="px-5 py-3">
                        {r.inquiry?.status === 'confirmed' ? (
                          <Badge variant="green">Confirmed</Badge>
                        ) : r.inquiry?.status === 'pending' ? (
                          <Badge variant="platinum">Pending</Badge>
                        ) : r.inquiry?.status === 'cancelled' ? (
                          <Badge variant="red">Cancelled</Badge>
                        ) : (
                          <Badge variant="blue">Completed</Badge>
                        )}
                      </td>
                      <td className="px-5 py-3 text-xs text-platinum/60">
                        {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}
