'use client'

import { motion, useInView } from 'framer-motion'
import { Calendar, FileText, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { Benefit } from './Benefit'

interface RelationshipStagesProps {
  className?: string
}

export function RelationshipStages({ className }: RelationshipStagesProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-primary-teal text-primary-cream px-4 py-2 rounded-[24px] text-sm mb-4">
            LES COACHINGS DE LA RELATION
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            LES ETAPES DE LA RELATION EN DÉTAIL
          </h2>
        </div>

        {/* Stages Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Stage 1: Beginning */}
          <div className="bg-primary-forest/30 text-primary-cream rounded-[24px] p-8">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl text-primary-cream font-light mb-2">
                  COACHING DE DÉBUT DE RELATION
                </h3>
                <p className="text-lg mb-4">
                  L&apos;amour commence par soi. Explorez vos schémas relationnels.
                </p>
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
                className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-md py-3 font-bold"
              >
                En savoir plus
              </button>
            </div>
          </div>

          {/* Stage 2: Check-up */}
          <div className="bg-primary-forest/30 text-primary-cream rounded-[24px] p-8">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl text-primary-cream font-light mb-2">
                  CHECK UP RELATIONNEL
                </h3>
                <p className="text-lg mb-4">
                  L&apos;amour s&apos;épanouit dans la conscience. Transformez vos relations.
                </p>
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
                className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-md py-3 font-bold"
              >
                En savoir plus
              </button>
            </div>
          </div>

          {/* Stage 3: Decision */}
          <div className="bg-primary-forest/30 text-primary-cream rounded-[24px] p-8">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl text-primary-cream font-light mb-2">
                  RESTER OU PARTIR, COMMENT DECIDER ?
                </h3>
                <p className="text-lg mb-4">
                  L&apos;amour rayonne naturellement. Vivez des relations authentiques.
                </p>
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
                className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-md py-3 font-bold"
              >
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
