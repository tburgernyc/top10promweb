import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ReactNode } from 'react'
import Link from 'next/link'

export default async function SuperAdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const systemRole = user.app_metadata?.system_role

  // Defense-in-depth: Kick out anyone who isn't the CEO/Super Admin
  if (systemRole !== 'SUPER_ADMIN') {
    redirect('/unauthorized')
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300">
      {/* Executive Sidebar */}
      <aside className="w-64 bg-black border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-black text-white tracking-wide">TopTenProm</h2>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mt-1 block">
            Super Admin Portal
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/saas/admin" className="block px-4 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition">
            Global Hub
          </Link>
          <Link href="/saas/admin/stores" className="block px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition">
            Manage Boutiques
          </Link>
          <Link href="/saas/admin/inventory" className="block px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition">
            Global Inventory
          </Link>
          <Link href="/saas/admin/billing" className="block px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition">
            Subscriptions
          </Link>
        </nav>

        <div className="p-4 text-xs text-slate-600 border-t border-slate-800 text-center">
          System Core: Active
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
