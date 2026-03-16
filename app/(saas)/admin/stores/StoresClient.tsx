'use client'

import { useState } from 'react'
import { onboardBoutique, toggleBoutiqueStatus } from '@/lib/actions/admin'

type Boutique = {
  id: string
  name: string
  city: string | null
  state: string | null
  phone: string | null
  email: string | null
  subscription_status: string | null
  is_active: boolean
  created_at: string
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  PAST_DUE: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  CANCELLED: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
}

export default function StoresClient({ stores }: { stores: Boutique[] }) {
  const [showModal, setShowModal] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  async function handleOnboard(formData: FormData) {
    setIsPending(true)
    setError(null)
    const result = await onboardBoutique(formData)
    setIsPending(false)
    if (result.error) {
      setError(result.error)
    } else {
      setShowModal(false)
    }
  }

  async function handleToggle(id: string, current: string | null) {
    setTogglingId(id)
    const newStatus = current === 'ACTIVE' ? 'CANCELLED' : 'ACTIVE'
    await toggleBoutiqueStatus(id, newStatus)
    setTogglingId(null)
  }

  return (
    <>
      {/* Table Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">All Boutiques</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Onboard New Boutique
          </button>
        </div>

        {stores.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No boutiques onboarded yet. Click &quot;Onboard New Boutique&quot; to get started.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {stores.map(store => (
              <div key={store.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-lg truncate">{store.name}</p>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {[store.city, store.state].filter(Boolean).join(', ') || 'Location not set'}
                    {store.email && <span className="ml-3 text-slate-500">{store.email}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[store.subscription_status || 'CANCELLED'] || STATUS_STYLES.CANCELLED}`}>
                    {store.subscription_status || 'Unknown'}
                  </span>
                  <button
                    onClick={() => handleToggle(store.id, store.subscription_status)}
                    disabled={togglingId === store.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
                  >
                    {togglingId === store.id ? '...' : store.subscription_status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Onboard Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">Onboard New Boutique</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form action={handleOnboard} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Boutique Name *</label>
                  <input name="name" required className="w-full h-11 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none" placeholder="Glamour Prom NYC" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">URL Slug *</label>
                  <input name="slug" required className="w-full h-11 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono text-sm" placeholder="glamour-prom-nyc" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">City</label>
                  <input name="city" className="w-full h-11 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none" placeholder="New York" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">State</label>
                  <input name="state" maxLength={2} className="w-full h-11 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none uppercase" placeholder="NY" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                  <input name="phone" type="tel" className="w-full h-11 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none" placeholder="(212) 555-0100" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Email</label>
                  <input name="email" type="email" className="w-full h-11 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none" placeholder="owner@store.com" />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-11 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold rounded-xl transition-colors">
                  {isPending ? 'Creating...' : 'Create Boutique'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
