'use client'

import { motion, useReducedMotion } from 'motion/react'
import { logoutAction } from '@/lib/actions/auth'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { CalendarDays, Heart, ShieldCheck, LogOut } from 'lucide-react'
import type { Profile, AvailabilityInquiry, DressReservation, Dress, Boutique } from '@/types/index'
import type { DressImage } from '@/types/index'

type InquiryWithRelations = AvailabilityInquiry & {
  dress: Pick<Dress, 'id' | 'name' | 'images'>
  boutique: Pick<Boutique, 'id' | 'name' | 'slug'>
}

type ReservationWithRelations = DressReservation & {
  dress: Pick<Dress, 'id' | 'name' | 'images'>
  boutique: Pick<Boutique, 'id' | 'name' | 'slug'>
}

interface DashboardClientProps {
  profile: Profile | null
  inquiries: InquiryWithRelations[]
  reservations: ReservationWithRelations[]
  userEmail: string
}

const STATUS_COLORS = {
  pending: 'platinum',
  confirmed: 'green',
  cancelled: 'red',
  completed: 'green',
  reserved: 'gold',
  purchased: 'green',
} as const

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
  reserved: 'Reserved',
  purchased: 'Purchased',
} as const

function getPrimaryImage(dress: { images: unknown }): string | null {
  const images = dress.images as DressImage[] | null
  if (!Array.isArray(images) || images.length === 0) return null
  return images.find((img) => img.is_primary)?.url ?? images[0]?.url ?? null
}

export function DashboardClient({
  profile,
  inquiries,
  reservations,
  userEmail,
}: DashboardClientProps) {
  const shouldReduce = useReducedMotion()

  return (
    <div className="min-h-dvh pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-ivory">
              {profile?.full_name ? `Hi, ${profile.full_name.split(' ')[0]}` : 'My Account'}
            </h1>
            <p className="text-sm text-platinum mt-1">{userEmail}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-sm text-platinum hover:text-ivory transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </form>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 30, delay: 0.05 }}
          className="grid grid-cols-2 gap-3"
        >
          <Link href="/book">
            <div className="glass-light rounded-xl p-4 text-center space-y-2 hover:border-gold/30 transition-colors border border-white/10">
              <CalendarDays size={24} className="text-gold mx-auto" />
              <p className="text-sm text-ivory font-medium">Book Appointment</p>
            </div>
          </Link>
          <Link href="/catalog">
            <div className="glass-light rounded-xl p-4 text-center space-y-2 hover:border-gold/30 transition-colors border border-white/10">
              <Heart size={24} className="text-gold mx-auto" />
              <p className="text-sm text-ivory font-medium">Browse Dresses</p>
            </div>
          </Link>
        </motion.div>

        {/* Appointments */}
        <motion.section
          initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ivory flex items-center gap-2">
              <CalendarDays size={18} className="text-gold" />
              Appointments
            </h2>
            {inquiries.length > 0 && (
              <Link href="/book">
                <Button variant="ghost" className="text-xs">New Booking</Button>
              </Link>
            )}
          </div>

          {inquiries.length === 0 ? (
            <div className="glass-light rounded-xl p-6 text-center space-y-3">
              <p className="text-platinum text-sm">No appointments yet.</p>
              <Link href="/book">
                <Button variant="primary" className="text-sm">Book an Appointment</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inquiry) => {
                const img = getPrimaryImage(inquiry.dress)
                return (
                  <div key={inquiry.id} className="glass-light rounded-xl p-4 flex items-center gap-4">
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={inquiry.dress.name}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-ivory font-medium truncate">{inquiry.dress.name}</p>
                      <p className="text-sm text-platinum">{inquiry.boutique.name}</p>
                      {inquiry.preferred_date && (
                        <p className="text-xs text-white/40">
                          {inquiry.preferred_date} {inquiry.preferred_time ? `at ${inquiry.preferred_time}` : ''}
                        </p>
                      )}
                    </div>
                    <Badge variant={STATUS_COLORS[inquiry.status]}>
                      {STATUS_LABELS[inquiry.status]}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </motion.section>

        {/* Reservations */}
        {reservations.length > 0 && (
          <motion.section
            initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.15 }}
          >
            <h2 className="text-lg font-semibold text-ivory flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-gold" />
              My Reservations
            </h2>
            <div className="space-y-3">
              {reservations.map((res) => {
                const img = getPrimaryImage(res.dress)
                return (
                  <div key={res.id} className="glass-light rounded-xl p-4 flex items-center gap-4">
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={res.dress.name}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-ivory font-medium truncate">{res.dress.name}</p>
                      <p className="text-sm text-platinum">{res.boutique.name}</p>
                      <p className="text-xs text-white/40">
                        {res.school_name} • {res.event_date}
                      </p>
                    </div>
                    <Badge variant={STATUS_COLORS[res.status]}>
                      {STATUS_LABELS[res.status]}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}
