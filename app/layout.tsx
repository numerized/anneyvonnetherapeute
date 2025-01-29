import type { Metadata } from 'next'
import { IBM_Plex_Mono, PT_Serif, Montserrat, Aleo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from "sonner"
import './globals.css'

const aleo = Aleo({
  subsets: ['latin'],
  variable: '--font-aleo',
  display: 'swap',
})

const serif = PT_Serif({
  variable: '--font-serif',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
})

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

const mono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['500', '700'],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${mono.variable} ${montserrat.variable} ${aleo.variable}`}
    >
      <body className="font-montserrat antialiased">
        {children}
        <Toaster position="bottom-right" richColors closeButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}