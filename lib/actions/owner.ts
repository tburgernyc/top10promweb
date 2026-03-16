'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function inviteStaffMember(formData: FormData) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const storeId = user.app_metadata?.store_id
  const storeRole = user.app_metadata?.store_role
  const systemRole = user.app_metadata?.system_role

  if (!storeId || (storeRole !== 'OWNER' && systemRole !== 'SUPER_ADMIN')) {
    return { error: 'You do not have permission to manage staff.' }
  }

  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const role = formData.get('role') as string

  if (!email || !role) return { error: 'Email and role are required.' }
  if (!['MANAGER', 'ASSOCIATE'].includes(role)) return { error: 'Invalid role selected.' }

  // Look up the invited user by email in profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('email', email)
    .returns<Array<{ id: string; full_name: string | null; email: string | null }>>()
    .maybeSingle()

  if (!profile) {
    return { error: `No account found for ${email}. They must sign up on the app first before being added as staff.` }
  }

  const { error } = await db
    .from('store_staff')
    .insert({
      user_id: profile.id,
      store_id: storeId,
      role,
      is_active: true,
    }) as { error: { message: string; code?: string } | null }

  if (error) {
    if (error.code === '23505') {
      return { error: 'This person is already a staff member at your store.' }
    }
    console.error('Invite Staff Error:', error)
    return { error: 'Failed to add staff member.' }
  }

  revalidatePath('/saas/owner/staff')
  return { success: true }
}

export async function setStaffActiveStatus(staffId: string, isActive: boolean) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const storeId = user.app_metadata?.store_id
  const storeRole = user.app_metadata?.store_role
  const systemRole = user.app_metadata?.system_role

  if (!storeId || (storeRole !== 'OWNER' && systemRole !== 'SUPER_ADMIN')) {
    return { error: 'Unauthorized' }
  }

  const { error } = await db
    .from('store_staff')
    .update({ is_active: isActive })
    .eq('id', staffId)
    .eq('store_id', storeId) as { error: { message: string } | null }

  if (error) return { error: 'Failed to update staff status.' }

  revalidatePath('/saas/owner/staff')
  return { success: true }
}
