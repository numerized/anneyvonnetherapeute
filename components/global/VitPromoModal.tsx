'use client'

import { X } from 'lucide-react'

interface VitPromoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VitPromoModal({ isOpen, onClose }: VitPromoModalProps) {
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
             FORFAIT INDIVIDUEL VERY<br/>IMPORTANT THERAPY
          </h3>

          <div className="space-y-6 text-primary-cream/90">
            <blockquote className="text-xl italic border-l-4 border-primary-coral pl-4 mb-8">
              "Thérapie sur-mesure - Offrez-vous un accompagnement unique, totalement personnalisé et flexible, selon vos besoins spécifiques et à votre rythme."
            </blockquote>

            <h4 className="text-2xl text-primary-coral mb-4">AVANTAGES</h4>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Accès illimité aux séances :</strong>{" "}
                  Explorez tous les thèmes souhaités (relationnel, personnel, professionnel, etc.) avec AYR.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">État des lieux actuel :</strong>{" "}
                  Faites le point sur votre situation individuelle, conjugale et/ou relationnelle.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Flexibilité totale :</strong>{" "}
                  Choisissez le moment qui vous convient, sans contrainte de planning.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Accompagnement personnalisé :</strong>{" "}
                  Chaque séance est adaptée à vos besoins du moment.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Disponibilité prioritaire :</strong>{" "}
                  Accès privilégié pour planifier vos séances selon vos urgences.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Suivi exclusif :</strong>{" "}
                  Un suivi dédié entre les séances pour une progression continue.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-coral mt-1.5">•</span>
                <p>
                  <strong className="text-primary-coral">Outils et ressources sur-mesure :</strong>{" "}
                  Supports personnalisés pour renforcer vos progrès.
                </p>
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <br/>
            <h4 className="text-2xl text-primary-coral mb-4">Points Clés</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4 text-primary-cream/90">
                SMS illimités avec réponse audio 24h
              </div>
              <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4 text-primary-cream/90">
                Réservation flexible L-V
              </div>
              <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4 text-primary-cream/90">
                Accès ressources illimité
              </div>
              <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4 text-primary-cream/90">
                Check gratuit à 3 mois
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-2xl text-primary-coral mb-4">PLUS PRIVILÈGE</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary-coral rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary-cream">
                  1
                </div>
                <p className="text-lg mb-6">
                  &quot;Vivez une expérience transformative unique lors d&apos;une immersion thérapeutique à Ibiza. Dans ce cadre enchanteur, nous explorerons ensemble vos schémas relationnels et émotionnels pour vous permettre de vous reconnecter profondément à vous-même.&quot;
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-coral rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary-cream">
                  2
                </div>
                <p className="text-primary-cream/90 text-lg">Check gratuit à 3 mois pour faire le point</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-coral rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary-cream">
                  3
                </div>
                <p className="text-primary-cream/90 text-lg">Report et annulation flexibles</p>
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
