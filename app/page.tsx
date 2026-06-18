'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Upload, Palette, Download, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Home } from 'lucide-react'

// ── Design styles ────────────────────────────────────────────
const DESIGN_STYLES = [
  { id: 'scandinavian', label: 'Scandinavian', emoji: '🪵' },
  { id: 'modern',       label: 'Modern',       emoji: '⬜' },
  { id: 'bohemian',     label: 'Bohemian',     emoji: '🌸' },
  { id: 'minimalist',   label: 'Minimalist',   emoji: '◻️' },
  { id: 'industrial',   label: 'Industrial',   emoji: '🔩' },
  { id: 'coastal',      label: 'Coastal',      emoji: '🌊' },
]

// ── SVG Room illustrations ───────────────────────────────────
function RoomBefore() {
  return (
    <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Floor */}
      <rect x="0" y="260" width="640" height="100" fill="#cfc6b5" />
      {/* Back wall */}
      <rect x="0" y="0" width="640" height="260" fill="#e2d9cc" />
      {/* Wall shadow sides */}
      <polygon points="0,0 80,60 80,260 0,260" fill="#d8cfc2" />
      <polygon points="640,0 560,60 560,260 640,260" fill="#d8cfc2" />
      {/* Floor line */}
      <line x1="80" y1="260" x2="560" y2="260" stroke="#b8ae9f" strokeWidth="2" />
      {/* Plain sofa — beige */}
      <rect x="150" y="200" width="340" height="80" rx="6" fill="#c9bfaf" />
      <rect x="150" y="195" width="340" height="20" rx="4" fill="#bdb3a3" />
      <rect x="148" y="200" width="20" height="80" rx="4" fill="#bdb3a3" />
      <rect x="472" y="200" width="20" height="80" rx="4" fill="#bdb3a3" />
      {/* Coffee table */}
      <rect x="235" y="248" width="170" height="20" rx="4" fill="#b8a896" />
      {/* Lamp */}
      <rect x="106" y="170" width="8" height="90" fill="#a89f92" />
      <polygon points="80,170 140,170 120,120 100,120" fill="#d4cbbf" />
      {/* Empty white walls note */}
      <text x="320" y="140" textAnchor="middle" fill="#a89f92" fontSize="13" fontFamily="sans-serif">Plain walls · no decor</text>
      {/* BEFORE label */}
      <rect x="16" y="12" width="70" height="22" rx="4" fill="rgba(0,0,0,0.18)" />
      <text x="51" y="27" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="sans-serif">BEFORE</text>
    </svg>
  )
}

function RoomAfter() {
  return (
    <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Floor — warm wood */}
      <rect x="0" y="260" width="640" height="100" fill="#c4a882" />
      <line x1="0" y1="280" x2="640" y2="280" stroke="#b89870" strokeWidth="1.5" strokeDasharray="60,4" />
      <line x1="0" y1="300" x2="640" y2="300" stroke="#b89870" strokeWidth="1.5" strokeDasharray="60,4" />
      {/* Rose accent back wall */}
      <rect x="0" y="0" width="640" height="260" fill="#f9eeef" />
      {/* Accent wall panel center */}
      <rect x="160" y="20" width="320" height="240" rx="2" fill="#fce8ea" />
      <rect x="160" y="20" width="320" height="240" rx="2" fill="none" stroke="#e11d48" strokeWidth="2" opacity="0.25" />
      {/* Wall side shading */}
      <polygon points="0,0 80,55 80,260 0,260" fill="#f4e6e7" />
      <polygon points="640,0 560,55 560,260 640,260" fill="#f4e6e7" />
      {/* Floor line */}
      <line x1="80" y1="260" x2="560" y2="260" stroke="#c4a882" strokeWidth="2" />
      {/* Scandinavian sofa — light grey */}
      <rect x="140" y="198" width="360" height="80" rx="8" fill="#e8e4df" />
      <rect x="140" y="192" width="360" height="20" rx="5" fill="#ddd9d4" />
      <rect x="138" y="198" width="22" height="80" rx="5" fill="#d4d0cb" />
      <rect x="480" y="198" width="22" height="80" rx="5" fill="#d4d0cb" />
      {/* Rose accent cushions */}
      <rect x="166" y="202" width="60" height="46" rx="6" fill="#e11d48" opacity="0.8" />
      <rect x="240" y="202" width="60" height="46" rx="6" fill="#fce8ea" />
      <rect x="340" y="202" width="60" height="46" rx="6" fill="#e11d48" opacity="0.6" />
      <rect x="414" y="202" width="60" height="46" rx="6" fill="#fce8ea" />
      {/* Coffee table — natural wood */}
      <rect x="228" y="244" width="184" height="24" rx="5" fill="#c4a882" />
      <rect x="238" y="268" width="8" height="14" rx="3" fill="#b89870" />
      <rect x="394" y="268" width="8" height="14" rx="3" fill="#b89870" />
      {/* Table book + vase */}
      <rect x="278" y="238" width="30" height="8" rx="2" fill="#e11d48" opacity="0.5" />
      <rect x="308" y="235" width="8" height="11" rx="2" fill="#d4c8be" />
      {/* Floor lamp — modern */}
      <rect x="524" y="150" width="5" height="120" fill="#a89f92" />
      <circle cx="526" cy="145" r="16" fill="#fde8c8" opacity="0.8" />
      <circle cx="526" cy="145" r="10" fill="#f9d4a0" />
      {/* Wall art */}
      <rect x="240" y="50" width="160" height="100" rx="4" fill="#fff" />
      <rect x="244" y="54" width="152" height="92" rx="2" fill="#fce8ea" />
      <ellipse cx="320" cy="100" rx="40" ry="30" fill="#e11d48" opacity="0.2" />
      <ellipse cx="320" cy="100" rx="20" ry="15" fill="#e11d48" opacity="0.35" />
      {/* Plant */}
      <rect x="92" y="220" width="10" height="42" fill="#8b7355" />
      <ellipse cx="97" cy="210" rx="22" ry="28" fill="#5d8a4c" />
      <ellipse cx="82" cy="220" rx="14" ry="18" fill="#6da05a" />
      <ellipse cx="112" cy="218" rx="14" ry="18" fill="#4f7840" />
      {/* AFTER label */}
      <rect x="16" y="12" width="62" height="22" rx="4" fill="#e11d48" />
      <text x="47" y="27" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="sans-serif">AFTER</text>
    </svg>
  )
}

// ── Before/After interactive slider ─────────────────────────
function BeforeAfterSlider() {
  const [pos, setPos] = useState(50)
  const [auto, setAuto] = useState(true)
  const dirRef = useRef(1)
  const posRef = useRef(50)

  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => {
      posRef.current += dirRef.current * 0.8
      if (posRef.current >= 80) dirRef.current = -1
      if (posRef.current <= 20) dirRef.current = 1
      setPos(posRef.current)
    }, 30)
    return () => clearInterval(id)
  }, [auto])

  function handleMove(clientX: number, rect: DOMRect) {
    setAuto(false)
    const p = Math.max(4, Math.min(96, ((clientX - rect.left) / rect.width) * 100))
    posRef.current = p
    setPos(p)
  }

  return (
    <div
      className="ba-wrap"
      onMouseMove={e => handleMove(e.clientX, e.currentTarget.getBoundingClientRect())}
      onTouchMove={e => handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
      onMouseLeave={() => { if (!auto) setTimeout(() => setAuto(true), 2000) }}
      style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '16/9', position: 'relative', cursor: 'col-resize', userSelect: 'none' }}
    >
      {/* Before */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <RoomBefore />
      </div>
      {/* After (clipped) */}
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)`, transition: 'clip-path 0.04s linear' }}>
        <RoomAfter />
      </div>
      {/* Handle */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pos}%`, width: 2, background: '#e11d48', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 10 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 32, height: 32, borderRadius: '50%', background: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 800, boxShadow: '0 2px 12px rgba(225,29,72,0.5)' }}>⇔</div>
      </div>
    </div>
  )
}

// ── Design summary card ──────────────────────────────────────
function DesignSummaryCard() {
  const summaries = [
    { style: 'Scandinavian', items: ['Rose accent wall', 'Natural oak flooring', 'Linen sofa', 'Monstera plant'] },
    { style: 'Modern',       items: ['Concrete grey walls', 'Rose statement cushions', 'Walnut side table', 'Arc floor lamp'] },
    { style: 'Bohemian',     items: ['Terracotta tones', 'Rose throws', 'Rattan furniture', 'Macramé wall art'] },
  ]
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % summaries.length), 3200)
    return () => clearInterval(id)
  }, [])

  const s = summaries[idx]
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(225,29,72,0.15)', borderRadius: 12, padding: '16px 20px', marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#e11d48', textTransform: 'uppercase' }}>AI Design Summary</span>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e11d48', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: '#1a1614', marginBottom: 8 }}>
            {s.style} living room concept
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {s.items.map(item => (
              <span key={item} style={{ fontSize: 12, color: '#4a4541', background: '#fafaf9', border: '1px solid #e5e2de', borderRadius: 6, padding: '3px 10px' }}>
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Navbar ────────────────────────────────────────────────────
function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'all 300ms',
      background: scrolled ? 'rgba(250,250,249,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : 'none',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span style={{ width: 28, height: 28, borderRadius: 8, background: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Home size={14} color="#fff" />
          </span>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 16, color: '#1a1614', letterSpacing: '-0.02em' }}>
            Home<span style={{ color: '#e11d48' }}>Canvas</span>
          </span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/visualise" style={{ fontSize: 13, color: '#4a4541', textDecoration: 'none', fontWeight: 500 }}>Design</a>
          <a href="#how" style={{ fontSize: 13, color: '#4a4541', textDecoration: 'none', fontWeight: 500 }}>How it works</a>
          <a href="#pricing" style={{ fontSize: 13, color: '#4a4541', textDecoration: 'none', fontWeight: 500 }}>Pricing</a>
          <a href="/visualise" className="btn-rose" style={{ fontSize: 13, padding: '9px 20px' }}>
            Try free
          </a>
        </div>
      </div>
    </nav>
  )
}

// ── FAQ ───────────────────────────────────────────────────────
const FAQS = [
  { q: 'How does the AI generate designs?', a: 'Describe your room (dimensions, style preference, budget) and HomeCanvas AI analyses thousands of interior design combinations. It generates a personalised concept with furniture suggestions, colour palettes, and layout ideas in under 30 seconds.' },
  { q: 'Do I need to hire a designer afterwards?', a: "No — that's the point. HomeCanvas gives you a ready-to-execute design plan: furniture links, paint codes, layout diagrams. You can share it directly with an IKEA or a local furniture store." },
  { q: 'Can I upload a photo of my room?', a: 'Yes. Photo upload is on the roadmap. For now, describe your room dimensions and current furniture. Photo-based redesign launches in Q3 2026 on Pro plan.' },
  { q: 'Is it really free?', a: 'You get 3 free design generations per month with no account needed. Sign up to save your designs and get 10 free monthly generations. Pro removes all limits.' },
  { q: 'What room types does it work for?', a: 'Living rooms, bedrooms, home offices, kitchens, dining rooms, bathrooms, hallways, and gardens. More room types and commercial spaces coming soon.' },
]

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div onClick={() => setOpen(o => !o)} style={{ borderBottom: '1px solid var(--border-s)', padding: '18px 0', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-1)' }}>{q}</span>
        {open ? <ChevronUp size={16} color="var(--ink-3)" /> : <ChevronDown size={16} color="var(--ink-3)" />}
      </div>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.7, marginTop: 10, overflow: 'hidden' }}
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Feedback section ─────────────────────────────────────────
function FeedbackSection() {
  const [vote, setVote] = useState<'up' | 'down' | null>(null)
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)

  async function submit() {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote, text, page: 'home', ts: new Date().toISOString() }),
      })
    } catch { /* silent */ }
    setSent(true)
  }

  if (sent) return (
    <div style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-3)', fontSize: 14 }}>
      Thanks for your feedback!
    </div>
  )

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border-s)', borderRadius: 16, padding: '28px', maxWidth: 480, margin: '0 auto' }}>
      <p style={{ textAlign: 'center', color: 'var(--ink-2)', fontSize: 15, fontWeight: 500, margin: '0 0 16px' }}>Was this page helpful?</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => setVote('up')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 10, border: `1.5px solid ${vote === 'up' ? '#e11d48' : 'var(--border-m)'}`, background: vote === 'up' ? '#fce8ea' : 'transparent', color: vote === 'up' ? '#e11d48' : 'var(--ink-2)', cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 160ms' }}>
          <ThumbsUp size={15} /> Yes
        </button>
        <button onClick={() => setVote('down')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 10, border: `1.5px solid ${vote === 'down' ? '#e11d48' : 'var(--border-m)'}`, background: vote === 'down' ? '#fce8ea' : 'transparent', color: vote === 'down' ? '#e11d48' : 'var(--ink-2)', cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 160ms' }}>
          <ThumbsDown size={15} /> Not really
        </button>
      </div>
      {vote && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Any thoughts? (optional)" rows={2}
            style={{ width: '100%', borderRadius: 10, border: '1.5px solid var(--border-m)', padding: '10px 14px', fontSize: 14, color: 'var(--ink-1)', background: '#fff', outline: 'none', resize: 'none', fontFamily: 'Inter, sans-serif', marginBottom: 10, boxSizing: 'border-box' }} />
          <button onClick={submit} className="btn-rose" style={{ width: '100%', justifyContent: 'center' }}>Send feedback</button>
        </motion.div>
      )}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────
export default function HomePage() {
  const [room, setRoom] = useState('')
  const [style, setStyle] = useState('scandinavian')

  return (
    <>
      <div className="hc-bg" />
      <HomeNavbar />
      <div style={{ paddingTop: 56 }} />

      {/* ── Hero — split layout ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px 56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center', position: 'relative', zIndex: 10 }}>

        {/* Left — hero text + form */}
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge-rose" style={{ marginBottom: 20, display: 'inline-flex' }}>
              <Sparkles size={11} />
              AI interior design — free to try
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(36px, 5.5vw, 64px)',
              lineHeight: 1.06,
              letterSpacing: '-0.04em',
              color: 'var(--ink-1)',
              margin: '0 0 20px',
            }}
          >
            See your space<br />
            <span style={{ color: '#e11d48' }}>transformed</span><br />
            before you lift<br />a finger
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            style={{ color: 'var(--ink-2)', fontSize: 17, lineHeight: 1.65, marginBottom: 32, maxWidth: 420 }}
          >
            Describe your room. AI generates a full design concept — furniture, colour palette, layout — in seconds. No designer needed.
          </motion.p>

          {/* Quick form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.5 }}
            style={{ background: '#fff', border: '1px solid var(--border-s)', borderRadius: 20, padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
          >
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
                Describe your room
              </label>
              <input
                className="input"
                placeholder="e.g. Living room, 4×5m, north-facing, need storage"
                value={room}
                onChange={e => setRoom(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
                Style preference
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {DESIGN_STYLES.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                      border: `1.5px solid ${style === s.id ? '#e11d48' : 'var(--border-m)'}`,
                      background: style === s.id ? '#fce8ea' : '#fafaf9',
                      color: style === s.id ? '#e11d48' : 'var(--ink-2)',
                      cursor: 'pointer', transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{s.emoji}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href={`/visualise?room=${encodeURIComponent(room)}&style=${style}`}
              className="btn-rose"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', textDecoration: 'none', fontSize: 16, padding: '15px 28px' }}
            >
              Generate my design — free
              <ArrowRight size={18} />
            </Link>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-4)', marginTop: 10 }}>
              No account needed · Results in ~30 seconds
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap' }}
          >
            {[
              { val: '30s', label: 'avg generation' },
              { val: '8', label: 'room types' },
              { val: '6', label: 'design styles' },
              { val: 'Free', label: 'to start' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: 'var(--ink-1)', lineHeight: 1 }}>{s.val}</div>
                <div style={{ color: 'var(--ink-4)', fontSize: 11, marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — animated before/after demo */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.22, duration: 0.6 }}
          style={{ position: 'relative' }}
        >
          <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge-rose" style={{ fontSize: 11 }}>
              Drag to compare
            </span>
            <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>or watch the auto-reveal</span>
          </div>
          <BeforeAfterSlider />
          <DesignSummaryCard />
        </motion.div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="badge-rose" style={{ marginBottom: 14, display: 'inline-flex' }}>Simple 3-step process</span>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.03em', color: 'var(--ink-1)', margin: '0 0 12px' }}>
            From idea to design plan<br />in under a minute
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 16, maxWidth: 440, margin: '0 auto' }}>
            No design skills. No expensive consultation. No waiting weeks.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {[
            { n: '01', icon: <Upload size={22} color="#e11d48" />, title: 'Describe your space', body: 'Tell AI your room size, current layout, what you want to keep, and your style preference. Or upload a photo (Pro).' },
            { n: '02', icon: <Palette size={22} color="#e11d48" />, title: 'AI generates your concept', body: 'Get a full design: colour palette with paint codes, furniture recommendations, layout diagram, and mood board.' },
            { n: '03', icon: <Download size={22} color="#e11d48" />, title: 'Save and execute', body: 'Download your design plan as PDF. Share with furniture stores. Sign up to save and iterate unlimited designs.' },
          ].map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="card-hc"
              style={{ padding: '28px' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fce8ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                {step.icon}
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#e11d48', textTransform: 'uppercase', marginBottom: 6 }}>
                Step {step.n}
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--ink-1)', marginBottom: 8 }}>{step.title}</div>
              <div style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.65 }}>{step.body}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Room types grid ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '-0.03em', color: 'var(--ink-1)', margin: '0 0 10px' }}>
            Every room in your home
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, maxWidth: 400, margin: '0 auto' }}>AI trained on thousands of real interior design projects across all room types</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {[
            { icon: '🛋️', label: 'Living Room',  desc: 'Sofa, layout, focal point' },
            { icon: '🛏️', label: 'Bedroom',      desc: 'Sleep, storage, calm' },
            { icon: '🍳', label: 'Kitchen',       desc: 'Workflow, storage, style' },
            { icon: '🍽️', label: 'Dining Room',   desc: 'Entertaining & everyday' },
            { icon: '💻', label: 'Home Office',   desc: 'Focus, ergonomics, light' },
            { icon: '🚿', label: 'Bathroom',      desc: 'Spa feel, clever storage' },
            { icon: '🌿', label: 'Garden',        desc: 'Outdoor living space' },
            { icon: '🚪', label: 'Hallway',       desc: 'First impression, flow' },
          ].map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-hc"
              style={{ padding: '18px 16px', textAlign: 'center', cursor: 'pointer' }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{r.icon}</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--ink-1)', marginBottom: 4 }}>{r.label}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)', lineHeight: 1.4 }}>{r.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: '-0.03em', color: 'var(--ink-1)', margin: '0 0 12px' }}>
            Start free — no card needed
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>Interior designers charge £500–£3,000 for a consultation. HomeCanvas starts at £0.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            {
              name: 'Free',
              price: '£0',
              sub: 'forever',
              badge: null,
              features: ['3 designs per month', 'All room types', 'All design styles', 'Download as PDF', 'No account needed'],
              cta: 'Start designing',
              href: '/visualise',
              primary: false,
            },
            {
              name: 'Pro',
              price: '£12',
              sub: 'per month',
              badge: 'Most popular',
              features: ['Unlimited designs', 'Save design history', 'Photo room upload', 'Shopping list export', 'Priority generation', 'Email support'],
              cta: 'Sign up — save designs',
              href: '/visualise',
              primary: true,
            },
            {
              name: 'Studio',
              price: '£39',
              sub: 'per month',
              badge: null,
              features: ['Everything in Pro', 'Multiple rooms per project', 'Client sharing links', 'White-label PDF export', 'API access'],
              cta: 'Go Studio',
              href: '/visualise',
              primary: false,
            },
          ].map(p => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-hc"
              style={{
                padding: '28px',
                borderColor: p.primary ? 'rgba(225,29,72,0.30)' : undefined,
                boxShadow: p.primary ? '0 0 0 2px rgba(225,29,72,0.10), 0 4px 24px rgba(225,29,72,0.08)' : undefined,
                position: 'relative',
              }}
            >
              {p.badge && (
                <span className="badge-rose" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>{p.badge}</span>
              )}
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--ink-1)', marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 34, color: 'var(--ink-1)' }}>{p.price}</span>
                <span style={{ color: 'var(--ink-4)', fontSize: 13 }}>/{p.sub}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-s)', margin: '20px 0' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'var(--ink-2)', fontSize: 14 }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#fce8ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, fontSize: 9, color: '#e11d48', fontWeight: 800 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={p.primary ? 'btn-rose' : 'btn-ghost'}
                style={{ width: '100%', justifyContent: 'center', display: 'flex', textDecoration: 'none' }}
              >
                {p.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 32px)', letterSpacing: '-0.03em', color: 'var(--ink-1)', textAlign: 'center', marginBottom: 40 }}>
          Common questions
        </h2>
        {FAQS.map(f => <Faq key={f.q} {...f} />)}
      </section>

      {/* ── Final CTA ── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="card-hc" style={{ padding: '56px 40px', background: 'linear-gradient(135deg, #fff9f9 0%, #fff 100%)', borderColor: 'rgba(225,29,72,0.15)' }}>
          <span className="badge-rose" style={{ marginBottom: 20, display: 'inline-flex' }}>
            <Sparkles size={11} />
            Start in 30 seconds
          </span>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.04em', color: 'var(--ink-1)', margin: '0 0 16px' }}>
            Your room, reimagined.<br />
            <span style={{ color: '#e11d48' }}>No designer required.</span>
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 16, marginBottom: 32 }}>
            Describe your space and get a professional design concept instantly — free, no account needed.
          </p>
          <Link href="/visualise" className="btn-rose" style={{ fontSize: 16, padding: '16px 36px', display: 'inline-flex', textDecoration: 'none' }}>
            Design my room — free
            <ArrowRight size={18} />
          </Link>
          <p style={{ fontSize: 13, color: 'var(--ink-4)', marginTop: 14 }}>
            Sign up to save your designs →
          </p>
          <p className="text-xs opacity-60 mt-2">Have a promo code? <a href="#promo" className="underline">Apply here</a></p>
        </div>
      </section>

      {/* ── Feedback ── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 60px', position: 'relative', zIndex: 10 }}>
        <FeedbackSection />
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border-s)', padding: '28px 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={11} color="#fff" />
            </span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--ink-2)' }}>
              Home<span style={{ color: '#e11d48' }}>Canvas</span>
            </span>
          </div>
          <p style={{ color: 'var(--ink-4)', fontSize: 13, margin: 0 }}>
            © 2026 HomeCanvas · AI Interior Design
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="/visualise" style={{ color: 'var(--ink-4)', fontSize: 13, textDecoration: 'none' }}>Design</a>
            <a href="#pricing" style={{ color: 'var(--ink-4)', fontSize: 13, textDecoration: 'none' }}>Pricing</a>
            <a href="#how" style={{ color: 'var(--ink-4)', fontSize: 13, textDecoration: 'none' }}>How it works</a>
          </div>
        </div>
      </footer>
    </>
  )
}
