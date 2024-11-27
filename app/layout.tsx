import './globals.css'

import { IBM_Plex_Mono, Inter, PT_Serif, Montserrat } from 'next/font/google'
import localFont from 'next/font/local'

const serif = PT_Serif({
  variable: '--font-serif',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
})

const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['500', '700', '800'],
})

const mono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['500', '700'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
})

const nove = localFont({
  src: '../styles/nove-28987730/Nove.otf',
  variable: '--font-nove',
  display: 'swap',
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${mono.variable} ${sans.variable} ${serif.variable} ${montserrat.variable} ${nove.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
