'use client'

import { usePathname } from 'next/navigation'

import NavbarLayout from './NavbarLayout'

interface ClientNavbarProps {
  data: any // Replace with proper type from your settings
}

export function ClientNavbar({ data }: ClientNavbarProps) {
  const pathname = usePathname()

  // Don't show navbar on style guide page
  if (pathname === '/style-guide') {
    return null
  }

  return <NavbarLayout data={data} />
}
