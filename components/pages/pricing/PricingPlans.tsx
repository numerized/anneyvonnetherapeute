'use client'

import { useState } from 'react'
import { Heart, Users, Sparkles } from 'lucide-react'
import clsx from 'clsx'

const plans = [
  {
    name: 'Thérapie Relationnelle Individuelle',
    description: 'Pour ceux qui souhaitent se reconnecter à eux-mêmes et transformer leur vie.',
    icon: Heart,
    price: '120',
    duration: 'la séance',
    features: [
      'Séance découverte gratuite de 30min',
      'Séances individuelles de 1h',
      'Définition du thème thérapeutique',
      'Suivi personnalisé',
      'Exercices pratiques',
      'Support entre les séances'
    ],
    buttonText: 'Commencer',
    buttonLink: '/contact'
  },
  {
    name: 'Thérapie Relationnelle de Couple',
    description: 'Pour les couples en désir d\'harmonie, qui souhaitent mieux s\'entendre et se comprendre.',
    icon: Users,
    price: '150',
    duration: 'la séance',
    features: [
      'Séance découverte gratuite de 30min',
      'Séances de couple de 1h30',
      'Bilan relationnel complet',
      'Outils de communication',
      'Exercices pratiques en couple',
      'Support entre les séances'
    ],
    buttonText: 'Commencer',
    buttonLink: '/contact',
    highlight: true
  },
  {
    name: 'Very Important Therapy',
    description: 'Un accompagnement unique, totalement personnalisé et flexible selon vos besoins.',
    icon: Sparkles,
    price: 'Sur mesure',
    duration: '',
    features: [
      'Accompagnement premium',
      'Disponibilité prioritaire',
      'Sessions flexibles',
      'Support illimité',
      'Programme personnalisé',
      'Suivi intensif'
    ],
    buttonText: 'Me contacter',
    buttonLink: '/contact'
  }
]

export function PricingPlans() {
  const [isAnnual] = useState(false)

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-4xl font-light tracking-tight text-primary-forest mb-4">
          Tarifs
        </h2>
        <p className="text-xl text-primary-forest/80 mb-12">
          Choisissez la formule qui correspond le mieux à vos besoins.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <div
              key={plan.name}
              className={clsx(
                'relative flex flex-col p-8 rounded-[32px]',
                plan.highlight
                  ? 'bg-primary-forest text-primary-cream ring-2 ring-primary-coral'
                  : 'bg-primary-forest/5 text-primary-forest'
              )}
            >
              <div className="mb-4">
                <Icon className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-light mb-2">{plan.name}</h3>
              <p className="text-sm opacity-80 mb-8">{plan.description}</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-light">{plan.price}€</span>
                  {plan.duration && (
                    <span className="text-sm opacity-70">/ {plan.duration}</span>
                  )}
                </div>
              </div>

              <ul className="mb-8 space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="text-primary-coral">♦</span>
                    <span className="text-sm opacity-90">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.buttonLink}
                className={clsx(
                  'inline-flex justify-center items-center px-6 py-3 text-sm font-medium rounded-full transition-colors',
                  plan.highlight
                    ? 'bg-primary-coral hover:bg-primary-coral/90 text-primary-cream'
                    : 'bg-primary-forest hover:bg-primary-forest/90 text-primary-cream'
                )}
              >
                {plan.buttonText}
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}
