'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import TestDesirErosPage from '@/app/test-relation-desir-eros/page'
import { Modal } from '@/components/shared/Modal'
import { Stats } from '@/components/shared/Stats'
import { WherebyEmbed } from '@/components/shared/WherebyEmbed'

export default function LivePage() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [timeUntilLive, setTimeUntilLive] = useState('')
  const [isLiveActive, setIsLiveActive] = useState(false)
  const searchParams = useSearchParams()
  const email = searchParams?.get('email') ?? ''

  useEffect(() => {
    const updateTimeUntilLive = () => {
      const now = new Date()
      // Event time is 20:00, but we go live 15 minutes before
      const mainEventTime = new Date('2025-04-15T20:00:00+02:00')
      const liveStart = new Date(mainEventTime.getTime() - 15 * 60 * 1000) // 15 minutes before event
      const liveEnd = new Date('2025-04-15T23:00:00+02:00')

      // Check if live is active
      const isActive = now >= liveStart && now <= liveEnd
      setIsLiveActive(isActive)

      // Calculate countdown only if not yet live
      if (now < liveStart) {
        const diff = liveStart.getTime() - now.getTime()

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        )
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        const parts: string[] = []
        if (days > 0) {
          parts.push(`${days} jour${days > 1 ? 's' : ''}`)
        }
        if (hours > 0 || days > 0) {
          parts.push(`${hours} heure${hours > 1 ? 's' : ''}`)
        }
        parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)

        setTimeUntilLive(parts.join(' et '))
      } else {
        setTimeUntilLive('Le live commence maintenant!')
      }
    }

    updateTimeUntilLive()
    // Check more frequently (every 5 seconds)
    const interval = setInterval(updateTimeUntilLive, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="flex-auto">
      {!isLiveActive ? (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-medium text-primary-coral mb-4">
              LE LIVE
            </h1>
            <h2>Sur le divan d'Anne Yvonne</h2>
            <p className="text-primary-coral mt-2">
              Le prochain live: 15 avril à 20h - Les suivants: 13 Mai - 17 Juin
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div className="bg-primary-forest rounded-[32px] p-4 md:p-8 shadow-xl h-full">
              {email ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-medium text-primary-coral mb-4">
                      Vous êtes enregistré(e) au LIVE
                    </h2>
                    <p className="text-primary-cream text-lg mb-4">
                      Le live commence dans:
                    </p>
                    <p className="text-primary-coral text-2xl font-bold">
                      {timeUntilLive}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-lg font-medium text-primary-coral mb-2">
                      Pour s'inscrire au live:
                    </p>
                  </div>

                  {/* Email Subscription Form */}
                  <div className="mb-6">
                    {isSubscribed ? (
                      <div className="mt-4">
                        <p className="text-primary-coral font-bold">
                          Merci pour votre inscription !
                        </p>
                        <p className="text-primary-coral mt-2">
                          Consultez votre email pour plus d'informations sur le
                          live.
                        </p>
                      </div>
                    ) : (
                      <form
                        className="space-y-4"
                        onSubmit={async (e) => {
                          e.preventDefault()
                          const form = e.target as HTMLFormElement
                          const emailInput = form.querySelector(
                            'input[type="email"]',
                          ) as HTMLInputElement
                          const email = emailInput.value

                          try {
                            const response = await fetch('/api/newsletter', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ email }),
                            })

                            const data = await response.json()

                            if (!response.ok) {
                              throw new Error(
                                data.error || 'Failed to subscribe',
                              )
                            }

                            // Clear the form and show success message
                            form.reset()
                            setIsSubscribed(true)
                          } catch (error) {
                            console.error(
                              'Newsletter subscription error:',
                              error,
                            )
                            alert(
                              error instanceof Error
                                ? error.message
                                : 'Une erreur est survenue. Veuillez réessayer.',
                            )
                          }
                        }}
                      >
                        <div>
                          <label htmlFor="email" className="sr-only">
                            Adresse email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Votre adresse email"
                            required
                            className="w-full px-4 py-2 rounded-md bg-primary-dark/50 border border-primary-teal/20 text-primary-cream placeholder-primary-cream/50 focus:outline-none focus:ring-2 focus:ring-primary-teal form-input"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-primary-coral hover:bg-primary-coral/90 text-primary-cream py-3 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-primary-teal"
                        >
                          S'inscrire au live
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="prose prose-invert max-w-none text-primary-cream/80">
                    <ul className="text-sm text-primary-cream/70 space-y-2 list-none m-0 p-0">
                      <li className="flex items-center gap-2 m-0">
                        <span className="text-primary-coral">♦</span>
                        <span>
                          Testez votre audio et vidéo avant de rejoindre la
                          session
                        </span>
                      </li>
                      <li className="flex items-center gap-2 m-0">
                        <span className="text-primary-coral">♦</span>
                        <span>
                          Utilisez un casque pour une meilleure qualité audio
                        </span>
                      </li>
                      <li className="flex items-center gap-2 m-0">
                        <span className="text-primary-coral">♦</span>
                        <span>Trouvez un endroit calme et bien éclairé</span>
                      </li>
                      <li className="flex items-center gap-2 m-0">
                        <span className="text-primary-coral">♦</span>
                        <span>
                          Assurez-vous d'avoir une connexion internet stable
                        </span>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Test de l'Eros Column */}
            <div className="bg-primary-forest rounded-[32px] p-4 md:p-8 shadow-xl h-full flex flex-col">
              <div className="mb-6">
                <h2 className="text-xl font-medium text-primary-coral mb-2">
                  Test de l'Eros
                </h2>
              </div>
              <div className="prose prose-invert max-w-none text-primary-cream/80 flex-1">
                <p>
                  Explorez votre relation au désir et à la sensualité à travers
                  notre test unique. Ce questionnaire vous permettra de mieux
                  comprendre votre rapport à l'érotisme et d'identifier les
                  chemins vers une vie intime plus épanouie.
                </p>
              </div>
              <div className="flex justify-end mt-auto pt-4">
                <button
                  onClick={() => setIsTestModalOpen(true)}
                  className="bg-primary-coral hover:bg-primary-coral/90 text-primary-cream px-6 py-3 rounded-full transition-colors"
                >
                  Commencer le test
                </button>
              </div>
            </div>
          </div>

          {/* Video Container - Full Width */}
          <div className="bg-primary-forest rounded-[32px] p-4 md:p-8 shadow-xl mb-8">
            <div className="mx-auto max-w-5xl">
              <div className="relative h-[calc(85vw*2)] md:h-[calc(85vw)] md:max-h-[calc(85*48rem/100)]">
                <WherebyEmbed className="absolute inset-0" />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <Stats
            title="Expertise et résultats"
            items={[
              { value: '95%', label: 'Taux de satisfaction client' },
              { value: '500+', label: 'Couples accompagnés' },
              { value: '20', label: "Années d'expérience" },
              { value: '85%', label: 'Amélioration des relations' },
            ]}
          />
        </div>
      ) : (
        <div className="w-full h-screen">
          <WherebyEmbed />
        </div>
      )}

      {/* Modal for Test de l'Eros */}
      <Modal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        hideFooter
      >
        <div className="h-[calc(90vh-8rem)]">
          <TestDesirErosPage />
        </div>
      </Modal>
    </main>
  )
}
