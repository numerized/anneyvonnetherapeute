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
  },
  {
    title: 'Programme de transformation sexuelle pour hommes',
    description: 'Programme de transformation sexuelle pour hommes',
    type: 'men'
  },
  {
    title: 'Voyage vers une sexualité libérée et épanouie',
    description: 'Voyage vers une sexualité libérée et épanouie',
    type: 'women'
  }
]

export function TherapyQuestionnaire() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    situation: '',
    need: '',
    intimacyFocus: false,
    gender: ''
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
    setAnswers(prev => ({ ...prev, need }));
    
    if (need === 'intimacy') {
      if (answers.situation === 'individual') {
        setStep(3); // Go to gender selection
      } else {
        const recommended = therapyOptions.filter(option => 
          ['sexology'].includes(option.type)
        );
        setRecommendations(recommended);
        setStep(4);
      }
    } else if (need === 'decide') {
      const recommended = therapyOptions.filter(option => 
        ['couple', 'decision'].includes(option.type)
      );
      setRecommendations(recommended);
      setStep(4);
    } else {
      if (answers.situation === 'individual') {
        const recommended = therapyOptions.filter(option =>
          ['individual'].includes(option.type)
        );
        setRecommendations(recommended);
        setStep(4);
      } else {
        const recommended = therapyOptions.filter(option =>
          ['couple'].includes(option.type)
        );
        setRecommendations(recommended);
        setStep(4);
      }
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

  const handleGenderSelect = (gender: string) => {
    setAnswers(prev => ({ ...prev, gender }));
    // Set exactly one recommendation based on gender
    const recommended = [{
      title: gender === 'male' ? 'FORFAIT HOMME' : 'FORFAIT FEMME',
      description: gender === 'male' 
        ? 'Programme de transformation sexuelle pour hommes' 
        : 'Voyage vers une sexualité libérée et épanouie',
      type: gender === 'male' ? 'men' : 'women'
    }];
    setRecommendations(recommended);
    setShowReward(true);
    setStep(4);
  }

  const handleRestart = () => {
    setStep(1)
    setAnswers({ situation: '', need: '', intimacyFocus: false, gender: '' })
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
        return <MenTherapyCard onShowPromo={() => handleShowPromo('individual')} />
      case 'women':
        return <WomenTherapyCard onShowPromo={() => handleShowPromo('individual')} />
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
                  className="space-y-6"
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
                  className="space-y-6"
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

              {showReward && (
                <motion.div
                  key="recommendations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6">
                    {recommendations.map((option) => (
                      <div key={option.type}>{renderCard(option.type)}</div>
                    ))}
                  </div>
                </motion.div>
              )}

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

      {showReward && <QuestionnaireReward />}

      <TherapyPromoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={selectedTherapyType || 'couple'}
      />
    </>
  )
}
