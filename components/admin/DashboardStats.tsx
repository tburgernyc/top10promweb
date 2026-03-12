'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Calendar, Clock, ShieldCheck, TrendingUp } from 'lucide-react'

interface DashboardStatsProps {
  todayAppointments: number
  pendingInquiries: number
  activeReservations: number
  confirmedThisMonth: number
}

const CARDS = (props: DashboardStatsProps) => [
  {
    label: "Today's Appointments",
    value: props.todayAppointments,
    icon: Calendar,
    color: 'text-gold',
    bg: 'bg-gold/10 border-gold/20',
  },
  {
    label: 'Pending Inquiries',
    value: props.pendingInquiries,
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
  },
  {
    label: 'Active Reservations',
    value: props.activeReservations,
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
  },
  {
    label: 'Confirmed This Month',
    value: props.confirmedThisMonth,
    icon: TrendingUp,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10 border-sky-400/20',
  },
]

export function DashboardStats(props: DashboardStatsProps) {
  const shouldReduce = useReducedMotion()
  const cards = CARDS(props)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }, i) => (
        <motion.div
          key={label}
          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28, delay: i * 0.06 }}
          className="glass-light rounded-2xl p-4 space-y-3"
        >
          <div className={['w-9 h-9 rounded-xl border flex items-center justify-center', bg].join(' ')}>
            <Icon size={18} className={color} />
          </div>
          <div>
            <p className="text-2xl font-bold text-ivory">{value}</p>
            <p className="text-xs text-platinum mt-0.5">{label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
