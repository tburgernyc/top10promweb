'use server'

import { createClient } from '@/lib/supabase/server'

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

  const dress_id = (formData.get('dress_id') as string) || null
  const boutique_id = formData.get('boutique_id') as string
  const preferred_date = formData.get('preferred_date') as string
  const preferred_time = formData.get('preferred_time') as string
  const customer_name = formData.get('customer_name') as string
  const customer_email = formData.get('customer_email') as string
  const customer_phone = (formData.get('customer_phone') as string) || null
  const parent_email = formData.get('parent_email') as string
  const parent_phone = (formData.get('parent_phone') as string) || null
  const school_name = formData.get('school_name') as string
  const event_date = formData.get('event_date') as string
  const notes = (formData.get('notes') as string) || null

  // Validate required fields — dress is optional
  if (
    !boutique_id || !preferred_date || !preferred_time ||
    !customer_name || !customer_email ||
    !parent_email || !school_name || !event_date
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
        ...(dress_id ? { dress_id } : {}),
        boutique_id,
        customer_id: user?.id ?? null,
        customer_name,
        customer_email,
        customer_phone,
        parent_email,
        parent_phone,
        school_name,
        event_date,
        preferred_date,
        preferred_time,
        notes,
        status: 'pending',
      })
      .select('id')
      .single()

    if (inquiryError) throw inquiryError

    // 2. Create dress reservation only when a specific dress was selected
    if (dress_id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('dress_reservations')
        .insert({
          dress_id,
          boutique_id,
          customer_id: user?.id ?? null,
          school_name,
          event_name: 'prom',
          event_date,
          status: 'reserved',
        })
      // Non-fatal — reservation may fail if already reserved (duplicate check catches it first)
    }

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
