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
              Si vous êtes ici, c'est probablement parce que vous cherchez à :
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
                  Passer d'une dynamique conflictuelle ou insatisfaisante à une relation harmonieuse et alignée sur vos aspirations.
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

            <p className="text-xl text-primary-cream mt-8">
              Vous êtes prêt(e) à investir dans votre bonheur et à créer une vie amoureuse qui reflète vraiment vos valeurs et vos désirs profonds.
            </p>
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
