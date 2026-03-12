'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import {
  LayoutDashboard, Package, Calendar, ShieldCheck,
  Users, Settings, ChevronLeft, Menu, LogOut, Store,
} from 'lucide-react'
import { logoutAction } from '@/lib/actions/auth'
import type { UserRole } from '@/types/index'

interface AdminSidebarProps {
  role: UserRole
  userName: string
  boutiqueName: string | null
  boutiqueId: string | null
}

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/inventory', label: 'Inventory', icon: Package },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/reservations', label: 'Reservations', icon: ShieldCheck },
  { href: '/admin/staff', label: 'Staff', icon: Users, roles: ['store_admin', 'platform_admin'] as UserRole[] },
  { href: '/admin/settings', label: 'Settings', icon: Settings, roles: ['store_admin', 'platform_admin'] as UserRole[] },
]

interface SidebarContentProps {
  pathname: string
  visibleNav: typeof NAV_ITEMS
  boutiqueName: string | null
  role: UserRole
  userName: string
  onNavClick: () => void
}

function SidebarContent({ pathname, visibleNav, boutiqueName, role, userName, onNavClick }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full py-4">
      {/* Logo */}
      <div className="px-4 mb-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="text-gold font-bold text-lg tracking-tight">
            Top<span className="text-ivory">10</span>
            <span className="text-platinum text-sm font-normal ml-1">Admin</span>
          </span>
        </Link>
        {boutiqueName && role !== 'platform_admin' && (
          <div className="flex items-center gap-1.5 mt-2">
            <Store size={12} className="text-gold" />
            <span className="text-xs text-platinum truncate">{boutiqueName}</span>
          </div>
        )}
        {role === 'platform_admin' && (
          <div className="flex items-center gap-1.5 mt-2">
            <Store size={12} className="text-gold" />
            <span className="text-xs text-gold">All Locations</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1">
        {visibleNav.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavClick}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gold/15 text-gold border border-gold/20'
                  : 'text-platinum hover:text-ivory hover:bg-white/5',
              ].join(' ')}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-4 pt-4 border-t border-white/10 space-y-2">
        <p className="text-xs text-platinum truncate">{userName}</p>
        <p className="text-xs text-white/30 capitalize">{role.replace('_', ' ')}</p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-2 text-xs text-platinum hover:text-ivory transition-colors mt-1"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </form>
        <Link href="/" className="flex items-center gap-2 text-xs text-platinum/50 hover:text-platinum transition-colors">
          <ChevronLeft size={13} />
          Back to site
        </Link>
      </div>
    </div>
  )
}

export function AdminSidebar({ role, userName, boutiqueName }: AdminSidebarProps) {
  const pathname = usePathname()
  const shouldReduce = useReducedMotion()
  const [mobileOpen, setMobileOpen] = useState(false)

  const visibleNav = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role)
  )

  const sidebarProps: SidebarContentProps = {
    pathname,
    visibleNav,
    boutiqueName,
    role,
    userName,
    onNavClick: () => setMobileOpen(false),
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 inset-y-0 w-56 flex-col glass-heavy border-r border-white/10 z-30">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 h-16 glass-heavy border-b border-white/10 flex items-center justify-between px-4">
        <Link href="/admin/dashboard" className="text-gold font-bold text-lg">
          Top<span className="text-ivory">10</span>
          <span className="text-platinum text-sm font-normal ml-1">Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-platinum hover:text-ivory hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={shouldReduce ? { opacity: 0 } : { x: '-100%' }}
              animate={{ x: 0, opacity: 1 }}
              exit={shouldReduce ? { opacity: 0 } : { x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed left-0 inset-y-0 z-50 w-64 glass-heavy border-r border-white/10"
            >
              <SidebarContent {...sidebarProps} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
