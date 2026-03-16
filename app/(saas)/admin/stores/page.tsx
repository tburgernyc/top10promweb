import { createClient } from '@/lib/supabase/server'
import StoresClient from './StoresClient'

type Boutique = {
  id: string
  name: string
  city: string | null
  state: string | null
  phone: string | null
  email: string | null
  subscription_status: string | null
  is_active: boolean
  created_at: string
}

export default async function AdminStoresPage() {
  const supabase = await createClient()

  const { data: boutiques } = await supabase
    .from('boutiques')
    .select('id, name, city, state, phone, email, subscription_status, is_active, created_at')
    .order('created_at', { ascending: false })
    .returns<Boutique[]>()

  const stores = boutiques || []
  const activeCount = stores.filter(s => s.subscription_status === 'ACTIVE').length
  const pastDueCount = stores.filter(s => s.subscription_status === 'PAST_DUE').length
  const cancelledCount = stores.filter(s => s.subscription_status === 'CANCELLED').length

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Manage Boutiques</h1>
          <p className="text-slate-400 mt-1">Onboard and manage all franchise locations.</p>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</p>
          <p className="text-4xl font-black text-white mt-1">{stores.length}</p>
        </div>
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active</p>
          <p className="text-4xl font-black text-emerald-400 mt-1">{activeCount}</p>
        </div>
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Issues</p>
          <p className="text-4xl font-black text-rose-400 mt-1">{pastDueCount + cancelledCount}</p>
        </div>
      </div>

      <StoresClient stores={stores} />
    </div>
  )
}
