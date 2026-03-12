'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { X } from 'lucide-react'

const DESIGNERS = ['Jovani', 'Sherri Hill', 'La Femme', 'Mac Duggal', 'Morilee']
const COLORS = ['Midnight Blue', 'Gold', 'Blush Rose', 'Scarlet Red', 'Ivory', 'Emerald Green', 'Black', 'Lavender', 'Silver', 'Coral']
const SIZES = ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24W']

export function FilterBar() {
  const router = useRouter()
  const params = useSearchParams()

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString())
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      router.push(`/catalog?${next.toString()}`, { scroll: false })
    },
    [params, router]
  )

  const clearAll = () => router.push('/catalog', { scroll: false })

  const activeDesigner = params.get('designer')
  const activeColor = params.get('color')
  const activeSize = params.get('size')
  const hasFilters = activeDesigner || activeColor || activeSize

  return (
    <div className="flex flex-col gap-3">
      {/* Filter rows */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* Designer */}
        <select
          aria-label="Filter by designer"
          value={activeDesigner ?? ''}
          onChange={(e) => setParam('designer', e.target.value || null)}
          className="shrink-0 rounded-xl border border-white/10 bg-white/5 text-sm text-ivory px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
        >
          <option value="">All Designers</option>
          {DESIGNERS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Color */}
        <select
          aria-label="Filter by color"
          value={activeColor ?? ''}
          onChange={(e) => setParam('color', e.target.value || null)}
          className="shrink-0 rounded-xl border border-white/10 bg-white/5 text-sm text-ivory px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
        >
          <option value="">All Colors</option>
          {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Size */}
        <select
          aria-label="Filter by size"
          value={activeSize ?? ''}
          onChange={(e) => setParam('size', e.target.value || null)}
          className="shrink-0 rounded-xl border border-white/10 bg-white/5 text-sm text-ivory px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
        >
          <option value="">All Sizes</option>
          {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="shrink-0 flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-sm text-platinum hover:text-ivory hover:border-white/20 transition-colors"
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {activeDesigner && (
            <button
              onClick={() => setParam('designer', null)}
              className="flex items-center gap-1.5 bg-gold/15 text-gold text-xs px-2.5 py-1 rounded-full border border-gold/30 hover:bg-gold/25 transition-colors"
            >
              {activeDesigner} <X size={11} />
            </button>
          )}
          {activeColor && (
            <button
              onClick={() => setParam('color', null)}
              className="flex items-center gap-1.5 bg-gold/15 text-gold text-xs px-2.5 py-1 rounded-full border border-gold/30 hover:bg-gold/25 transition-colors"
            >
              {activeColor} <X size={11} />
            </button>
          )}
          {activeSize && (
            <button
              onClick={() => setParam('size', null)}
              className="flex items-center gap-1.5 bg-gold/15 text-gold text-xs px-2.5 py-1 rounded-full border border-gold/30 hover:bg-gold/25 transition-colors"
            >
              Size {activeSize} <X size={11} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
