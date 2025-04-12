'use client'

import { Navbar } from '@/components/global/Navbar'

export default function CoachingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
