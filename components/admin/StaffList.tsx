'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Plus, UserX, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface StaffMember {
  id: string
  boutique_id: string
  user_id: string
  role: string
  created_at: string
  profile: { id: string; email: string; full_name: string | null } | null
  boutique: { id: string; name: string } | null
}

interface StaffListProps {
  staff: StaffMember[]
  boutiques: { id: string; name: string }[]
  defaultBoutiqueId: string | null
  isPlatformAdmin: boolean
}

export function StaffList({ staff: initialStaff, boutiques, defaultBoutiqueId, isPlatformAdmin }: StaffListProps) {
  const shouldReduce = useReducedMotion()
  const [staff, setStaff] = useState(initialStaff)
  const [showInvite, setShowInvite] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)

  async function handleRemove(member: StaffMember) {
    if (!confirm(`Remove ${member.profile?.full_name ?? member.profile?.email} from staff?`)) return
    setRemoving(member.id)
    const res = await fetch('/api/admin/staff', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: member.id }),
    })
    if (res.ok) {
      setStaff((prev) => prev.filter((s) => s.id !== member.id))
    }
    setRemoving(null)
  }

  async function handleInvite(data: { email: string; boutique_id: string; role: string }) {
    const res = await fetch('/api/admin/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const { member } = await res.json() as { member: StaffMember }
      if (member) setStaff((prev) => [member, ...prev])
      setShowInvite(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" size="sm" onClick={() => setShowInvite(true)}>
          <Plus size={15} />
          Invite Staff
        </Button>
      </div>

      <div className="glass-light rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-5 py-3 text-xs text-platinum font-semibold uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 text-xs text-platinum font-semibold uppercase tracking-wider">Email</th>
              {isPlatformAdmin && <th className="text-left px-5 py-3 text-xs text-platinum font-semibold uppercase tracking-wider">Boutique</th>}
              <th className="text-left px-5 py-3 text-xs text-platinum font-semibold uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-3 text-xs text-platinum font-semibold uppercase tracking-wider">Joined</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {staff.map((member, idx) => (
              <motion.tr
                key={member.id}
                initial={shouldReduce ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28, delay: idx * 0.03 }}
                className="hover:bg-white/3 transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold shrink-0">
                      {(member.profile?.full_name ?? member.profile?.email ?? '?')[0].toUpperCase()}
                    </div>
                    <span className="text-ivory font-medium">{member.profile?.full_name ?? '—'}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-platinum">{member.profile?.email ?? '—'}</td>
                {isPlatformAdmin && (
                  <td className="px-5 py-3 text-platinum">{member.boutique?.name ?? '—'}</td>
                )}
                <td className="px-5 py-3">
                  <Badge variant={member.role === 'manager' ? 'gold' : 'platinum'}>
                    {member.role}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-platinum/60 text-xs">
                  {new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => handleRemove(member)}
                    disabled={removing === member.id}
                    className="p-1.5 rounded-lg text-platinum/40 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-30"
                    aria-label="Remove staff member"
                  >
                    <UserX size={15} />
                  </button>
                </td>
              </motion.tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan={isPlatformAdmin ? 6 : 5} className="px-5 py-12 text-center text-platinum/50 text-sm">
                  No staff members yet. Invite someone to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invite modal */}
      <AnimatePresence>
        {showInvite && (
          <>
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowInvite(false)} />
            <motion.div
              initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="fixed z-50 inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md glass-heavy rounded-2xl p-6 shadow-2xl"
            >
              <InviteStaffModal
                boutiques={boutiques}
                defaultBoutiqueId={defaultBoutiqueId}
                isPlatformAdmin={isPlatformAdmin}
                onInvite={handleInvite}
                onClose={() => setShowInvite(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function InviteStaffModal({
  boutiques,
  defaultBoutiqueId,
  isPlatformAdmin,
  onInvite,
  onClose,
}: {
  boutiques: { id: string; name: string }[]
  defaultBoutiqueId: string | null
  isPlatformAdmin: boolean
  onInvite: (data: { email: string; boutique_id: string; role: string }) => Promise<void>
  onClose: () => void
}) {
  const [email, setEmail] = useState('')
  const [boutiqueId, setBoutiqueId] = useState(defaultBoutiqueId ?? '')
  const [role, setRole] = useState('staff')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    if (!email || !boutiqueId) {
      setError('Please fill in all required fields.')
      return
    }
    setSaving(true)
    setError('')
    await onInvite({ email, boutique_id: boutiqueId, role })
    setSuccess(true)
    setSaving(false)
  }

  if (success) {
    return (
      <div className="text-center space-y-4 py-4">
        <p className="text-ivory font-semibold">Invitation sent!</p>
        <p className="text-sm text-platinum">An email has been sent to {email} with instructions to join.</p>
        <Button variant="ghost" onClick={onClose} className="w-full">Close</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ivory">Invite Staff Member</h2>
        <button onClick={onClose} className="p-1 text-platinum hover:text-ivory"><X size={18} /></button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="space-y-3">
        <div>
          <label className="text-xs text-platinum mb-1 block">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="staff@boutique.com"
            className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2.5 placeholder:text-platinum/40 focus:outline-none focus:border-gold/50"
          />
        </div>

        {isPlatformAdmin && (
          <div>
            <label className="text-xs text-platinum mb-1 block">Boutique</label>
            <select
              value={boutiqueId}
              onChange={(e) => setBoutiqueId(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2.5 focus:outline-none focus:border-gold/50"
            >
              <option value="">Select boutique…</option>
              {boutiques.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="text-xs text-platinum mb-1 block">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-ivory px-3 py-2.5 focus:outline-none focus:border-gold/50"
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving} className="flex-1">
          {saving ? 'Sending…' : 'Send Invite'}
        </Button>
      </div>
    </div>
  )
}
