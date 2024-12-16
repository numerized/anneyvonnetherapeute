'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Users, User, Sparkles, Heart, ArrowUpRight, Target } from 'lucide-react'

import { QuestionnaireReward } from '@/components/shared/QuestionnaireReward'
import { scrollToSection } from '@/utils/scroll'

import { BeginningStageCard } from './stages/BeginningStageCard'
import { CheckupStageCard } from './stages/CheckupStageCard'
import { CoupleTherapyCard } from './pricing/CoupleTherapyCard'
import { DecisionStageCard } from './stages/DecisionStageCard'
import { IndividualTherapyCard } from './pricing/IndividualTherapyCard'
import { TherapyPromoModal } from './modals/TherapyPromoModal'
import { VitTherapyCard } from './pricing/VitTherapyCard'

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
    title: ' FORFAIT INDIVIDUEL VERY IMPORTANT THERAPY',
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
  const [showReward, setShowReward] = useState(false)
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
    setShowReward(true)
  }

  const handleRestart = () => {
    setStep(1)
    setAnswers({ situation: '', need: '' })
    setRecommendations([])
    setShowReward(false)
    scrollToSection('questionnaire')
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
          <div className="flex justify-center mb-4">
            <div 
              className="inline-block bg-primary-teal/20 text-primary-cream px-4 py-2 rounded-[24px] text-sm"
              role="presentation"
              aria-label="Questionnaire"
            >
              QUESTIONNAIRE
            </div>
          </div>
          <div className="relative">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-light text-primary-coral">
                {step === 3 ? (recommendations.length === 1 ? 'Notre recommandation pour vous' : 'Nos recommandations pour vous') : 'Quelle thérapie vous correspond ?'}
              </h2>
              {step !== 3 && (
                <p className="text-lg mt-4">
                  Répondez à deux questions simples pour découvrir nos recommandations personnalisées
                </p>
              )}
            </div>
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
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 flex-shrink-0" />
                        <span>Je suis en couple ou je souhaite travailler sur ma relation</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setAnswers(prev => ({ ...prev, situation: 'individual' }))
                        setStep(2)
                      }}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 flex-shrink-0" />
                        <span>Je souhaite un accompagnement individuel</span>
                      </div>
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
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 flex-shrink-0" />
                            <span>Débuter une nouvelle relation sur de bonnes bases</span>
                          </div>
                        </button>
                        <button
                          onClick={() => getRecommendations(answers.situation, 'improve')}
                          className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Heart className="w-5 h-5 flex-shrink-0" />
                            <span>Améliorer et faire évoluer notre relation</span>
                          </div>
                        </button>
                        <button
                          onClick={() => getRecommendations(answers.situation, 'decide')}
                          className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 flex-shrink-0" />
                            <span>Prendre une décision importante pour notre couple</span>
                          </div>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => getRecommendations(answers.situation, 'intensive')}
                          className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <ArrowUpRight className="w-5 h-5 flex-shrink-0" />
                            <span>Un suivi intensif et personnalisé</span>
                          </div>
                        </button>
                        <button
                          onClick={() => getRecommendations(answers.situation, 'regular')}
                          className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 flex-shrink-0" />
                            <span>Un accompagnement régulier</span>
                          </div>
                        </button>
                        <button
                          onClick={() => getRecommendations(answers.situation, 'specific')}
                          className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 flex-shrink-0" />
                            <span>Un travail sur des thèmes spécifiques</span>
                          </div>
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
                  
                  <div className={`grid ${recommendations.length > 1 ? 'md:grid-cols-2' : ''} gap-8 ${recommendations.length === 1 ? 'max-w-2xl mx-auto' : ''} relative`}>
                    {recommendations.map((option, index) => (
                      <div key={option.type} className="w-full">
                        {renderCard(option.type)}
                        {recommendations.length === 2 && index === 0 && (
                          <div className="hidden md:flex absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 items-center">
                            <div className="w-[1px] h-48 bg-primary-cream/30"></div>
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-dark px-3 text-primary-cream">OU</span>
                          </div>
                        )}
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
      <QuestionnaireReward
        isOpen={showReward}
        onClose={() => setShowReward(false)}
        situation={answers.situation as 'couple' | 'individual'}
      />
    </>
  )
}
