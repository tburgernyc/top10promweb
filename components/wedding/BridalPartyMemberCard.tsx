'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Badge } from '@/components/ui/Badge'
import { UserX, Mail } from 'lucide-react'
import type { BridalPartyMember, BridalMemberRole, BridalMemberStatus } from '@/types/index'

interface BridalPartyMemberCardProps {
  member: BridalPartyMember
  onRemove: (id: string) => void
  onResendInvite: (id: string) => void
  index: number
}

const ROLE_LABEL: Record<BridalMemberRole, string> = {
  bride: 'Bride',
  maid_of_honor: 'Maid of Honor',
  bridesmaid: 'Bridesmaid',
  flower_girl: 'Flower Girl',
  mother_of_bride: 'Mother of Bride',
  other: 'Guest',
}

const STATUS_VARIANT: Record<BridalMemberStatus, 'gold' | 'platinum' | 'green' | 'blue'> = {
  invited: 'platinum',
  confirmed: 'blue',
  fitted: 'gold',
  purchased: 'green',
}

export function BridalPartyMemberCard({ member, onRemove, onResendInvite, index }: BridalPartyMemberCardProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28, delay: index * 0.04 }}
      className="glass-light rounded-xl p-4 flex items-center gap-4"
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm shrink-0">
        {member.member_name[0].toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-ivory truncate">{member.member_name}</p>
          <Badge variant={STATUS_VARIANT[member.status as BridalMemberStatus]}>
            {member.status}
          </Badge>
        </div>
        <p className="text-xs text-platinum mt-0.5">
          {ROLE_LABEL[member.role as BridalMemberRole]}
          {member.size ? ` · Size ${member.size}` : ''}
        </p>
        {member.member_email && (
          <p className="text-xs text-white/40 truncate">{member.member_email}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {member.member_email && member.status === 'invited' && (
          <button
            onClick={() => onResendInvite(member.id)}
            className="p-1.5 rounded-lg text-platinum/40 hover:text-gold hover:bg-gold/10 transition-colors"
            aria-label="Resend invite"
            title="Resend invite"
          >
            <Mail size={14} />
          </button>
        )}
        {member.role !== 'bride' && (
          <button
            onClick={() => onRemove(member.id)}
            className="p-1.5 rounded-lg text-platinum/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            aria-label="Remove member"
          >
            <UserX size={14} />
          </button>
        )}
      </div>
    </motion.div>
  )
}
