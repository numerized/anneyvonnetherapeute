'use client'

import { usePathname } from 'next/navigation'

import NavbarLayout from './NavbarLayout'

export function ClientNavbar() {
  const pathname = usePathname()

  // Don't show navbar on style guide and live pages
  if (pathname === '/style-guide' || pathname === '/live') {
    return null
  }

  return <NavbarLayout />
}
