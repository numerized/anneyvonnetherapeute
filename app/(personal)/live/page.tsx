'use client'

import { WherebyEmbed } from '@/components/shared/WherebyEmbed'

export default function LivePage() {
  return (
    <main className="flex-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-medium text-primary-coral mb-4">
            Le Live
          </h1>
          <p className="text-lg text-primary-cream/80 max-w-2xl mx-auto">
            Bienvenue, assurez-vous d'avoir un environnement calme pour une expérience optimale.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Prerequisites Column */}
          <div className="bg-primary-forest rounded-[32px] p-4 md:p-8 shadow-xl h-full">
            <div className="mb-4">
              <p className="text-lg font-medium text-primary-coral mb-2">
                PRÉREQUIS : (facultatif)
              </p>
            </div>
            <div className="prose prose-invert max-w-none text-primary-cream/80">
              <ul className="space-y-2 list-disc list-inside">
                <li>Testez votre audio et vidéo avant de rejoindre la session</li>
                <li>Utilisez un casque pour une meilleure qualité audio</li>
                <li>Trouvez un endroit calme et bien éclairé</li>
                <li>Assurez-vous d'avoir une connexion internet stable</li>
              </ul>
            </div>
          </div>

          {/* Test de l'amoureux Column */}
          <div className="bg-primary-forest rounded-[32px] p-4 md:p-8 shadow-xl h-full">
            <div className="mb-6">
              <h2 className="text-xl font-medium text-primary-coral mb-2">
                Test de l'amoureux
              </h2>
            </div>
            <div className="prose prose-invert max-w-none text-primary-cream/80">
              <p>
                Découvrez votre profil relationnel à travers notre test unique. Ce questionnaire vous aidera à mieux comprendre vos schémas amoureux et à identifier les domaines de croissance potentielle dans vos relations.
              </p>
              <div className="mt-6">
                <button className="bg-primary-coral hover:bg-primary-coral/90 text-primary-cream px-6 py-3 rounded-full transition-colors">
                  Commencer le test
                </button>
              </div>
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
