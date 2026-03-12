import { createClient } from '@/lib/supabase/server'
import type { DressImage } from '@/types/index'
import { TrendingUp } from 'lucide-react'

interface PopularDressesProps {
  boutiqueId: string | null
}

export async function PopularDresses({ boutiqueId }: PopularDressesProps) {
  const supabase = await createClient()

  // Count inquiries per dress to find popular ones
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('availability_inquiries')
    .select('dress_id, dresses(id, name, designer, images)')
    .in('status', ['confirmed', 'pending'])

  if (boutiqueId) query = query.eq('boutique_id', boutiqueId)

  const { data: rows } = await query.limit(50)

  // Aggregate counts
  const counts: Record<string, { name: string; designer: string | null; images: unknown; count: number }> = {}
  for (const row of rows ?? []) {
    if (!row.dresses) continue
    const id = row.dress_id
    counts[id] = counts[id]
      ? { ...counts[id], count: counts[id].count + 1 }
      : { name: row.dresses.name, designer: row.dresses.designer, images: row.dresses.images, count: 1 }
  }

  const popular = Object.entries(counts)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)

  if (popular.length === 0) return null

  function getPrimaryImg(images: unknown): string | null {
    const imgs = images as DressImage[] | null
    if (!Array.isArray(imgs) || imgs.length === 0) return null
    return imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null
  }

  return (
    <div className="glass-light rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-gold" />
        <h2 className="text-sm font-semibold text-ivory">Most Requested Dresses</h2>
      </div>

      <div className="space-y-2">
        {popular.map(([, dress], i) => {
          const img = getPrimaryImg(dress.images)
          return (
            <div key={i} className="flex items-center gap-3 p-2">
              <span className="text-xs font-bold text-gold w-4 shrink-0">{i + 1}</span>
              {img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt={dress.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ivory font-medium truncate">{dress.name}</p>
                {dress.designer && <p className="text-xs text-platinum">{dress.designer}</p>}
              </div>
              <span className="text-xs text-platinum shrink-0">{dress.count} request{dress.count !== 1 ? 's' : ''}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
