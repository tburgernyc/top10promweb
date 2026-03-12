import { NextRequest, NextResponse } from 'next/server'

interface ShareParentBody {
  parent_email: string
  parent_name: string
  dress_name: string
  boutique_name?: string
  share_url: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ShareParentBody
    const { parent_email, parent_name, dress_name, boutique_name, share_url } = body

    if (!parent_email || !share_url) {
      return NextResponse.json({ error: 'parent_email and share_url are required' }, { status: 400 })
    }

    // If Resend or SMTP is configured, send the email here.
    // For now, log and return success — integrate email provider in Phase 1G.
    const emailPayload = {
      to: parent_email,
      subject: `Your daughter wants your opinion on "${dress_name}"`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#050505;color:#F5F5F5;padding:32px;border-radius:16px;border:1px solid rgba(212,175,55,0.3)">
          <div style="text-align:center;margin-bottom:24px">
            <span style="color:#D4AF37;font-size:24px;font-weight:700">Top10Prom</span>
          </div>
          <h1 style="font-size:22px;color:#F5F5F5;margin-bottom:8px">Hi ${parent_name} 👋</h1>
          <p style="color:#C0C0C0;font-size:15px;line-height:1.6;margin-bottom:20px">
            Your daughter has picked out <strong style="color:#F5F5F5">${dress_name}</strong>
            ${boutique_name ? ` from <strong style="color:#F5F5F5">${boutique_name}</strong>` : ''} and
            wants your opinion before booking an appointment.
          </p>
          <p style="color:#C0C0C0;font-size:15px;line-height:1.6;margin-bottom:28px">
            Click below to view the dress and vote on her picks. You can also approve and book an
            appointment directly from the page.
          </p>
          <div style="text-align:center;margin-bottom:24px">
            <a
              href="${share_url}"
              style="display:inline-block;background:#D4AF37;color:#050505;text-decoration:none;font-weight:700;padding:14px 32px;border-radius:12px;font-size:15px"
            >
              View Picks &amp; Approve →
            </a>
          </div>
          <p style="color:#C0C0C0;font-size:12px;text-align:center;margin-top:24px;border-top:1px solid rgba(255,255,255,0.1);padding-top:16px">
            Top 10 Prom · One dress. One school. One night to remember.<br/>
            <a href="${share_url}" style="color:#D4AF37">${share_url}</a>
          </p>
        </div>
      `,
    }

    // TODO: integrate with Resend in Phase 1G
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({ from: 'noreply@top10prom.com', ...emailPayload })

    if (process.env.NODE_ENV === 'development') {
      console.log('[share/parent] Email payload:', emailPayload)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
