'use client'

import { Calendar, FileText, MessageSquare } from 'lucide-react'
import { type FC } from 'react'

import { Benefit } from '../Benefit'

interface BeginningStageCardProps {
  onShowPromo?: () => void;
}

export function BeginningStageCard({ onShowPromo }: BeginningStageCardProps) {
  return (
    <div className="bg-primary-forest/30 text-primary-cream rounded-[24px] p-8">
      <div className="space-y-8">
        <div className="text-right">
          <h3 className="text-2xl text-primary-cream font-light mb-2">
            COACHING DE DÉBUT DE RELATION
          </h3>
          <p className="text-primary-coral italic">Les premiers mois « clés » de votre avenir</p>
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
                <span>Délai d'annulation de 48h</span>
              </li>
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>Uniquement en « salon en ligne »</span>
              </li>
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>Réservation en ligne flex</span>
              </li>
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>Réservation en ligne récurrence</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-6">
            <Benefit
              icon={<Calendar size={24} />}
              title="Réservation flexible"
              description="En ligne avec possibilité de récurrence"
            />
            <Benefit
              icon={<FileText size={24} />}
              title="Ressources illimitées"
              description="Accès aux contenus audio et vidéo CAC"
            />
            <Benefit
              icon={<MessageSquare size={24} />}
              title="Formulaires d'introspection"
              description="Avant et après chaque séance"
            />
          </div>
        </div>

        <button
          onClick={onShowPromo}
          className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-md py-3 font-bold"
        >
          En savoir plus
        </button>
      </div>
    </div>
  )
}
