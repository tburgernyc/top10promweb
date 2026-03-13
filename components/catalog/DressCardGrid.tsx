import { createClient } from '@/lib/supabase/server'
import { STATIC_DRESSES } from '@/lib/data/dresses'
import { DressCard } from './DressCard'
import type { Dress } from '@/types/index'

interface DressCardGridProps {
  boutiqueId?: string | null
  color?: string | null
  designer?: string | null
  eventType?: 'prom' | 'wedding' | null
  limit?: number
}

function applyStaticFilters(
  dresses: Dress[],
  opts: { color?: string | null; designer?: string | null; eventType?: string | null; limit: number }
): Dress[] {
  let filtered = dresses
  if (opts.color) filtered = filtered.filter((d) => d.color?.toLowerCase().includes(opts.color!.toLowerCase()))
  if (opts.designer) filtered = filtered.filter((d) => d.designer?.toLowerCase().includes(opts.designer!.toLowerCase()))
  if (opts.eventType) filtered = filtered.filter((d) => Array.isArray(d.event_types) && (d.event_types as string[]).includes(opts.eventType!))
  return filtered.slice(0, opts.limit)
}

export async function DressCardGrid({
  boutiqueId,
  color,
  designer,
  eventType,
  limit = 24,
}: DressCardGridProps) {
  const supabase = await createClient()

  let dresses: Dress[] = []

  if (boutiqueId) {
    // Fetch dress IDs through inventory, then load the dresses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: invRows } = await (supabase as any)
      .from('dress_inventory')
      .select('dress_id')
      .eq('boutique_id', boutiqueId)
      .eq('is_active', true)
      .limit(limit)

    if (invRows && invRows.length > 0) {
      const ids = (invRows as { dress_id: string }[]).map((r) => r.dress_id)
      const { data } = await supabase
        .from('dresses')
        .select('*')
        .in('id', ids)
        .eq('is_active', true)
        .limit(limit)
      if (data) dresses = data as Dress[]
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('dresses')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (color) query = query.ilike('color', `%${color}%`)
    if (designer) query = query.ilike('designer', `%${designer}%`)
    if (eventType) query = query.contains('event_types', JSON.stringify([eventType]))

    const { data } = await query
    if (data) dresses = data as Dress[]
  }

  // Fall back to static catalog when Supabase has no dress data yet.
  // Remove once seed.sql has been run against the live database.
  if (dresses.length === 0 && !boutiqueId) {
    dresses = applyStaticFilters(STATIC_DRESSES as unknown as Dress[], { color, designer, eventType, limit })
  }

  if (dresses.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
        <p className="text-platinum/50">No dresses found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <>
      {dresses.map((dress) => (
        <DressCard key={dress.id} dress={dress} />
      ))}
    </>
  )
}
