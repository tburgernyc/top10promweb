import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/types/index'
import { AppointmentCalendar } from '@/components/admin/AppointmentCalendar'

export default async function AppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/admin/appointments')

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

  // Fetch appointments for the next 7 days
  const from = new Date()
  from.setHours(0, 0, 0, 0)
  const to = new Date(from)
  to.setDate(to.getDate() + 7)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('availability_inquiries')
    .select('id, customer_name, customer_email, preferred_date, preferred_time, status, notes, dress:dresses(name), boutique:boutiques(name)')
    .gte('preferred_date', from.toISOString().split('T')[0])
    .lte('preferred_date', to.toISOString().split('T')[0])
    .order('preferred_date')
    .order('preferred_time')

  if (boutiqueId) query = query.eq('boutique_id', boutiqueId)

  const { data: appointments } = await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ivory">Appointments</h1>
        <p className="text-platinum text-sm mt-1">7-day calendar view.</p>
      </div>
      <AppointmentCalendar appointments={appointments ?? []} />
    </div>
  )
}
