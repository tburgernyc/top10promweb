import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DressDetailPanel } from '@/components/catalog/DressDetailPanel'
import type { Dress, DressImage } from '@/types/index'

interface DressDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: DressDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dress } = await (supabase as any)
    .from('dresses')
    .select('name, designer, description, images')
    .eq('id', id)
    .single() as { data: { name: string; designer: string | null; description: string | null; images: unknown } | null }

  if (!dress) return { title: 'Dress Not Found' }

  const primaryImage = (() => {
    const imgs = dress.images as DressImage[] | null
    if (!Array.isArray(imgs) || imgs.length === 0) return null
    return imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null
  })()

  const ogUrl = `/api/og?title=${encodeURIComponent(dress.name)}&subtitle=${encodeURIComponent(dress.designer ?? 'Top 10 Prom')}${primaryImage ? `&image=${encodeURIComponent(primaryImage)}` : ''}`

  return {
    title: dress.name,
    description: dress.description ?? `${dress.name} by ${dress.designer} — exclusively available at Top 10 Prom.`,
    openGraph: {
      title: `${dress.name} | Top 10 Prom`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
  }
}

export default async function DressDetailPage({ params }: DressDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: dress } = await supabase
    .from('dresses')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!dress) notFound()

  return (
    <div className="min-h-dvh pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <DressDetailPanel dress={dress as Dress} />
      </div>
    </div>
  )
}
