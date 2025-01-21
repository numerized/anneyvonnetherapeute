'use client'

import { useState } from 'react'
import { RangeInput } from '@/components/ui/RangeInput'
import { EvaluationResults } from '@/components/pages/evaluation/EvaluationResults'
import { motion } from 'framer-motion'

interface RatingSection {
  [key: string]: string
}

export default function EvaluationHandicapRelationnelPage() {
  const [date] = useState(() => {
    const today = new Date()
    return today.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })

  const [socialRatings, setSocialRatings] = useState<RatingSection>({
    autonomieDecisionnelle: '0',
    gestionTemps: '0',
    expressionOpinions: '0',
    limites: '0',
    solitude: '0',
    independanceEmotionnelle: '0',
    autonomieQuotidienne: '0',
    gestionConflits: '0',
    independanceFinanciere: '0',
    priseInitiatives: '0'
  })

  const [intimateRatings, setIntimateRatings] = useState<RatingSection>({
    autonomieDecisionnelleIntime: '0',
    gestionTempsPartage: '0',
    expressionBesoins: '0',
    limitesRelation: '0',
    gestionAttachement: '0',
    independanceEmotionnelleIntime: '0',
    partageResponsabilites: '0',
    gestionConflitsRelation: '0',
    intimitePhysique: '0',
    visionCommune: '0'
  })

  const [showResults, setShowResults] = useState(false)

  const handleSocialChange = (field: keyof typeof socialRatings, value: string) => {
    setSocialRatings(prev => ({ ...prev, [field]: value }))
  }

  const handleIntimateChange = (field: keyof typeof intimateRatings, value: string) => {
    setIntimateRatings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <main className="min-h-screen bg-primary-forest p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-lg print:shadow-none">
        <div className="flex flex-col h-full print-container">
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-primary-coral md:max-w-[70%]">
                Formulaire d'Évaluation du Handicap Relationnel
              </h1>
              <div className="text-right text-sm md:text-base">
                <span className="text-gray-600">Date: </span>
                <span className="text-gray-700">{date}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-8">
              Ce formulaire est divisé en deux parties : l'une centrée sur vos interactions sociales générales, 
              l'autre sur vos relations intimes ou amoureuses. Pour chaque affirmation, évaluez votre situation 
              actuelle en choisissant une note de 0 (dépendance totale) à 10 (indépendance totale).
            </p>

            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6">Section 1 : Relationnelle Sociale</h3>
              
              <ul className="list-none space-y-8 mb-12">
                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Autonomie décisionnelle</span>
                      <span className="text-sm text-gray-500 block">0 : Je suis incapable de prendre des décisions sans l'aval des autres.</span>
                      <span className="text-sm text-gray-500 block">10 : Je prends toutes mes décisions de manière totalement indépendante.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{socialRatings.autonomieDecisionnelle}</span>
                  </div>
                  <RangeInput
                    value={socialRatings.autonomieDecisionnelle}
                    onChange={(value) => handleSocialChange('autonomieDecisionnelle', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Gestion du temps personnel</span>
                      <span className="text-sm text-gray-500 block">0 : Je consacre tout mon temps aux autres, sans moments pour moi.</span>
                      <span className="text-sm text-gray-500 block">10 : Je gère mon temps de manière totalement indépendante.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{socialRatings.gestionTemps}</span>
                  </div>
                  <RangeInput
                    value={socialRatings.gestionTemps}
                    onChange={(value) => handleSocialChange('gestionTemps', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Expression des opinions personnelles</span>
                      <span className="text-sm text-gray-500 block">0 : Je n'exprime jamais mes opinions par peur de déplaire.</span>
                      <span className="text-sm text-gray-500 block">10 : J'exprime toujours mes opinions, sans tenir compte de l'impact sur les autres.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{socialRatings.expressionOpinions}</span>
                  </div>
                  <RangeInput
                    value={socialRatings.expressionOpinions}
                    onChange={(value) => handleSocialChange('expressionOpinions', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Capacité à établir des limites</span>
                      <span className="text-sm text-gray-500 block">0 : Je suis incapable de dire non ou d'établir des limites dans mes relations.</span>
                      <span className="text-sm text-gray-500 block">10 : J'établis des limites strictes dans toutes mes interactions, sans flexibilité.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{socialRatings.limites}</span>
                  </div>
                  <RangeInput
                    value={socialRatings.limites}
                    onChange={(value) => handleSocialChange('limites', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Gestion de la solitude</span>
                      <span className="text-sm text-gray-500 block">0 : Je suis incapable de rester seul, même pour de courtes périodes.</span>
                      <span className="text-sm text-gray-500 block">10 : Je préfère toujours être seul et évite toute interaction sociale.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{socialRatings.solitude}</span>
                  </div>
                  <RangeInput
                    value={socialRatings.solitude}
                    onChange={(value) => handleSocialChange('solitude', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Indépendance émotionnelle</span>
                      <span className="text-sm text-gray-500 block">0 : Mon bien-être émotionnel dépend entièrement des autres.</span>
                      <span className="text-sm text-gray-500 block">10 : Je suis totalement détaché émotionnellement des autres.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{socialRatings.independanceEmotionnelle}</span>
                  </div>
                  <RangeInput
                    value={socialRatings.independanceEmotionnelle}
                    onChange={(value) => handleSocialChange('independanceEmotionnelle', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Autonomie dans les activités quotidiennes</span>
                      <span className="text-sm text-gray-500 block">0 : J'ai besoin de l'aide ou de l'approbation des autres pour toutes mes activités.</span>
                      <span className="text-sm text-gray-500 block">10 : Je réalise toutes mes activités de manière totalement indépendante.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{socialRatings.autonomieQuotidienne}</span>
                  </div>
                  <RangeInput
                    value={socialRatings.autonomieQuotidienne}
                    onChange={(value) => handleSocialChange('autonomieQuotidienne', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Gestion des conflits sociaux</span>
                      <span className="text-sm text-gray-500 block">0 : J'évite tout conflit pour préserver mes relations, même à mon détriment.</span>
                      <span className="text-sm text-gray-500 block">10 : Je gère les conflits de manière unilatérale, sans chercher de compromis.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{socialRatings.gestionConflits}</span>
                  </div>
                  <RangeInput
                    value={socialRatings.gestionConflits}
                    onChange={(value) => handleSocialChange('gestionConflits', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Indépendance financière</span>
                      <span className="text-sm text-gray-500 block">0 : Je dépends entièrement des autres pour mes finances.</span>
                      <span className="text-sm text-gray-500 block">10 : Je suis totalement indépendant(e) financièrement.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{socialRatings.independanceFinanciere}</span>
                  </div>
                  <RangeInput
                    value={socialRatings.independanceFinanciere}
                    onChange={(value) => handleSocialChange('independanceFinanciere', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Prise d'initiatives dans les interactions sociales</span>
                      <span className="text-sm text-gray-500 block">0 : J'attends toujours que les autres prennent l'initiative.</span>
                      <span className="text-sm text-gray-500 block">10 : Je prends toutes les initiatives sans demander l'avis des autres.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{socialRatings.priseInitiatives}</span>
                  </div>
                  <RangeInput
                    value={socialRatings.priseInitiatives}
                    onChange={(value) => handleSocialChange('priseInitiatives', value)}
                    min="0"
                    max="10"
                  />
                </li>
              </ul>
            </div>

            {/* Section 2: Relations Intimes */}
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6">Section 2 : Relationnelle Intime et Amoureuse</h3>
              
              <ul className="list-none space-y-8 mb-12">
                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Autonomie décisionnelle dans la relation</span>
                      <span className="text-sm text-gray-500 block">0 : Je suis incapable de prendre des décisions sans l'avis de mon/mes partenaire(s).</span>
                      <span className="text-sm text-gray-500 block">10 : Je prends toutes mes décisions sans tenir compte de l'avis de l'autre.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{intimateRatings.autonomieDecisionnelleIntime}</span>
                  </div>
                  <RangeInput
                    value={intimateRatings.autonomieDecisionnelleIntime}
                    onChange={(value) => handleIntimateChange('autonomieDecisionnelleIntime', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Gestion du temps partagé</span>
                      <span className="text-sm text-gray-500 block">0 : Je consacre tout mon temps à mon/mes partenaire(s), sans moment pour moi.</span>
                      <span className="text-sm text-gray-500 block">10 : Je privilégie toujours mon propre emploi du temps.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{intimateRatings.gestionTempsPartage}</span>
                  </div>
                  <RangeInput
                    value={intimateRatings.gestionTempsPartage}
                    onChange={(value) => handleIntimateChange('gestionTempsPartage', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Expression des besoins émotionnels</span>
                      <span className="text-sm text-gray-500 block">0 : Je n'exprime jamais mes besoins émotionnels par peur de déranger.</span>
                      <span className="text-sm text-gray-500 block">10 : J'exprime mes besoins sans prendre en compte les limites de l'autre.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{intimateRatings.expressionBesoins}</span>
                  </div>
                  <RangeInput
                    value={intimateRatings.expressionBesoins}
                    onChange={(value) => handleIntimateChange('expressionBesoins', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Capacité à poser des limites dans la relation</span>
                      <span className="text-sm text-gray-500 block">0 : Je suis incapable de poser des limites ou de dire non.</span>
                      <span className="text-sm text-gray-500 block">10 : Je pose des limites strictes et inflexibles.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{intimateRatings.limitesRelation}</span>
                  </div>
                  <RangeInput
                    value={intimateRatings.limitesRelation}
                    onChange={(value) => handleIntimateChange('limitesRelation', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Gestion de l'attachement</span>
                      <span className="text-sm text-gray-500 block">0 : Je me sens totalement perdu(e) lorsque je suis loin de mon/mes partenaire(s).</span>
                      <span className="text-sm text-gray-500 block">10 : Je reste émotionnellement distant(e) et évite tout attachement.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{intimateRatings.gestionAttachement}</span>
                  </div>
                  <RangeInput
                    value={intimateRatings.gestionAttachement}
                    onChange={(value) => handleIntimateChange('gestionAttachement', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Indépendance émotionnelle dans la relation</span>
                      <span className="text-sm text-gray-500 block">0 : Mon bien-être émotionnel dépend entièrement de mon/mes partenaire(s).</span>
                      <span className="text-sm text-gray-500 block">10 : Je suis totalement insensible aux émotions de l'autre.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{intimateRatings.independanceEmotionnelleIntime}</span>
                  </div>
                  <RangeInput
                    value={intimateRatings.independanceEmotionnelleIntime}
                    onChange={(value) => handleIntimateChange('independanceEmotionnelleIntime', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Partage des responsabilités</span>
                      <span className="text-sm text-gray-500 block">0 : J'attends que mon/mes partenaire(s) gèrent tous les aspects de la relation.</span>
                      <span className="text-sm text-gray-500 block">10 : Je m'occupe de tout, refusant toute aide de l'autre.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{intimateRatings.partageResponsabilites}</span>
                  </div>
                  <RangeInput
                    value={intimateRatings.partageResponsabilites}
                    onChange={(value) => handleIntimateChange('partageResponsabilites', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Gestion des conflits relationnels</span>
                      <span className="text-sm text-gray-500 block">0 : J'évite systématiquement les conflits par crainte de nuire à la relation.</span>
                      <span className="text-sm text-gray-500 block">10 : Je traite les conflits de manière unilatérale, sans discussion.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{intimateRatings.gestionConflitsRelation}</span>
                  </div>
                  <RangeInput
                    value={intimateRatings.gestionConflitsRelation}
                    onChange={(value) => handleIntimateChange('gestionConflitsRelation', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Intimité physique et affective</span>
                      <span className="text-sm text-gray-500 block">0 : Je n'ose pas exprimer mes désirs ou besoins intimes.</span>
                      <span className="text-sm text-gray-500 block">10 : J'impose toujours mes désirs sans tenir compte du consentement.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{intimateRatings.intimitePhysique}</span>
                  </div>
                  <RangeInput
                    value={intimateRatings.intimitePhysique}
                    onChange={(value) => handleIntimateChange('intimitePhysique', value)}
                    min="0"
                    max="10"
                  />
                </li>

                <li className="rating-item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1 flex-1 mr-4">
                      <span className="block font-medium">Vision commune</span>
                      <span className="text-sm text-gray-500 block">0 : Je me conforme toujours aux attentes de mon/mes partenaire(s).</span>
                      <span className="text-sm text-gray-500 block">10 : Je n'intègre jamais les attentes de l'autre dans mes projets.</span>
                    </div>
                    <span className="text-4xl font-light text-primary-coral shrink-0 w-16 text-right">{intimateRatings.visionCommune}</span>
                  </div>
                  <RangeInput
                    value={intimateRatings.visionCommune}
                    onChange={(value) => handleIntimateChange('visionCommune', value)}
                    min="0"
                    max="10"
                  />
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              transition={{ ease: [0, 0.71, 0.2, 1] }}
            >
              <button
                onClick={() => setShowResults(!showResults)}
                className="rounded-full px-6 py-3 bg-primary-coral hover:bg-primary-rust text-primary-cream transition-all duration-300 flex items-center gap-2"
              >
                {showResults ? 'Masquer les résultats' : 'Voir mes résultats'}
              </button>
            </motion.div>
          </div>

          {showResults && (
            <section className="mt-8">
              <EvaluationResults
                socialRatings={socialRatings}
                intimateRatings={intimateRatings}
              />
            </section>
          )}

          <blockquote className="text-primary-coral italic text-sm mt-8 print:hidden">
            "Comme un diamant brut, ma valeur est innée et inaltérable ;
            ni les regards ni les jugements ne sauraient l'entamer."
          </blockquote>
        </div>
      </div>
    </main>
  )
}
