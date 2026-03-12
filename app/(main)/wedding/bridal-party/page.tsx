import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BridalPartyManager } from '@/components/wedding/BridalPartyManager'
import type { BridalPartyWithMembers } from '@/types/index'

export const metadata: Metadata = {
  title: 'My Bridal Party | Top 10 Prom',
  description:
    'Manage your wedding party — add members, assign dresses, and send invites so everyone can coordinate for the big day.',
}

export default async function BridalPartyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/wedding/bridal-party')

  // Load the bride's party (if exists) with members
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: partyData } = await (supabase as any)
    .from('bridal_parties')
    .select('*, members:bridal_party_members(*)')
    .eq('bride_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const party: BridalPartyWithMembers | null = partyData
    ? { ...partyData, members: partyData.members ?? [] }
    : null

  return (
    <div className="min-h-dvh pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ivory">
            My Bridal <span className="text-gold">Party</span>
          </h1>
          <p className="text-platinum mt-2 text-sm">
            Coordinate dresses for your entire wedding party in one place.
          </p>
        </div>

        <BridalPartyManager party={party} userId={user.id} />
      </div>
    </div>
  )
}
