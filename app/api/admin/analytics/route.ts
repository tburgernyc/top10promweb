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
  const range = url.searchParams.get('range') ?? '30d'

  const days = range === '7d' ? 7 : range === '90d' ? 90 : 30
  const from = new Date()
  from.setDate(from.getDate() - days)
  const fromStr = from.toISOString()

  // Inquiries over time
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let inqQuery = (supabase as any)
    .from('availability_inquiries')
    .select('id, status, created_at, dress_id')
    .gte('created_at', fromStr)
  if (boutiqueId) inqQuery = inqQuery.eq('boutique_id', boutiqueId)
  const { data: inquiries } = await inqQuery.limit(500)

  // Reservations count
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resQuery = (supabase as any)
    .from('dress_reservations')
    .select('id, created_at')
    .gte('created_at', fromStr)
  if (boutiqueId) resQuery = resQuery.eq('boutique_id', boutiqueId)
  const { data: reservations } = await resQuery.limit(500)

  // Aggregate by day
  const dailyCounts: Record<string, { inquiries: number; confirmed: number; cancelled: number }> = {}
  for (const inq of inquiries ?? []) {
    const day = inq.created_at.split('T')[0] as string
    dailyCounts[day] = dailyCounts[day] ?? { inquiries: 0, confirmed: 0, cancelled: 0 }
    dailyCounts[day].inquiries++
    if (inq.status === 'confirmed') dailyCounts[day].confirmed++
    if (inq.status === 'cancelled') dailyCounts[day].cancelled++
  }

  const timeline = Object.entries(dailyCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, ...counts }))

  // Status breakdown
  const statusCounts: Record<string, number> = {}
  for (const inq of inquiries ?? []) {
    statusCounts[inq.status as string] = (statusCounts[inq.status as string] ?? 0) + 1
  }

  return NextResponse.json({
    range,
    total_inquiries: (inquiries ?? []).length,
    total_reservations: (reservations ?? []).length,
    status_breakdown: statusCounts,
    timeline,
  })
}
