import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Flower2, CalendarHeart, MapPin, Users, Heart } from 'lucide-react'
import type { BridalPartyWithMembers, Dress, DressImage } from '@/types/index'

interface Props {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('bridal_parties')
    .select('bride_name, wedding_date')
    .eq('share_token', token)
    .single()

  if (!data) return { title: 'Bridal Party | Top 10 Prom' }

  return {
    title: `${data.bride_name}'s Bridal Party | Top 10 Prom`,
    description: `You've been invited to join ${data.bride_name}'s wedding party. View dress options and book your fitting.`,
  }
}

function getPrimaryImage(dress: Dress): string | null {
  const imgs = dress.images as DressImage[] | null
  if (!Array.isArray(imgs) || imgs.length === 0) return null
  return imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null
}

export default async function SharedBridalPartyPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  // Load party + members
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: partyData } = await (supabase as any)
    .from('bridal_parties')
    .select('*, members:bridal_party_members(*)')
    .eq('share_token', token)
    .maybeSingle()

  if (!partyData) notFound()

  const party: BridalPartyWithMembers = {
    ...partyData,
    members: partyData.members ?? [],
  }

  // Load wedding dresses to suggest
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dressData } = await (supabase as any)
    .from('dresses')
    .select('*')
    .eq('is_active', true)
    .contains('event_types', '["wedding"]')
    .limit(8)

  const dresses: Dress[] = dressData ?? []

  const weddingDate = new Date(party.wedding_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-dvh pb-24">
      {/* Hero banner */}
      <section className="relative bg-gradient-to-b from-onyx to-onyx/95 pt-12 pb-10 px-4">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.15) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-medium">
            <Flower2 size={12} />
            Wedding Party Invite
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-ivory">
            {party.bride_name}&apos;s Bridal Party
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-platinum">
            <span className="inline-flex items-center gap-1.5">
              <CalendarHeart size={14} className="text-gold/60" />
              {weddingDate}
            </span>
            {party.venue_name && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-gold/60" />
                {party.venue_name}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Users size={14} className="text-gold/60" />
              {party.members.length} member{party.members.length !== 1 ? 's' : ''}
            </span>
          </div>
          {party.notes && (
            <p className="text-sm text-platinum/70 max-w-md mx-auto italic">&ldquo;{party.notes}&rdquo;</p>
          )}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 mt-10 space-y-12">
        {/* Party members */}
        {party.members.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-ivory mb-4">The Party</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {party.members.map((member) => (
                <div
                  key={member.id}
                  className="glass-light rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm shrink-0">
                    {member.member_name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ivory truncate">{member.member_name}</p>
                    <p className="text-xs text-platinum capitalize">{member.role.replace(/_/g, ' ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested dresses */}
        {dresses.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-ivory mb-1">Dress Suggestions</h2>
            <p className="text-sm text-platinum mb-4">
              Browse options that complement the wedding theme. Book a fitting to see them in person.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {dresses.map((dress) => {
                const img = getPrimaryImage(dress)
                return (
                  <Link key={dress.id} href={`/catalog/${dress.id}`} className="group">
                    <div className="glass-light rounded-2xl overflow-hidden">
                      <div className="relative aspect-[3/4] bg-white/5">
                        {img && (
                          <Image
                            src={img}
                            alt={dress.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, 25vw"
                          />
                        )}
                        {!img && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Heart size={24} className="text-platinum/20" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-platinum/60 truncate">{dress.designer}</p>
                        <p className="text-sm font-semibold text-ivory truncate">{dress.name}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="glass-heavy rounded-2xl p-6 text-center space-y-4">
          <Flower2 size={28} className="text-gold mx-auto" />
          <h3 className="text-lg font-bold text-ivory">Ready to find your dress?</h3>
          <p className="text-sm text-platinum max-w-sm mx-auto">
            Book a private fitting appointment at your nearest Top 10 Prom boutique.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gold text-onyx font-semibold text-base hover:bg-[#c9a227] transition-colors"
          >
            Book Your Fitting
          </Link>
        </div>
      </div>
    </div>
  )
}
