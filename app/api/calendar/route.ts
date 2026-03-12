import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/calendar?boutique_id=&date=YYYY-MM-DD
// Returns available appointment slots for a boutique on a given date
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const boutique_id = searchParams.get('boutique_id')
  const date = searchParams.get('date')

  if (!boutique_id || !date) {
    return NextResponse.json(
      { error: 'boutique_id and date are required' },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient()

    // Fetch boutique settings for business hours + appointment rules
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: settings } = await (supabase as any)
      .from('boutique_settings')
      .select('business_hours, appointment_duration_minutes, max_daily_appointments, booking_lead_time_hours')
      .eq('boutique_id', boutique_id)
      .single()

    if (!settings) {
      return NextResponse.json({ available_slots: [], error: 'Store settings not found' })
    }

    // Count existing inquiries for this boutique + date
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count } = await (supabase as any)
      .from('availability_inquiries')
      .select('id', { count: 'exact', head: true })
      .eq('boutique_id', boutique_id)
      .eq('preferred_date', date)
      .in('status', ['pending', 'confirmed'])

    const bookedCount = count ?? 0
    const maxAppointments = settings.max_daily_appointments ?? 8
    const remainingSlots = Math.max(0, maxAppointments - bookedCount)

    return NextResponse.json({
      boutique_id,
      date,
      remaining_slots: remainingSlots,
      is_available: remainingSlots > 0,
      appointment_duration_minutes: settings.appointment_duration_minutes ?? 60,
      business_hours: settings.business_hours,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch calendar availability' }, { status: 500 })
  }
}
