import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function getAuthorizedBoutiqueId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<string | null | 'platform_admin'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', userId).single()
  if (profile?.role === 'platform_admin') return 'platform_admin'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: staff } = await (supabase as any).from('boutique_staff').select('boutique_id').eq('user_id', userId).single()
  return staff?.boutique_id ?? null
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const boutiqueAccess = await getAuthorizedBoutiqueId(supabase, user.id)
  if (!boutiqueAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json() as { dress_id: string; boutique_id: string; sizes: string[]; quantity: number }
  const { dress_id, boutique_id, sizes, quantity } = body

  // Non-platform-admins can only add to their own boutique
  if (boutiqueAccess !== 'platform_admin' && boutique_id !== boutiqueAccess) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: item, error } = await (supabase as any)
    .from('dress_inventory')
    .upsert({
      dress_id,
      boutique_id,
      sizes_available: sizes,
      quantity,
      is_active: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'dress_id,boutique_id' })
    .select(`
      id, boutique_id, dress_id, sizes_available, quantity, is_active, updated_at,
      dress:dresses(id, name, designer, color, images),
      boutique:boutiques(id, name)
    `)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item })
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const boutiqueAccess = await getAuthorizedBoutiqueId(supabase, user.id)
  if (!boutiqueAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json() as { id: string; is_active?: boolean; quantity?: number }
  const { id, ...updates } = body

  // Verify the inventory item belongs to the user's boutique
  if (boutiqueAccess !== 'platform_admin') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('dress_inventory').select('boutique_id').eq('id', id).single()
    if (existing?.boutique_id !== boutiqueAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('dress_inventory')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
