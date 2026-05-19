import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

let _groq: Groq | null = null
function groq(): Groq {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })
  return _groq
}

export async function POST(req: NextRequest) {
  try {
    const { messages, system } = await req.json()
    const sysPrompt = system ?? 'You are CampaignForge AI — a marketing expert. Help users create better campaigns: email sequences, Facebook ads, podcast scripts, and copywriting. Be concise and actionable.'

    const res = await groq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: sysPrompt }, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    })

    const text = res.choices[0]?.message?.content ?? 'Let me help you forge that campaign!'
    return NextResponse.json({ text })
  } catch {
    return NextResponse.json({ text: 'Campaign AI is warming up — try again in a moment.' }, { status: 200 })
  }
}
