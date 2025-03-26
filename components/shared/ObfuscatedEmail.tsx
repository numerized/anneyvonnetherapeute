'use client'

import { useState } from 'react'

interface ObfuscatedEmailProps {
  email: string
  className?: string
}

export function ObfuscatedEmail({
  email,
  className = '',
}: ObfuscatedEmailProps) {
  const [revealed, setRevealed] = useState(false)

  // Split email into parts
  const [username, domain] = email.split('@')
  const obfuscatedEmail = revealed
    ? email
    : `${username.slice(0, 2)}...@${domain}`

  return (
    <button
      onClick={() => setRevealed(true)}
      className={`${className} hover:text-primary-cream focus:outline-none`}
      aria-label={revealed ? 'Email address' : 'Click to reveal email address'}
      type="button"
    >
      {obfuscatedEmail}
    </button>
  )
}
