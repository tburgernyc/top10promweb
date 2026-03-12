import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function getAuthorizedBoutiqueId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<string | null | 'platform_admin'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', userId).single()
  if (profile?.role === 'platform_admin') return 'platform_admin'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: staff } = await (supabase as any).from('boutique_staff').select('boutique_id, role').eq('user_id', userId).single()
  // Only managers can manage staff
  if (staff?.role !== 'manager') return null
  return staff?.boutique_id ?? null
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const access = await getAuthorizedBoutiqueId(supabase, user.id)
  if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json() as { email: string; boutique_id: string; role: string }
  const { email, boutique_id, role } = body

  if (access !== 'platform_admin' && boutique_id !== access) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Look up or create the user by email via admin API (requires service role)
  // In a real deployment, this would use Supabase admin.inviteUserByEmail
  // Here we create a placeholder profile record and link them
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existingProfile } = await (supabase as any)
    .from('profiles').select('id').eq('email', email).single()

  const profileId: string | null = existingProfile?.id ?? null

  // If user doesn't exist, we'd call admin.inviteUserByEmail — for now record the invite
  if (!profileId) {
    // Record pending invite — in production use Supabase Admin SDK to invite
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: invite } = await (supabase as any)
      .from('staff_invites')
      .insert({ email, boutique_id, role, invited_by: user.id })
      .select('id')
      .single()
    return NextResponse.json({ ok: true, invited: true, invite_id: invite?.id, member: null })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: member, error } = await (supabase as any)
    .from('boutique_staff')
    .upsert({ user_id: profileId, boutique_id, role }, { onConflict: 'user_id,boutique_id' })
    .select(`
      id, boutique_id, user_id, role, created_at,
      profile:profiles(id, email, full_name),
      boutique:boutiques(id, name)
    `)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, invited: false, member })
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const access = await getAuthorizedBoutiqueId(supabase, user.id)
  if (!access) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json() as { id: string }

  // If not platform admin, verify the record belongs to their boutique
  if (access !== 'platform_admin') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('boutique_staff').select('boutique_id').eq('id', body.id).single()
    if (existing?.boutique_id !== access) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('boutique_staff').delete().eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
