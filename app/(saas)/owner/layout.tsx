import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ReactNode } from 'react'
import Link from 'next/link'

export default async function OwnerDashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Extract the custom JWT metadata configured in Phase 1
  const systemRole = user.app_metadata?.system_role
  const storeRole = user.app_metadata?.store_role
  const storeId = user.app_metadata?.store_id

  // Defense-in-depth: Server-side route protection
  if (systemRole !== 'SUPER_ADMIN' && storeRole !== 'OWNER') {
    redirect('/unauthorized')
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Tier 2 Specific Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white tracking-wide">Owner Portal</h2>
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mt-1 block">
            TopTenProm SaaS
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/saas/owner" className="block px-4 py-2 rounded-md hover:bg-slate-800 hover:text-white transition">
            Global Dashboard
          </Link>
          <Link href="/saas/owner/staff" className="block px-4 py-2 rounded-md hover:bg-slate-800 hover:text-white transition">
            Staff Management
          </Link>
          <Link href="/saas/owner/analytics" className="block px-4 py-2 rounded-md hover:bg-slate-800 hover:text-white transition">
            Financial Analytics
          </Link>
          <Link href="/saas/owner/settings" className="block px-4 py-2 rounded-md hover:bg-slate-800 hover:text-white transition">
            Boutique Settings
          </Link>
        </nav>

        {/* Development Context / Info */}
        {storeId && (
          <div className="p-4 bg-slate-950 text-xs text-slate-500 border-t border-slate-800">
            <p className="truncate">Store ID: {storeId}</p>
            <p>Role: {storeRole}</p>
          </div>
        )}
      </aside>

      {/* Main Content Area - Context is strictly bound to storeId by RLS */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
