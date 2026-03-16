import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// This legacy /admin route is superseded by the RBAC SaaS routes.
// Redirect users to the correct new path based on their JWT role claims.
export default async function LegacyAdminLayout() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const systemRole = user.app_metadata?.system_role
  const storeRole  = user.app_metadata?.store_role

  if (systemRole === 'SUPER_ADMIN') redirect('/saas/admin')
  if (storeRole === 'OWNER')        redirect('/saas/owner')
  if (storeRole === 'MANAGER' || storeRole === 'ASSOCIATE') redirect('/saas/staff')

  // Fallback for legacy role values or users not yet migrated
  redirect('/profile')
}
