'use client'

import { useState, useMemo } from 'react'
import type { CustomerWithAppointments } from './page'

type Segment = 'all' | 'recentWalkIns' | 'noShows' | 'completed'

const SEGMENT_LABELS: Record<Segment, string> = {
  all: 'All Customers',
  recentWalkIns: 'Recent Walk-ins',
  noShows: 'No-Shows',
  completed: 'Completed Try-Ons',
}

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  SCHEDULED: 'bg-amber-100 text-amber-700',
  NO_SHOW: 'bg-rose-100 text-rose-700',
  CANCELLED: 'bg-slate-100 text-slate-500',
}

function getLatestAppointment(appts: CustomerWithAppointments['appointments']) {
  if (!appts || appts.length === 0) return null
  return appts.sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())[0]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ClientelingTable({
  customers,
  segmentCounts,
}: {
  customers: CustomerWithAppointments[]
  segmentCounts: Record<Segment, number>
}) {
  const [activeSegment, setActiveSegment] = useState<Segment>('all')
  const [search, setSearch] = useState('')

  const sevenDaysAgo = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - 7); return d
  }, [])

  const filtered = useMemo(() => {
    let list = customers

    switch (activeSegment) {
      case 'recentWalkIns':
        list = list.filter(c =>
          c.appointments?.some(a =>
            a.appointment_type === 'WALK_IN' && new Date(a.appointment_date) >= sevenDaysAgo
          )
        )
        break
      case 'noShows':
        list = list.filter(c => c.appointments?.some(a => a.status === 'NO_SHOW'))
        break
      case 'completed':
        list = list.filter(c => c.appointments?.some(a => a.status === 'COMPLETED'))
        break
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      )
    }

    return list
  }, [customers, activeSegment, search, sevenDaysAgo])

  return (
    <div className="space-y-4">
      {/* Segment Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(SEGMENT_LABELS) as Segment[]).map(seg => (
          <button
            key={seg}
            onClick={() => setActiveSegment(seg)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeSegment === seg
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {SEGMENT_LABELS[seg]}
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${activeSegment === seg ? 'bg-indigo-500 text-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
              {segmentCounts[seg]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:outline-none transition-colors text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            {search ? `No customers match &quot;${search}&quot;` : 'No customers in this segment yet.'}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-2">Last Visit</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Notes</div>
              <div className="col-span-1">Action</div>
            </div>

            <div className="divide-y divide-slate-50">
              {filtered.map(customer => {
                const latest = getLatestAppointment(customer.appointments)
                return (
                  <div key={customer.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-5 hover:bg-slate-50 transition-colors items-center">
                    {/* Name */}
                    <div className="md:col-span-3">
                      <p className="font-bold text-slate-900">{customer.first_name} {customer.last_name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Added {formatDate(customer.created_at)}</p>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-2 text-sm text-slate-600 space-y-0.5">
                      {customer.phone && <p>{customer.phone}</p>}
                      {customer.email && <p className="truncate text-xs text-slate-400">{customer.email}</p>}
                      {!customer.phone && !customer.email && <p className="text-slate-300 italic">No contact</p>}
                    </div>

                    {/* Last Visit */}
                    <div className="md:col-span-2 text-sm text-slate-600">
                      {latest ? (
                        <span>{formatDate(latest.appointment_date)}</span>
                      ) : (
                        <span className="text-slate-300 italic">No visits</span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="md:col-span-2">
                      {latest ? (
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[latest.status] || STATUS_STYLES.CANCELLED}`}>
                          {latest.status.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2 text-xs text-slate-500 truncate">
                      {customer.notes || <span className="text-slate-300 italic">No notes</span>}
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-1 flex items-center gap-2">
                      {customer.phone && (
                        <a
                          href={`sms:${customer.phone}?body=Hi ${customer.first_name}! This is your Top 10 Prom boutique. We wanted to follow up with you about your recent visit. Would you like to schedule a fitting?`}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                          title="Send SMS"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </a>
                      )}
                      {customer.email && (
                        <a
                          href={`mailto:${customer.email}?subject=Following up from your prom boutique visit&body=Hi ${customer.first_name},%0D%0A%0D%0AThank you for visiting us! We wanted to follow up...`}
                          className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-slate-400 text-center">
          Showing {filtered.length} of {customers.length} customer{customers.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
