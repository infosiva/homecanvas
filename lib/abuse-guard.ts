/**
 * lib/abuse-guard.ts — Global abuse detection for all AI projects
 *
 * Detects and blocks:
 *   1. Free plan abuse — multi-account farming, limit evasion
 *   2. AI cost farming — high-volume token pumping in tight loops
 *   3. Prompt injection — jailbreak/override patterns in AI inputs
 *   4. Bot traffic — headless browsers, missing UA, automation headers
 *   5. Velocity attacks — same fingerprint hammering across window
 *
 * Usage in Next.js API route:
 *   import { guardRequest, guardAiInput } from '@/lib/abuse-guard'
 *
 *   export async function POST(req: NextRequest) {
 *     const block = guardRequest(req)
 *     if (block) return block  // 429 or 403 Response
 *
 *     const body = await req.json()
 *     const inputBlock = guardAiInput(req, body.message)
 *     if (inputBlock) return inputBlock
 *
 *     // ... proceed with AI call
 *   }
 *
 * Usage in Next.js middleware.ts (app-wide, catches every request):
 *   import { middlewareGuard } from '@/lib/abuse-guard'
 *   export function middleware(req: NextRequest) { return middlewareGuard(req) }
 *   export const config = { matcher: ['/api/:path*'] }
 *
 * Environment variables:
 *   TELEGRAM_BOT_TOKEN  — for admin alerts
 *   TELEGRAM_ALERT_CHAT — admin chat ID to receive alerts
 *   ABUSE_BAN_DURATION  — ban duration in seconds (default: 86400 = 24h)
 *   ABUSE_AI_RPM        — max AI requests per minute per fingerprint (default: 20)
 *   ABUSE_WINDOW_MS     — rate window in ms (default: 60000)
 */

import { NextRequest, NextResponse } from 'next/server'

// ── Config ────────────────────────────────────────────────────────────────────
const BAN_DURATION_MS  = parseInt(process.env.ABUSE_BAN_DURATION  ?? '86400') * 1000
const AI_RPM           = parseInt(process.env.ABUSE_AI_RPM        ?? '20')
const WINDOW_MS        = parseInt(process.env.ABUSE_WINDOW_MS     ?? '60000')
const COST_FARM_CHARS  = 2000   // prompt longer than this = suspicious
const COST_FARM_RPM    = 5      // >5 long prompts/min = cost farming
const BOT_SCORE_BAN    = 4      // bot signal score to trigger ban

// ── In-memory state (resets on cold start — fine for serverless edge cases) ───
interface FingerprintRecord {
  requests:     number
  longPrompts:  number
  violations:   number
  bannedUntil?: number
  windowStart:  number
  lastSeen:     number
  accounts:     Set<string>   // userId/session IDs seen from this fingerprint
}

const store = new Map<string, FingerprintRecord>()

// ── Fingerprint extraction ────────────────────────────────────────────────────
function getFingerprint(req: NextRequest): string {
  // Combine IP + broad UA class (not full UA — avoids spoofing trivially)
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : (req.headers.get('x-real-ip') ?? 'unknown')
  const ua = req.headers.get('user-agent') ?? ''
  const uaClass = ua.length === 0 ? 'noua'
    : /bot|crawl|spider|scrape|headless|phantom|puppeteer|playwright|selenium/i.test(ua) ? 'bot'
    : /mozilla|chrome|safari|firefox/i.test(ua) ? 'browser'
    : 'other'
  return `${ip}::${uaClass}`
}

function getRecord(fp: string): FingerprintRecord {
  const now = Date.now()
  let rec = store.get(fp)
  if (!rec) {
    rec = { requests: 0, longPrompts: 0, violations: 0, windowStart: now, lastSeen: now, accounts: new Set() }
    store.set(fp, rec)
  }
  // Roll the window
  if (now - rec.windowStart > WINDOW_MS) {
    rec.requests    = 0
    rec.longPrompts = 0
    rec.windowStart = now
  }
  rec.lastSeen = now
  return rec
}

// ── Bot signal scoring ────────────────────────────────────────────────────────
function botScore(req: NextRequest): number {
  let score = 0
  const ua      = req.headers.get('user-agent') ?? ''
  const accept  = req.headers.get('accept') ?? ''
  const lang    = req.headers.get('accept-language') ?? ''
  const referer = req.headers.get('referer') ?? ''

  if (!ua)                                                                          score += 3  // no UA — almost certainly automated
  if (/bot|crawl|spider|headless|phantom|puppeteer|playwright|selenium/i.test(ua)) score += 3  // known automation UA
  if (/sqlmap|nikto|nmap|masscan|zgrab|nuclei|dirsearch/i.test(ua))               score += 4  // scanner tools
  if (!lang && ua.length > 0)                                                       score += 1  // no accept-language but has UA — uncommon in real browsers
  if (accept && !accept.includes('text/html') && !accept.includes('*/*'))           score += 1  // API-only accept (ok for direct API calls, but combined raises score)
  if (!referer && /^(POST|PUT|PATCH|DELETE)$/.test(req.method))                    score += 1  // mutation with no referer

  return score
}

// ── Prompt injection detection ────────────────────────────────────────────────
const INJECTION_PATTERNS: RegExp[] = [
  /ignore (all |previous |above |prior )?(instructions?|prompts?|rules?|context)/i,
  /you are now|pretend (you are|to be)|act as (if you are|an? |though you)/i,
  /forget (everything|your (instructions?|training|rules?|guidelines?))/i,
  /system ?prompt|<\/?system>|<\/?instruction>|\[INST\]/i,
  /jailbreak|dan mode|developer mode|unrestricted mode/i,
  /reveal (your|the) (system |)(prompt|instructions?)/i,
  /bypass (your|the|all) (restrictions?|filters?|safety|guidelines?)/i,
  /disregard (your|all) (previous |)(instructions?|rules?|guidelines?)/i,
  /\bdo anything now\b|\bDAN\b|\bAIM\b|\bgrandma (exploit|trick)\b/i,
]

export function detectInjection(text: string): boolean {
  return INJECTION_PATTERNS.some(p => p.test(text))
}

// ── Suspicious path patterns ──────────────────────────────────────────────────
const SUSPICIOUS_PATHS: RegExp[] = [
  /\.\.\//,
  /\/etc\/passwd|\/etc\/shadow|\/proc\//,
  /\.(php|asp|aspx|jsp|cgi|env)$/i,
  /wp-admin|wp-login|xmlrpc\.php/i,
  /\.git\/|\.svn\//,
  /\/phpmyadmin|\/pma\//i,
  /union.*select|select.*from|drop\s+table/i,
  /<script|javascript:/i,
  /\$\{.*\}|\{\{.*\}\}|<%.*%>/,
]

// ── Telegram alert (non-blocking) ─────────────────────────────────────────────
function alert(msg: string) {
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ALERT_CHAT
  if (!token || !chatId) return
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' }),
  }).catch(() => {})
}

function banRecord(fp: string, rec: FingerprintRecord, reason: string) {
  rec.violations++
  rec.bannedUntil = Date.now() + BAN_DURATION_MS
  console.warn(`[abuse-guard] BANNED ${fp} — ${reason} (violations: ${rec.violations})`)
  alert(`🚨 *Abuse Banned*\nFP: \`${fp}\`\nReason: ${reason}\nViolations: ${rec.violations}`)
}

// ── Exported guards ───────────────────────────────────────────────────────────

/**
 * guardRequest — call at the top of every API route handler.
 * Returns a NextResponse (block) or null (proceed).
 *
 * Checks: ban status, bot signals, suspicious paths, rate limit.
 */
export function guardRequest(req: NextRequest): NextResponse | null {
  const fp  = getFingerprint(req)
  const rec = getRecord(fp)
  const now = Date.now()

  // Already banned?
  if (rec.bannedUntil) {
    if (now < rec.bannedUntil) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    rec.bannedUntil = undefined
    rec.violations  = 0  // expired ban: reset violations for fresh start
  }

  // Suspicious path probe
  const path = req.nextUrl?.pathname ?? ''
  if (SUSPICIOUS_PATHS.some(p => p.test(path))) {
    banRecord(fp, rec, `suspicious path: ${path.slice(0, 80)}`)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Bot scoring
  const score = botScore(req)
  if (score >= BOT_SCORE_BAN) {
    banRecord(fp, rec, `bot signals (score ${score})`)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Rate limit
  rec.requests++
  if (rec.requests > AI_RPM) {
    rec.violations++
    if (rec.violations >= 5) {
      banRecord(fp, rec, `flood: ${rec.requests} req/${WINDOW_MS / 1000}s`)
    }
    const retryAfter = Math.ceil((rec.windowStart + WINDOW_MS - now) / 1000)
    return NextResponse.json(
      { error: 'Too many requests', retryAfter },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  return null  // all clear
}

/**
 * guardAiInput — call after parsing the request body, before calling any AI provider.
 * Checks: prompt injection, cost farming (very long prompts at high velocity).
 *
 * @param req     The original NextRequest
 * @param input   The user's text input / prompt
 * @param userId  Optional — if provided, tracks multi-account signal from same fingerprint
 */
export function guardAiInput(req: NextRequest, input: string, userId?: string): NextResponse | null {
  if (!input) return null

  const fp  = getFingerprint(req)
  const rec = getRecord(fp)

  // Track unique accounts from this fingerprint (multi-account farming signal)
  if (userId) {
    rec.accounts.add(userId)
    if (rec.accounts.size >= 4) {
      // 4+ accounts from same IP/fingerprint = very suspicious
      rec.violations += 2
      if (rec.violations >= 5) {
        banRecord(fp, rec, `multi-account: ${rec.accounts.size} accounts`)
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      alert(`⚠️ *Multi-account signal*\nFP: \`${fp}\`\nAccounts: ${rec.accounts.size}\nViolations: ${rec.violations}`)
    }
  }

  // Prompt injection
  if (detectInjection(input)) {
    rec.violations++
    console.warn(`[abuse-guard] Injection attempt from ${fp}: "${input.slice(0, 100)}"`)
    alert(`⚠️ *Prompt Injection*\nFP: \`${fp}\`\nInput: \`${input.slice(0, 200)}\``)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Cost farming — long prompts at high velocity
  if (input.length > COST_FARM_CHARS) {
    rec.longPrompts++
    if (rec.longPrompts > COST_FARM_RPM) {
      rec.violations++
      if (rec.violations >= 3) {
        banRecord(fp, rec, `cost farming: ${rec.longPrompts} long prompts in window`)
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      }
      console.warn(`[abuse-guard] Cost farm signal ${fp}: ${rec.longPrompts} long prompts`)
    }
  }

  return null  // all clear
}

/**
 * middlewareGuard — use in Next.js middleware.ts to protect all /api/* routes.
 *
 * Lighter than guardRequest — only does: ban check, bot score, suspicious path.
 * No rate limiting here (that's per-route via guardRequest).
 */
export function middlewareGuard(req: NextRequest): NextResponse | undefined {
  // Only guard API routes — skip static assets, pages
  if (!req.nextUrl.pathname.startsWith('/api')) return undefined

  const fp  = getFingerprint(req)
  const rec = getRecord(fp)
  const now = Date.now()

  if (rec.bannedUntil && now < rec.bannedUntil) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const path = req.nextUrl.pathname
  if (SUSPICIOUS_PATHS.some(p => p.test(path))) {
    banRecord(fp, rec, `suspicious path (middleware): ${path.slice(0, 80)}`)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const score = botScore(req)
  if (score >= BOT_SCORE_BAN) {
    banRecord(fp, rec, `bot signals (middleware, score ${score})`)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return undefined  // continue to route handler
}

/**
 * getAbuseStats — returns current ban + suspicious IP summary.
 * Wire to an admin-only API route: GET /api/admin/abuse-stats
 */
export function getAbuseStats() {
  const now = Date.now()
  const banned: string[] = []
  const suspicious: Array<{ fp: string; violations: number; requests: number; accounts: number }> = []

  for (const [fp, rec] of store.entries()) {
    if (rec.bannedUntil && now < rec.bannedUntil) {
      banned.push(fp)
    } else if (rec.violations > 0) {
      suspicious.push({ fp, violations: rec.violations, requests: rec.requests, accounts: rec.accounts.size })
    }
  }

  return {
    totalTracked: store.size,
    banned:       banned.length,
    bannedList:   banned,
    suspicious:   suspicious.sort((a, b) => b.violations - a.violations).slice(0, 20),
  }
}
