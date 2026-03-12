import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DressCard } from '@/components/catalog/DressCard'
import type { Dress } from '@/types/index'

interface FeaturedDressesProps {
  boutiqueId?: string | null
  boutiqueName?: string | null
}

export async function FeaturedDresses({ boutiqueId, boutiqueName }: FeaturedDressesProps) {
  const supabase = await createClient()
  let dresses: Dress[] = []

  if (boutiqueId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: inv } = await (supabase as any)
      .from('dress_inventory')
      .select('dress_id')
      .eq('boutique_id', boutiqueId)
      .eq('is_active', true)
      .limit(8)

    if (inv?.length) {
      const ids = (inv as { dress_id: string }[]).map((r) => r.dress_id)
      const { data } = await supabase
        .from('dresses')
        .select('*')
        .in('id', ids)
        .eq('is_active', true)
        .limit(8)
      dresses = (data as Dress[]) ?? []
    }
  }

  // Fallback: global featured dresses
  if (dresses.length === 0) {
    const { data } = await supabase
      .from('dresses')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8)
    dresses = (data as Dress[]) ?? []
  }

  if (dresses.length === 0) return null

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-gold font-semibold uppercase tracking-widest mb-1">
            {boutiqueName ? `Now at ${boutiqueName}` : 'New Arrivals'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-ivory">
            Featured Dresses
          </h2>
        </div>
        <Link
          href="/catalog"
          className="shrink-0 text-sm text-gold hover:text-gold/80 transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {dresses.map((dress) => (
          <DressCard key={dress.id} dress={dress} />
        ))}
      </div>
    </section>
  )
}
