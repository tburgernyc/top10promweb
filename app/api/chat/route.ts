import { NextRequest, NextResponse } from 'next/server'
import { createAriaChat } from '@/lib/gemini'
import { createClient } from '@/lib/supabase/server'

interface ChatBody {
  message: string
  history?: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>
  boutique_id?: string | null
  event_type?: 'prom' | 'wedding' | null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ChatBody
    const { message, history = [], boutique_id, event_type } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    // Fetch boutique name/city for location-aware prompt
    let boutiqueName: string | undefined
    let boutiqueCity: string | undefined

    if (boutique_id) {
      const supabase = await createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('boutiques')
        .select('name, city')
        .eq('id', boutique_id)
        .single()

      boutiqueName = data?.name
      boutiqueCity = data?.city
    }

    const chat = await createAriaChat(boutiqueName, boutiqueCity, event_type ?? undefined)

    if (!chat) {
      return NextResponse.json({
        reply: "Hi! I'm Aria, but my AI features aren't available right now. Please speak with our in-store team for personalized style guidance!",
      })
    }

    // Restore history into the chat session
    // The Gemini SDK's startChat accepts history in the initial config,
    // but we can replay manually by sending history context in the message.
    // We use the simpler approach: prepend history as context text.
    const historyContext = history
      .map((m) => `${m.role === 'user' ? 'Customer' : 'Aria'}: ${m.parts.map((p) => p.text).join('')}`)
      .join('\n')

    const fullMessage = historyContext
      ? `[Previous conversation]\n${historyContext}\n\n[New message]\nCustomer: ${message}`
      : message

    // Exponential backoff for rate limits
    let lastError: Error | null = null
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await chat.sendMessage(fullMessage)
        const reply = result.response.text()
        return NextResponse.json({ reply })
      } catch (err) {
        lastError = err as Error
        const isRateLimit = (err as { status?: number })?.status === 429
        if (!isRateLimit) break
        // Exponential backoff: 1s, 2s, 4s
        await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt))
      }
    }

    console.error('[Aria] Gemini error:', lastError)
    return NextResponse.json({
      reply: "I'm having a moment — please try again shortly! In the meantime, feel free to browse our catalog or call any of our boutique locations.",
    })
  } catch {
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 })
  }
}
