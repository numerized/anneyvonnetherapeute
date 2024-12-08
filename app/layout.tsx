import type { Metadata } from 'next'
import { IBM_Plex_Mono, PT_Serif, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import './globals.css'

const serif = PT_Serif({
  variable: '--font-serif',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
})

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const mono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['500', '700'],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${mono.variable} ${montserrat.variable} ${serif.variable}`}
    >
      <body className="font-montserrat">{children}<SpeedInsights /><Analytics /></body>
    </html>
  )
}