'use client'

import { X } from 'lucide-react'

interface IndividualPromoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function IndividualPromoModal({ isOpen, onClose }: IndividualPromoModalProps) {
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
            THÉRAPIE RELATIONNELLE INDIVIDUELLE
          </h3>

          <div className="space-y-6 text-primary-cream/90">
            <blockquote className="text-xl italic border-l-4 border-primary-coral pl-4 mb-8">
              "Un parcours pensé pour celles et ceux en quête d'une compréhension plus profonde d'eux-mêmes et d'un alignement authentique dans leur vie et/ou dans leurs relations."
            </blockquote>

            <h4 className="text-2xl text-primary-coral mb-4">LES AVANTAGES DU FORFAIT INDIVIDUEL</h4>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Choisissez votre FORMULE :</strong>{" "}
                  Adaptez votre parcours thérapeutique selon vos besoins et votre rythme.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Identifiez votre THÈME thérapeutique :</strong>{" "}
                  Un formulaire en ligne pour cibler précisément vos besoins.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">SÉANCE GRATUITE de 30 minutes :</strong>{" "}
                  Une première rencontre pour définir ensemble votre parcours.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Support WhatsApp hebdomadaire :</strong>{" "}
                  Posez une question, recevez une réponse audio personnalisée.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Accès à la plateforme :</strong>{" "}
                  Ressources exclusives et événements en ligne pour soutenir votre transformation.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Modules spécifiques :</strong>{" "}
                  Accompagnement et support avec des modules adaptés à vos thèmes.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Délocalisation des thérapies :</strong>{" "}
                  Profitez de l'accompagnement, peu importe où vous vous trouvez.
                </p>
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <br/>
            <h4 className="text-2xl text-primary-coral mb-4">Points Clés</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4 text-primary-cream/90">
                Séance gratuite de découverte
              </div>
              <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4 text-primary-cream/90">
                Support WhatsApp continu
              </div>
              <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4 text-primary-cream/90">
                Ressources exclusives
              </div>
              <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4 text-primary-cream/90">
                Sessions délocalisées
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
                <p className="text-primary-cream/90 text-lg">Identification du thème en ligne</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-coral rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary-cream">
                  2
                </div>
                <p className="text-primary-cream/90 text-lg">Séance gratuite de découverte</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-coral rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary-cream">
                  3
                </div>
                <p className="text-primary-cream/90 text-lg">Choix de la formule adaptée</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-coral rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary-cream">
                  4
                </div>
                <p className="text-primary-cream/90 text-lg">Suivi personnalisé continu</p>
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
