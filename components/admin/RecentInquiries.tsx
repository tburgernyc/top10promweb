import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Inbox } from 'lucide-react'

interface Inquiry {
  id: string
  customer_name: string
  customer_email: string
  created_at: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  dress: { name: string } | null
  boutique: { name: string } | null
}

interface RecentInquiriesProps {
  inquiries: Inquiry[]
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function RecentInquiries({ inquiries }: RecentInquiriesProps) {
  return (
    <div className="glass-light rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Inbox size={16} className="text-gold" />
        <h2 className="text-sm font-semibold text-ivory">Recent Inquiries</h2>
        <Link href="/admin/appointments" className="ml-auto text-xs text-gold hover:text-gold/70 transition-colors">
          View all →
        </Link>
      </div>

      {inquiries.length === 0 ? (
        <p className="text-sm text-platinum/50 text-center py-6">
          No pending inquiries.
        </p>
      ) : (
        <div className="space-y-2">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-ivory font-medium truncate">{inq.customer_name}</p>
                  <Badge variant="platinum">{inq.status}</Badge>
                </div>
                {inq.dress && <p className="text-xs text-platinum truncate">{inq.dress.name}</p>}
                {inq.boutique && <p className="text-xs text-white/30">{inq.boutique.name}</p>}
              </div>
              <span className="text-xs text-white/30 shrink-0">{timeAgo(inq.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
