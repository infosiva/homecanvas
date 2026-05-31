import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'
import FloatingChatWrapper from '@/components/FloatingChatWrapper'

export const metadata: Metadata = {
  metadataBase: new URL('https://homecanvas.app'),
  title: 'HomeCanvas — AI Interior Design & Room Redesign',
  description: 'Redesign any room in 30 seconds. Describe your style, AI generates stunning interior concepts instantly. Free to try — no design skills needed.',
  keywords: ['AI interior design', 'room redesign', 'home decor AI', 'interior decorator', 'room makeover', 'AI home design'],
  openGraph: {
    title: 'HomeCanvas — AI Interior Design',
    description: 'Redesign any room in 30 seconds with AI. Free interior design concepts.',
    type: 'website',
    siteName: 'HomeCanvas',
    url: 'https://homecanvas.app',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏠</text></svg>",
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
