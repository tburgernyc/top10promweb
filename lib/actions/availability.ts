'use server'

import { createClient } from '@/lib/supabase/server'

export type AvailabilityFormState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

export async function submitAvailabilityAction(
  _prev: AvailabilityFormState,
  formData: FormData
): Promise<AvailabilityFormState> {
  const supabase = await createClient()

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('availability_inquiries')
      .insert({
        dress_id: formData.get('dress_id') as string,
        boutique_id: formData.get('boutique_id') as string,
        customer_name: formData.get('customer_name') as string,
        customer_email: formData.get('customer_email') as string,
        customer_phone: (formData.get('customer_phone') as string) || null,
        parent_email: formData.get('parent_email') as string,
        parent_phone: (formData.get('parent_phone') as string) || null,
        school_name: formData.get('school_name') as string,
        event_date: formData.get('event_date') as string,
        preferred_date: formData.get('preferred_date') as string,
        preferred_time: formData.get('preferred_time') as string,
        notes: (formData.get('notes') as string) || null,
      })

    if (error) throw error

    return {
      status: 'success',
      message: 'Appointment request sent! Check your email for confirmation.',
    }
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong. Please try again or call us directly.',
    }
  }
}
