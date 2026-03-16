'use client'

import { useState } from 'react'
import { inviteStaffMember, setStaffActiveStatus } from '@/lib/actions/owner'

type StaffMember = {
  id: string
  role: string
  is_active: boolean
  created_at: string
  profiles: {
    id: string
    full_name: string | null
    email: string | null
  } | null
}

const ROLE_STYLES: Record<string, string> = {
  OWNER: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  MANAGER: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  ASSOCIATE: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
}

export default function StaffClient({ staff }: { staff: StaffMember[] }) {
  const [showModal, setShowModal] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  async function handleInvite(formData: FormData) {
    setIsPending(true)
    setError(null)
    const result = await inviteStaffMember(formData)
    setIsPending(false)
    if (result.error) {
      setError(result.error)
    } else {
      setShowModal(false)
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    setTogglingId(id)
    await setStaffActiveStatus(id, !isActive)
    setTogglingId(null)
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Team Members</h2>
          <button
            onClick={() => { setShowModal(true); setError(null) }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Invite Staff Member
          </button>
        </div>

        {staff.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No staff members yet. Invite your first team member above.
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {staff.map(member => (
              <div key={member.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm flex-shrink-0">
                    {(member.profiles?.full_name?.[0] || member.profiles?.email?.[0] || '?').toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      {member.profiles?.full_name || 'Unnamed User'}
                    </p>
                    <p className="text-sm text-slate-500">{member.profiles?.email || 'No email'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${ROLE_STYLES[member.role] || ROLE_STYLES.ASSOCIATE}`}>
                    {member.role}
                  </span>
                  {member.is_active ? (
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">Active</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-400">Inactive</span>
                  )}
                  <button
                    onClick={() => handleToggle(member.id, member.is_active)}
                    disabled={togglingId === member.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${
                      member.is_active
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                    }`}
                  >
                    {togglingId === member.id ? '...' : member.is_active ? 'Deactivate' : 'Reactivate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Invite Staff Member</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form action={handleInvite} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Staff Email *</label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="off"
                  className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="associate@yourboutique.com"
                />
                <p className="text-xs text-slate-400 mt-1">They must already have an account on the app.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role *</label>
                <select
                  name="role"
                  required
                  className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  <option value="">Select a role...</option>
                  <option value="MANAGER">Manager — Can view analytics & exports</option>
                  <option value="ASSOCIATE">Associate — Floor operations only</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white font-bold rounded-xl transition-colors">
                  {isPending ? 'Adding...' : 'Add to Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
