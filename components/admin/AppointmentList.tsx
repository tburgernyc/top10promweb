import { Badge } from '@/components/ui/Badge'
import { CalendarDays } from 'lucide-react'

interface Appointment {
  id: string
  customer_name: string
  preferred_time: string | null
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  dress: { name: string } | null
}

interface AppointmentListProps {
  appointments: Appointment[]
  date: string
}

const STATUS_VARIANT = {
  pending: 'platinum',
  confirmed: 'green',
  cancelled: 'red',
  completed: 'blue',
} as const

export function AppointmentList({ appointments, date }: AppointmentListProps) {
  return (
    <div className="glass-light rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays size={16} className="text-gold" />
        <h2 className="text-sm font-semibold text-ivory">Today&apos;s Appointments</h2>
        <span className="ml-auto text-xs text-platinum">{date}</span>
      </div>

      {appointments.length === 0 ? (
        <p className="text-sm text-platinum/50 text-center py-6">
          No appointments scheduled for today.
        </p>
      ) : (
        <div className="space-y-2">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors"
            >
              <div className="shrink-0 text-center min-w-[52px]">
                <p className="text-xs font-semibold text-gold">
                  {appt.preferred_time ?? '—'}
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ivory font-medium truncate">{appt.customer_name}</p>
                {appt.dress && (
                  <p className="text-xs text-platinum truncate">{appt.dress.name}</p>
                )}
              </div>
              <Badge variant={STATUS_VARIANT[appt.status]}>
                {appt.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
