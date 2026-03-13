import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import type { UserRole } from '@/types/index'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/admin')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const role = profile?.role as UserRole | undefined
  if (!role || !['staff', 'store_admin', 'platform_admin'].includes(role)) {
    redirect('/profile')
  }

  // Fetch boutique assignment for non-platform admins
  let boutique: { id: string; name: string; slug: string } | null = null
  if (role !== 'platform_admin') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: staffRow } = await (supabase as any)
      .from('boutique_staff')
      .select('boutique_id, boutiques(id, name, slug)')
      .eq('user_id', user.id)
      .single()

    boutique = staffRow?.boutiques ?? null
  }

  return (
    <div className="min-h-dvh flex">
      <AdminSidebar
        role={role}
        userName={profile?.full_name ?? user.email ?? 'Admin'}
        boutiqueName={boutique?.name ?? null}
        boutiqueId={boutique?.id ?? null}
      />
      <main className="flex-1 min-w-0 ml-0 md:ml-56 pt-16 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
