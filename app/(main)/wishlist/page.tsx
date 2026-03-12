'use cache'

import type { Metadata } from 'next'
import { WishlistClient } from './WishlistClient'

export const metadata: Metadata = {
  title: 'My Wishlist',
  description: 'Your saved prom dress favorites.',
}

export default async function WishlistPage() {
  return (
    <div className="min-h-dvh pb-24">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ivory">
            My <span className="text-gold">Wishlist</span>
          </h1>
          <p className="text-platinum text-sm mt-1">
            Dresses you&apos;ve saved for later.
          </p>
        </div>
        <WishlistClient />
      </div>
    </div>
  )
}
