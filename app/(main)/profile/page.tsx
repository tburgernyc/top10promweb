import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileClient } from './ProfileClient'

export const metadata: Metadata = {
  title: 'My Account | Top 10 Prom',
  description: 'Manage your profile, appointments, wishlist, and reservations.',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/profile')

  const [{ data: profile }, { data: inquiries }, { data: reservations }] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('profiles').select('*').eq('id', user.id).single(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('availability_inquiries')
      .select('*, dress:dresses(id,name,images), boutique:boutiques(id,name,slug)')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('dress_reservations')
      .select('*, dress:dresses(id,name,images), boutique:boutiques(id,name,slug)')
      .eq('customer_id', user.id)
      .order('reserved_at', { ascending: false })
      .limit(10),
  ])

  return (
    <ProfileClient
      profile={profile}
      inquiries={inquiries ?? []}
      reservations={reservations ?? []}
      userEmail={user.email ?? ''}
      userId={user.id}
    />
  )
}
