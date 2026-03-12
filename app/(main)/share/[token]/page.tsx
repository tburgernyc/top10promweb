import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SharePageClient } from './SharePageClient'
import type { Dress, DressImage } from '@/types/index'

interface SharePageProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { token } = await params
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: session } = await (supabase as any)
    .from('fitting_room_sessions')
    .select('dress_ids')
    .eq('share_token', token)
    .single()

  if (!session) return { title: 'Fitting Room | Top 10 Prom' }

  const dressIds = session.dress_ids as string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dresses } = await (supabase as any)
    .from('dresses')
    .select('name, images')
    .in('id', dressIds)
    .limit(1)

  const firstName = dresses?.[0]?.name ?? 'Prom Dresses'
  const primaryImage = (() => {
    const imgs = dresses?.[0]?.images as DressImage[] | null
    if (!Array.isArray(imgs) || imgs.length === 0) return null
    return imgs.find((i: DressImage) => i.is_primary)?.url ?? imgs[0]?.url ?? null
  })()

  const ogUrl = `/api/og?title=${encodeURIComponent(`Check out ${firstName}`)}&subtitle=${encodeURIComponent('My prom dress picks on Top 10 Prom')}${primaryImage ? `&image=${encodeURIComponent(primaryImage)}` : ''}`

  return {
    title: 'My Prom Picks | Top 10 Prom',
    description: 'See my fitting room picks and vote on your favorites!',
    openGraph: {
      title: 'My Prom Picks | Top 10 Prom',
      description: 'See my fitting room picks and vote on your favorites!',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'My Prom Picks | Top 10 Prom',
      images: [ogUrl],
    },
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: session } = await (supabase as any)
    .from('fitting_room_sessions')
    .select('id, share_token, dress_ids, created_at')
    .eq('share_token', token)
    .single()

  if (!session) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dresses } = await (supabase as any)
    .from('dresses')
    .select('id, name, designer, color, price_cents, images, description')
    .in('id', session.dress_ids as string[])

  return (
    <SharePageClient
      token={token}
      dresses={(dresses ?? []) as Dress[]}
    />
  )
}
