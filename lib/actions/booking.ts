'use server'

import { createClient } from '@/lib/supabase/server'
import type { FullBookingValues } from '@/lib/schemas'

export type BookingFormState = {
  status: 'idle' | 'success' | 'error'
  message: string
  inquiryId?: string
}

export async function submitBookingAction(
  _prev: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const supabase = await createClient()

  const values: FullBookingValues = {
    dress_id: formData.get('dress_id') as string,
    boutique_id: formData.get('boutique_id') as string,
    preferred_date: formData.get('preferred_date') as string,
    preferred_time: formData.get('preferred_time') as string,
    customer_name: formData.get('customer_name') as string,
    customer_email: formData.get('customer_email') as string,
    customer_phone: (formData.get('customer_phone') as string) || undefined,
    parent_email: formData.get('parent_email') as string,
    parent_phone: (formData.get('parent_phone') as string) || undefined,
    school_name: formData.get('school_name') as string,
    event_date: formData.get('event_date') as string,
    notes: (formData.get('notes') as string) || undefined,
  }

  // Validate required fields
  if (
    !values.dress_id || !values.boutique_id || !values.preferred_date ||
    !values.preferred_time || !values.customer_name || !values.customer_email ||
    !values.parent_email || !values.school_name || !values.event_date
  ) {
    return { status: 'error', message: 'Missing required booking fields.' }
  }

  const { data: { user } } = await supabase.auth.getUser()

  try {
    // 1. Create availability inquiry
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: inquiry, error: inquiryError } = await (supabase as any)
      .from('availability_inquiries')
      .insert({
        dress_id: values.dress_id,
        boutique_id: values.boutique_id,
        customer_id: user?.id ?? null,
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_phone: values.customer_phone ?? null,
        parent_email: values.parent_email,
        parent_phone: values.parent_phone ?? null,
        school_name: values.school_name,
        event_date: values.event_date,
        preferred_date: values.preferred_date,
        preferred_time: values.preferred_time,
        notes: values.notes ?? null,
        status: 'pending',
      })
      .select('id')
      .single()

    if (inquiryError) throw inquiryError

    // 2. Create dress reservation (the no-duplicate moat)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('dress_reservations')
      .insert({
        dress_id: values.dress_id,
        boutique_id: values.boutique_id,
        customer_id: user?.id ?? null,
        school_name: values.school_name,
        event_name: 'prom',
        event_date: values.event_date,
        status: 'reserved',
      })
    // Non-fatal — reservation may fail if already reserved (duplicate check catches it first)

    return {
      status: 'success',
      message: 'Booking request submitted! Check your email for confirmation details.',
      inquiryId: inquiry?.id,
    }
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong. Please try again or call us directly.',
    }
  }
}
