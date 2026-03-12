import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/types/index'
import { BoutiqueSettingsForm } from '@/components/admin/BoutiqueSettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/admin/settings')

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

  // Platform admins need to pick a boutique; for now show first boutique
  if (role === 'platform_admin' && !boutiqueId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: first } = await (supabase as any)
      .from('boutiques').select('id').eq('is_active', true).limit(1).single()
    boutiqueId = first?.id ?? null
  }

  if (!boutiqueId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-ivory">Settings</h1>
        <p className="text-platinum text-sm">No boutique found. Please contact support.</p>
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: boutique } = await (supabase as any)
    .from('boutiques')
    .select('id, name, address, city, state, zip, phone, email, website, lat, lng')
    .eq('id', boutiqueId)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: settings } = await (supabase as any)
    .from('boutique_settings')
    .select('*')
    .eq('boutique_id', boutiqueId)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ivory">Settings</h1>
        <p className="text-platinum text-sm mt-1">Configure your boutique hours, booking rules, and notifications.</p>
      </div>
      <BoutiqueSettingsForm
        boutique={boutique}
        settings={settings}
      />
    </div>
  )
}
