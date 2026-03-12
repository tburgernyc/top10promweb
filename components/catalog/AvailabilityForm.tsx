'use client'

import { useActionState, useRef } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { CalendarCheck, User, Mail, Phone, GraduationCap } from 'lucide-react'
import { submitAvailabilityAction, type AvailabilityFormState } from '@/lib/actions/availability'

interface AvailabilityFormProps {
  dressId: string
  boutiqueId: string
}

const initialState: AvailabilityFormState = { status: 'idle', message: '' }

export function AvailabilityForm({ dressId, boutiqueId }: AvailabilityFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, pending] = useActionState(submitAvailabilityAction, initialState)

  if (state.status === 'success') {
    return (
      <div className="rounded-2xl glass-light p-6 text-center">
        <CalendarCheck size={40} className="text-gold mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-ivory mb-1">Request Sent!</h3>
        <p className="text-sm text-platinum/70">{state.message}</p>
      </div>
    )
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <input type="hidden" name="dress_id" value={dressId} />
      <input type="hidden" name="boutique_id" value={boutiqueId} />

      <h3 className="text-base font-semibold text-ivory flex items-center gap-2">
        <CalendarCheck size={18} className="text-gold" />
        Book an Appointment
      </h3>

      <div className="flex flex-col gap-3">
        <Input label="Your Name" name="customer_name" required placeholder="Jane Smith" icon={<User size={15} />} />
        <Input label="Your Email" name="customer_email" type="email" required placeholder="jane@email.com" icon={<Mail size={15} />} />
        <Input label="Your Phone" name="customer_phone" type="tel" placeholder="(555) 555-5555" icon={<Phone size={15} />} />
      </div>

      <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
        <p className="text-xs text-platinum/50 font-medium uppercase tracking-wide">Parent / Guardian</p>
        <Input label="Parent Email" name="parent_email" type="email" required placeholder="parent@email.com" icon={<Mail size={15} />} />
        <Input label="Parent Phone" name="parent_phone" type="tel" placeholder="(555) 555-5555" icon={<Phone size={15} />} />
      </div>

      <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
        <Input label="School Name" name="school_name" required placeholder="Westside High School" icon={<GraduationCap size={15} />} />
        <Input label="Prom Date" name="event_date" type="date" required />
      </div>

      <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
        <p className="text-xs text-platinum/50 font-medium uppercase tracking-wide">Preferred Appointment</p>
        <Input label="Date" name="preferred_date" type="date" required />
        <div>
          <label className="text-sm font-medium text-platinum block mb-1.5">
            Time <span className="text-gold">*</span>
          </label>
          <select
            name="preferred_time"
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="">Select a time</option>
            {['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {state.status === 'error' && (
        <p className="text-sm text-red-400 rounded-xl bg-red-500/10 p-3">{state.message}</p>
      )}

      <Button type="submit" loading={pending} fullWidth size="lg">
        Request Appointment
      </Button>

      <p className="text-xs text-platinum/40 text-center">
        Confirmation emails will be sent to you and your parent/guardian.
      </p>
    </form>
  )
}
