import Link from 'next/link'
import WalkInForm from './WalkInForm'

export default function WalkInRegistrationPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Tablet-Friendly Back Navigation */}
      <div className="mb-6">
        <Link
          href="/saas/staff"
          className="inline-flex items-center gap-2 text-indigo-600 font-bold p-2 -ml-2 rounded-lg active:bg-indigo-50 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Floor Hub
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Register Walk-In
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Quickly log a new customer visiting the store right now.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <WalkInForm />
        </div>
      </div>
    </div>
  )
}
