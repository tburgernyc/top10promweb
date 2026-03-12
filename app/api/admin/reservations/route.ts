import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', user.id).single()
  const isPlatformAdmin = profile?.role === 'platform_admin'

  let boutiqueId: string | null = null
  if (!isPlatformAdmin) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: staff } = await (supabase as any).from('boutique_staff').select('boutique_id').eq('user_id', user.id).single()
    boutiqueId = staff?.boutique_id ?? null
  }

  const url = new URL(req.url)
  const school = url.searchParams.get('school')
  const dressId = url.searchParams.get('dress_id')
  const promDate = url.searchParams.get('prom_date')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('dress_reservations')
    .select('id, school_name, prom_date, confirmed_at, created_at, dress_id, boutique_id')
    .order('prom_date')

  if (boutiqueId) query = query.eq('boutique_id', boutiqueId)
  if (school) query = query.ilike('school_name', `%${school}%`)
  if (dressId) query = query.eq('dress_id', dressId)
  if (promDate) query = query.eq('prom_date', promDate)

  const { data, error } = await query.limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reservations: data })
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'platform_admin') {
    return NextResponse.json({ error: 'Forbidden — platform admins only' }, { status: 403 })
  }

  const body = await req.json() as { id: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('dress_reservations').delete().eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
