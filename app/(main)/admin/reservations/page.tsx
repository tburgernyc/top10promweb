import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/types/index'
import { ReservationRegistry } from '@/components/admin/ReservationRegistry'

export default async function ReservationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/admin/reservations')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles').select('role').eq('id', user.id).single()
  const role = profile?.role as UserRole

  let boutiqueId: string | null = null
  if (role !== 'platform_admin') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: staff } = await (supabase as any)
      .from('boutique_staff').select('boutique_id').eq('user_id', user.id).single()
    boutiqueId = staff?.boutique_id ?? null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('dress_reservations')
    .select(`
      id, school_name, prom_date, confirmed_at, created_at,
      dress:dresses(id, name, designer, color),
      boutique:boutiques(id, name),
      inquiry:availability_inquiries(id, customer_name, customer_email, status)
    `)
    .order('prom_date', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(100)

  if (boutiqueId) query = query.eq('boutique_id', boutiqueId)

  const { data: reservations } = await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ivory">Reservations</h1>
        <p className="text-platinum text-sm mt-1">
          Dress reservations by school — no two students from the same school wear the same dress.
        </p>
      </div>
      <ReservationRegistry
        reservations={reservations ?? []}
        isPlatformAdmin={role === 'platform_admin'}
      />
    </div>
  )
}
