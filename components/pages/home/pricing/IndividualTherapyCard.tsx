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
          <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4">
            <p className="text-primary-cream/90 mb-2">
              <strong>Organisation</strong>
            </p>
            <ul className="text-sm text-primary-cream/70 space-y-2 list-none m-0 p-0">
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>Définissez votre thème thérapeutique en ligne</span>
              </li>
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>30' de séance gratuite : identifier le thème et le parcours thérapeutique ensemble</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          {/* COMPACT Package */}
          <div className="bg-primary-forest/30 rounded-xl p-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl text-primary-coral font-light">COMPACT</h3>
              <div className="flex items-end gap-1">
                <p className="text-4xl text-primary-cream font-light">2850 €</p>
                <p className="text-primary-cream/70 pb-1">(3 x 950€)</p>
              </div>
              <ul className="text-sm text-primary-cream/70 space-y-2 mt-2 list-none m-0 p-0">
                <li className="flex items-center gap-2 m-0">
                  <span className="text-primary-coral">♦</span>
                  <span>2 séances par mois</span>
                </li>
                <li className="flex items-center gap-2 m-0">
                  <span className="text-primary-coral">♦</span>
                  <span>3 MOIS - 12 x 75 min</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RELAX Package */}
          <div className="bg-primary-forest/30 rounded-xl p-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl text-primary-coral font-light">RELAX</h3>
              <div className="flex items-end gap-1">
                <p className="text-4xl text-primary-cream font-light">2850 €</p>
                <p className="text-primary-cream/70 pb-1">(3 x 950€)</p>
              </div>
              <ul className="text-sm text-primary-cream/70 space-y-2 mt-2 list-none m-0 p-0">
                <li className="flex items-center gap-2 m-0">
                  <span className="text-primary-coral">♦</span>
                  <span>1 séance par mois</span>
                </li>
                <li className="flex items-center gap-2 m-0">
                  <span className="text-primary-coral">♦</span>
                  <span>6 MOIS - 12 x 75 min</span>
                </li>
              </ul>
            </div>
          </div>

          {/* MINI Package */}
          <div className="bg-primary-forest/30 rounded-xl p-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl text-primary-coral font-light">MINI</h3>
              <div className="flex items-end gap-1">
                <p className="text-4xl text-primary-cream font-light">950 €</p>
              </div>
              <ul className="text-sm text-primary-cream/70 space-y-2 mt-2 list-none m-0 p-0">
                <li className="flex items-center gap-2 m-0">
                  <span className="text-primary-coral">♦</span>
                  <span>1 séance par semaine</span>
                </li>
                <li className="flex items-center gap-2 m-0">
                  <span className="text-primary-coral">♦</span>
                  <span>1 MOIS - 4 x 75 min</span>
                </li>
              </ul>
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
