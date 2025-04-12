'use client'

import { Navbar } from '@/components/global/Navbar'

export default function TherapiesLayout({
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
