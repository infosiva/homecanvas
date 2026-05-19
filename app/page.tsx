'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Monitor, Radio, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

// ── Floating chatbot ─────────────────────────────────────
function FloatingChat() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hi! Need help crafting your campaign brief or improving your copy? 🔥' },
  ])
  const [input, setInput] = useState('')

  async function send() {
    if (!input.trim()) return
    const userMsg = input
    setMsgs(m => [...m, { role: 'user', text: userMsg }])
    setInput('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userMsg }] }),
      })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'bot', text: data.text || 'Let me help you forge that campaign!' }])
    } catch {
      setMsgs(m => [...m, { role: 'bot', text: 'Campaign AI is warming up — try again in a moment.' }])
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{ position: 'fixed', bottom: 24, right: 24, width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg,#f97316,#ea580c)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(249,115,22,0.5)', zIndex: 1000, fontSize: 20 }}
      >
        {open ? '✕' : '🔥'}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', bottom: 88, right: 24, width: 320, height: 420,
              background: 'var(--bg-base)', border: '1px solid rgba(249,115,22,0.3)',
              borderRadius: 16, display: 'flex', flexDirection: 'column', zIndex: 1000,
              overflow: 'hidden', backdropFilter: 'blur(20px)' }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(249,115,22,0.2)', fontSize: 13, fontWeight: 700, color: 'var(--ink-1)' }}>
              CampaignForge AI
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.05)',
                  padding: '8px 12px', borderRadius: 10, fontSize: 12, color: 'var(--ink-2)', maxWidth: '85%',
                }}>{m.text}</div>
              ))}
            </div>
            <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(249,115,22,0.15)', display: 'flex', gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about your campaign…"
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(249,115,22,0.2)',
                  borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--ink-1)', outline: 'none' }} />
              <button onClick={send}
                style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#fff', cursor: 'pointer' }}>→</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const STEPS = [
  'Reading your brief…',
  'Writing email sequence…',
  'Crafting Facebook ads…',
  'Scripting podcast episode…',
  'Campaign ready!',
]

const TONES = ['professional', 'friendly', 'bold', 'inspirational'] as const
type Tone = typeof TONES[number]

const OUTPUTS = [
  { icon: Mail,    label: '5 Emails',    desc: 'Nurture sequence · 0–14 days' },
  { icon: Monitor, label: '3 Ad variants', desc: 'Facebook / Meta ready' },
  { icon: Radio,   label: 'Podcast script', desc: 'Hook + outline + full script' },
]

export default function HomePage() {
  const router = useRouter()
  const [name, setName]         = useState('')
  const [category, setCategory] = useState('')
  const [audience, setAudience] = useState('')
  const [goal, setGoal]         = useState('')
  const [tone, setTone]         = useState<Tone>('friendly')
  const [loading, setLoading]   = useState(false)
  const [activeStep, setActiveStep] = useState(-1)
  const [error, setError]       = useState('')
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null)

  const valid = name.trim() && category.trim() && audience.trim() && goal.trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || loading) return
    setLoading(true)
    setActiveStep(0)
    setError('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, audience, goal, tone }),
      })

      const reader = res.body!.getReader()
      readerRef.current = reader
      const dec = new TextDecoder()
      let buf = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })

        const chunks = buf.split('\n\n')
        buf = chunks.pop() ?? ''

        for (const chunk of chunks) {
          const lines = chunk.split('\n')
          const eventLine = lines.find(l => l.startsWith('event: '))
          const dataLine  = lines.find(l => l.startsWith('data: '))
          if (!eventLine || !dataLine) continue

          const event = eventLine.slice(7).trim()
          const data  = JSON.parse(dataLine.slice(6))

          if (event === 'step') setActiveStep(data.step)
          else if (event === 'done') {
            setActiveStep(STEPS.length - 1)
            router.push(`/result/${data.id}`)
          } else if (event === 'error') {
            setError(data.message)
            setLoading(false)
            return
          }
        }
      }
    } catch {
      setError('Connection failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      {/* Background */}
      <div className="forge-grid" aria-hidden />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden>
        <div className="orb orb-forge-1" />
        <div className="orb orb-forge-2" />
        <div className="orb orb-forge-3" />
      </div>

      {/* Hero */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        minHeight: 'calc(100svh - 54px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 1100 }}>

          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}
          >
            <span className="badge-forge">
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--forge)',
                display: 'inline-block',
                boxShadow: '0 0 8px var(--forge)',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
              AI Campaign Engine · Under 60 seconds
            </span>
          </motion.div>

          {/* Two-column layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'start',
          }} className="forge-grid-layout">

            {/* Left — headline + outputs + stats */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.06,
                color: 'var(--ink-1)',
                marginBottom: '1.1rem',
              }}>
                Your full marketing<br />
                campaign,{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  forged in 60s
                </span>
              </h1>

              <p style={{
                color: 'var(--ink-2)',
                fontSize: 16,
                lineHeight: 1.65,
                marginBottom: '2rem',
                maxWidth: 440,
              }}>
                Enter your business brief. Walk out with a 5-email nurture sequence, 3 Facebook ads, and a full podcast script — ready to publish.
              </p>

              {/* Output chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '2.5rem' }}>
                {OUTPUTS.map(({ icon: Icon, label, desc }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '12px 16px',
                      background: 'var(--bg-raised)',
                      border: '1px solid var(--border-s)',
                      borderRadius: 12,
                    }}
                  >
                    <span style={{
                      width: 36, height: 36,
                      borderRadius: 9,
                      background: 'rgba(249,115,22,0.10)',
                      border: '1px solid rgba(249,115,22,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      color: 'var(--forge)',
                    }}>
                      <Icon size={16} />
                    </span>
                    <span>
                      <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-1)', display: 'block' }}>{label}</span>
                      <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{desc}</span>
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 32 }}>
                {[
                  { n: '< 60s', label: 'to generate' },
                  { n: '9 assets', label: 'per campaign' },
                  { n: 'Free', label: 'to try' },
                ].map(({ n, label }, i) => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    {i > 0 && <div style={{ width: 1, height: 20, background: 'var(--border-s)' }} />}
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-1)', fontFamily: "'Outfit', system-ui, sans-serif" }}>{n}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — form card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <div className="card-forge" style={{ padding: '24px 24px 20px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="label">Business name</label>
                      <input className="input" value={name} onChange={e => setName(e.target.value)}
                        placeholder="Bella's Bakery" disabled={loading} />
                    </div>
                    <div>
                      <label className="label">Industry</label>
                      <input className="input" value={category} onChange={e => setCategory(e.target.value)}
                        placeholder="Artisan bakery" disabled={loading} />
                    </div>
                  </div>

                  <div>
                    <label className="label">Target audience</label>
                    <input className="input" value={audience} onChange={e => setAudience(e.target.value)}
                      placeholder="Local families who want fresh, quality baked goods" disabled={loading} />
                  </div>

                  <div>
                    <label className="label">Campaign goal</label>
                    <input className="input" value={goal} onChange={e => setGoal(e.target.value)}
                      placeholder="Grow email list and drive pre-orders" disabled={loading} />
                  </div>

                  <div>
                    <label className="label">Tone</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {TONES.map(t => (
                        <button key={t} type="button" disabled={loading}
                          onClick={() => setTone(t)}
                          className={`tone-pill${tone === t ? ' active' : ''}`}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          padding: '10px 14px',
                          background: 'rgba(248,113,113,0.08)',
                          border: '1px solid rgba(248,113,113,0.20)',
                          borderRadius: 9,
                          fontSize: 13,
                          color: '#f87171',
                        }}
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div style={{ marginTop: 2 }}>
                    <button type="submit" disabled={!valid || loading} className="btn-forge">
                      {loading ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Forging campaign…
                        </>
                      ) : (
                        <>
                          Forge campaign
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Step progress */}
                  <AnimatePresence>
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          display: 'flex', flexDirection: 'column', gap: 8,
                          paddingTop: 12,
                          borderTop: '1px solid var(--border-s)',
                          marginTop: 2,
                        }}
                      >
                        {STEPS.map((label, i) => {
                          const done   = i < activeStep
                          const active = i === activeStep
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.06 }}
                              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                            >
                              <span style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {done ? (
                                  <CheckCircle2 size={15} style={{ color: '#34d399' }} />
                                ) : active ? (
                                  <Loader2 size={13} className="animate-spin" style={{ color: 'var(--forge)' }} />
                                ) : (
                                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ink-4)', display: 'block' }} />
                                )}
                              </span>
                              <span style={{
                                fontSize: 13,
                                color: done ? '#34d399' : active ? 'var(--ink-1)' : 'var(--ink-4)',
                                fontWeight: active ? 500 : 400,
                                transition: 'color 0.2s',
                              }}>
                                {label}
                              </span>
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid var(--border-s)',
        padding: '64px 24px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--forge)', textAlign: 'center', marginBottom: 10 }}>Process</p>
          <h2 style={{
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em',
            textAlign: 'center', marginBottom: 36, color: 'var(--ink-1)',
          }}>
            Brief in. Campaign out.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { n: '01', title: 'Fill the brief', body: 'Business name, audience, goal, tone. Takes 45 seconds.' },
              { n: '02', title: 'AI forges everything', body: 'Emails, ads, podcast script generated in parallel. Specific to your business — no filler copy.' },
              { n: '03', title: 'Copy and publish', body: 'Paste into Mailchimp, Meta Ads Manager, and your podcast host. Done.' },
            ].map(({ n, title, body }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: '22px 22px 26px',
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border-d)',
                  borderRadius: 14,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--forge)', opacity: 0.65, marginBottom: 10 }}>{n}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-1)', marginBottom: 6, letterSpacing: '-0.01em', fontFamily: "'Outfit', system-ui, sans-serif" }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.65 }}>{body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive: single column on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .forge-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
      <FloatingChat />
    </>
  )
}
