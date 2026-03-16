import { createClient } from '@/lib/supabase/server'

export default async function SuperAdminDashboard() {
  const supabase = await createClient()

  // 1. Fetch Global Store Data
  const { data: stores } = await supabase
    .from('boutiques')
    .select('id, subscription_status')
    .returns<Array<{ id: string; subscription_status: string | null }>>()

  const activeStores = stores?.filter(s => s.subscription_status === 'ACTIVE').length || 0
  const totalStores = stores?.length || 0

  // 2. Fetch Global Appointment Volume (Last 30 Days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: globalApptCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .gte('appointment_date', thirtyDaysAgo.toISOString())

  // 3. Fetch Total Registered End-Customers (Profiles with USER role)
  const { count: globalUsersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('system_role', 'USER')

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight">Global Platform Hub</h1>
        <p className="text-slate-400 mt-1">Ecosystem overview for TopTenProm HQ.</p>
      </header>

      {/* Global KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <svg className="w-24 h-24 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
          </div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Active Boutiques</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-black text-white">{activeStores}</p>
            <p className="text-lg text-slate-500">/ {totalStores}</p>
          </div>
          <p className="text-sm text-emerald-400 mt-2 font-medium">Platform Tenants</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Global Appointments</h3>
          <p className="text-5xl font-black text-white">{globalApptCount || 0}</p>
          <p className="text-sm text-blue-400 mt-2 font-medium">Generated in last 30 days</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">App Users</h3>
          <p className="text-5xl font-black text-white">{globalUsersCount || 0}</p>
          <p className="text-sm text-indigo-400 mt-2 font-medium">Registered end-consumers</p>
        </div>

      </div>

      {/* System Alerts / Management Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Subscription Alerts</h2>
          {totalStores - activeStores > 0 ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-4">
              <svg className="w-6 h-6 text-rose-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <div>
                <p className="text-rose-400 font-bold">Past Due Accounts Detected</p>
                <p className="text-sm text-slate-400 mt-1">There are {totalStores - activeStores} stores with past due or cancelled subscriptions. They are currently locked out of the Floor Hub.</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-medium">
              All {totalStores} subscribed boutiques are active and in good standing.
            </div>
          )}
        </section>

        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition font-medium flex justify-between items-center">
              <span>Onboard New Boutique</span>
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition font-medium flex justify-between items-center">
              <span>Export Global Data (CSV)</span>
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            </button>
          </div>
        </section>
      </div>

    </div>
  )
}
