'use client'

import { WherebyEmbed } from '@/components/shared/WherebyEmbed'

export default function LivePage() {
  return (
    <main className="flex-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-medium text-primary-coral mb-4">
            Session Live
          </h1>
          <p className="text-lg text-primary-cream/80 max-w-2xl mx-auto">
            Bienvenue dans votre espace de thérapie en ligne. Assurez-vous d'avoir une connexion internet stable et un environnement calme pour une expérience optimale.
          </p>
        </div>

        {/* Video Container */}
        <div className="bg-primary-forest rounded-[32px] p-4 md:p-8 shadow-xl">
          <WherebyEmbed />
          
          {/* Instructions */}
          <div className="mt-6 space-y-4 text-primary-cream/80">
            <h2 className="text-xl font-medium text-primary-coral">Instructions</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Testez votre audio et vidéo avant de rejoindre la session</li>
              <li>Utilisez un casque pour une meilleure qualité audio</li>
              <li>Trouvez un endroit calme et bien éclairé</li>
              <li>Assurez-vous d'avoir une connexion internet stable</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
