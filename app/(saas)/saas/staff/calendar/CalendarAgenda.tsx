'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateAppointmentStatus } from '@/lib/actions/appointments'

type Appointment = {
    id: string
    appointment_date: string
    appointment_type: string
    status: string
    notes: string | null
    sales_feedback: string | null
    customer_name: string
    customer_phone: string
}

export default function CalendarAgenda({
    initialDate,
    appointments
}: {
    initialDate: string
    appointments: Appointment[]
}) {
    const router = useRouter()
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    // Navigate to previous/next days via URL params to trigger SSR data fetch
    const changeDate = (days: number) => {
        const current = new Date(initialDate)
        current.setDate(current.getDate() + days)
        const newDateStr = current.toISOString().split('T')[0]
        router.push(`/saas/staff/calendar?date=${newDateStr}`)
    }

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
            case 'NO_SHOW': return 'bg-rose-100 text-rose-800 border-rose-200'
            case 'CANCELLED': return 'bg-slate-100 text-slate-600 border-slate-200'
            default: return 'bg-amber-100 text-amber-800 border-amber-200' // SCHEDULED
        }
    }

    async function handleStatusUpdate(formData: FormData) {
        setIsUpdating(true)
        await updateAppointmentStatus(formData)
        setIsUpdating(false)
        setSelectedAppt(null) // Close Modal
    }

    return (
        <div className="space-y-6">

            {/* Touch-Friendly Date Navigator */}
            <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
                <button
                    onClick={() => changeDate(-1)}
                    className="p-4 bg-slate-50 text-slate-700 rounded-2xl active:bg-slate-200 transition-colors"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-900">
                        {new Date(initialDate + 'T12:00:00Z').toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                    <p className="text-slate-500 font-medium">{appointments.length} Total Events</p>
                </div>

                <button
                    onClick={() => changeDate(1)}
                    className="p-4 bg-slate-50 text-slate-700 rounded-2xl active:bg-slate-200 transition-colors"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Agenda List */}
            <div className="space-y-4 pb-24">
                {appointments.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-2xl text-slate-400 font-bold mb-2">No appointments scheduled.</p>
                        <p className="text-slate-500">Enjoy the downtime, or check the floor for walk-ins!</p>
                    </div>
                ) : (
                    appointments.map((appt) => (
                        <div
                            key={appt.id}
                            onClick={() => setSelectedAppt(appt)}
                            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center gap-6 cursor-pointer active:scale-[0.98] active:bg-slate-50 transition-all"
                        >
                            {/* Massive Time Block */}
                            <div className="flex-shrink-0 w-24 h-24 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center shadow-inner">
                                <span className="text-2xl font-black">{formatTime(appt.appointment_date).split(' ')[0]}</span>
                                <span className="text-sm font-bold text-slate-400">{formatTime(appt.appointment_date).split(' ')[1]}</span>
                            </div>

                            {/* Customer Details */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-2xl font-bold text-slate-900">{appt.customer_name}</h3>
                                    {appt.appointment_type === 'WALK_IN' && (
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-black uppercase rounded-lg tracking-wider">
                                            Walk-In
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-500 text-lg mb-2">{appt.customer_phone}</p>
                                {appt.notes && (
                                    <p className="text-slate-700 bg-slate-50 p-3 rounded-xl text-sm border border-slate-100 line-clamp-2">
                                        <span className="font-bold">Notes:</span> {appt.notes}
                                    </p>
                                )}
                            </div>

                            {/* Status Badge */}
                            <div className="flex-shrink-0">
                                <span className={`px-4 py-2 rounded-xl text-sm font-black tracking-wider uppercase border ${getStatusColor(appt.status)}`}>
                                    {appt.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Action Modal */}
            {selectedAppt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-900">Update Appointment</h2>
                            <button
                                onClick={() => setSelectedAppt(null)}
                                className="p-3 bg-white rounded-full text-slate-500 shadow-sm active:bg-slate-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form action={handleStatusUpdate} className="p-6 overflow-y-auto flex-1 space-y-8">
                            <input type="hidden" name="appointmentId" value={selectedAppt.id} />

                            <div>
                                <p className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-2">Customer Info</p>
                                <p className="text-2xl font-bold text-slate-900">{selectedAppt.customer_name}</p>
                                <p className="text-lg text-slate-600">{formatTime(selectedAppt.appointment_date)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
                                    Current Status
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'NO_SHOW'].map((status) => (
                                        <label key={status} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                value={status}
                                                defaultChecked={selectedAppt.status === status}
                                                className="peer sr-only"
                                            />
                                            <div className="p-4 text-center rounded-2xl border-2 border-slate-200 text-slate-600 font-bold peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 transition-all active:scale-95">
                                                {status.replace('_', ' ')}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                                    Sales Feedback & Notes (Internal)
                                </label>
                                <textarea
                                    name="salesFeedback"
                                    defaultValue={selectedAppt.sales_feedback || ''}
                                    rows={4}
                                    placeholder="Did they purchase? What styles did they like/dislike?"
                                    className="w-full p-4 text-lg rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 resize-none transition-colors"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full h-16 bg-indigo-900 text-white text-xl font-black rounded-2xl shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center"
                            >
                                {isUpdating ? 'Saving...' : 'Save Updates'}
                            </button>
                        </form>

                    </div>
                </div>
            )}

        </div>
    )
}