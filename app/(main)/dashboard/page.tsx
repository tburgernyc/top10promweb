import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from './DashboardClient'

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your appointments, wishlist, and reservations.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/dashboard')

  const [{ data: profile }, { data: inquiries }, { data: reservations }] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('profiles').select('*').eq('id', user.id).single(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('availability_inquiries')
      .select(`
        *,
        dress:dresses(id, name, images),
        boutique:boutiques(id, name, slug)
      `)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('dress_reservations')
      .select(`
        *,
        dress:dresses(id, name, images),
        boutique:boutiques(id, name, slug)
      `)
      .eq('customer_id', user.id)
      .order('reserved_at', { ascending: false })
      .limit(10),
  ])

  return (
    <DashboardClient
      profile={profile}
      inquiries={inquiries ?? []}
      reservations={reservations ?? []}
      userEmail={user.email ?? ''}
    />
  )
}
