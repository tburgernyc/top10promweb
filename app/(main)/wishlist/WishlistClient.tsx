'use client'

import { useEffect, useState } from 'react'
import { useShopStore } from '@/lib/store/shopStore'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import type { Dress } from '@/types/index'
import { DressCard } from '@/components/catalog/DressCard'
import { DressGridSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export function WishlistClient() {
  const isHydrated = useShopStore((s) => s._hasHydrated)
  const wishlistIds = useShopStore((s) => s.wishlistIds)
  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isHydrated) return

    async function fetchWishlist() {
      if (wishlistIds.length === 0) {
        setLoading(false)
        return
      }

      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('dresses')
        .select('*')
        .in('id', wishlistIds)
        .eq('is_active', true)

      setDresses((data as Dress[]) ?? [])
      setLoading(false)
    }

    fetchWishlist()
  }, [isHydrated, wishlistIds])

  if (!isHydrated || loading) return <DressGridSkeleton count={4} />

  if (wishlistIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <Heart size={48} className="text-platinum/20" />
        <div>
          <p className="text-ivory font-semibold mb-1">Your wishlist is empty</p>
          <p className="text-platinum/50 text-sm">
            Browse the catalog and tap the heart icon to save your favorites.
          </p>
        </div>
        <Link href="/catalog">
          <Button variant="primary">Browse Catalog</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {dresses.map((dress) => (
        <DressCard key={dress.id} dress={dress} />
      ))}
    </div>
  )
}
