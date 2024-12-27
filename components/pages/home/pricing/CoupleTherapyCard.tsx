'use client'

import { BookOpen, Calendar, Heart, MessageSquare, Users } from 'lucide-react'
import { Benefit } from '../Benefit'

interface CoupleTherapyCardProps {
  onShowPromo: (modalType: string) => void
}

export function CoupleTherapyCard({ onShowPromo }: CoupleTherapyCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary-forest/30 p-8 hover:bg-primary-forest/40 transition-colors">
      <div className="space-y-12">
        <div className="text-center">
          <h3 className="text-2xl text-primary-cream font-light mb-2 text-right">
            THÉRAPIE RELATIONNELLE DE COUPLE
          </h3>
          <p className="text-primary-coral italic text-right">De cœur et de corps</p>
        </div>

        <blockquote className="border-l-4 border-primary-coral pl-4 my-4">
          <p className="text-primary-cream/90 italic">
            "On ne change pas une relation sans d'abord transformer ceux qui la vivent"
          </p>
        </blockquote>

        <div className="space-y-6">
          <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4">
            <p className="text-primary-cream/90 mb-2">
              <strong>Organisation</strong>
            </p>
            <ul className="text-sm text-primary-cream/70 space-y-2 list-none m-0 p-0">
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>2 séances de 90 minutes</span>
              </li>
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>6 séances de 75 minutes</span>
              </li>
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>Alternance entre séances de couple et individuelles</span>
              </li>
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>Parcours à thèmes sur demande</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-primary-forest/30 rounded-3xl p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl text-primary-coral font-light text-right">VOTRE THÉRAPIE DE COUPLE</h3>
            <div className="flex items-end gap-1 justify-start">
              <p className="text-4xl text-primary-cream font-light">2590 €</p>
              <p className="text-primary-cream/70 pb-1">(ou 3 x 880€ mensuel)</p>
            </div>
            <ul className="text-sm text-primary-cream/70 space-y-2 mt-2 list-none m-0 p-0">
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>Programme sur 6 mois avec séances alternées</span>
              </li>
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>Bilans et introspections réguliers</span>
              </li>
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>Support continu entre les séances</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-6">
            <Benefit
              icon={<MessageSquare size={24} />}
              title="Support WhatsApp hebdomadaire"
              description="Posez une question, recevez une réponse audio personnalisée"
            />
            <Benefit
              icon={<BookOpen size={24} />}
              title="Accès à la plateforme"
              description="Ressources exclusives et exercices pour votre relation"
            />
            <Benefit
              icon={<Heart size={24} />}
              title="Investissement dans l'amour"
              description="Transformez votre relation et construisez une connexion durable"
            />
          </div>
        </div>

        <div className="bg-primary-forest/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-primary-coral mt-1">
              <Users size={24} />
            </div>
            <div>
              <h4 className="text-primary-cream font-bold mb-2">Idéal pour</h4>
              <p className="text-primary-cream/90">
                Les couples en désir d'harmonie, qui ont le désir de mieux s'entendre et de mieux se comprendre.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onShowPromo('couple-therapy')}
          className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-md py-3 font-bold"
        >
          En savoir plus
        </button>
      </div>
    </div>
  )
}
