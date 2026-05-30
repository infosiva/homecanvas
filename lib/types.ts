export interface ContentBrief {
  brand: string
  topic: string
  audience: string
  channels?: string[]
}

export interface BlogPost {
  title: string
  metaDescription: string
  sections: { heading: string; body: string }[]
}

export interface PodcastEpisode {
  title: string
  hook: string
  outline: string[]
  script: string
  showNotes: string
  promoPulls: string[]
}

export interface VideoStoryboard {
  title: string
  voiceoverScript: string
  scenes: { timestamp: string; visual: string; broll: string }[]
  callToAction: string
}

export interface EmailSequence {
  emails: { subject: string; preview: string; body: string; sendDay: number }[]
}

export interface LinkedInPosts {
  posts: { hook: string; body: string; cta: string }[]
}

export interface ShortClips {
  captions: string[]
}

export interface ClientReport {
  executiveSummary: string
  contentCalendar: { day: string; format: string; title: string }[]
  nextSteps: string[]
}

export interface AgencyResult {
  id: string
  brief: ContentBrief
  blog: BlogPost
  podcast: PodcastEpisode
  video: VideoStoryboard
  emails: EmailSequence
  linkedin: LinkedInPosts
  clips: ShortClips
  report: ClientReport
  createdAt: string
}
