'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

export function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Don't show navbar on style guide and live pages
  if (pathname === '/style-guide' || pathname === '/live') {
    return null
  }

  return <Navbar />
}
