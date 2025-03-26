'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

export default function CheckEmailPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = window.localStorage.getItem('emailForSignIn')
    setEmail(storedEmail)
  }, [])

  const handleResendEmail = () => {
    // Add resend email logic here
    setIsLoading(true)
    // ...
    setIsLoading(false)
  }

  return (
    <div className="relative min-h-screen grid place-items-center bg-primary-forest">
      <div className="w-full max-w-md px-4 space-y-8 text-center">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-black text-primary-cream tracking-tight">
            Vérifiez votre email
          </h2>
          {email && (
            <p className="mt-2 text-primary-cream/80">
              Nous avons envoyé un lien magique à{' '}
              <span className="font-medium text-primary-cream">{email}</span>.
              <br />
              Cliquez sur le lien dans l'email pour vous connecter.
            </p>
          )}
          <div className="mt-4">
            <button
              onClick={handleResendEmail}
              disabled={isLoading}
              className="text-primary-cream/80 hover:text-primary-coral transition-colors"
            >
              {isLoading
                ? 'Envoi en cours...'
                : "Vous n'avez pas reçu l'email ? Cliquez ici pour le renvoyer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
