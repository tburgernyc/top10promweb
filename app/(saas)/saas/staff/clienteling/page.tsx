import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientelingTable from './ClientelingTable'

export type CustomerWithAppointments = {
  id: string
  first_name: string
  last_name: string
  phone: string | null
  email: string | null
  notes: string | null
  created_at: string
  appointments: Array<{
    id: string
    status: string
    appointment_type: string
    appointment_date: string
  }>
}

export default async function ClientelingPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const storeId = user.app_metadata?.store_id
  if (!storeId) redirect('/unauthorized')

  // Fetch store customers with their appointments, most recently created first
  const { data: customersData } = await db
    .from('store_customers')
    .select(`
      id,
      first_name,
      last_name,
      phone,
      email,
      notes,
      created_at,
      appointments (
        id,
        status,
        appointment_type,
        appointment_date
      )
    `)
    .eq('store_id', storeId)
    .order('created_at', { ascending: false }) as { data: CustomerWithAppointments[] | null }

  const customers = customersData || []

  // Pre-compute segment counts for the UI
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const segmentCounts = {
    all: customers.length,
    recentWalkIns: customers.filter(c =>
      c.appointments?.some(a =>
        a.appointment_type === 'WALK_IN' &&
        new Date(a.appointment_date) >= sevenDaysAgo
      )
    ).length,
    noShows: customers.filter(c =>
      c.appointments?.some(a => a.status === 'NO_SHOW')
    ).length,
    completed: customers.filter(c =>
      c.appointments?.some(a => a.status === 'COMPLETED')
    ).length,
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Clienteling CRM</h1>
          <p className="text-slate-500 mt-1">
            {customers.length} customer{customers.length !== 1 ? 's' : ''} in your local database.
          </p>
        </div>
        <a
          href="#export"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </a>
      </header>

      <ClientelingTable customers={customers} segmentCounts={segmentCounts} />
    </div>
  )
}
