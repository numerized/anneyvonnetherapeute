'use client'

import { Navbar } from '@/components/global/Navbar'
import SimpleFooter from '@/components/shared/SimpleFooter'

export default function TherapiesLayout({
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
