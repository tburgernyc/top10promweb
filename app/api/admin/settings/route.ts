import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', user.id).single()
  const isPlatformAdmin = profile?.role === 'platform_admin'

  let boutiqueId: string | null = null
  if (!isPlatformAdmin) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: staff } = await (supabase as any)
      .from('boutique_staff').select('boutique_id, role').eq('user_id', user.id).single()
    if (staff?.role !== 'manager') return NextResponse.json({ error: 'Forbidden — managers only' }, { status: 403 })
    boutiqueId = staff?.boutique_id ?? null
  }

  const body = await req.json() as {
    boutique_id: string
    business_hours: unknown
    lead_time_hours: number
    max_appointments_per_day: number
    appointment_duration_minutes: number
    auto_confirm: boolean
  }

  // Non-platform-admins can only update their own boutique
  if (!isPlatformAdmin && body.boutique_id !== boutiqueId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('boutique_settings')
    .upsert({
      boutique_id: body.boutique_id,
      business_hours: body.business_hours,
      lead_time_hours: body.lead_time_hours,
      max_appointments_per_day: body.max_appointments_per_day,
      appointment_duration_minutes: body.appointment_duration_minutes,
      auto_confirm: body.auto_confirm,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'boutique_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
