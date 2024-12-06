'use client'

import { X } from 'lucide-react'

interface PromoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PromoModal({ isOpen, onClose }: PromoModalProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-primary-dark/80 backdrop-blur-lg z-50"
      onClick={onClose}
    >
      <div 
        className="fixed inset-x-0 bottom-0 top-16 bg-primary-forest/90 backdrop-blur-md rounded-t-3xl overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream w-12 h-12 rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
          aria-label="Fermer"
        >
          <X size={32} />
        </button>

        <div className="max-w-3xl mx-auto p-8">
          <h3 className="text-4xl font-light text-primary-cream mb-8">
          THÉRAPIE RELATIONNELLE DE COUPLE
          </h3>

          <div className="space-y-6 text-primary-cream/90">
            <p className="text-xl mb-6">
              Si vous êtes ici, c&apos;est probablement parce que vous cherchez à :
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Changer vos schémas relationnels :</strong>{" "}
                  Comprendre en profondeur les mécanismes qui influencent vos relations amoureuses et personnelles.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Apaiser vos conflits intérieurs :</strong>{" "}
                  Identifier et transformer les blocages qui freinent votre épanouissement personnel et amoureux.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Créer une relation plus consciente et épanouissante :</strong>{" "}
                  Passer d&apos;une dynamique conflictuelle ou insatisfaisante à une relation harmonieuse et alignée sur vos aspirations.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Reprendre le pouvoir sur votre vie amoureuse :</strong>{" "}
                  Devenir un acteur conscient de vos choix amoureux en accédant à des outils et ressources exclusifs.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Vous engager dans une transformation profonde :</strong>{" "}
                  Travailler sur vous-même et/ou votre couple de manière intensive et sur-mesure pour réinventer votre relation dans un cadre ambitieux et bien défini.
                </p>
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <br/>
            <h4 className="text-2xl text-primary-coral mb-4">Points Clés</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4 text-primary-cream/90">
                Processus complet sur 6 mois
              </div>
              <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4 text-primary-cream/90">
                Support continu WhatsApp
              </div>
              <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4 text-primary-cream/90">
                Ressources exclusives
              </div>
              <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4 text-primary-cream/90">
                Accompagnement personnalisé
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-2xl text-primary-coral mb-4">Déroulement</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary-coral rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary-cream">
                  1
                </div>
                <p className="text-primary-cream/90 text-lg">Évaluation initiale approfondie</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-coral rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary-cream">
                  2
                </div>
                <p className="text-primary-cream/90 text-lg">Séances alternées couple/individuel</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-coral rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary-cream">
                  3
                </div>
                <p className="text-primary-cream/90 text-lg">Bilans réguliers</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-coral rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary-cream">
                  4
                </div>
                <p className="text-primary-cream/90 text-lg">Suivi et ajustements continus</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => {
                onClose()
                window.location.href = '#contact'
              }}
              className="block w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-[24px] py-3 font-bold"
            >
              Commencer mon parcours
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
