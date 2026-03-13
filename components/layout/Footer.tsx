'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-onyx mt-24 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-gold font-bold text-xl tracking-tight mb-3">
              Top<span className="text-ivory">10</span>Prom
            </p>
            <p className="text-platinum/60 text-sm leading-relaxed">
              Your moment. Your dress. Your night.<br />
              The only prom boutique that guarantees no duplicates.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-ivory text-sm font-semibold mb-3">Shop</p>
            <ul className="flex flex-col gap-2 text-sm text-platinum/60">
              <li><Link href="/catalog" className="link-hover hover:text-ivory transition-colors">Catalog</Link></li>
              <li><Link href="/fitting-room" className="link-hover hover:text-ivory transition-colors">Fitting Room</Link></li>
              <li><Link href="/wishlist" className="link-hover hover:text-ivory transition-colors">Wishlist</Link></li>
              <li><Link href="/book" className="link-hover hover:text-ivory transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <p className="text-ivory text-sm font-semibold mb-3">Locations</p>
            <ul className="flex flex-col gap-2 text-sm text-platinum/60">
              <li><Link href="/boutiques/atlanta" className="link-hover hover:text-ivory transition-colors">Atlanta</Link></li>
              <li><Link href="/boutiques/marietta" className="link-hover hover:text-ivory transition-colors">Marietta</Link></li>
              <li><Link href="/boutiques/alpharetta" className="link-hover hover:text-ivory transition-colors">Alpharetta</Link></li>
              <li><Link href="/boutiques/buckhead" className="link-hover hover:text-ivory transition-colors">Buckhead</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-ivory text-sm font-semibold mb-3">Info</p>
            <ul className="flex flex-col gap-2 text-sm text-platinum/60">
              <li><Link href="/about" className="link-hover hover:text-ivory transition-colors">About Us</Link></li>
              <li><Link href="/faq" className="link-hover hover:text-ivory transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="link-hover hover:text-ivory transition-colors">Privacy Policy</Link></li>
              <li><Link href="/owner-login" className="link-hover hover:text-ivory transition-colors">Owner Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-platinum/40 text-xs">
            © {new Date().getFullYear()} Top 10 Prom. All rights reserved.
          </p>
          <p className="text-platinum/30 text-xs">
            One dress. One school. One unforgettable night.
          </p>
        </div>
      </div>
    </footer>
  )
}
