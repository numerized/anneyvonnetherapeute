'use client'

import { BookOpen, Calendar,MessageSquare } from 'lucide-react'

import { Benefit } from '../Benefit'

interface IndividualTherapyCardProps {
  onShowPromo: (modalType: string) => void
}

export function IndividualTherapyCard({ onShowPromo }: IndividualTherapyCardProps) {
  return (
    <div className="bg-primary-forest/30 text-primary-cream rounded-[24px] p-8">
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl text-primary-cream font-light mb-2">
            THÉRAPIE RELATIONNELLE INDIVIDUELLE
          </h3>
          <p className="text-primary-coral italic">Accords à corps</p>
        </div>

        <blockquote className="border-l-4 border-primary-coral pl-4 my-4">
          <p className="text-primary-cream/90 italic">
            "Changer sa vie, c'est d'abord se reconnecter à son corps et à soi."
          </p>
        </blockquote>

        <div className="space-y-6">
          <h4 className="text-xl text-primary-cream font-light">FORFAIT INDIVIDUEL</h4>
          <ul className="list-disc list-inside text-primary-cream/90 space-y-2">
            <li>Définissez votre thème thérapeutique en ligne</li>
            <li>30' de séance gratuite : identifier le thème et le parcours thérapeutique ensemble</li>
          </ul>
        </div>

        <div className="space-y-4">
          {/* COMPACT Package */}
          <div className="bg-primary-forest/30 rounded-xl p-6">
            <h4 className="text-xl text-primary-cream font-light mb-2">COMPACT</h4>
            <ul className="text-primary-cream/90 space-y-2 mb-4">
              <li>2 séances par mois</li>
              <li>3 MOIS - 12 x 75 min</li>
            </ul>
            <div className="text-primary-coral text-2xl font-bold">
              2850 € <span className="text-sm text-primary-cream/70">(3 x 950€)</span>
            </div>
          </div>

          {/* RELAX Package */}
          <div className="bg-primary-forest/30 rounded-xl p-6">
            <h4 className="text-xl text-primary-cream font-light mb-2">RELAX</h4>
            <ul className="text-primary-cream/90 space-y-2 mb-4">
              <li>1 séance par mois</li>
              <li>6 MOIS - 12 x 75 min</li>
            </ul>
            <div className="text-primary-coral text-2xl font-bold">
              2850 € <span className="text-sm text-primary-cream/70">(3 x 950€)</span>
            </div>
          </div>

          {/* MINI Package */}
          <div className="bg-primary-forest/30 rounded-xl p-6">
            <h4 className="text-xl text-primary-cream font-light mb-2">MINI</h4>
            <ul className="text-primary-cream/90 space-y-2 mb-4">
              <li>1 séance par semaine</li>
              <li>1 MOIS - 4 x 75 min</li>
            </ul>
            <div className="text-primary-coral text-2xl font-bold">
              950 €
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Benefit
            icon={<MessageSquare size={24} />}
            title="Support WhatsApp hebdomadaire"
            description="Posez une question, recevez une réponse audio personnalisée"
          />
          <Benefit
            icon={<BookOpen size={24} />}
            title="Accès à la plateforme"
            description="Ressources exclusives et événements en ligne pour soutenir votre transformation"
          />
          <Benefit
            icon={<Calendar size={24} />}
            title="Accompagnement personnalisé"
            description="Support continu pendant toute la durée du processus"
          />
        </div>
        <button
          onClick={() => onShowPromo('individual')}
          className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-md py-3 font-bold"
        >
          En savoir plus
        </button>
      </div>
    </div>
  )
}
