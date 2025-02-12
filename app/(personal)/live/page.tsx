'use client'

import { WherebyEmbed } from '@/components/shared/WherebyEmbed'
import { useState } from 'react'

export default function LivePage() {
  const [isSubscribed, setIsSubscribed] = useState(false)

  return (
    <main className="flex-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-medium text-primary-coral mb-4">
          LE LIVE D’ANNE YVONNE
          </h1>
          <h2>Sur le divan</h2>
          <p className="text-primary-coral mt-2">Le 18 février à 19h : Le live mensuel sur le thème du mois; ici c'est le mois DEUX, donc de l'amour à 2.</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Prerequisites Column */}
          <div className="bg-primary-forest rounded-[32px] p-4 md:p-8 shadow-xl h-full">
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
              <button className="bg-primary-coral hover:bg-primary-coral/90 text-primary-cream px-6 py-3 rounded-full transition-colors">
                Commencer le test
              </button>
            </div>
          </div>
        </div>

        {/* Video Container - Full Width */}
        <div className="bg-primary-forest rounded-[32px] p-4 md:p-8 shadow-xl">
          <WherebyEmbed />
        </div>
      </div>
    </main>
  )
}
