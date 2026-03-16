import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OwnerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  const storeId = user.app_metadata?.store_id

  // Calculate dates for a 30-day lookback
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const isoThirtyDaysAgo = thirtyDaysAgo.toISOString()

  // Fetch only this store's appointments from the last 30 days
  const { data: recentAppointments } = await supabase
    .from('appointments')
    .select('id, status, appointment_type, created_at, appointment_date')
    .eq('store_id', storeId)
    .gte('appointment_date', isoThirtyDaysAgo)
    .returns<Array<{ id: string; status: string; appointment_type: string; created_at: string; appointment_date: string }>>()

  // Aggregate Data
  const appts = recentAppointments || []
  const totalAppts = appts.length
  const walkIns = appts.filter(a => a.appointment_type === 'WALK_IN').length
  const completed = appts.filter(a => a.status === 'COMPLETED').length
  const noShows = appts.filter(a => a.status === 'NO_SHOW').length

  // Simple completion rate calculation
  const completionRate = totalAppts > 0 ? Math.round((completed / totalAppts) * 100) : 0

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Store Performance</h1>
        <p className="text-slate-500 mt-1">Your 30-day snapshot for Boutique #{storeId?.slice(0,8)}</p>
      </header>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Volume</h3>
          <p className="text-4xl font-black text-indigo-900">{totalAppts}</p>
          <p className="text-sm text-slate-400 mt-2">Appointments & Walk-ins</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Walk-in Traffic</h3>
          <p className="text-4xl font-black text-emerald-600">{walkIns}</p>
          <p className="text-sm text-slate-400 mt-2">Logged by staff on floor</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Completion Rate</h3>
          <p className="text-4xl font-black text-blue-600">{completionRate}%</p>
          <p className="text-sm text-slate-400 mt-2">Successfully serviced</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">No-Shows</h3>
          <p className="text-4xl font-black text-rose-500">{noShows}</p>
          <p className="text-sm text-slate-400 mt-2">Missed appointments</p>
        </div>
      </div>

      {/* Recent Feedback/Action Items area */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Insights & Next Steps</h2>
        </div>
        <div className="p-6 text-slate-600">
          <p className="mb-4">
            <strong>Clienteling Tip:</strong> You have {noShows} no-shows this month. Have your Store Manager use the Floor Hub to follow up with these customers and reschedule.
          </p>
          <div className="p-4 bg-indigo-50 text-indigo-800 rounded-xl font-medium">
            Advanced designer analytics and staff performance metrics will populate here as your team logs more sales feedback on the floor.
          </div>
        </div>
      </section>
    </div>
  )
}
