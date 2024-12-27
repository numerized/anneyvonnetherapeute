'use client'

import { PropsWithChildren } from 'react'

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col bg-primary-dark text-primary-cream">
      {children}
    </div>
  )
}
