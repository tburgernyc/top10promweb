'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

interface VoteCounts {
  up: number
  down: number
}

interface VoteOnDressProps {
  shareToken: string
  dressId: string
  /** Voter name — optional, defaults to 'Anonymous' */
  voterName?: string
}

export function VoteOnDress({ shareToken, dressId, voterName = 'Anonymous' }: VoteOnDressProps) {
  const shouldReduce = useReducedMotion()
  const [counts, setCounts] = useState<VoteCounts>({ up: 0, down: 0 })
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Initial fetch
    async function fetchVotes() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('social_votes')
        .select('vote')
        .eq('share_token', shareToken)
        .eq('dress_id', dressId)

      if (data) {
        const up = data.filter((v: { vote: string }) => v.vote === 'up').length
        const down = data.filter((v: { vote: string }) => v.vote === 'down').length
        setCounts({ up, down })
      }
    }

    fetchVotes()

    // Realtime subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = (supabase as any)
      .channel(`votes:${shareToken}:${dressId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_votes',
          filter: `share_token=eq.${shareToken}`,
        },
        () => { fetchVotes() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareToken, dressId])

  async function handleVote(vote: 'up' | 'down') {
    if (loading) return
    setLoading(true)

    if (userVote === vote) {
      // Remove vote (toggle off)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('social_votes')
        .delete()
        .eq('share_token', shareToken)
        .eq('dress_id', dressId)
        .eq('voter_name', voterName)

      setUserVote(null)
    } else {
      // Upsert vote (replace previous if exists)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('social_votes')
        .upsert({
          share_token: shareToken,
          dress_id: dressId,
          voter_name: voterName,
          vote,
        }, { onConflict: 'share_token,dress_id,voter_name' })

      setUserVote(vote)
    }

    setLoading(false)
  }

  const total = counts.up + counts.down
  const upPct = total > 0 ? (counts.up / total) * 100 : 50

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <VoteButton
          vote="up"
          count={counts.up}
          active={userVote === 'up'}
          disabled={loading}
          shouldReduce={!!shouldReduce}
          onClick={() => handleVote('up')}
          icon={<ThumbsUp size={16} />}
        />
        <VoteButton
          vote="down"
          count={counts.down}
          active={userVote === 'down'}
          disabled={loading}
          shouldReduce={!!shouldReduce}
          onClick={() => handleVote('down')}
          icon={<ThumbsDown size={16} />}
        />
      </div>

      {total > 0 && (
        <div className="space-y-1">
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${upPct}%` }}
              transition={shouldReduce ? {} : { type: 'spring', stiffness: 200, damping: 30 }}
            />
          </div>
          <p className="text-xs text-platinum text-center">
            {total} vote{total !== 1 ? 's' : ''} · {Math.round(upPct)}% love it
          </p>
        </div>
      )}
    </div>
  )
}

interface VoteButtonProps {
  vote: 'up' | 'down'
  count: number
  active: boolean
  disabled: boolean
  shouldReduce: boolean
  onClick: () => void
  icon: React.ReactNode
}

function VoteButton({ vote, count, active, disabled, shouldReduce, onClick, icon }: VoteButtonProps) {
  return (
    <motion.button
      whileTap={shouldReduce || disabled ? {} : { scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={vote === 'up' ? 'Vote up' : 'Vote down'}
      aria-pressed={active}
      className={[
        'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        active
          ? vote === 'up'
            ? 'bg-gold text-onyx border-gold'
            : 'bg-red-500/20 text-red-400 border-red-500/40'
          : 'glass-light text-platinum hover:text-ivory border-white/10',
      ].join(' ')}
    >
      {icon}
      <span>{count}</span>
    </motion.button>
  )
}
