'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function onboardBoutique(formData: FormData) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.system_role !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const slug = (formData.get('slug') as string).toLowerCase().replace(/\s+/g, '-')
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const timezone = (formData.get('timezone') as string) || 'America/New_York'

  if (!name || !slug) return { error: 'Boutique name and URL slug are required.' }

  const { data: boutique, error } = await db
    .from('boutiques')
    .insert({
      name,
      slug,
      city: city || null,
      state: state || null,
      phone: phone || null,
      email: email || null,
      timezone,
      is_active: true,
      subscription_status: 'ACTIVE',
    })
    .select('id, name')
    .single() as { data: { id: string; name: string } | null; error: { message: string } | null }

  if (error) {
    console.error('Boutique Creation Error:', error)
    return { error: 'Failed to create boutique. The slug may already be in use.' }
  }

  revalidatePath('/saas/admin/stores')
  return { success: true, boutiqueId: boutique?.id }
}

export async function toggleBoutiqueStatus(boutiqueId: string, newStatus: 'ACTIVE' | 'CANCELLED') {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.system_role !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized' }
  }

  const { error } = await db
    .from('boutiques')
    .update({ subscription_status: newStatus })
    .eq('id', boutiqueId) as { error: { message: string } | null }

  if (error) return { error: 'Failed to update boutique status.' }

  revalidatePath('/saas/admin/stores')
  return { success: true }
}
