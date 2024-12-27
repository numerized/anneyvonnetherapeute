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
import { SexologyTherapyCard } from './pricing/SexologyTherapyCard'
import { TherapyPromoModal } from './modals/TherapyPromoModal'
import { VitTherapyCard } from './pricing/VitTherapyCard'

type TherapyOption = {
  title: string
  description: string
  type: 'couple' | 'individual' | 'vit' | 'beginning' | 'checkup' | 'decision' | 'sexology'
}

const therapyOptions: TherapyOption[] = [
  {
    title: 'FORFAIT COUPLE SEXOLOGIE',
    description: 'Programme de renaissance intime pour couples souhaitant raviver leur flamme et renforcer leur intimité.',
    type: 'sexology'
  },
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
    need: '',
    intimacyFocus: false
  })
  const [recommendations, setRecommendations] = useState<TherapyOption[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedTherapyType, setSelectedTherapyType] = useState<TherapyOption['type'] | null>(null)
  const [showReward, setShowReward] = useState(false)
  const questionnaireRef = useRef<HTMLElement>(null)

  const handleSituationSelect = (situation: string) => {
    setAnswers(prev => ({ ...prev, situation }))
    setStep(2)
  }

  const handleNeedSelect = (need: string) => {
    if (need === 'decide') {
      const recommended = therapyOptions.filter(option => 
        ['couple', 'decision'].includes(option.type)
      )
      setRecommendations(recommended)
      setAnswers(prev => ({ ...prev, need }))
      setStep(4)
      setShowReward(true)
    } else if (need === 'intensive' || need === 'regular' || need === 'specific') {
      let recommended: TherapyOption[] = []
      if (need === 'intensive') {
        recommended = therapyOptions.filter(option => ['vit'].includes(option.type))
      } else if (need === 'regular') {
        recommended = therapyOptions.filter(option => ['individual'].includes(option.type))
      } else if (need === 'specific') {
        recommended = therapyOptions.filter(option => ['individual', 'vit'].includes(option.type))
      }
      setRecommendations(recommended)
      setAnswers(prev => ({ ...prev, need }))
      setStep(4)
      setShowReward(true)
    } else if (need === 'start') {
      // Skip intimacy question for "Bien démarrer notre relation"
      const recommended = therapyOptions.filter(option => 
        ['couple', 'beginning'].includes(option.type)
      )
      setRecommendations(recommended)
      setAnswers(prev => ({ ...prev, need }))
      setStep(4)
      setShowReward(true)
    } else {
      setAnswers(prev => ({ ...prev, need }))
      setStep(3)
    }
  }

  const handleIntimacySelect = (intimacyFocus: boolean) => {
    setAnswers(prev => ({ ...prev, intimacyFocus }))
    if (intimacyFocus) {
      setRecommendations([therapyOptions.find(option => option.type === 'sexology')!])
    } else {
      const recommended = therapyOptions.filter(option => {
        if (answers.need === 'start') {
          return ['couple', 'beginning'].includes(option.type)
        } else if (answers.need === 'improve') {
          return ['couple', 'checkup'].includes(option.type)
        }
        return false
      })
      setRecommendations(recommended)
    }
    setStep(4)
    setShowReward(true)
  }

  const handleRestart = () => {
    setStep(1)
    setAnswers({ situation: '', need: '', intimacyFocus: false })
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
      case 'sexology':
        return <SexologyTherapyCard onShowPromo={() => handleShowPromo('sexology')} />
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
                {step === 4 ? (recommendations.length === 1 ? 'Notre recommandation pour vous' : 'Nos recommandations pour vous') : 'Quelle thérapie vous correspond ?'}
              </h2>
              {step !== 4 && (
                <p className="text-lg mt-4">
                  Répondez à deux questions simples pour découvrir nos recommandations personnalisées
                </p>
              )}
            </div>
          </div>

          <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-8"
                >
                  <h3 className="text-xl text-primary-cream mb-6">Quelle est votre situation ?</h3>
                  <div className="grid gap-4">
                    <button
                      onClick={() => handleSituationSelect('couple')}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 flex-shrink-0" />
                        <span>Je suis en couple ou je souhaite travailler sur ma relation</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSituationSelect('individual')}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 flex-shrink-0" />
                        <span>Je souhaite une thérapie individuelle</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && answers.situation === 'couple' && (
                <motion.div
                  key="step-2-couple"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-8"
                >
                  <h3 className="text-xl text-primary-cream mb-6">Que souhaitez-vous ?</h3>
                  <div className="grid gap-4">
                    <button
                      onClick={() => handleNeedSelect('start')}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 flex-shrink-0" />
                        <span>Bien démarrer notre relation</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNeedSelect('improve')}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 flex-shrink-0" />
                        <span>Améliorer notre relation actuelle</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNeedSelect('decide')}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 flex-shrink-0" />
                        <span>Prendre une décision sur l'avenir de notre relation</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && answers.situation === 'individual' && (
                <motion.div
                  key="step-2-individual"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-8"
                >
                  <h3 className="text-xl text-primary-cream mb-6">Quel type d'accompagnement recherchez-vous ?</h3>
                  <div className="grid gap-4">
                    <button
                      onClick={() => handleNeedSelect('intensive')}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ArrowUpRight className="w-5 h-5 flex-shrink-0" />
                        <span>Un suivi intensif et personnalisé</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNeedSelect('regular')}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 flex-shrink-0" />
                        <span>Un accompagnement régulier</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNeedSelect('specific')}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 flex-shrink-0" />
                        <span>Un travail sur des thèmes spécifiques</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-8"
                >
                  <h3 className="text-xl text-primary-cream mb-6">Votre priorité est-elle de raviver l'intimité dans votre couple ?</h3>
                  <div className="grid gap-4">
                    <button
                      onClick={() => handleIntimacySelect(true)}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 flex-shrink-0" />
                        <span>Oui, je souhaite me concentrer sur l'intimité et la connexion</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleIntimacySelect(false)}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 flex-shrink-0" />
                        <span>Non, je souhaite travailler sur d'autres aspects de la relation</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="recommendations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8"
                >
                  <div className={`grid ${recommendations.length > 1 ? 'md:grid-cols-2' : ''} gap-8 ${recommendations.length === 1 ? 'max-w-2xl mx-auto' : ''}`}>
                    {recommendations.map((option) => (
                      <div key={option.type}>
                        {renderCard(option.type)}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {step > 1 && (
              <div className="flex justify-center pb-8">
                <button
                  onClick={handleRestart}
                  className="text-primary-cream hover:text-primary-cream/80 transition-colors"
                >
                  Recommencer le questionnaire
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {showReward && <QuestionnaireReward />}

      <TherapyPromoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={selectedTherapyType || 'couple'}
      />
    </>
  )
}
