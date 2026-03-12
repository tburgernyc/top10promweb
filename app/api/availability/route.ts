import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/availability?dress_id=&boutique_id=&school_name=&event_date=
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const dress_id = searchParams.get('dress_id')
  const boutique_id = searchParams.get('boutique_id')
  const school_name = searchParams.get('school_name')
  const event_date = searchParams.get('event_date')

  if (!dress_id || !school_name || !event_date) {
    return NextResponse.json(
      { error: 'dress_id, school_name, and event_date are required' },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient()

    // Check for existing reservations for this dress + school + event_date
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: reservations, error } = await (supabase as any)
      .from('dress_reservations')
      .select('id, school_name, event_date, status')
      .eq('dress_id', dress_id)
      .eq('school_name', school_name)
      .eq('event_date', event_date)
      .in('status', ['reserved', 'purchased'])

    if (error) throw error

    // Also check boutique-specific inventory if boutique_id provided
    let inventoryAvailable = true
    if (boutique_id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: inventory } = await (supabase as any)
        .from('dress_inventory')
        .select('quantity, is_active')
        .eq('dress_id', dress_id)
        .eq('boutique_id', boutique_id)
        .single()

      inventoryAvailable = inventory?.is_active && (inventory?.quantity ?? 0) > 0
    }

    const isAvailable = (reservations?.length ?? 0) === 0 && inventoryAvailable

    return NextResponse.json({
      is_available: isAvailable,
      conflicting_reservation: isAvailable ? null : reservations?.[0] ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 })
  }
}
