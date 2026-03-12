import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomUUID } from 'crypto'

// POST /api/fitting-room — persist a fitting room session to the database
// Body: { session_token: string, dress_ids: string[] }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { session_token: string; dress_ids: string[] }
    const { session_token, dress_ids } = body

    if (!session_token || !Array.isArray(dress_ids)) {
      return NextResponse.json({ error: 'session_token and dress_ids are required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Upsert session
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('fitting_room_sessions')
      .upsert({
        session_token,
        user_id: user?.id ?? null,
        dress_ids,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'session_token' })
      .select('id, session_token, share_token')
      .single()

    if (error) throw error

    return NextResponse.json({ session: data })
  } catch {
    return NextResponse.json({ error: 'Failed to save fitting room session' }, { status: 500 })
  }
}

// PATCH /api/fitting-room — generate a share token for the session
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as { session_token: string }
    const { session_token } = body

    if (!session_token) {
      return NextResponse.json({ error: 'session_token is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const share_token = randomUUID()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('fitting_room_sessions')
      .update({ share_token })
      .eq('session_token', session_token)
      .select('share_token')
      .single()

    if (error) throw error

    return NextResponse.json({ share_token: data?.share_token })
  } catch {
    return NextResponse.json({ error: 'Failed to generate share token' }, { status: 500 })
  }
}

// GET /api/fitting-room?token= — fetch a shared fitting room session
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'token is required' }, { status: 400 })
  }

  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: session, error } = await (supabase as any)
      .from('fitting_room_sessions')
      .select(`
        id,
        session_token,
        share_token,
        dress_ids,
        created_at
      `)
      .eq('share_token', token)
      .single()

    if (error || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Fetch dress details
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: dresses } = await (supabase as any)
      .from('dresses')
      .select('id, name, designer, color, price_cents, images')
      .in('id', session.dress_ids as string[])

    return NextResponse.json({ session, dresses: dresses ?? [] })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
  }
}
