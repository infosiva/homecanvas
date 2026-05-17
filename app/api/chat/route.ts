import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'
import { guardRequest, guardAiInput } from '@/lib/abuse-guard'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const block = guardRequest(req)
  if (block) return block

  try {
    const body = await req.json()
    const { messages } = body
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 })
    }

    const lastUserMsg = messages.filter((m: { role: string }) => m.role === 'user').at(-1)?.content ?? ''
    const inputBlock = guardAiInput(req, lastUserMsg)
    if (inputBlock) return inputBlock

    const reply = await aiChat(messages)
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('/api/chat error:', err)
    return NextResponse.json({ reply: 'Sorry, I had trouble responding. Please try again in a moment.' }, { status: 200 })
  }
}
