import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/types/index'
import { StaffList } from '@/components/admin/StaffList'

export default async function StaffPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/admin/staff')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles').select('role').eq('id', user.id).single()
  const role = profile?.role as UserRole

  let boutiqueId: string | null = null
  let boutiqueName: string | null = null

  if (role !== 'platform_admin') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: staff } = await (supabase as any)
      .from('boutique_staff').select('boutique_id, boutiques(name)').eq('user_id', user.id).single()
    boutiqueId = staff?.boutique_id ?? null
    boutiqueName = staff?.boutiques?.name ?? null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('boutique_staff')
    .select(`
      id, boutique_id, user_id, role, created_at,
      profile:profiles(id, email, full_name),
      boutique:boutiques(id, name)
    `)
    .order('created_at', { ascending: false })

  if (boutiqueId) query = query.eq('boutique_id', boutiqueId)

  const { data: staffMembers } = await query

  // For platform admin: fetch all boutiques for the invite modal
  const { data: boutiques } = role === 'platform_admin'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? await (supabase as any).from('boutiques').select('id, name').eq('is_active', true).order('name')
    : { data: [] }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ivory">Team</h1>
        <p className="text-platinum text-sm mt-1">
          {boutiqueName ? `Manage team members for ${boutiqueName}.` : 'Manage team members across all boutiques.'}
        </p>
      </div>
      <StaffList
        staff={staffMembers ?? []}
        boutiques={role === 'platform_admin' ? (boutiques ?? []) : []}
        defaultBoutiqueId={boutiqueId}
        isPlatformAdmin={role === 'platform_admin'}
      />
    </div>
  )
}
