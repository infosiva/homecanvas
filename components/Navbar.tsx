'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import config from '@/vertical.config'
import { btn, theme } from '@/lib/theme'

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
        ${scrolled ? 'glass-strong border-b border-white/[0.05] shadow-lg shadow-black/20' : 'bg-transparent'}`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group select-none">
            <span
              className="flex items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
              style={{ width: 26, height: 26, background: 'linear-gradient(135deg, #be123c, #e11d48)', flexShrink: 0 }}
              aria-hidden
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 11l9-8 9 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </span>
            <span className={`font-bold text-[15px] tracking-tight transition-opacity duration-150 group-hover:opacity-80 ${theme.gradientText}`}>
              {config.name}
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5 text-[13px]">
            <Link href="/search"       className="px-3 py-1.5 text-white/45 hover:text-white/90 rounded-md hover:bg-white/[0.04] transition-all duration-150">Find a {config.providerLabel}</Link>
            <Link href="/providers"    className="px-3 py-1.5 text-white/45 hover:text-white/90 rounded-md hover:bg-white/[0.04] transition-all duration-150">For {config.providerPlural}</Link>
            <Link href="/how-it-works" className="px-3 py-1.5 text-white/45 hover:text-white/90 rounded-md hover:bg-white/[0.04] transition-all duration-150">How it works</Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-[13px] text-white/40 hover:text-white/70 transition-colors px-2 py-1.5">
              Log in
            </Link>
            <Link href="/chat" className={`${btn.primary} btn-press text-[13px]`}>
              Get matched
            </Link>
          </div>

          {/* Mobile toggle — animated lines */}
          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-md text-white/50 hover:text-white/80 transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className={`block w-5 h-px bg-current transition-all duration-200 origin-center ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block w-5 h-px bg-current transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-px bg-current transition-all duration-200 origin-center ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${open ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <div className={`absolute top-0 left-0 right-0 glass-strong border-b border-white/[0.06] transition-all duration-300 ease-out ${open ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-white/[0.05]">
            <Link href="/" onClick={() => setOpen(false)} className={`font-bold text-sm ${theme.gradientText}`}>{config.name}</Link>
            <button onClick={() => setOpen(false)} className="p-1.5 text-white/40 hover:text-white/80 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="px-5 py-4 flex flex-col gap-1 text-sm">
            <Link href="/search"       onClick={() => setOpen(false)} className="px-2 py-2.5 text-white/60 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all">Find a {config.providerLabel}</Link>
            <Link href="/providers"    onClick={() => setOpen(false)} className="px-2 py-2.5 text-white/60 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all">For {config.providerPlural}</Link>
            <Link href="/how-it-works" onClick={() => setOpen(false)} className="px-2 py-2.5 text-white/60 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all">How it works</Link>
            <div className="h-px bg-white/[0.05] my-2" />
            <Link href="/login"        onClick={() => setOpen(false)} className="px-2 py-2.5 text-white/50 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all">Log in</Link>
            <Link href="/chat"         onClick={() => setOpen(false)} className={`${btn.primary} text-center py-2.5 mt-1`}>Get matched free</Link>
          </div>
        </div>
      </div>

      {/* Spacer so content doesn't go under fixed nav */}
      <div className="h-14" />
    </>
  )
}
