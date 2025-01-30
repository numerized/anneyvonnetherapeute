'use client'

import { usePathname } from 'next/navigation'

import { Navbar } from './Navbar'

export function ConditionalNavbar() {
  const pathname = usePathname()

  // Don't show navbar on style guide page
  if (pathname === '/style-guide') {
    return null
  }

  return <Navbar />
}
