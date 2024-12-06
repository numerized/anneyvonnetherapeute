'use client'

import { MessageSquare, BookOpen, Calendar, Heart, Users } from 'lucide-react'
import { Benefit } from './Benefit'
import { useState } from 'react'
import { PromoModal } from '@/components/global/PromoModal'

interface TherapyPricingProps {
  className?: string
}

export function TherapyPricing({ className }: TherapyPricingProps) {
  const [showPromoModal, setShowPromoModal] = useState(false)

  return (
    <>
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-primary-teal text-primary-cream px-4 py-2 rounded-[24px] text-sm mb-4">
              NOS THÉRAPIES
            </div>
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              Transformez Votre Vie
            </h2>
            <p className="text-gray-400">
              Une approche holistique pour une harmonie durable
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Couple Therapy Card */}
            <div className="bg-primary-forest/30 text-primary-cream rounded-[24px] p-8">
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl text-primary-cream font-light mb-2">
                    THÉRAPIE RELATIONNELLE DE COUPLE
                  </h3>
                  <p className="text-primary-coral italic">De cœur et de corps</p>
                </div>

                <blockquote className="border-l-4 border-primary-coral pl-4 my-4">
                  <p className="text-primary-cream/90 italic">
                    "On ne change pas une relation sans d'abord transformer ceux qui la vivent"
                  </p>
                </blockquote>

                <div className="space-y-6">
                  <h4 className="text-xl text-primary-cream font-light">PROCESSUS COMPLET</h4>
                  <ul className="list-disc list-inside text-primary-cream/90 space-y-2">
                    <li>8 séances couple et/ou individuel selon la situation</li>
                    <li>2 séances de 90 minutes</li>
                    <li>6 séances de 75 minutes</li>
                    <li>Bilans et introspections avant et après chaque séance</li>
                    <li>Parcours à thèmes sur demande</li>
                  </ul>
                </div>

                <div className="bg-primary-forest/30 rounded-xl p-6">
                  <h4 className="text-xl text-primary-cream font-light mb-4">VOTRE THÉRAPIE DE COUPLE</h4>
                  <div className="space-y-4">
                    <p className="text-primary-cream/90">
                      Séances alternées sur 20 - 24 semaines (max. 6 mois)
                    </p>
                    <div className="text-primary-coral text-2xl font-bold">
                      2590 € <span className="text-sm text-primary-cream/70">(ou 3 x 880€ mensuel)</span>
                    </div>
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
                      description="Ressources exclusives et événements en ligne pour soutenir votre transformation"
                    />
                    <Benefit
                      icon={<Calendar size={24} />}
                      title="Accompagnement intense"
                      description="Support continu pendant toute la durée du processus"
                    />
                    <Benefit
                      icon={<Heart size={24} />}
                      title="Investissement dans l'amour"
                      description="Rien n'a plus de valeur que l'amour, investissez dans la qualité de vos relations !"
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
                  onClick={() => setShowPromoModal(true)}
                  className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-md py-3 font-bold"
                >
                  En savoir plus
                </button>
              </div>
            </div>

            {/* Individual Therapy Card */}
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
                  onClick={() => setShowPromoModal(true)}
                  className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-md py-3 font-bold"
                >
                  En savoir plus
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PromoModal 
        isOpen={showPromoModal}
        onClose={() => setShowPromoModal(false)}
      />
    </>
  )
}
