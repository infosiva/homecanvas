'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, Video, FileText, Mail, Share2, Scissors,
  BarChart3, ArrowRight, Loader2, ChevronDown, ChevronUp,
  Zap, Globe, Clock, Search, TrendingUp, Target,
  Briefcase, Palette, Layout, Check, X,
} from 'lucide-react'

// ── Output definitions ───────────────────────────────────────
const OUTPUTS = [
  { icon: FileText,  label: 'Blog / SEO Article',  desc: '1,200-word SEO article with meta + headings', color: 'var(--aos)' },
  { icon: Mic,       label: 'Podcast Episode',      desc: 'Hook + outline + full script + show notes', color: 'var(--cyan)' },
  { icon: Video,     label: 'Faceless Video',       desc: 'AI voiceover script + 8 B-roll scene prompts', color: '#a78bfa' },
  { icon: Share2,    label: 'LinkedIn Posts',       desc: '3 posts — thought leader, hook bait, carousel', color: '#3b82f6' },
  { icon: Mail,      label: 'Email Sequence',       desc: '5-email nurture — welcome → educate → convert', color: '#f59e0b' },
  { icon: Scissors,  label: 'Short Clips',          desc: '10 Reels/TikTok captions with hook formulas', color: 'var(--emerald)' },
  { icon: BarChart3, label: 'Client Report',        desc: 'Strategy deck + 30-day content calendar', color: '#f472b6' },
]

// ── Integrations (Canva, Figma, etc.) ───────────────────────
const INTEGRATIONS = [
  { name: 'Canva', desc: 'Auto-export designs to Canva templates', icon: '🎨', status: 'soon' },
  { name: 'Figma', desc: 'Push brand guidelines to Figma library', icon: '✏️', status: 'soon' },
  { name: 'Notion', desc: 'Sync content calendar to Notion DB', icon: '📋', status: 'soon' },
  { name: 'Zapier', desc: 'Trigger workflows from generated content', icon: '⚡', status: 'soon' },
  { name: 'Buffer', desc: 'Schedule LinkedIn/Twitter posts directly', icon: '📅', status: 'soon' },
  { name: 'Make.com', desc: 'Multi-step automation from brief to publish', icon: '🔄', status: 'soon' },
]

// ── Opportunity research agent modules ──────────────────────
const RESEARCH_MODULES = [
  { icon: Search,     label: 'Trend Scout',       desc: 'Finds trending topics in your niche from Reddit, X, LinkedIn' },
  { icon: TrendingUp, label: 'Gap Analyzer',      desc: "Spots keyword + content gaps competitors haven't covered" },
  { icon: Target,     label: 'Audience Intel',    desc: 'Maps buyer pain points to content formats that convert' },
  { icon: Briefcase,  label: 'Client Finder',     desc: 'Surfaces local/niche businesses ready to outsource content' },
  { icon: Globe,      label: 'Market Pulse',      desc: "Daily brief: what's blowing up in your industry today" },
]

// ── Competitor comparison ────────────────────────────────────
const COMPETITORS = [
  { name: 'Repurpose.io', price: '$49/mo', does: 'Repurpose existing content', doesnt: 'Create content from scratch' },
  { name: 'Opus Clip',    price: '$35/mo', does: 'Clip long videos',           doesnt: 'Write scripts or blogs' },
  { name: 'Capsho',       price: '$59/mo', does: 'Podcast show notes',         doesnt: 'Video / social / email' },
  { name: 'Blotato',      price: '$39/mo', does: 'LinkedIn repurpose',         doesnt: 'Full agency workflow' },
  { name: 'HeyGen',       price: '$99/mo', does: 'Talking-head AI video',      doesnt: 'Strategy or copy' },
  { name: 'AgencyOS',     price: 'Free',   does: 'All 7 formats + research + integrations', doesnt: null },
]

// ── Loading steps ────────────────────────────────────────────
const LOADING_STEPS = [
  'Researching your topic...',
  'Writing SEO blog post...',
  'Scripting podcast episode...',
  'Building video storyboard...',
  'Crafting LinkedIn posts...',
  'Writing email sequence...',
  'Creating clip captions...',
  'Compiling client report...',
  'All 7 outputs ready!',
]

// ── Live activity ticker ─────────────────────────────────────
const TICKER_ITEMS = [
  '📝 Blog: "10 AI Tools That Replace a Full Marketing Team"',
  '🎙️ Podcast: "Zero Employee Business Models in 2026"',
  '🎬 Video: "How I Automated My Agency With 3 Prompts"',
  '📱 LinkedIn: 3 posts for TechStartupFounders scheduled',
  '📧 Email: 5-part sequence for SaaS onboarding ready',
  '✂️ Clips: 10 TikTok hooks for B2B content strategy',
  '📊 Report: 30-day content calendar compiled',
  '🔍 Research: Found 14 trending gaps in AI niche',
  '🎨 Canva template synced with brand kit',
  '📁 Client deck exported to Figma',
]

function LiveTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="ticker-wrap" style={{ borderTop: '1px solid var(--border-s)', borderBottom: '1px solid var(--border-s)', padding: '10px 0', background: 'rgba(12,12,20,0.50)' }}>
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} style={{ color: 'var(--ink-2)', fontSize: 13, fontFamily: "'Inter', sans-serif" }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── FAQ data ─────────────────────────────────────────────────
const FAQS = [
  {
    q: 'How long does generation take?',
    a: 'All 7 outputs are generated in parallel using AI — typically 60–90 seconds. Podcast scripts and blog posts run simultaneously so you\'re not waiting 7x longer.',
  },
  {
    q: 'Do I need to know how to use AI?',
    a: 'No. Fill in 3 fields: your brand name, topic, and target audience. AgencyOS handles everything else. No prompting skills required.',
  },
  {
    q: 'When are Canva and Figma integrations available?',
    a: 'These are on our Q3 roadmap. Sign up free and you\'ll get early access when they launch — Canva auto-export and Figma brand kit sync.',
  },
  {
    q: 'What is the Opportunity Research Agent?',
    a: 'It\'s a built-in research layer that finds trending topics, content gaps, and even potential clients in your niche before you write a single brief. Available on Agency and Studio plans.',
  },
  {
    q: 'Can I white-label the client report?',
    a: 'Yes — on Agency and Studio plans, the client report is fully white-labeled with your agency branding, logo, and contact details.',
  },
]

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        borderBottom: '1px solid var(--border-s)',
        padding: '18px 0',
        cursor: 'pointer',
      }}
    >
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

// ── Main page ────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter()
  const [brand, setBrand] = useState('')
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')
  const [loading, setLoading] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!brand || !topic || !audience) return
    setLoading(true)
    setStepIdx(0)
    setError('')

    const timer = setInterval(() => {
      setStepIdx(i => Math.min(i + 1, LOADING_STEPS.length - 2))
    }, 1500)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, topic, audience }),
      })
      clearInterval(timer)
      if (!res.ok) throw new Error('Generation failed')
      const { id } = await res.json()
      setStepIdx(LOADING_STEPS.length - 1)
      setTimeout(() => router.push(`/result/${id}`), 600)
    } catch {
      clearInterval(timer)
      setLoading(false)
      setError('Something went wrong. Try again.')
    }
  }

  return (
    <>
      {/* Background */}
      <div className="aos-mesh" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Live ticker */}
      <LiveTicker />

      {/* ── Hero ── */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px 40px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="badge-aos" style={{ marginBottom: 24, display: 'inline-flex' }}>
            <Zap size={11} />
            Your competitors use 6 tools. You use one.
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.55 }}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(36px, 6vw, 72px)',
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            color: 'var(--ink-1)',
            margin: '0 0 24px',
          }}
        >
          Run a Full AI Agency<br />
          <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            With Zero Employees
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ color: 'var(--ink-2)', fontSize: 18, lineHeight: 1.65, maxWidth: 600, margin: '0 auto 48px' }}
        >
          One brief → blog + podcast + faceless video + LinkedIn + emails + Reels + client report.
          In 90 seconds. No team. No agency fees.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', marginBottom: 48 }}
        >
          {[
            { val: '7', label: 'formats' },
            { val: '90s', label: 'avg time' },
            { val: '∞', label: 'free tier' },
            { val: '1', label: 'brief needed' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 28, color: 'var(--ink-1)', lineHeight: 1 }}>{s.val}</div>
              <div style={{ color: 'var(--ink-3)', fontSize: 12, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Brief form ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55 }}
          className="glass"
          style={{ padding: '32px', maxWidth: 560, margin: '0 auto', textAlign: 'left' }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '20px 0' }}
              >
                <Loader2 size={28} color="var(--aos)" style={{ animation: 'spin 0.8s linear infinite', display: 'block', margin: '0 auto 16px' }} />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={stepIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    style={{ color: 'var(--ink-2)', fontSize: 14, margin: 0 }}
                  >
                    {LOADING_STEPS[stepIdx]}
                  </motion.p>
                </AnimatePresence>
                <div style={{ marginTop: 20, background: 'var(--border-s)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, var(--aos), var(--cyan))',
                    width: `${((stepIdx + 1) / LOADING_STEPS.length) * 100}%`,
                    transition: 'width 1.2s ease',
                  }} />
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ color: 'var(--ink-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                    Brand / Company name
                  </label>
                  <input className="input" placeholder="e.g. Acme Marketing" value={brand} onChange={e => setBrand(e.target.value)} required />
                </div>
                <div>
                  <label style={{ color: 'var(--ink-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                    Topic / angle
                  </label>
                  <input className="input" placeholder="e.g. AI tools for small businesses in 2026" value={topic} onChange={e => setTopic(e.target.value)} required />
                </div>
                <div>
                  <label style={{ color: 'var(--ink-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                    Target audience
                  </label>
                  <input className="input" placeholder="e.g. SaaS founders, 25–45" value={audience} onChange={e => setAudience(e.target.value)} required />
                </div>
                {error && <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>}
                <button type="submit" className="btn-aos" style={{ width: '100%', marginTop: 4, justifyContent: 'center' }}>
                  Generate 7 outputs — free
                  <ArrowRight size={16} />
                </button>
                <p style={{ color: 'var(--ink-3)', fontSize: 12, textAlign: 'center', margin: 0 }}>
                  No account required. Results in ~90 seconds.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── Outputs grid ── */}
      <section id="outputs" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="badge-cyan" style={{ display: 'inline-flex', marginBottom: 16 }}>7 outputs in one run</span>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.03em', color: 'var(--ink-1)', margin: '0 0 12px' }}>
            Everything your agency produces
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Competitors do one format. AgencyOS does the whole stack.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {OUTPUTS.map((o, i) => (
            <motion.div
              key={o.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="card-aos"
              style={{ padding: '24px' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${o.color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <o.icon size={20} color={o.color} />
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--ink-1)', marginBottom: 6 }}>{o.label}</div>
              <div style={{ color: 'var(--ink-3)', fontSize: 13, lineHeight: 1.55 }}>{o.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Opportunity Research Agent ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 10 }}>
        <div className="card-aos" style={{ padding: '40px', borderColor: 'rgba(99,102,241,0.2)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 300px' }}>
              <span className="badge-aos" style={{ marginBottom: 16, display: 'inline-flex' }}>
                <Search size={11} />
                Opportunity Research Agent
              </span>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.03em', color: 'var(--ink-1)', margin: '0 0 12px' }}>
                Find clients before<br />
                <span style={{ color: 'var(--aos)' }}>they find you</span>
              </h3>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.65 }}>
                Built-in research agent scans Reddit, LinkedIn, X, and Google Trends daily — surfacing trending topics, content gaps, and businesses actively looking to outsource content. No cold outreach. Just warm leads.
              </p>
              <span className="badge-cyan" style={{ marginTop: 12, display: 'inline-flex' }}>Agency + Studio plans</span>
            </div>
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {RESEARCH_MODULES.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--aos-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <m.icon size={16} color="var(--aos-2)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-1)', marginBottom: 2 }}>{m.label}</div>
                    <div style={{ color: 'var(--ink-3)', fontSize: 13, lineHeight: 1.5 }}>{m.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Integrations ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="badge-green" style={{ display: 'inline-flex', marginBottom: 16 }}>
            <Layout size={11} />
            Integrations coming Q3 2026
          </span>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '-0.03em', color: 'var(--ink-1)', margin: '0 0 10px' }}>
            Works where you work
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, maxWidth: 440, margin: '0 auto' }}>
            Export to Canva, sync to Figma, push to Notion, schedule via Buffer — all from one brief.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {INTEGRATIONS.map((int, i) => (
            <motion.div
              key={int.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="card-aos"
              style={{ padding: '20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}
            >
              <span style={{ fontSize: 24, lineHeight: 1 }}>{int.icon}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink-1)' }}>{int.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--ink-3)', border: '1px solid var(--border-s)', borderRadius: 4, padding: '1px 5px' }}>soon</span>
                </div>
                <div style={{ color: 'var(--ink-3)', fontSize: 12, lineHeight: 1.5 }}>{int.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Competitor comparison ── */}
      <section id="compare" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '-0.03em', color: 'var(--ink-1)', margin: '0 0 10px' }}>
            Why AgencyOS beats the rest
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
            Tools like Opus Clip, Repurpose.io, and Capsho each do one thing. AgencyOS does the whole agency.
          </p>
        </div>
        <div className="card-aos" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'rgba(99,102,241,0.06)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--ink-3)', fontWeight: 600, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-s)' }}>Tool</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--ink-3)', fontWeight: 600, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-s)' }}>Price</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--ink-3)', fontWeight: 600, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-s)' }}>What it does</th>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--ink-3)', fontWeight: 600, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-s)' }}>Gap</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITORS.map((c, i) => (
                <tr key={c.name} style={{ borderBottom: i < COMPETITORS.length - 1 ? '1px solid var(--border-s)' : 'none', background: c.name === 'AgencyOS' ? 'rgba(99,102,241,0.06)' : 'transparent' }}>
                  <td style={{ padding: '14px 20px', fontWeight: c.name === 'AgencyOS' ? 700 : 500, color: c.name === 'AgencyOS' ? 'var(--aos-2)' : 'var(--ink-1)' }}>{c.name}</td>
                  <td style={{ padding: '14px 20px', color: c.name === 'AgencyOS' ? 'var(--emerald)' : 'var(--ink-2)' }}>{c.price}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--ink-2)', maxWidth: 260 }}>{c.does}</td>
                  <td style={{ padding: '14px 20px' }}>
                    {c.doesnt ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f87171', fontSize: 13 }}>
                        <X size={13} />
                        {c.doesnt}
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--emerald)', fontSize: 13, fontWeight: 600 }}>
                        <Check size={13} />
                        Full stack
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: '-0.03em', color: 'var(--ink-1)', margin: '0 0 12px' }}>
            3 fields. 90 seconds. Done.
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15, maxWidth: 400, margin: '0 auto' }}>
            No 10-step wizard. No agency onboarding call. No waiting 3 days.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { n: '01', title: 'Fill in 3 fields', body: 'Brand name, topic, and target audience. That\'s all. No settings menu. No 47 toggles.' },
            { n: '02', title: 'AI generates 7 outputs in parallel', body: 'All formats run simultaneously. Blog, podcast, video, LinkedIn, emails, clips, and client report — all ready at once.' },
            { n: '03', title: 'Copy, export, publish', body: 'One-click copy for each format. Canva + Figma export coming soon. Your brief becomes a full content machine.' },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              style={{ display: 'flex', gap: 24, padding: '28px 0', borderBottom: i < 2 ? '1px solid var(--border-s)' : 'none' }}
            >
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 28, color: 'var(--aos)', opacity: 0.5, lineHeight: 1, flexShrink: 0, width: 40 }}>{s.n}</div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--ink-1)', marginBottom: 6 }}>{s.title}</div>
                <div style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.65 }}>{s.body}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: '-0.03em', color: 'var(--ink-1)', margin: '0 0 12px' }}>
            No agency retainer
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 15 }}>Agencies charge $3,000–$10,000/month for this. AgencyOS starts free.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {[
            {
              name: 'Free',
              price: '$0',
              sub: 'forever',
              badge: null,
              features: ['3 briefs per month', 'All 7 output formats', 'Copy & download', 'Community support'],
              cta: 'Start free',
              primary: false,
            },
            {
              name: 'Agency',
              price: '$49',
              sub: 'per month',
              badge: 'Most popular',
              features: ['Unlimited briefs', 'All 7 output formats', 'Opportunity research agent', 'White-label client reports', 'Canva + Figma export (Q3)', 'Priority support'],
              cta: 'Start Agency',
              primary: true,
            },
            {
              name: 'Studio',
              price: '$99',
              sub: 'per month',
              badge: null,
              features: ['Everything in Agency', 'Multi-client workspace', 'Team seats (5)', 'API access', 'Buffer + Zapier + Make.com', 'Dedicated onboarding'],
              cta: 'Start Studio',
              primary: false,
            },
          ].map(p => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-aos"
              style={{
                padding: '28px',
                borderColor: p.primary ? 'rgba(99,102,241,0.35)' : undefined,
                boxShadow: p.primary ? '0 0 40px rgba(99,102,241,0.12)' : undefined,
                position: 'relative',
              }}
            >
              {p.badge && (
                <span className="badge-aos" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>{p.badge}</span>
              )}
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--ink-1)', marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 36, color: 'var(--ink-1)' }}>{p.price}</span>
                <span style={{ color: 'var(--ink-3)', fontSize: 13 }}>/{p.sub}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-s)', margin: '20px 0' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'var(--ink-2)', fontSize: 14 }}>
                    <Check size={14} color="var(--emerald)" style={{ marginTop: 2, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={p.primary ? 'btn-aos' : 'btn-ghost'} style={{ width: '100%', justifyContent: 'center' }}>
                {p.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 32px)', letterSpacing: '-0.03em', color: 'var(--ink-1)', textAlign: 'center', marginBottom: 40 }}>
          Questions
        </h2>
        {FAQS.map(f => <Faq key={f.q} {...f} />)}
      </section>

      {/* ── Final CTA ── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="glass" style={{ padding: '52px 40px' }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.04em', color: 'var(--ink-1)', margin: '0 0 16px' }}>
            Ship your first brief<br />
            <span style={{ color: 'var(--aos)' }}>in the next 90 seconds</span>
          </h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 16, marginBottom: 32 }}>No account. No card. No agency. Just results.</p>
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="btn-aos" style={{ fontSize: 16, padding: '16px 36px' }}>
            Generate free now
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border-s)', padding: '24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <p style={{ color: 'var(--ink-4)', fontSize: 13, margin: 0 }}>
          © 2026 AgencyOS · Built with AI · No employees were harmed
        </p>
      </footer>
    </>
  )
}
