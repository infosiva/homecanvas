import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'
import FloatingChatWrapper from '@/components/FloatingChatWrapper'

export const metadata: Metadata = {
  metadataBase: new URL('https://homecanvas.app'),
  title: 'HomeCanvas — AI Interior Design & Room Visualization',
  description: 'See your room transformed before you lift a finger. AI generates interior design concepts in 30 seconds — furniture, colour palette, layout. Free to try.',
  keywords: ['AI interior design', 'room visualization', 'room redesign AI', 'AI home decor', 'interior design tool', 'room makeover AI'],
  openGraph: {
    title: 'HomeCanvas — AI Interior Design & Room Visualization',
    description: 'See your room transformed before you lift a finger. AI generates design concepts in 30 seconds.',
    type: 'website',
    siteName: 'HomeCanvas',
    url: 'https://homecanvas.app',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'HomeCanvas — AI Interior Design' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HomeCanvas — AI Interior Design',
    description: 'See your room transformed before you lift a finger. Free AI design in 30 seconds.',
    images: ['/og.png'],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏠</text></svg>",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4237294630161176" />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "HomeCanvas",
              "description": "AI-powered interior design — redesign any room in 30 seconds",
              "applicationCategory": "LifestyleApplication",
              "url": "https://homecanvas.app",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
            })
          }}
        />
      </head>
      <body style={{ minHeight: '100svh', overscrollBehavior: 'none' }}>
        <main style={{ position: 'relative', zIndex: 10 }}>
          {children}
        </main>
        <Script defer data-site="homecanvas.app" src="http://31.97.56.148:3098/t.js" strategy="afterInteractive" />
        <FloatingChatWrapper />
      </body>
    </html>
  )
}
