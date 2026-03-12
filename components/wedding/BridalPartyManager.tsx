'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { BridalPartyForm } from './BridalPartyForm'
import { BridalPartyMemberCard } from './BridalPartyMemberCard'
import { Button } from '@/components/ui/Button'
import { Plus, Link as LinkIcon, Check } from 'lucide-react'
import type { BridalPartyWithMembers, BridalMemberRole } from '@/types/index'

interface BridalPartyManagerProps {
  party: BridalPartyWithMembers | null
  userId: string
}

interface AddMemberForm {
  member_name: string
  member_email: string
  role: BridalMemberRole
}

const ROLE_OPTIONS: { value: BridalMemberRole; label: string }[] = [
  { value: 'maid_of_honor', label: 'Maid of Honor' },
  { value: 'bridesmaid', label: 'Bridesmaid' },
  { value: 'flower_girl', label: 'Flower Girl' },
  { value: 'mother_of_bride', label: 'Mother of Bride' },
  { value: 'other', label: 'Guest' },
]

export function BridalPartyManager({ party: initialParty, userId }: BridalPartyManagerProps) {
  const shouldReduce = useReducedMotion()
  const [party, setParty] = useState(initialParty)
  const [showAddMember, setShowAddMember] = useState(false)
  const [copied, setCopied] = useState(false)
  const [addForm, setAddForm] = useState<AddMemberForm>({
    member_name: '',
    member_email: '',
    role: 'bridesmaid',
  })
  const [addError, setAddError] = useState('')
  const [addPending, setAddPending] = useState(false)

  async function handleCreateParty(data: {
    bride_name: string
    wedding_date: string
    venue_name: string
    party_size: number
    notes: string
  }) {
    const res = await fetch('/api/bridal-party', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, bride_id: userId }),
    })
    if (!res.ok) throw new Error('Failed to create bridal party')
    const created = await res.json()
    setParty({ ...created, members: [] })
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    if (!addForm.member_name.trim()) {
      setAddError('Name is required.')
      return
    }
    setAddPending(true)
    setAddError('')
    try {
      const res = await fetch('/api/bridal-party/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ party_id: party!.id, ...addForm }),
      })
      if (!res.ok) throw new Error('Failed to add member')
      const member = await res.json()
      setParty((prev) => prev ? { ...prev, members: [...prev.members, member] } : prev)
      setAddForm({ member_name: '', member_email: '', role: 'bridesmaid' })
      setShowAddMember(false)
    } catch {
      setAddError('Something went wrong. Please try again.')
    }
    setAddPending(false)
  }

  async function handleRemoveMember(id: string) {
    await fetch(`/api/bridal-party/members?id=${id}`, { method: 'DELETE' })
    setParty((prev) =>
      prev ? { ...prev, members: prev.members.filter((m) => m.id !== id) } : prev
    )
  }

  async function handleResendInvite(id: string) {
    await fetch('/api/bridal-party/members', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'resend_invite' }),
    })
  }

  function copyShareLink() {
    if (!party) return
    const url = `${window.location.origin}/wedding/bridal-party/${party.share_token}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!party) {
    return <BridalPartyForm onSubmit={handleCreateParty} />
  }

  const weddingDate = new Date(party.wedding_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Party header */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="glass-heavy rounded-2xl p-5 space-y-3"
      >
        <div>
          <h2 className="text-lg font-bold text-ivory">{party.bride_name}&apos;s Bridal Party</h2>
          <p className="text-sm text-platinum">{weddingDate}{party.venue_name ? ` · ${party.venue_name}` : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-platinum/60">{party.members.length} member{party.members.length !== 1 ? 's' : ''}</span>
          <button
            onClick={copyShareLink}
            className="ml-auto inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
          >
            {copied ? <Check size={12} /> : <LinkIcon size={12} />}
            {copied ? 'Copied!' : 'Copy Share Link'}
          </button>
        </div>
      </motion.div>

      {/* Members list */}
      <div className="space-y-3">
        <AnimatePresence>
          {party.members.map((member, idx) => (
            <BridalPartyMemberCard
              key={member.id}
              member={member}
              index={idx}
              onRemove={handleRemoveMember}
              onResendInvite={handleResendInvite}
            />
          ))}
        </AnimatePresence>

        {party.members.length === 0 && (
          <p className="text-sm text-platinum/50 text-center py-8">
            No members yet. Add your first bridesmaid!
          </p>
        )}
      </div>

      {/* Add member */}
      <AnimatePresence>
        {showAddMember ? (
          <motion.form
            key="add-form"
            onSubmit={handleAddMember}
            initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="glass-light rounded-2xl p-5 space-y-4"
          >
            <h3 className="text-sm font-semibold text-ivory">Add Party Member</h3>
            {addError && <p className="text-xs text-red-400">{addError}</p>}

            <div className="space-y-3">
              <div>
                <label className="text-xs text-platinum mb-1 block">Name *</label>
                <input
                  type="text"
                  value={addForm.member_name}
                  onChange={(e) => setAddForm((p) => ({ ...p, member_name: e.target.value }))}
                  placeholder="First and last name"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2.5 placeholder:text-platinum/40 focus:outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="text-xs text-platinum mb-1 block">Email (for invite)</label>
                <input
                  type="email"
                  value={addForm.member_email}
                  onChange={(e) => setAddForm((p) => ({ ...p, member_email: e.target.value }))}
                  placeholder="their@email.com"
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2.5 placeholder:text-platinum/40 focus:outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="text-xs text-platinum mb-1 block">Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm((p) => ({ ...p, role: e.target.value as BridalMemberRole }))}
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2.5 focus:outline-none focus:border-gold/50"
                >
                  {ROLE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value} className="bg-onyx">{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary" fullWidth disabled={addPending}>
                {addPending ? 'Adding…' : 'Add Member'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => { setShowAddMember(false); setAddError('') }}
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        ) : (
          <Button
            key="add-btn"
            variant="secondary"
            fullWidth
            onClick={() => setShowAddMember(true)}
          >
            <Plus size={16} className="mr-1" />
            Add Party Member
          </Button>
        )}
      </AnimatePresence>
    </div>
  )
}
