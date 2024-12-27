import type { Metadata } from 'next'
import { IBM_Plex_Mono, PT_Serif, Montserrat, Aleo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import './globals.css'
import '@/styles/index.css'

const aleo = Aleo({
  variable: '--font-aleo',
  subsets: ['latin'],
  weight: ['900'],
})
export const metadata: Metadata = {
  title: 'Anne-Yvonne Thérapeute',
  description: 'Anne-Yvonne Thérapeute - Psychothérapie & Hypnose',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/logo.png', type: 'image/png' }
    ],
    apple: { url: '/images/logo.png', type: 'image/png' }
  },
}

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
      lang="fr"
      className={`${mono.variable} ${montserrat.variable} ${serif.variable} ${aleo.variable}`}
    >
      <body className="font-montserrat bg-primary-dark" style={{ backgroundColor: '#2a3a3a' }}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}