'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import {
  CalendarDays, Heart, ShieldCheck, LogOut, Camera,
  Shirt, MapPin, User, ChevronRight, Sparkles,
} from 'lucide-react'
import { logoutAction } from '@/lib/actions/auth'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useShopStore } from '@/lib/store/shopStore'
import type { Profile, AvailabilityInquiry, DressReservation, Dress, Boutique } from '@/types/index'
import type { DressImage } from '@/types/index'

type InquiryRow = AvailabilityInquiry & {
  dress: Pick<Dress, 'id' | 'name' | 'images'>
  boutique: Pick<Boutique, 'id' | 'name' | 'slug'>
}
type ReservationRow = DressReservation & {
  dress: Pick<Dress, 'id' | 'name' | 'images'>
  boutique: Pick<Boutique, 'id' | 'name' | 'slug'>
}

interface ProfileClientProps {
  profile: Profile | null
  inquiries: InquiryRow[]
  reservations: ReservationRow[]
  userEmail: string
  userId: string
}

const STATUS_COLORS = {
  pending: 'platinum', confirmed: 'green', cancelled: 'red',
  completed: 'green', reserved: 'gold', purchased: 'green',
} as const

function getPrimaryImg(images: unknown): string | null {
  const imgs = images as DressImage[] | null
  if (!Array.isArray(imgs) || imgs.length === 0) return null
  return imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null
}

type Tab = 'overview' | 'appointments' | 'reservations'

export function ProfileClient({ profile, inquiries, reservations, userEmail }: ProfileClientProps) {
  const shouldReduce = useReducedMotion()
  const [tab, setTab] = useState<Tab>('overview')
  const wishlistCount = useShopStore((s) => s.wishlistIds.length)
  const fittingCount = useShopStore((s) => s.fittingRoomIds.length)

  const firstName = profile?.full_name?.split(' ')[0] ?? userEmail.split('@')[0]
  const initials = profile?.full_name
    ?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    ?? userEmail[0].toUpperCase()

  const spring = (delay = 0) => ({
    type: 'spring' as const, stiffness: 280, damping: 28, delay,
  })

  return (
    <div className="min-h-dvh pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-8 space-y-6">

        {/* Profile header */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring()}
          className="glass-light rounded-3xl p-6 flex items-center gap-5 border border-gold/10"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 60%)' }}
        >
          <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/30 flex items-center justify-center shrink-0">
            <span className="text-2xl font-black text-gold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-ivory">Welcome back, {firstName}</h1>
            <p className="text-sm text-platinum/60 truncate">{userEmail}</p>
            {profile?.role && (
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-gold/70 bg-gold/10 border border-gold/20 rounded-full px-2 py-0.5 font-semibold uppercase tracking-widest">
                <Sparkles size={9} /> {profile.role.replace('_', ' ')}
              </span>
            )}
          </div>
          <form action={logoutAction}>
            <button type="submit" className="p-2 rounded-xl text-platinum/60 hover:text-ivory hover:bg-white/10 transition-colors">
              <LogOut size={18} />
            </button>
          </form>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring(0.05)}
          className="grid grid-cols-4 gap-2"
        >
          {[
            { icon: CalendarDays, label: 'Bookings', value: inquiries.length, href: undefined, onClick: () => setTab('appointments') },
            { icon: ShieldCheck,  label: 'Reserved', value: reservations.length, href: undefined, onClick: () => setTab('reservations') },
            { icon: Heart,        label: 'Wishlist', value: wishlistCount, href: '/wishlist', onClick: undefined },
            { icon: Shirt,        label: 'Try-On',   value: fittingCount,  href: '/try-on',  onClick: undefined },
          ].map(({ icon: Icon, label, value, href, onClick }) => {
            const content = (
              <div className="glass-light rounded-2xl p-3 text-center space-y-1 hover:border-gold/20 transition-colors border border-white/10">
                <Icon size={18} className="text-gold mx-auto" />
                <p className="text-lg font-black text-ivory">{value}</p>
                <p className="text-[10px] text-platinum/50 uppercase tracking-widest">{label}</p>
              </div>
            )
            if (href) return <Link key={label} href={href}>{content}</Link>
            return <button key={label} onClick={onClick} className="text-left w-full">{content}</button>
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring(0.08)}
          className="flex gap-1 glass-light rounded-2xl p-1"
        >
          {(['overview', 'appointments', 'reservations'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'flex-1 text-xs font-semibold py-2 rounded-xl transition-all capitalize',
                tab === t ? 'bg-gold text-onyx' : 'text-platinum/60 hover:text-ivory',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        {tab === 'overview' && (
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring()}
            className="space-y-3"
          >
            {[
              { icon: Camera,      label: 'Virtual Try-On',     sub: 'See yourself in any dress',        href: '/try-on' },
              { icon: CalendarDays,label: 'Book Appointment',   sub: 'Schedule your private fitting',    href: '/book' },
              { icon: Heart,       label: 'My Wishlist',        sub: `${wishlistCount} saved dress${wishlistCount !== 1 ? 'es' : ''}`, href: '/wishlist' },
              { icon: Shirt,       label: 'Fitting Room',       sub: `${fittingCount} dress${fittingCount !== 1 ? 'es' : ''} queued`, href: '/fitting-room' },
              { icon: MapPin,      label: 'Our Locations',      sub: '5+ Atlanta metro boutiques',       href: '/boutiques' },
              { icon: User,        label: 'Browse Catalog',     sub: '1,000+ styles available now',      href: '/catalog' },
            ].map(({ icon: Icon, label, sub, href }) => (
              <Link key={label} href={href}>
                <div className="glass-light rounded-2xl px-4 py-3.5 flex items-center gap-4 hover:border-gold/20 transition-colors border border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ivory">{label}</p>
                    <p className="text-xs text-platinum/50">{sub}</p>
                  </div>
                  <ChevronRight size={16} className="text-platinum/30 shrink-0" />
                </div>
              </Link>
            ))}
          </motion.div>
        )}

        {tab === 'appointments' && (
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring()}
            className="space-y-3"
          >
            {inquiries.length === 0 ? (
              <div className="glass-light rounded-2xl p-8 text-center space-y-3">
                <CalendarDays size={32} className="text-platinum/20 mx-auto" />
                <p className="text-ivory font-semibold">No appointments yet</p>
                <p className="text-platinum/50 text-sm">Book a private fitting at any of our locations.</p>
                <Link href="/book"><Button variant="primary">Book Now</Button></Link>
              </div>
            ) : inquiries.map((inq) => {
              const img = getPrimaryImg(inq.dress.images)
              return (
                <div key={inq.id} className="glass-light rounded-2xl p-4 flex items-center gap-4">
                  {img && <img src={img} alt={inq.dress.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-ivory font-semibold text-sm truncate">{inq.dress.name}</p>
                    <p className="text-platinum/60 text-xs">{inq.boutique.name}</p>
                    {inq.preferred_date && (
                      <p className="text-platinum/40 text-xs mt-0.5">
                        {inq.preferred_date}{inq.preferred_time ? ` · ${inq.preferred_time}` : ''}
                      </p>
                    )}
                  </div>
                  <Badge variant={STATUS_COLORS[inq.status]}>{inq.status}</Badge>
                </div>
              )
            })}
            <Link href="/book">
              <Button variant="secondary" size="sm" fullWidth>+ New Appointment</Button>
            </Link>
          </motion.div>
        )}

        {tab === 'reservations' && (
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring()}
            className="space-y-3"
          >
            {reservations.length === 0 ? (
              <div className="glass-light rounded-2xl p-8 text-center space-y-3">
                <ShieldCheck size={32} className="text-platinum/20 mx-auto" />
                <p className="text-ivory font-semibold">No reservations yet</p>
                <p className="text-platinum/50 text-sm">Reserve your dress and lock in your no-duplicate guarantee.</p>
                <Link href="/catalog"><Button variant="primary">Shop Dresses</Button></Link>
              </div>
            ) : reservations.map((res) => {
              const img = getPrimaryImg(res.dress.images)
              return (
                <div key={res.id} className="glass-light rounded-2xl p-4 flex items-center gap-4">
                  {img && <img src={img} alt={res.dress.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-ivory font-semibold text-sm truncate">{res.dress.name}</p>
                    <p className="text-platinum/60 text-xs">{res.boutique.name}</p>
                    <p className="text-platinum/40 text-xs mt-0.5">
                      {res.school_name} · {res.event_date}
                    </p>
                  </div>
                  <Badge variant={STATUS_COLORS[res.status]}>{res.status}</Badge>
                </div>
              )
            })}
          </motion.div>
        )}

      </div>
    </div>
  )
}
