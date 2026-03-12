'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'motion/react'
import { Home, Grid3X3, Shirt, CalendarCheck, User } from 'lucide-react'
import { useShopStore } from '@/lib/store/shopStore'

const tabs = [
  { href: '/home',          label: 'Home',        icon: Home },
  { href: '/catalog',       label: 'Catalog',     icon: Grid3X3 },
  { href: '/fitting-room',  label: 'Fitting',     icon: Shirt },
  { href: '/book',          label: 'Book',        icon: CalendarCheck },
  { href: '/profile',       label: 'Profile',     icon: User },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const shouldReduce = useReducedMotion()
  const fittingCount = useShopStore((s) => s.fittingRoomIds.length)

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 md:hidden glass-heavy border-t border-white/10 pb-safe"
      aria-label="Main navigation"
    >
      <div className="flex h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive =
            tab.href === '/home' ? pathname === '/home' : pathname.startsWith(tab.href)
          const isFitting = tab.href === '/fitting-room'

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors"
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={isActive ? 'text-gold' : 'text-platinum/60'}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {isFitting && fittingCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 bg-gold text-onyx text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {fittingCount}
                  </span>
                )}
              </div>

              <span className={isActive ? 'text-gold' : 'text-platinum/50'}>
                {tab.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 inset-x-3 h-0.5 bg-gold rounded-full"
                  transition={
                    shouldReduce
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 400, damping: 35 }
                  }
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
