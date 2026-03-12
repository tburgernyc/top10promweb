import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/types/index'
import { InventoryClient } from '@/components/admin/InventoryClient'

export default async function InventoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/admin/inventory')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from('profiles').select('role').eq('id', user.id).single()

  const role = profile?.role as UserRole
  let boutiqueId: string | null = null

  if (role !== 'platform_admin') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: staff } = await (supabase as any)
      .from('boutique_staff').select('boutique_id').eq('user_id', user.id).single()
    boutiqueId = staff?.boutique_id ?? null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let invQuery = (supabase as any)
    .from('dress_inventory')
    .select(`
      id, boutique_id, dress_id, sizes_available, quantity, is_active, updated_at,
      dress:dresses(id, name, designer, color, images),
      boutique:boutiques(id, name)
    `)
    .order('updated_at', { ascending: false })
    .limit(50)

  if (boutiqueId) invQuery = invQuery.eq('boutique_id', boutiqueId)

  const { data: inventory } = await invQuery

  // Fetch all dresses for the add-dress modal
  const { data: dresses } = await supabase
    .from('dresses')
    .select('id, name, designer')
    .eq('is_active', true)
    .order('name')

  // Fetch boutiques for platform admin
  const { data: boutiques } = role === 'platform_admin'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? await (supabase as any).from('boutiques').select('id, name').eq('is_active', true)
    : { data: [] }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ivory">Inventory</h1>
        <p className="text-platinum text-sm mt-1">Manage dress availability at your boutique.</p>
      </div>
      <InventoryClient
        inventory={inventory ?? []}
        dresses={dresses ?? []}
        boutiques={role === 'platform_admin' ? (boutiques ?? []) : []}
        defaultBoutiqueId={boutiqueId}
        isPlatformAdmin={role === 'platform_admin'}
      />
    </div>
  )
}
