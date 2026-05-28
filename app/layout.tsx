import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'
import FloatingChatWrapper from '@/components/FloatingChatWrapper'

export const metadata: Metadata = {
  metadataBase: new URL('https://campaignforge.vercel.app'),
  title: 'CampaignForge — Zero-Employee AI Content Agency',
  description: 'One brief. 7 AI-generated outputs: blog post, podcast script, faceless video, email sequence, LinkedIn posts, short clips, client report. Free to start.',
  keywords: ['AI content agency', 'faceless video AI', 'AI podcast generator', 'zero employee business', 'content automation'],
  openGraph: {
    title: 'CampaignForge — Run a Full AI Agency with Zero Employees',
    description: 'One brief → blog + podcast + faceless video + emails + LinkedIn + clips + client report. 90 seconds. Free.',
    type: 'website',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "CampaignForge",
              "description": "AI-powered marketing campaign and content generator",
              "applicationCategory": "MarketingApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body style={{ minHeight: '100svh', overscrollBehavior: 'none' }}>

        {/* Sticky glass nav */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: 54,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          justifyContent: 'space-between',
          background: 'rgba(7,7,12,0.82)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            {/* Animated flame logo mark */}
            <span className="logo-mark" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14.5v-5l-3 3 1.5-6.5L12 10l1.5-4 3 7.5-3-2.5v5H11z"/>
              </svg>
            </span>
            <span style={{
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: '-0.03em',
              color: 'var(--ink-1)',
            }}>
              Campaign<span style={{ color: 'var(--forge)' }}>Forge</span>
            </span>
          </a>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#how" className="nav-link">
              How it works
            </a>
          </nav>
        </header>

        <main style={{ position: 'relative', zIndex: 10 }}>
          {children}
        </main>
        <Script defer data-site="campaignforge.vercel.app" src="http://31.97.56.148:3098/t.js" strategy="afterInteractive" />
        <FloatingChatWrapper />
      </body>
    </html>
  )
}
