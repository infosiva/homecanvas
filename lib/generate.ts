import Groq from 'groq-sdk'
import { ContentBrief, AgencyResult, BlogPost, PodcastEpisode, VideoStoryboard, EmailSequence, LinkedInPosts, ShortClips, ClientReport } from './types'
import { randomUUID } from 'crypto'

let _groq: Groq | null = null
function groq(): Groq {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })
  return _groq
}

async function ask(prompt: string, system: string, maxTokens = 2000): Promise<string> {
  const res = await groq().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.75,
  })
  return res.choices[0]?.message?.content ?? '{}'
}

function parseJSON<T>(raw: string, fallback: T): T {
  try {
    const clean = raw.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(clean) as T
  } catch {
    return fallback
  }
}

async function generateBlog(b: ContentBrief): Promise<BlogPost> {
  const sys = 'You are a senior SEO content writer. Return ONLY valid JSON, no markdown.'
  const prompt = `Write a 1,200-word SEO blog post for brand "${b.brand}" on topic "${b.topic}" targeting "${b.audience}".
Return JSON:
{
  "title": "SEO-optimised title",
  "metaDescription": "150-char meta description with primary keyword",
  "sections": [
    {"heading": "Introduction", "body": "250 words"},
    {"heading": "Section 2 title", "body": "250 words"},
    {"heading": "Section 3 title", "body": "250 words"},
    {"heading": "Section 4 title", "body": "250 words"},
    {"heading": "Conclusion + CTA", "body": "200 words mentioning ${b.brand}"}
  ]
}`
  return parseJSON<BlogPost>(await ask(prompt, sys, 3000), { title: '', metaDescription: '', sections: [] })
}

async function generatePodcast(b: ContentBrief): Promise<PodcastEpisode> {
  const sys = 'You are a podcast producer. Return ONLY valid JSON, no markdown.'
  const prompt = `Create a podcast episode for "${b.brand}" on "${b.topic}" for audience "${b.audience}".
Return JSON:
{
  "title": "Episode title (max 60 chars)",
  "hook": "First 30-second hook script — grab attention instantly",
  "outline": ["Segment 1", "Segment 2", "Segment 3", "Outro + CTA"],
  "script": "Full 700-word script using HOST: prefix. Include [pause] markers. End with CTA for ${b.brand}.",
  "showNotes": "100-word episode show notes for Spotify/Apple Podcasts",
  "promoPulls": ["Quote 1 from script", "Quote 2", "Quote 3", "Quote 4", "Quote 5"]
}`
  return parseJSON<PodcastEpisode>(await ask(prompt, sys, 2500), { title: '', hook: '', outline: [], script: '', showNotes: '', promoPulls: [] })
}

async function generateVideo(b: ContentBrief): Promise<VideoStoryboard> {
  const sys = 'You are a faceless video producer. Return ONLY valid JSON, no markdown.'
  const prompt = `Create a 90-second faceless YouTube/TikTok video storyboard for "${b.brand}" on "${b.topic}" targeting "${b.audience}".
Return JSON:
{
  "title": "Video title (max 70 chars, hook-first)",
  "voiceoverScript": "Full 200-word voiceover script — punchy, no filler",
  "scenes": [
    {"timestamp": "0:00–0:10", "visual": "describe on-screen text/graphic", "broll": "AI image prompt to generate this B-roll"},
    {"timestamp": "0:10–0:25", "visual": "...", "broll": "..."},
    {"timestamp": "0:25–0:50", "visual": "...", "broll": "..."},
    {"timestamp": "0:50–1:10", "visual": "...", "broll": "..."},
    {"timestamp": "1:10–1:30", "visual": "...", "broll": "..."}
  ],
  "callToAction": "End-screen CTA text"
}`
  return parseJSON<VideoStoryboard>(await ask(prompt, sys, 2000), { title: '', voiceoverScript: '', scenes: [], callToAction: '' })
}

async function generateEmails(b: ContentBrief): Promise<EmailSequence> {
  const sys = 'You are an email copywriter. Return ONLY valid JSON, no markdown.'
  const prompt = `Write a 5-email nurture sequence for "${b.brand}" on topic "${b.topic}" for "${b.audience}".
Return JSON:
{
  "emails": [
    {"subject": "...", "preview": "40-char preview text", "body": "150-word email body with \\n\\n paragraphs", "sendDay": 0},
    {"subject": "...", "preview": "...", "body": "...", "sendDay": 2},
    {"subject": "...", "preview": "...", "body": "...", "sendDay": 5},
    {"subject": "...", "preview": "...", "body": "...", "sendDay": 8},
    {"subject": "...", "preview": "...", "body": "...", "sendDay": 14}
  ]
}`
  return parseJSON<EmailSequence>(await ask(prompt, sys, 2000), { emails: [] })
}

async function generateLinkedIn(b: ContentBrief): Promise<LinkedInPosts> {
  const sys = 'You are a LinkedIn content strategist. Return ONLY valid JSON, no markdown.'
  const prompt = `Write 3 LinkedIn posts for "${b.brand}" on "${b.topic}" for audience "${b.audience}". Each post has a different angle: insight, story, contrarian take.
Return JSON:
{
  "posts": [
    {"hook": "First line (scroll-stopper)", "body": "150-word post body with line breaks", "cta": "Call to action"},
    {"hook": "...", "body": "...", "cta": "..."},
    {"hook": "...", "body": "...", "cta": "..."}
  ]
}`
  return parseJSON<LinkedInPosts>(await ask(prompt, sys, 1800), { posts: [] })
}

async function generateClips(b: ContentBrief): Promise<ShortClips> {
  const sys = 'You are a short-form content creator. Return ONLY valid JSON, no markdown.'
  const prompt = `Write 10 short-form social captions (Instagram Reels / TikTok) for "${b.brand}" on "${b.topic}". Each under 150 chars, punchy, with hashtags.
Return JSON:
{"captions": ["caption1", "caption2", ..., "caption10"]}`
  return parseJSON<ShortClips>(await ask(prompt, sys, 1000), { captions: [] })
}

async function generateReport(b: ContentBrief): Promise<ClientReport> {
  const sys = 'You are a content strategist writing client reports. Return ONLY valid JSON, no markdown.'
  const prompt = `Write a client content report for "${b.brand}" campaign on "${b.topic}" for "${b.audience}".
Return JSON:
{
  "executiveSummary": "120-word exec summary of the content strategy and expected outcomes",
  "contentCalendar": [
    {"day": "Day 1", "format": "Blog", "title": "..."},
    {"day": "Day 3", "format": "LinkedIn", "title": "..."},
    {"day": "Day 5", "format": "Podcast", "title": "..."},
    {"day": "Day 7", "format": "Email", "title": "..."},
    {"day": "Day 10", "format": "Video", "title": "..."},
    {"day": "Day 14", "format": "Reels", "title": "..."}
  ],
  "nextSteps": ["Step 1", "Step 2", "Step 3", "Step 4"]
}`
  return parseJSON<ClientReport>(await ask(prompt, sys, 1500), { executiveSummary: '', contentCalendar: [], nextSteps: [] })
}

function channelNote(b: ContentBrief): string {
  if (!b.channels || b.channels.length === 0) return ''
  const labels: Record<string, string> = { email: 'Email', social: 'Social Ads', landing: 'Landing Page', sms: 'SMS' }
  const selected = b.channels.map(c => labels[c] ?? c).join(', ')
  return ` Focus content for these selected channels: ${selected}.`
}

export async function generateAgencyContent(brief: ContentBrief): Promise<AgencyResult> {
  const note = channelNote(brief)
  if (note) {
    brief = { ...brief, topic: brief.topic + note }
  }
  const [blog, podcast, video, emails, linkedin, clips, report] = await Promise.all([
    generateBlog(brief),
    generatePodcast(brief),
    generateVideo(brief),
    generateEmails(brief),
    generateLinkedIn(brief),
    generateClips(brief),
    generateReport(brief),
  ])

  return {
    id: randomUUID().split('-')[0],
    brief,
    blog,
    podcast,
    video,
    emails,
    linkedin,
    clips,
    report,
    createdAt: new Date().toISOString(),
  }
}
