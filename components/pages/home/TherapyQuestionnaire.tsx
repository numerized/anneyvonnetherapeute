'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CoupleTherapyCard } from './pricing/CoupleTherapyCard'
import { IndividualTherapyCard } from './pricing/IndividualTherapyCard'
import { VitTherapyCard } from './pricing/VitTherapyCard'
import { BeginningStageCard } from './stages/BeginningStageCard'
import { CheckupStageCard } from './stages/CheckupStageCard'
import { DecisionStageCard } from './stages/DecisionStageCard'
import { TherapyPromoModal } from './modals/TherapyPromoModal'

type TherapyOption = {
  title: string
  description: string
  type: 'couple' | 'individual' | 'vit' | 'beginning' | 'checkup' | 'decision'
}

const therapyOptions: TherapyOption[] = [
  {
    title: 'THERAPIE RELATIONNELLE DE COUPLE',
    description: 'Pour les couples en désir d\'harmonie, qui souhaitent mieux s\'entendre et se comprendre.',
    type: 'couple'
  },
  {
    title: 'THERAPIE RELATIONNELLE INDIVIDUELLE',
    description: 'Pour ceux qui souhaitent se reconnecter à eux-mêmes et transformer leur vie.',
    type: 'individual'
  },
  {
    title: 'FORFAIT INDIVIDUEL VIT',
    description: 'Un accompagnement unique, totalement personnalisé et flexible selon vos besoins.',
    type: 'vit'
  },
  {
    title: 'COACHING DE DEBUT DE RELATION',
    description: 'Les premiers mois « clés » de votre avenir relationnel.',
    type: 'beginning'
  },
  {
    title: 'CHECK UP RELATIONNEL',
    description: 'Pour faire le point régulièrement sur votre relation vivante et évolutive.',
    type: 'checkup'
  },
  {
    title: 'RESTER OU PARTIR',
    description: 'Médiation et coaching pour une décision consciente sur l\'avenir de votre relation.',
    type: 'decision'
  }
]

export function TherapyQuestionnaire() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    situation: '',
    need: ''
  })
  const [recommendations, setRecommendations] = useState<TherapyOption[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedTherapyType, setSelectedTherapyType] = useState<TherapyOption['type'] | null>(null)
  const questionnaireRef = useRef<HTMLElement>(null)

  const getRecommendations = (situation: string, need: string) => {
    let recommended: TherapyOption[] = []

    // Logic for couples
    if (situation === 'couple') {
      if (need === 'start') {
        recommended = therapyOptions.filter(option => 
          ['couple', 'beginning'].includes(option.type)
        )
      } else if (need === 'improve') {
        recommended = therapyOptions.filter(option => 
          ['couple', 'checkup'].includes(option.type)
        )
      } else if (need === 'decide') {
        recommended = therapyOptions.filter(option => 
          ['couple', 'decision'].includes(option.type)
        )
      }
    }
    // Logic for individuals
    else if (situation === 'individual') {
      if (need === 'intensive') {
        recommended = therapyOptions.filter(option => 
          ['vit'].includes(option.type)
        )
      } else if (need === 'regular') {
        recommended = therapyOptions.filter(option => 
          ['individual'].includes(option.type)
        )
      } else if (need === 'specific') {
        recommended = therapyOptions.filter(option => 
          ['individual', 'vit'].includes(option.type)
        )
      }
    }

    setRecommendations(recommended)
    setStep(3)
  }

  const handleRestart = () => {
    setStep(1)
    setAnswers({ situation: '', need: '' })
    setRecommendations([])
    questionnaireRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleShowPromo = (type: TherapyOption['type']) => {
    setSelectedTherapyType(type)
    setShowModal(true)
  }

  const renderCard = (type: string) => {
    switch (type) {
      case 'couple':
        return <CoupleTherapyCard onShowPromo={() => handleShowPromo('couple')} />
      case 'individual':
        return <IndividualTherapyCard onShowPromo={() => handleShowPromo('individual')} />
      case 'vit':
        return <VitTherapyCard onShowPromo={() => handleShowPromo('vit')} />
      case 'beginning':
        return <BeginningStageCard onShowPromo={() => handleShowPromo('beginning')} />
      case 'checkup':
        return <CheckupStageCard onShowPromo={() => handleShowPromo('checkup')} />
      case 'decision':
        return <DecisionStageCard onShowPromo={() => handleShowPromo('decision')} />
      default:
        return null
    }
  }

  return (
    <>
      <section 
        ref={questionnaireRef}
        id="questionnaire"
        className="py-16 bg-primary-forest/30"
        aria-labelledby="questionnaire-title"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary-teal text-primary-cream px-4 py-2 rounded-[24px] text-sm mb-4">
              TROUVEZ VOTRE ACCOMPAGNEMENT
            </div>
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              Quelle thérapie vous correspond ?
            </h2>
            <p className="text-gray-400">
              Répondez à deux questions simples pour découvrir nos recommandations personnalisées
            </p>
          </div>

          <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl text-primary-cream mb-6">Quelle est votre situation ?</h3>
                  <div className="grid gap-4">
                    <button
                      onClick={() => {
                        setAnswers(prev => ({ ...prev, situation: 'couple' }))
                        setStep(2)
                      }}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      Je suis en couple ou je souhaite travailler sur ma relation
                    </button>
                    <button
                      onClick={() => {
                        setAnswers(prev => ({ ...prev, situation: 'individual' }))
                        setStep(2)
                      }}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      Je souhaite un accompagnement individuel
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl text-primary-cream mb-6">
                    {answers.situation === 'couple' ? (
                      "Quel est votre besoin principal ?"
                    ) : (
                      "Quel type d'accompagnement recherchez-vous ?"
                    )}
                  </h3>
                  <div className="grid gap-4">
                    {answers.situation === 'couple' ? (
                      <>
                        <button
                          onClick={() => getRecommendations(answers.situation, 'start')}
                          className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                        >
                          Débuter une nouvelle relation sur de bonnes bases
                        </button>
                        <button
                          onClick={() => getRecommendations(answers.situation, 'improve')}
                          className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                        >
                          Améliorer et faire évoluer notre relation
                        </button>
                        <button
                          onClick={() => getRecommendations(answers.situation, 'decide')}
                          className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                        >
                          Prendre une décision importante pour notre couple
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => getRecommendations(answers.situation, 'intensive')}
                          className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                        >
                          Un suivi intensif et personnalisé
                        </button>
                        <button
                          onClick={() => getRecommendations(answers.situation, 'regular')}
                          className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                        >
                          Un accompagnement régulier
                        </button>
                        <button
                          onClick={() => getRecommendations(answers.situation, 'specific')}
                          className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                        >
                          Un travail sur des thèmes spécifiques
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <h3 className="text-xl text-primary-cream mb-6">Nos recommandations pour vous</h3>
                  <div className={`grid ${recommendations.length > 1 ? 'md:grid-cols-2' : 'place-items-center'} gap-8`}>
                    {recommendations.map((option) => (
                      <div key={option.type} className="w-full">
                        {renderCard(option.type)}
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleRestart}
                      className="text-primary-coral hover:text-primary-rust transition-colors mt-6"
                    >
                      Recommencer le questionnaire
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      {selectedTherapyType && (
        <TherapyPromoModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedTherapyType(null)
          }}
          type={selectedTherapyType}
        />
      )}
    </>
  )
}
