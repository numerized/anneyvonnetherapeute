import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      setError('Session ID not found')
      setIsLoading(false)
      return
    }

    const checkSession = async () => {
      try {
        const response = await fetch('/api/check-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        if (!response.ok) {
          throw new Error('Failed to verify payment')
        }

        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setIsLoading(false)
      }
    }

    checkSession()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Une erreur est survenue</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-green-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-primary-coral mb-2">Paiement réussi !</h2>
      <p className="text-primary-cream/80 mb-4">
        Merci pour votre achat. Vous recevrez bientôt un email avec les détails de votre billet.
      </p>
      <p className="text-primary-cream/60 text-sm mb-8">
        Si vous ne recevez pas l&apos;email dans les prochaines minutes, veuillez vérifier votre dossier spam.
      </p>
      <Link 
        href="/"
        className="inline-flex items-center px-6 py-3 rounded-full bg-primary-coral hover:bg-primary-rust transition-colors duration-200 text-primary-cream font-medium"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
