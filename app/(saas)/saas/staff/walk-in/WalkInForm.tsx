'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerWalkInCustomer } from '@/lib/actions/staff'

export default function WalkInForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    const result = await registerWalkInCustomer(formData)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      // On success, instantly route back to the main floor hub
      router.push('/saas/staff')
      router.refresh()
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 md:space-y-8">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 font-bold rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Grid for Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            autoComplete="off"
            className="w-full h-14 px-4 text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 transition-colors"
            placeholder="Jane"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            autoComplete="off"
            className="w-full h-14 px-4 text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 transition-colors"
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            autoComplete="off"
            className="w-full h-14 px-4 text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 transition-colors"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            className="w-full h-14 px-4 text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 transition-colors"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
          What are they looking for? (Notes)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full p-4 text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 transition-colors resize-none"
          placeholder="e.g., Looking for a red Sherri Hill dress, size 4..."
        ></textarea>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-16 md:h-20 text-xl font-black text-white rounded-2xl flex items-center justify-center transition-all ${
            isSubmitting
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 active:scale-[0.98] shadow-lg shadow-indigo-200'
          }`}
        >
          {isSubmitting ? 'Registering...' : 'Log Walk-in Customer'}
        </button>
      </div>
    </form>
  )
}
