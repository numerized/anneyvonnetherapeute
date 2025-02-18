'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { Modal } from '@/components/shared/Modal'
import { WherebyEmbed } from '@/components/shared/WherebyEmbed'

export default function LivePage() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [timeUntilLive, setTimeUntilLive] = useState('')
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  useEffect(() => {
    const updateTimeUntilLive = () => {
      const now = new Date()
      const liveDate = new Date('2025-02-18T19:00:00+01:00')
      const diff = liveDate.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeUntilLive('Le live commence maintenant!')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
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
    }

    updateTimeUntilLive()
    const interval = setInterval(updateTimeUntilLive, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="flex-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-medium text-primary-coral mb-4">
            LE LIVE
          </h1>
          <h2>Sur le divan d'Anne Yvonne</h2>
          <p className="text-primary-coral mt-2">Le 18 février à 19h : Le live mensuel sur le thème du mois; « Février, mon Cœur ».</p>
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
                      <p className="text-primary-coral font-bold">Merci pour votre inscription !</p>
                      <p className="text-primary-coral mt-2">Consultez votre email pour plus d'informations sur le live.</p>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
                      const email = emailInput.value;

                      try {
                        const response = await fetch('/api/newsletter', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ email }),
                        });

                        const data = await response.json();

                        if (!response.ok) {
                          throw new Error(data.error || 'Failed to subscribe');
                        }

                        // Clear the form and show success message
                        form.reset();
                        setIsSubscribed(true);
                      } catch (error) {
                        console.error('Newsletter subscription error:', error);
                        alert(error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.');
                      }
                    }}>
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
                        className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream py-3 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-primary-teal"
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
                      <span>Testez votre audio et vidéo avant de rejoindre la session</span>
                    </li>
                    <li className="flex items-center gap-2 m-0">
                      <span className="text-primary-coral">♦</span>
                      <span>Utilisez un casque pour une meilleure qualité audio</span>
                    </li>
                    <li className="flex items-center gap-2 m-0">
                      <span className="text-primary-coral">♦</span>
                      <span>Trouvez un endroit calme et bien éclairé</span>
                    </li>
                    <li className="flex items-center gap-2 m-0">
                      <span className="text-primary-coral">♦</span>
                      <span>Assurez-vous d'avoir une connexion internet stable</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Test de l'amoureux Column */}
          <div className="bg-primary-forest rounded-[32px] p-4 md:p-8 shadow-xl h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-medium text-primary-coral mb-2">
                Test de l'amoureux
              </h2>
            </div>
            <div className="prose prose-invert max-w-none text-primary-cream/80 flex-1">
              <p>
                Découvrez votre profil relationnel à travers notre test unique. Ce questionnaire vous aidera à mieux comprendre vos schémas amoureux et à identifier les domaines de croissance potentielle dans vos relations.
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

        {/* Header */}
        <div className="text-center mb-12">
          <br/><br/>
          <h2 className="text-3xl md:text-5xl font-medium text-primary-coral mb-4">
            COACHING RELATIONNEL 7/7
          </h2>
          <div className="text-lg md:text-xl">
            <p className="font-bold mb-4" style={{ color: '#D9B70D' }}>OFFRE EXCLUSIVE LIMITÉE</p>
          </div>
        </div>

        {/* Event Details and Price Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-6 auto-rows-fr">
          <div className="flex-grow">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="space-y-4">
                  <div className="text-2xl line-through text-primary-cream/60">999 EUR</div>
                  <div className="text-3xl text-primary-coral font-semibold">899 EUR</div>
                  <div className="bg-primary-coral/20 rounded-lg py-2 px-6 inline-block">
                    <span className="text-primary-coral font-semibold">COEUR180</span>
                    <span className="ml-2">-10%</span>
                  </div>
                </div>
                <p className="text-sm text-primary-cream/60 mt-6 max-w-md mx-auto">
                  L'argent ne doit pas être un obstacle, contactez-moi si vous faites faces à des difficultés financières, nous trouverons une solution !
                </p>
                <Link
                  href="/prochainement?coupon=COEUR180"
                  className="block w-full bg-primary-coral hover:bg-primary-rust text-primary-cream py-3 px-6 rounded-full transition-colors duration-200 mt-6"
                >
                  Profiter de l'offre -10%
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-primary-forest rounded-[32px] p-8 shadow-lg">
              <ul className="space-y-4 text-primary-cream/80 m-0">
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Optimisez vos relations en 1 mois</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Special diversités</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Coaching individuel 24/24 sur 1 mois</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Échanges quotidiens via Telegram</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Trois séances de thérapie à la carte via Whereby</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Group Coaching Offer */}
        <div className="text-center mb-12">
          <br/><br/>
          <h2 className="text-3xl md:text-5xl font-medium text-primary-coral mb-4">
            COACHING RELATIONNEL EN GROUPE
          </h2>
          <div className="text-lg md:text-xl">
            <p className="font-bold mb-4" style={{ color: '#D9B70D' }}>DÉPASSEZ VOS SCHÉMAS, VIVEZ L'AMOUR AUTREMENT</p>
          </div>
        </div>

        {/* Group Coaching Details and Price Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-6 auto-rows-fr">
          <div className="flex-grow">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl text-primary-coral font-semibold">333 EUR</div>
                <p className="text-sm text-primary-cream/60 mt-6 max-w-md mx-auto">
                  L'argent ne doit pas être un obstacle, contactez-moi si vous faites faces à des difficultés financières, nous trouverons une solution !
                </p>
                <Link
                  href="/coaching-relationnel-en-groupe"
                  className="block w-full bg-primary-coral hover:bg-primary-rust text-primary-cream py-3 px-6 rounded-full transition-colors duration-200 mt-6"
                >
                  Réserver ma place
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-primary-forest rounded-[32px] p-8 shadow-lg">
              <ul className="space-y-4 text-primary-cream/80 m-0">
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Trois séances intensives (11, 18 et 25 mars)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Horaires : 20h-21h30</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Petits groupes (5 personnes max)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Exercices pratiques et prises de conscience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Transformation profonde de votre manière d'aimer</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Test Modal */}
      <Modal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        fullscreen
      >
        <div className="w-full h-screen p-0">
          <iframe
            src="/quel-amoureuse-ou-quel-amoureux-es-tu"
            className="w-full h-full"
            style={{ border: 'none' }}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-primary-forest/95 backdrop-blur-sm p-4 flex justify-center">
            <button
              onClick={() => setIsTestModalOpen(false)}
              className="bg-primary-coral hover:bg-primary-coral/90 text-primary-cream px-6 py-3 rounded-full transition-colors shadow-lg"
            >
              Fermer le test
            </button>
          </div>
        </div>
      </Modal>
    </main>
  )
}
