'use client'

import { BookOpen, Calendar,MessageSquare } from 'lucide-react'

import { Benefit } from '../Benefit'

interface VitTherapyCardProps {
  onShowPromo: (modalType: string) => void
}

export function VitTherapyCard({ onShowPromo }: VitTherapyCardProps) {
  return (
    <div className="bg-primary-forest/30 text-primary-cream rounded-[24px] p-8">
      <div className="space-y-8">
        <div className="text-right">
          <h3 className="text-2xl text-primary-cream font-light mb-2">
            FORFAIT INDIVIDUEL VIT
          </h3>
          <p className="text-primary-coral italic">Forfait Privilège</p>
        </div>

        <blockquote className="border-l-4 border-primary-coral pl-4 my-4">
          <p className="text-primary-cream/90 italic">
            "Thérapie sur-mesure"
          </p>
        </blockquote>

        <div className="space-y-6">
          <p className="text-primary-cream/90">
            Offrez-vous un accompagnement unique, totalement personnalisé et flexible, selon vos besoins spécifiques et à votre rythme.
          </p>
          <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4">
            <p className="text-primary-cream/90 mb-2">
              <strong>VOUS ÊTES PRIORITAIRES, MA DISPONIBILITÉ</strong>
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center justify-center gap-2 bg-primary-rust rounded-[24px] p-3">
                <Calendar size={20} className="text-primary-cream" />
                <span className="text-primary-cream">1 COMPLET</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-primary-rust rounded-[24px] p-3">
                <Calendar size={20} className="text-primary-cream" />
                <span className="text-primary-cream">2 COMPLET</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-primary-teal rounded-[24px] p-3">
                <Calendar size={20} className="text-primary-cream" />
                <span className="text-primary-cream">3 OUVERT</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xl text-primary-cream font-light mb-2">TARIFS</h4>
          <div className="bg-primary-forest/30 rounded-xl p-6">
            <div className="flex justify-start items-center mb-4 gap-4">
              <span>5 SÉANCES</span>
              <span className="text-primary-coral text-2xl font-bold">1200 €</span>
            </div>
            <div className="flex justify-start items-center gap-4">
              <span>10 SÉANCES</span>
              <span className="text-primary-coral text-2xl font-bold">2100 €</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-6">
            <Benefit
              icon={<MessageSquare size={24} />}
              title="SMS illimités"
              description="Réponse audio sous 24h"
            />
            <Benefit
              icon={<BookOpen size={24} />}
              title="Accès ressources illimité"
              description="Contenus audio et vidéo CAC"
            />
            <Benefit
              icon={<Calendar size={24} />}
              title="Flexibilité totale"
              description="Report et annulation selon vos besoins"
            />
          </div>
        </div>

        <button
          onClick={() => onShowPromo('vit')}
          className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-md py-3 font-bold"
        >
          En savoir plus
        </button>
      </div>
    </div>
  )
}
