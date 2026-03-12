'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Plus, Edit2, ToggleLeft, ToggleRight, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { DressImage } from '@/types/index'

interface InventoryRow {
  id: string
  boutique_id: string
  dress_id: string
  sizes_available: unknown
  quantity: number
  is_active: boolean
  updated_at: string
  dress: { id: string; name: string; designer: string | null; color: string | null; images: unknown } | null
  boutique: { id: string; name: string } | null
}

interface InventoryClientProps {
  inventory: InventoryRow[]
  dresses: { id: string; name: string; designer: string | null }[]
  boutiques: { id: string; name: string }[]
  defaultBoutiqueId: string | null
  isPlatformAdmin: boolean
}

function getPrimaryImg(images: unknown): string | null {
  const imgs = images as DressImage[] | null
  if (!Array.isArray(imgs) || imgs.length === 0) return null
  return imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null
}

export function InventoryClient({
  inventory: initialInventory,
  dresses,
  boutiques,
  defaultBoutiqueId,
  isPlatformAdmin,
}: InventoryClientProps) {
  const shouldReduce = useReducedMotion()
  const [inventory, setInventory] = useState(initialInventory)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQty, setEditQty] = useState(0)
  const [saving, setSaving] = useState(false)

  async function toggleActive(row: InventoryRow) {
    setSaving(true)
    const res = await fetch('/api/admin/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: row.id, is_active: !row.is_active }),
    })
    if (res.ok) {
      setInventory((prev) =>
        prev.map((r) => r.id === row.id ? { ...r, is_active: !r.is_active } : r)
      )
    }
    setSaving(false)
  }

  async function saveQty(row: InventoryRow) {
    setSaving(true)
    const res = await fetch('/api/admin/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: row.id, quantity: editQty }),
    })
    if (res.ok) {
      setInventory((prev) =>
        prev.map((r) => r.id === row.id ? { ...r, quantity: editQty } : r)
      )
      setEditingId(null)
    }
    setSaving(false)
  }

  async function handleAdd(data: { dress_id: string; boutique_id: string; sizes: string[]; quantity: number }) {
    const res = await fetch('/api/admin/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const { item } = await res.json() as { item: InventoryRow }
      setInventory((prev) => [item, ...prev])
      setShowAddModal(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={15} />
          Add Dress to Inventory
        </Button>
      </div>

      {/* Table */}
      <div className="glass-light rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs text-platinum font-semibold uppercase tracking-wider">Dress</th>
                {isPlatformAdmin && <th className="text-left px-4 py-3 text-xs text-platinum font-semibold uppercase tracking-wider">Boutique</th>}
                <th className="text-left px-4 py-3 text-xs text-platinum font-semibold uppercase tracking-wider">Qty</th>
                <th className="text-left px-4 py-3 text-xs text-platinum font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inventory.map((row) => {
                const img = getPrimaryImg(row.dress?.images)
                const isEditing = editingId === row.id

                return (
                  <tr key={row.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {img && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt={row.dress?.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        )}
                        <div>
                          <p className="text-ivory font-medium truncate max-w-[160px]">{row.dress?.name ?? '—'}</p>
                          {row.dress?.designer && <p className="text-xs text-platinum">{row.dress.designer}</p>}
                        </div>
                      </div>
                    </td>
                    {isPlatformAdmin && (
                      <td className="px-4 py-3 text-platinum">{row.boutique?.name ?? '—'}</td>
                    )}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editQty}
                            onChange={(e) => setEditQty(Number(e.target.value))}
                            className="w-16 rounded-lg bg-white/10 border border-white/20 text-ivory text-sm px-2 py-1 focus:outline-none focus:border-gold/50"
                            min={0}
                          />
                          <button onClick={() => saveQty(row)} disabled={saving} className="p-1 text-gold hover:text-gold/70">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 text-platinum hover:text-ivory">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-ivory">{row.quantity}</span>
                          <button
                            onClick={() => { setEditingId(row.id); setEditQty(row.quantity) }}
                            className="p-1 text-platinum/40 hover:text-gold transition-colors"
                            aria-label="Edit quantity"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={row.is_active ? 'green' : 'platinum'}>
                        {row.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(row)}
                        disabled={saving}
                        className="text-platinum/40 hover:text-gold transition-colors disabled:opacity-30"
                        aria-label={row.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {row.is_active ? <ToggleRight size={20} className="text-gold" /> : <ToggleLeft size={20} />}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {inventory.length === 0 && (
                <tr>
                  <td colSpan={isPlatformAdmin ? 5 : 4} className="px-4 py-12 text-center text-platinum/50 text-sm">
                    No inventory items. Add dresses to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div
              initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="fixed z-50 inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md glass-heavy rounded-2xl p-6 shadow-2xl"
            >
              <AddDressForm
                dresses={dresses}
                boutiques={boutiques}
                defaultBoutiqueId={defaultBoutiqueId}
                isPlatformAdmin={isPlatformAdmin}
                onAdd={handleAdd}
                onClose={() => setShowAddModal(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const ALL_SIZES = ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24W']

function AddDressForm({
  dresses, boutiques, defaultBoutiqueId, isPlatformAdmin, onAdd, onClose,
}: {
  dresses: { id: string; name: string; designer: string | null }[]
  boutiques: { id: string; name: string }[]
  defaultBoutiqueId: string | null
  isPlatformAdmin: boolean
  onAdd: (data: { dress_id: string; boutique_id: string; sizes: string[]; quantity: number }) => Promise<void>
  onClose: () => void
}) {
  const [dressId, setDressId] = useState('')
  const [boutiqueId, setBoutiqueId] = useState(defaultBoutiqueId ?? '')
  const [sizes, setSizes] = useState<string[]>([])
  const [qty, setQty] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function toggleSize(s: string) {
    setSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  async function handleSubmit() {
    if (!dressId || !boutiqueId || sizes.length === 0) {
      setError('Please select a dress, boutique, and at least one size.')
      return
    }
    setSaving(true)
    await onAdd({ dress_id: dressId, boutique_id: boutiqueId, sizes, quantity: qty })
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ivory">Add Dress to Inventory</h2>
        <button onClick={onClose} className="p-1 text-platinum hover:text-ivory"><X size={18} /></button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="space-y-3">
        <div>
          <label className="text-xs text-platinum mb-1 block">Dress</label>
          <select
            value={dressId}
            onChange={(e) => setDressId(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2.5 focus:outline-none focus:border-gold/50"
          >
            <option value="">Select dress…</option>
            {dresses.map((d) => (
              <option key={d.id} value={d.id}>{d.name}{d.designer ? ` — ${d.designer}` : ''}</option>
            ))}
          </select>
        </div>

        {isPlatformAdmin && (
          <div>
            <label className="text-xs text-platinum mb-1 block">Boutique</label>
            <select
              value={boutiqueId}
              onChange={(e) => setBoutiqueId(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2.5 focus:outline-none focus:border-gold/50"
            >
              <option value="">Select boutique…</option>
              {boutiques.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="text-xs text-platinum mb-2 block">Available Sizes</label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={[
                  'px-2.5 py-1 rounded-lg text-xs border transition-colors',
                  sizes.includes(s) ? 'bg-gold text-onyx border-gold' : 'border-white/10 text-platinum hover:border-white/30',
                ].join(' ')}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-platinum mb-1 block">Quantity</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            min={0}
            className="w-24 rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2 focus:outline-none focus:border-gold/50"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving} className="flex-1">
          {saving ? 'Adding…' : 'Add to Inventory'}
        </Button>
      </div>
    </div>
  )
}
