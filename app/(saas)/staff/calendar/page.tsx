import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CalendarAgenda from './CalendarAgenda'

type CalendarAppointment = {
  id: string
  appointment_date: string
  appointment_type: string
  status: string
  notes: string | null
  sales_feedback: string | null
  store_customers: { first_name: string; last_name: string; phone: string | null } | null
}

export default async function StaffCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const storeId = user.app_metadata?.store_id
  if (!storeId) redirect('/unauthorized')

  const { date } = await searchParams
  const queryDate = date || new Date().toISOString().split('T')[0]
  const startOfDay = `${queryDate}T00:00:00.000Z`
  const endOfDay   = `${queryDate}T23:59:59.999Z`

  const { data: appointments } = await db
    .from('appointments')
    .select(`
      id,
      appointment_date,
      appointment_type,
      status,
      notes,
      sales_feedback,
      store_customers:store_customer_id ( first_name, last_name, phone )
    `)
    .eq('store_id', storeId)
    .gte('appointment_date', startOfDay)
    .lte('appointment_date', endOfDay)
    .order('appointment_date', { ascending: true }) as { data: CalendarAppointment[] | null }

  const normalizedAgenda = (appointments ?? []).map(appt => ({
    ...appt,
    customer_name: appt.store_customers
      ? `${appt.store_customers.first_name} ${appt.store_customers.last_name}`
      : 'Walk-In Customer',
    customer_phone: appt.store_customers?.phone ?? 'No phone provided',
  }))

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daily Agenda</h1>
        <p className="text-slate-500 text-lg mt-1">Manage today&apos;s fitting room schedule.</p>
      </div>

      <CalendarAgenda initialDate={queryDate} appointments={normalizedAgenda} />
    </div>
  )
}
