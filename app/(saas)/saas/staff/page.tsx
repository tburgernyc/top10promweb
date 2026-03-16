import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type Appointment = {
  id: string
  appointment_date: string
  appointment_type: string
  status: string
  notes: string | null
  store_customers: { first_name: string; last_name: string } | null
}

const STATUS_STYLES: Record<string, string> = {
  SCHEDULED:   'bg-amber-100 text-amber-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED:   'bg-emerald-100 text-emerald-700',
  NO_SHOW:     'bg-rose-100 text-rose-700',
  CANCELLED:   'bg-slate-100 text-slate-500',
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const h = d.getUTCHours()
  const m = d.getUTCMinutes().toString().padStart(2, '0')
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return { time: `${hour}:${m}`, period }
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export default async function StaffFloorDashboard() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const storeId = user.app_metadata?.store_id
  if (!storeId) redirect('/unauthorized')

  // Today's window (UTC)
  const now = new Date()
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const tomorrowStart = new Date(todayStart)
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1)

  // Upcoming window for the schedule panel (next 7 days from now)
  const sevenDaysOut = new Date(now)
  sevenDaysOut.setUTCDate(sevenDaysOut.getUTCDate() + 7)

  // Today's appointments (all statuses)
  const { data: todayData } = await db
    .from('appointments')
    .select(`
      id, appointment_date, appointment_type, status, notes,
      store_customers ( first_name, last_name )
    `)
    .eq('store_id', storeId)
    .gte('appointment_date', todayStart.toISOString())
    .lt('appointment_date', tomorrowStart.toISOString())
    .order('appointment_date', { ascending: true }) as { data: Appointment[] | null }

  // Next 5 upcoming scheduled appointments (next 7 days)
  const { data: upcomingData } = await db
    .from('appointments')
    .select(`
      id, appointment_date, appointment_type, status, notes,
      store_customers ( first_name, last_name )
    `)
    .eq('store_id', storeId)
    .eq('status', 'SCHEDULED')
    .gte('appointment_date', now.toISOString())
    .lt('appointment_date', sevenDaysOut.toISOString())
    .order('appointment_date', { ascending: true })
    .limit(5) as { data: Appointment[] | null }

  const today = todayData ?? []
  const upcoming = upcomingData ?? []

  const totalToday     = today.length
  const completedToday = today.filter(a => a.status === 'COMPLETED' || a.status === 'NO_SHOW').length
  const walkInsToday   = today.filter(a => a.appointment_type === 'WALK_IN').length
  const remainingToday = totalToday - completedToday
  const nextUp         = upcoming[0] ?? null

  return (
    <div className="space-y-8">

      {/* Header & Walk-In CTA */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Floor Hub</h1>
          <p className="text-slate-500 mt-1">Manage today&apos;s appointments and walk-ins.</p>
        </div>
        <Link
          href="/saas/staff/walk-in"
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Register Walk-In
        </Link>
      </header>

      {/* Today's Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 text-indigo-600 mb-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-700">Today&apos;s Appointments</h3>
          </div>
          <p className="text-4xl font-black text-slate-900">{totalToday}</p>
          <p className="text-sm text-slate-500 mt-2">
            {completedToday} completed · {remainingToday} remaining
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 text-emerald-600 mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-700">Walk-Ins Today</h3>
          </div>
          <p className="text-4xl font-black text-slate-900">{walkInsToday}</p>
          <p className="text-sm text-slate-500 mt-2">Logged since open</p>
        </div>

        {nextUp ? (
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <h3 className="text-indigo-300 font-semibold mb-1 uppercase tracking-wider text-sm">
              Up Next — {formatTime(nextUp.appointment_date).time} {formatTime(nextUp.appointment_date).period}
            </h3>
            <p className="text-2xl font-bold mb-1">
              {nextUp.store_customers
                ? `${nextUp.store_customers.first_name} ${nextUp.store_customers.last_name}`
                : 'Walk-In Customer'}
            </p>
            <p className="text-slate-400 text-sm mb-4">
              {nextUp.appointment_type === 'WALK_IN' ? 'Walk-in' : 'Appointment'}
              {nextUp.notes ? ` · ${nextUp.notes}` : ''}
            </p>
            <Link
              href="/saas/staff/calendar"
              className="block w-full py-3 bg-white text-slate-900 font-bold rounded-xl text-center active:scale-95 transition-transform"
            >
              View Calendar
            </Link>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center justify-center text-center gap-2">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-500 text-sm font-medium">No upcoming appointments</p>
            <p className="text-slate-400 text-xs">in the next 7 days</p>
          </div>
        )}
      </div>

      {/* Upcoming Schedule */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Upcoming Schedule</h2>
          <Link href="/saas/staff/calendar" className="text-indigo-600 font-medium hover:underline text-sm">
            View Full Calendar
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No scheduled appointments in the next 7 days.
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {upcoming.map(appt => {
              const { time, period } = formatTime(appt.appointment_date)
              return (
                <div key={appt.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex flex-col items-center justify-center flex-shrink-0 text-slate-600">
                      <span className="text-xs font-bold leading-none">{time}</span>
                      <span className="text-[10px] uppercase leading-none mt-0.5">{period}</span>
                      <span className="text-[9px] text-slate-400 mt-1 leading-none">
                        {formatShortDate(appt.appointment_date).split(',')[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-900">
                        {appt.store_customers
                          ? `${appt.store_customers.first_name} ${appt.store_customers.last_name}`
                          : 'Walk-In Customer'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {appt.appointment_type === 'WALK_IN' ? 'Walk-in' : 'Appointment'}
                        {appt.notes ? ` · ${appt.notes}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold w-fit ${STATUS_STYLES[appt.status] ?? STATUS_STYLES.CANCELLED}`}>
                    {appt.status.replace('_', ' ')}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>

    </div>
  )
}
