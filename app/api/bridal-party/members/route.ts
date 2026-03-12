import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: add a member to a party (optionally send Resend invite)
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { party_id, member_name, member_email, member_phone, role, size } = body

  if (!party_id || !member_name) {
    return NextResponse.json({ error: 'party_id and member_name are required' }, { status: 400 })
  }

  // Verify the party belongs to the current user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: party } = await (supabase as any)
    .from('bridal_parties')
    .select('id, bride_name, wedding_date, share_token')
    .eq('id', party_id)
    .eq('bride_id', user.id)
    .single()

  if (!party) return NextResponse.json({ error: 'Party not found' }, { status: 404 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: member, error } = await (supabase as any)
    .from('bridal_party_members')
    .insert({
      party_id,
      member_name,
      member_email: member_email || null,
      member_phone: member_phone || null,
      role: role || 'bridesmaid',
      size: size || null,
      status: 'invited',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send invite email via Resend (if email provided and env var set)
  if (member_email && process.env.RESEND_API_KEY) {
    await sendInviteEmail({
      to: member_email,
      memberName: member_name,
      brideName: party.bride_name,
      weddingDate: party.wedding_date,
      shareToken: party.share_token,
    })
  }

  return NextResponse.json(member, { status: 201 })
}

// PATCH: update a member (assign dress, update status, resend invite)
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, action, ...updates } = body

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  if (action === 'resend_invite') {
    // Fetch member + party to send email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: member } = await (supabase as any)
      .from('bridal_party_members')
      .select('*, party:bridal_parties(bride_name, wedding_date, share_token, bride_id)')
      .eq('id', id)
      .single()

    if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    if (member.party?.bride_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (member.member_email && process.env.RESEND_API_KEY) {
      await sendInviteEmail({
        to: member.member_email,
        memberName: member.member_name,
        brideName: member.party.bride_name,
        weddingDate: member.party.wedding_date,
        shareToken: member.party.share_token,
      })
    }

    return NextResponse.json({ ok: true })
  }

  // General update (dress_id, size, status, etc.)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('bridal_party_members')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE: remove a member
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  // Verify ownership via party
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: member } = await (supabase as any)
    .from('bridal_party_members')
    .select('id, role, party:bridal_parties(bride_id)')
    .eq('id', id)
    .single()

  if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  if (member.party?.bride_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  if (member.role === 'bride') {
    return NextResponse.json({ error: 'Cannot remove the bride' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('bridal_party_members')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// ── Resend email helper ──────────────────────────────────────────────────────

interface InviteEmailParams {
  to: string
  memberName: string
  brideName: string
  weddingDate: string
  shareToken: string
}

async function sendInviteEmail({
  to,
  memberName,
  brideName,
  weddingDate,
  shareToken,
}: InviteEmailParams) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.warn('[BridalParty] RESEND_API_KEY missing — invite email skipped')
    return
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://top10prom.com'
  const partyUrl = `${baseUrl}/wedding/bridal-party/${shareToken}`
  const formattedDate = new Date(weddingDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#050505;color:#F5F5F5;padding:32px 24px;border-radius:16px;">
      <h1 style="color:#D4AF37;font-size:22px;margin:0 0 8px;">You're invited! 💐</h1>
      <p style="color:#C0C0C0;margin:0 0 16px;">Hi ${memberName},</p>
      <p style="color:#C0C0C0;margin:0 0 16px;">
        <strong style="color:#F5F5F5;">${brideName}</strong> has added you to her bridal party for her wedding on
        <strong style="color:#F5F5F5;">${formattedDate}</strong>.
      </p>
      <p style="color:#C0C0C0;margin:0 0 24px;">
        Browse dress suggestions and book your private fitting appointment at Top 10 Prom.
      </p>
      <a href="${partyUrl}"
         style="display:inline-block;background:#D4AF37;color:#050505;font-weight:600;padding:12px 24px;border-radius:12px;text-decoration:none;font-size:15px;">
        View Your Party Details →
      </a>
      <p style="color:#C0C0C0;margin:32px 0 0;font-size:12px;">
        Top 10 Prom · Your Moment. Your Dress. Your Night.
      </p>
    </div>
  `

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@top10prom.com'
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Top 10 Prom <${fromEmail}>`,
        to: [to],
        subject: `${brideName} has invited you to her bridal party 💐`,
        html,
      }),
    })
  } catch (err) {
    console.error('[BridalParty] Resend error:', err)
  }
}
