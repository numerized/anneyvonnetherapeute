'use client'

import { Calendar, FileText, MessageSquare } from 'lucide-react'

import { Benefit } from '../Benefit'

interface CheckupStageCardProps {
  onShowPromo?: () => void;
}

export function CheckupStageCard({ onShowPromo }: CheckupStageCardProps) {
  return (
    <div className="bg-primary-forest/30 text-primary-cream rounded-[24px] p-8">
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl text-primary-cream font-light mb-2">
            CHECK UP RELATIONNEL
          </h3>
          <p className="text-primary-coral italic">La relation est vivante, elle évolue</p>
        </div>

        <div className="space-y-6">
          <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4">
            <p className="text-primary-cream/90 mb-2">
              <strong>Organisation</strong>
            </p>
            <ul className="text-sm text-primary-cream/70 space-y-2">
              <li>DELAI D'ANNULATION (VIT 0 / AUTRES 48H)</li>
              <li>UNIQUEMENT EN « SALON EN LIGNE »</li>
              <li>RESERVATION EN LIGNE FLEX</li>
              <li>RESERVATION EN LIGNE RECURRENCE</li>
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
