import type { Metadata } from 'next'
import { IBM_Plex_Mono, PT_Serif, Montserrat, Aleo, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toast } from "@/components/ui/toast"

import './globals.css'

const aleo = Aleo({
  variable: '--font-aleo',
  subsets: ['latin'],
  weight: ['900'],
})

const inter = Inter({
  subsets: ["latin"]
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
  // Only show Speed Insights when not printing
  const isPrinting = typeof window !== 'undefined' && window.matchMedia('print').matches

  return (
    <html
      lang="en"
      className={`${mono.variable} ${montserrat.variable} ${serif.variable} ${aleo.variable} ${inter.variable}`}
    >
      <body className="font-montserrat">
        {children}
        <Analytics />
        {!isPrinting && <SpeedInsights />}
        <Toast />
      </body>
    </html>
  )
}