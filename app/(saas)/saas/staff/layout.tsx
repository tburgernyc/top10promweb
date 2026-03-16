import { ReactNode } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function StaffFloorLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // The middleware already validated they belong here, but we can extract info for the UI
  const storeRole = user.app_metadata?.store_role

  return (
    <div className="flex h-screen bg-slate-100 font-sans selection:bg-indigo-100 overflow-hidden">
      {/* TABLET OPTIMIZED SIDEBAR
        Designed for left-thumb reachability on an Android Tablet in landscape mode.
      */}
      <aside className="w-24 md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shadow-sm z-10">
        <div>
          <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-100">
            {/* Minimal logo for tablet space saving */}
            <span className="text-2xl font-black tracking-tighter text-indigo-900 hidden md:block">
              TopTen<span className="text-rose-500">Prom</span>
            </span>
            <span className="text-2xl font-black text-indigo-900 md:hidden">T10</span>
          </div>

          <nav className="p-4 space-y-4 mt-4">
            {/* Touch-optimized Nav Links - Large padding (p-4) for easy tapping */}
            <Link
              href="/saas/staff"
              className="flex items-center space-x-3 p-4 rounded-xl bg-indigo-50 text-indigo-700 font-semibold transition-colors active:bg-indigo-100"
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden md:block">Floor Hub</span>
            </Link>

            <Link
              href="/saas/staff/calendar"
              className="flex items-center space-x-3 p-4 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors active:bg-slate-100"
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden md:block">Appointments</span>
            </Link>

            <Link
              href="/saas/staff/clienteling"
              className="flex items-center space-x-3 p-4 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors active:bg-slate-100"
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden md:block">Clienteling CRM</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 text-center md:text-left">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1 hidden md:block">Active Role</p>
            <p className="text-sm font-bold text-slate-700 truncate">{storeRole}</p>
          </div>
        </div>
      </aside>

      {/* Main Floor Content Area - Allows internal scrolling */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto pb-24">
          {children}
        </div>
      </main>
    </div>
  )
}
