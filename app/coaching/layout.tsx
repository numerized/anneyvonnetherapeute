'use client'

import { Navbar } from '@/components/global/Navbar'
import SimpleFooter from '@/components/shared/SimpleFooter'

export default function CoachingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <SimpleFooter />
    </>
  )
}
