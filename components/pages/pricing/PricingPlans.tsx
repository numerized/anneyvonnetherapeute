'use client'

import clsx from 'clsx'
import { Check, Heart, Info, Minus, Sparkles, Users } from 'lucide-react'
import { useState } from 'react'

const plans = [
  {
    name: 'Thérapie Relationnelle Individuelle',
    description:
      'Pour ceux qui souhaitent se reconnecter à eux-mêmes et transformer leur vie.',
    icon: Heart,
    price: '120',
    duration: 'la séance',
    features: [
      'Séance découverte gratuite de 30min',
      'Séances individuelles de 1h',
      'Définition du thème thérapeutique',
      'Suivi personnalisé',
      'Exercices pratiques',
      'Support entre les séances',
    ],
    buttonText: 'Commencer',
    buttonLink: '/contact',
  },
  {
    name: 'Thérapie Relationnelle de Couple',
    description:
      "Pour les couples en désir d'harmonie, qui souhaitent mieux s'entendre et se comprendre.",
    icon: Users,
    price: '150',
    duration: 'la séance',
    features: [
      'Séance découverte gratuite de 30min',
      'Séances de couple de 1h30',
      'Bilan relationnel complet',
      'Outils de communication',
      'Exercices pratiques en couple',
      'Support entre les séances',
    ],
    buttonText: 'Commencer',
    buttonLink: '/contact',
    highlight: true,
  },
  {
    name: 'Very Important Therapy',
    description:
      'Un accompagnement unique, totalement personnalisé et flexible selon vos besoins.',
    icon: Sparkles,
    price: 'Sur mesure',
    duration: '',
    features: [
      'Accompagnement premium',
      'Disponibilité prioritaire',
      'Sessions flexibles',
      'Support illimité',
      'Programme personnalisé',
      'Suivi intensif',
    ],
    buttonText: 'Me contacter',
    buttonLink: '/contact',
  },
]

const features = [
  {
    name: 'Séance découverte gratuite',
    tooltip: 'Une séance de 30 minutes pour faire connaissance',
    basic: true,
    business: true,
    enterprise: true,
  },
  {
    name: 'Durée des séances',
    tooltip: 'Durée standard des séances',
    basic: '1h',
    business: '1h30',
    enterprise: 'Flexible',
  },
  {
    name: 'Bilan relationnel',
    tooltip: 'Évaluation complète de votre situation',
    basic: false,
    business: true,
    enterprise: true,
  },
  {
    name: 'Outils de communication',
    tooltip: 'Techniques et méthodes pour améliorer la communication',
    basic: false,
    business: true,
    enterprise: true,
  },
  {
    name: 'Exercices pratiques',
    tooltip: 'Exercices personnalisés à faire entre les séances',
    basic: true,
    business: true,
    enterprise: true,
  },
  {
    name: 'Support entre séances',
    tooltip: 'Possibilité de contact entre les séances',
    basic: false,
    business: true,
    enterprise: true,
  },
  {
    name: 'Programme personnalisé',
    tooltip: 'Plan thérapeutique sur mesure',
    basic: false,
    business: false,
    enterprise: true,
  },
  {
    name: 'Disponibilité prioritaire',
    tooltip: 'Accès prioritaire aux rendez-vous',
    basic: false,
    business: false,
    enterprise: true,
  },
]

export function PricingPlans() {
  const [isAnnual] = useState(false)

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-4xl font-light tracking-tight text-primary-cream mb-4">
          Tarifs
        </h2>
        <p className="text-xl text-primary-cream/90 mb-12">
          Choisissez la formule qui correspond le mieux à vos besoins.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <div
              key={plan.name}
              className={clsx(
                'relative flex flex-col p-8 rounded-[32px]',
                plan.highlight
                  ? 'bg-primary-forest/80 text-primary-cream ring-2 ring-primary-coral'
                  : 'bg-primary-forest/20 text-primary-cream',
              )}
            >
              <div className="mb-4">
                <Icon
                  className={clsx(
                    'w-8 h-8',
                    plan.highlight
                      ? 'text-primary-coral'
                      : 'text-primary-cream/80',
                  )}
                />
              </div>

              <h3 className="text-2xl font-light mb-2">{plan.name}</h3>
              <p className="text-sm text-primary-cream/80 mb-8">
                {plan.description}
              </p>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-light">
                    {plan.price}
                    {plan.duration && '€'}
                  </span>
                  {plan.duration && (
                    <span className="text-sm text-primary-cream/70">
                      / {plan.duration}
                    </span>
                  )}
                </div>
              </div>

              <ul className="mb-8 space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="text-primary-coral">♦</span>
                    <span className="text-sm text-primary-cream/90">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.buttonLink}
                className={clsx(
                  'inline-flex justify-center items-center px-6 py-3 text-sm font-medium rounded-full transition-colors',
                  plan.highlight
                    ? 'bg-primary-coral hover:bg-primary-coral/90 text-primary-cream'
                    : 'bg-primary-forest hover:bg-primary-forest/90 text-primary-cream',
                )}
              >
                {plan.buttonText}
              </a>
            </div>
          )
        })}
      </div>

      <div className="mt-16 bg-primary-forest/20 rounded-[32px] p-8">
        <h3 className="text-2xl font-light text-primary-cream mb-8 text-center">
          Comparaison détaillée des offres
        </h3>

        <div className="w-full">
          <div className="grid grid-cols-4 gap-4 mb-4 text-primary-cream/90">
            <div className="text-left font-medium">Fonctionnalités</div>
            <div className="text-center font-medium">Individuelle</div>
            <div className="text-center font-medium">Couple</div>
            <div className="text-center font-medium">V.I.T</div>
          </div>

          {features.map((feature) => (
            <div
              key={feature.name}
              className="grid grid-cols-4 gap-4 py-4 border-t border-primary-cream/10"
            >
              <div className="flex items-center gap-2 text-primary-cream/80">
                {feature.name}
                {feature.tooltip && (
                  <Info className="w-4 h-4 text-primary-cream/40" />
                )}
              </div>

              <div className="flex justify-center items-center text-primary-cream/80">
                {typeof feature.basic === 'boolean' ? (
                  feature.basic ? (
                    <Check className="w-5 h-5 text-primary-coral" />
                  ) : (
                    <Minus className="w-5 h-5 text-primary-cream/40" />
                  )
                ) : (
                  <span>{feature.basic}</span>
                )}
              </div>

              <div className="flex justify-center items-center text-primary-cream/80">
                {typeof feature.business === 'boolean' ? (
                  feature.business ? (
                    <Check className="w-5 h-5 text-primary-coral" />
                  ) : (
                    <Minus className="w-5 h-5 text-primary-cream/40" />
                  )
                ) : (
                  <span>{feature.business}</span>
                )}
              </div>

              <div className="flex justify-center items-center text-primary-cream/80">
                {typeof feature.enterprise === 'boolean' ? (
                  feature.enterprise ? (
                    <Check className="w-5 h-5 text-primary-coral" />
                  ) : (
                    <Minus className="w-5 h-5 text-primary-cream/40" />
                  )
                ) : (
                  <span>{feature.enterprise}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
