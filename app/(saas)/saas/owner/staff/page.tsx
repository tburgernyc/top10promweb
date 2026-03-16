import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StaffClient from './StaffClient'

type StaffMember = {
  id: string
  role: string
  is_active: boolean
  created_at: string
  profiles: {
    id: string
    full_name: string | null
    email: string | null
  } | null
}

export default async function OwnerStaffPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const storeId = user.app_metadata?.store_id
  if (!storeId) redirect('/unauthorized')

  const { data: staffData } = await db
    .from('store_staff')
    .select(`
      id,
      role,
      is_active,
      created_at,
      profiles:user_id (id, full_name, email)
    `)
    .eq('store_id', storeId)
    .order('created_at', { ascending: false }) as { data: StaffMember[] | null }

  const staff = staffData || []
  const activeCount = staff.filter(s => s.is_active).length

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Management</h1>
        <p className="text-slate-500 mt-1">
          {activeCount} active staff member{activeCount !== 1 ? 's' : ''} at your boutique.
        </p>
      </header>

      <StaffClient staff={staff} />
    </div>
  )
}
