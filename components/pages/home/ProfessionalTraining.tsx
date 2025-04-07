'use client'

import { Award, Calendar, GraduationCap, Users } from 'lucide-react'

interface ProfessionalTrainingProps {
  className?: string
}

export function ProfessionalTraining({ className }: ProfessionalTrainingProps) {
  return (
    <section className={`bg-primary-forest py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-primary-teal/20 px-4 py-2 rounded-[24px] text-sm mb-4">
            POUR LES PROFESSIONNELS
          </div>
          <h2 className="text-4xl font-light mb-6 text-primary-coral">
            Formation pour Thérapeutes
          </h2>
          <p className="text-xl text-primary-cream/80 max-w-2xl mx-auto">
            Enrichissez votre pratique avec nos méthodes thérapeutiques
            innovantes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-primary-dark/40 rounded-[24px] p-8 md:p-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <GraduationCap className="text-primary-coral mt-1" size={24} />
                <div>
                  <h3 className="text-primary-coral font-bold mb-2">
                    Formation Approfondie
                  </h3>
                  <p className="text-primary-cream/90">
                    Maîtrisez les techniques de la thérapie Cœurs à Corps et
                    développez une approche holistique unique.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="text-primary-coral mt-1" size={24} />
                <div>
                  <h3 className="text-primary-coral font-bold mb-2">
                    Supervision de Groupe
                  </h3>
                  <p className="text-primary-cream/90">
                    Échangez avec vos pairs et bénéficiez d'un accompagnement
                    personnalisé dans votre pratique.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Award className="text-primary-coral mt-1" size={24} />
                <div>
                  <h3 className="text-primary-coral font-bold mb-2">
                    Certification Officielle
                  </h3>
                  <p className="text-primary-cream/90">
                    Obtenez une certification reconnue et rejoignez notre réseau
                    de thérapeutes qualifiés.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="text-primary-coral mt-1" size={24} />
                <div>
                  <h3 className="text-primary-coral font-bold mb-2">
                    Formations Flexibles
                  </h3>
                  <p className="text-primary-cream/90">
                    Des programmes adaptés à votre emploi du temps, en
                    présentiel ou en ligne.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <button className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-[24px] py-3 font-bold">
                Découvrir nos formations
              </button>
            </div>
          </div>

          <div className="relative h-[600px]">
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#0F1A17]/60 from-5% via-primary-forest/50 via-50% to-primary-forest/20 z-10 rounded-[24px]"
              aria-hidden="true"
            />
            <img
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80"
              alt="Professional therapy training session"
              className="absolute inset-0 w-full h-full object-cover rounded-[24px]"
            />
            <div className="absolute bottom-8 left-8 right-8 text-primary-cream z-20">
              <div className="bg-primary-dark/80 p-6 rounded-[24px]">
                <p className="text-xl mb-4">
                  "Transmettez l'art de la thérapie relationnelle et faites
                  partie du changement."
                </p>
                <p className="text-primary-teal font-handwriting text-lg">
                  Anne Yvonne Racine
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
