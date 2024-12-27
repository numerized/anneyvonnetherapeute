'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Users, User, Sparkles, Heart, ArrowUpRight, Target, Users2, Clock } from 'lucide-react'
import { QuestionnaireReward } from '@/components/shared/QuestionnaireReward'
import { scrollToSection } from '@/utils/scroll'

import { BeginningStageCard } from './stages/BeginningStageCard'
import { CheckupStageCard } from './stages/CheckupStageCard'
import { CoupleTherapyCard } from './pricing/CoupleTherapyCard'
import { DecisionStageCard } from './stages/DecisionStageCard'
import { IndividualTherapyCard } from './pricing/IndividualTherapyCard'
import { MenTherapyCard } from './pricing/MenTherapyCard'
import { SexologyTherapyCard } from './pricing/SexologyTherapyCard'
import { TherapyPromoModal } from './modals/TherapyPromoModal'
import { VitTherapyCard } from './pricing/VitTherapyCard'
import { WomenTherapyCard } from './pricing/WomenTherapyCard'

type TherapyOption = {
  title: string
  description: string
  type: 'couple' | 'individual' | 'vit' | 'beginning' | 'checkup' | 'decision' | 'sexology' | 'men' | 'women'
}

const therapyOptions: TherapyOption[] = [
  {
    title: 'FORFAIT COUPLE',
    description: 'Thérapie de couple',
    type: 'couple'
  },
  {
    title: 'FORFAIT INDIVIDUEL',
    description: 'Thérapie individuelle',
    type: 'individual'
  },
  {
    title: 'FORFAIT VIT',
    description: 'Thérapie intensive',
    type: 'vit'
  },
  {
    title: 'FORFAIT HOMME',
    description: 'Programme de transformation sexuelle pour hommes',
    type: 'men'
  },
  {
    title: 'FORFAIT FEMME',
    description: 'Voyage vers une sexualité libérée et épanouie pour femmes',
    type: 'women'
  },
  {
    title: 'FORFAIT SEXOLOGIE',
    description: 'Thérapie sexologique',
    type: 'sexology'
  },
  {
    title: 'FORFAIT DÉMARRAGE',
    description: 'Pour bien démarrer',
    type: 'beginning'
  },
  {
    title: 'FORFAIT BILAN',
    description: 'Pour faire le point',
    type: 'checkup'
  },
  {
    title: 'FORFAIT DÉCISION',
    description: 'Pour prendre une décision',
    type: 'decision'
  }
]

export function TherapyQuestionnaire() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    situation: '',
    need: '',
    intimacyFocus: false,
    gender: '',
    stage: ''
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
    setAnswers(prev => ({ ...prev, need }))

    if (need === 'intimacy' && answers.situation === 'individual') {
      setStep(3) // Go to gender selection
      return
    }

    let recommended: TherapyOption[] = []
    switch (need) {
      case 'regular':
        recommended = [therapyOptions.find(option => option.type === 'individual')!]
        break
      case 'intensive':
        recommended = [therapyOptions.find(option => option.type === 'vit')!]
        break
      case 'intimacy':
        if (answers.situation === 'couple') {
          recommended = [
            therapyOptions.find(option => option.type === 'sexology')!,
            therapyOptions.find(option => option.type === 'couple')!
          ]
        }
        break
      case 'start':
        recommended = [therapyOptions.find(option => option.type === 'beginning')!]
        break
      case 'improve':
        recommended = [
          therapyOptions.find(option => option.type === 'checkup')!,
          therapyOptions.find(option => option.type === 'couple')!
        ]
        break
      case 'decide':
        recommended = [
          therapyOptions.find(option => option.type === 'decision')!,
          therapyOptions.find(option => option.type === 'couple')!
        ]
        break
    }

    setRecommendations(recommended)
    setShowReward(true)
    setStep(4)
  }

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setAnswers(prev => ({ ...prev, gender }))
    const recommended: TherapyOption[] = [{
      title: gender === 'male' ? 'FORFAIT HOMME' : 'FORFAIT FEMME',
      description: gender === 'male'
        ? 'Programme de transformation sexuelle pour hommes'
        : 'Voyage vers une sexualité libérée et épanouie pour femmes',
      type: gender === 'male' ? 'men' : 'women'
    }]
    setRecommendations(recommended)
    setShowReward(true)
    setStep(4)
  }

  const handleStageSelect = (stage: string) => {
    setAnswers(prev => ({ ...prev, stage }))
    let recommended: TherapyOption[]

    switch (stage) {
      case 'beginning':
        recommended = therapyOptions.filter(option => option.type === 'beginning')
        break
      case 'checkup':
        recommended = therapyOptions.filter(option => option.type === 'checkup')
        break
      case 'decision':
        recommended = therapyOptions.filter(option => option.type === 'decision')
        break
      default:
        recommended = []
    }

    setRecommendations(recommended)
    setShowReward(true)
    setStep(4)
  }

  const handleRestart = () => {
    setStep(1)
    setAnswers({ situation: '', need: '', intimacyFocus: false, gender: '', stage: '' })
    setRecommendations([])
    setShowReward(false)
    scrollToSection('questionnaire')
  }

  const handleShowPromo = (type: TherapyOption['type']) => {
    setSelectedTherapyType(type)
    setShowModal(true)
  }

  const renderCard = (type: TherapyOption['type']) => {
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
      case 'men':
        return <MenTherapyCard onShowPromo={() => handleShowPromo('men')} />
      case 'women':
        return <WomenTherapyCard onShowPromo={() => handleShowPromo('women')} />
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
                    <button
                      onClick={() => handleNeedSelect('intimacy')}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 flex-shrink-0" />
                        <span>Améliorer l'intimité dans notre relation</span>
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
                  <h3 className="text-xl text-primary-cream mb-6">Je souhaite :</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => handleNeedSelect('regular')}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users2 className="w-5 h-5 flex-shrink-0" />
                        <span>Un accompagnement régulier</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNeedSelect('intensive')}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 flex-shrink-0" />
                        <span>Un accompagnement intensif</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNeedSelect('intimacy')}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 flex-shrink-0" />
                        <span>Un accompagnement sur l'intimité</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && answers.need === 'intimacy' && (
                <motion.div
                  key="step-3-gender"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-8"
                >
                  <h3 className="text-xl text-primary-cream mb-6">Vous êtes :</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      className="bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-6 text-left transition-colors"
                      onClick={() => handleGenderSelect('male')}
                    >
                      <h4 className="text-xl mb-2">Un homme</h4>
                      <p className="text-primary-cream/70">Programme de transformation sexuelle pour hommes</p>
                    </button>
                    <button
                      className="bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-6 text-left transition-colors"
                      onClick={() => handleGenderSelect('female')}
                    >
                      <h4 className="text-xl mb-2">Une femme</h4>
                      <p className="text-primary-cream/70">Voyage vers une sexualité libérée et épanouie</p>
                    </button>
                  </div>

                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {step === 4 && recommendations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`grid grid-cols-12 gap-8 mt-12 ${recommendations.length === 1 ? 'justify-center' : ''}`}
                  >
                    {recommendations.map((option) => (
                      <div key={option.type}
                        className={`col-span-12 ${
                          recommendations.length === 1 
                            ? (option.type === 'men' || option.type === 'women')
                              ? 'md:col-span-12' 
                              : 'md:col-span-6 md:col-start-4'
                            : 'md:col-span-6'
                        }`}
                      >
                        {renderCard(option.type)}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {step > 1 && (
                <motion.div
                  key="restart-button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center mt-8"
                >
                  <button
                    onClick={handleRestart}
                    className="text-primary-cream/50 hover:text-primary-cream transition-colors"
                  >
                    Recommencer le questionnaire
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </section>

      {showReward && (
        <QuestionnaireReward
          isOpen={showReward}
          onClose={() => {
            setShowReward(false)
            // Don't reset step or recommendations when closing reward
          }}
          situation={answers.situation as 'couple' | 'individual'}
        />
      )}



      <TherapyPromoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={selectedTherapyType || 'couple'}
      />
    </>
  )
}
