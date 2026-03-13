import { createClient } from '@/lib/supabase/server'
import { FeaturedDressesGrid } from './FeaturedDressesGrid'
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

  return <FeaturedDressesGrid dresses={dresses} boutiqueName={boutiqueName} />
}
