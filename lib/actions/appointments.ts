'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type AppointmentUpdate = {
  status: string; sales_feedback: string | null
  updated_by_staff_id: string; updated_at: string
}

export async function updateAppointmentStatus(formData: FormData) {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const storeId = user.app_metadata?.store_id
    const staffId = user.id

    if (!storeId) return { error: 'No active store assignment' }

    const appointmentId = formData.get('appointmentId') as string
    const status = formData.get('status') as string
    const salesFeedback = formData.get('salesFeedback') as string

    const updatePayload: AppointmentUpdate = {
        status: status,
        sales_feedback: salesFeedback || null,
        updated_by_staff_id: staffId,
        updated_at: new Date().toISOString()
    }

    const { error } = await db
        .from('appointments')
        .update(updatePayload)
        .eq('id', appointmentId)
        .eq('store_id', storeId) as { error: { message: string } | null } // Double RLS security check

    if (error) {
        console.error('Failed to update appointment:', error)
        return { error: 'Failed to update appointment' }
    }

    revalidatePath('/saas/staff/calendar')
    revalidatePath('/saas/staff')

    return { success: true }
}
