'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  Clock,
  Heart,
  Sparkles,
  Target,
  User,
  Users,
  Users2,
} from 'lucide-react'
import { useRef, useState } from 'react'

import { BaseOffering } from '@/data/therapyOfferings/types'
import { 
  getAllOfferings, 
  getTherapyTypeById, 
  getCoachingTypeById,
  getTherapyOfferings,
  getCoachingOfferings
} from '@/data/therapyOfferings/utils'
import { scrollToSection } from '@/utils/scroll'

// Import the new therapy and coaching cards
import { TherapyCard } from './TherapyCard'
import { TherapyModal } from './TherapyModal'

import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

type TherapyOption = {
  title: string
  description: string
  type:
    | 'couple'
    | 'individual'
    | 'vit'
    | 'beginning'
    | 'checkup'
    | 'decision'
    | 'sexology'
    | 'men'
    | 'women'
  therapyId: string
  offeringType: 'therapy' | 'coaching'
}

const therapyOptions: TherapyOption[] = [
  {
    title: 'FORFAIT COUPLE',
    description: 'Thérapie de couple',
    type: 'couple',
    therapyId: 'couple',
    offeringType: 'therapy'
  },
  {
    title: 'FORFAIT INDIVIDUEL',
    description: 'Thérapie individuelle',
    type: 'individual',
    therapyId: 'individual',
    offeringType: 'therapy'
  },
  {
    title: 'FORFAIT VIT',
    description: 'Thérapie intensive',
    type: 'vit',
    therapyId: 'vit-a-la-carte',
    offeringType: 'therapy'
  },
  {
    title: 'FORFAIT HOMME',
    description: 'Programme de transformation sexuelle pour hommes',
    type: 'men',
    therapyId: 'men-sexuality',
    offeringType: 'therapy'
  },
  {
    title: 'FORFAIT FEMME',
    description: 'Voyage vers une sexualité libérée et épanouie pour femmes',
    type: 'women',
    therapyId: 'women-sexuality',
    offeringType: 'therapy'
  },
  {
    title: 'FORFAIT SEXOLOGIE',
    description: 'Thérapie sexologique',
    type: 'sexology',
    therapyId: 'couple',
    offeringType: 'therapy'
  },
  {
    title: 'FORFAIT DÉMARRAGE',
    description: 'Pour bien démarrer',
    type: 'beginning',
    therapyId: 'beginning-stage',
    offeringType: 'therapy'
  },
  {
    title: 'FORFAIT BILAN',
    description: 'Pour faire le point',
    type: 'checkup',
    therapyId: 'checkup-stage',
    offeringType: 'therapy'
  },
  {
    title: 'FORFAIT DÉCISION',
    description: 'Pour prendre une décision',
    type: 'decision',
    therapyId: 'decision-stage',
    offeringType: 'therapy'
  },
  {
    title: 'COACHING COMMUNICATION',
    description: 'Communication et conflits comme chemins initiatiques',
    type: 'couple',
    therapyId: 'communication-conflicts',
    offeringType: 'coaching'
  },
  {
    title: 'COACHING DÉSIR',
    description: 'Exploration, curiosité et ouvertures',
    type: 'sexology',
    therapyId: 'desire-exploration',
    offeringType: 'coaching'
  },
  {
    title: 'CHECK-UP DU COUPLE',
    description: 'Un Voyage vers l\'Harmonie',
    type: 'checkup',
    therapyId: 'couple-checkup',
    offeringType: 'coaching'
  }
]

// Helper function to get therapy options matching keywords
const getMatchingOfferingsOptions = (
  keywords: string[],
  situation: string = '',
  maxResults: number = 4
): TherapyOption[] => {
  // Get all offerings data
  const allOfferings = getAllOfferings();
  
  const therapyMatches: (TherapyOption & { matchScore: number })[] = [];
  const coachingMatches: (TherapyOption & { matchScore: number })[] = [];
  
  // Check therapy offerings
  allOfferings.therapies.forEach(therapy => {
    // Skip if therapy doesn't match situation filter
    if (situation === 'couple' && !therapy.id.includes('couple') && therapy.id !== 'vit-a-la-carte') {
      return;
    }
    if (situation === 'individual' && therapy.id.includes('couple')) {
      return;
    }
    
    // Search in themes, descriptions, and titles
    let matchScore = 0;
    
    // Check keywords in title and description
    if (therapy.title && keywords.some(kw => 
      therapy.title.toLowerCase().includes(kw.toLowerCase()))) {
      matchScore += 3;
    }
    
    if (therapy.description && keywords.some(kw => 
      therapy.description.toLowerCase().includes(kw.toLowerCase()))) {
      matchScore += 2;
    }
    
    // Check themes
    if (therapy.themes) {
      therapy.themes.forEach(theme => {
        if (keywords.some(kw => 
          theme.title.toLowerCase().includes(kw.toLowerCase()) || 
          theme.description.toLowerCase().includes(kw.toLowerCase()))) {
          matchScore += 2;
        }
      });
    }

    // If there's a match, add to results
    if (matchScore > 0) {
      const existingOption = therapyOptions.find(
        opt => opt.therapyId === therapy.id && opt.offeringType === 'therapy'
      );
      
      if (existingOption) {
        therapyMatches.push({
          ...existingOption,
          matchScore
        });
      } else {
        therapyMatches.push({
          title: therapy.title,
          description: therapy.description || '',
          type: (therapy.id.includes('couple') ? 'couple' : 
                therapy.id.includes('individual') ? 'individual' : 
                therapy.id.includes('vit') ? 'vit' : 'individual') as TherapyOption['type'],
          therapyId: therapy.id,
          offeringType: 'therapy',
          matchScore
        });
      }
    }
  });
  
  // Check coaching offerings
  allOfferings.coaching.forEach(coaching => {
    // Skip if coaching doesn't match situation filter
    if (situation === 'couple' && !coaching.id.includes('couple')) {
      return;
    }
    
    // Search in themes, descriptions, and titles
    let matchScore = 0;
    
    // Check keywords in title and description
    if (coaching.title && keywords.some(kw => 
      coaching.title.toLowerCase().includes(kw.toLowerCase()))) {
      matchScore += 3;
    }
    
    if (coaching.description && keywords.some(kw => 
      coaching.description.toLowerCase().includes(kw.toLowerCase()))) {
      matchScore += 2;
    }
    
    // Check themes
    if (coaching.themes) {
      coaching.themes.forEach(theme => {
        if (keywords.some(kw => 
          theme.title.toLowerCase().includes(kw.toLowerCase()) || 
          theme.description.toLowerCase().includes(kw.toLowerCase()))) {
          matchScore += 2;
        }
      });
    }

    // If there's a match, add to results
    if (matchScore > 0) {
      const existingOption = therapyOptions.find(
        opt => opt.therapyId === coaching.id && opt.offeringType === 'coaching'
      );
      
      if (existingOption) {
        coachingMatches.push({
          ...existingOption,
          matchScore
        });
      } else {
        coachingMatches.push({
          title: coaching.title,
          description: coaching.description || '',
          type: (coaching.id.includes('couple') ? 'couple' : 'individual') as TherapyOption['type'],
          therapyId: coaching.id,
          offeringType: 'coaching',
          matchScore
        });
      }
    }
  });
  
  // Sort by match score
  const sortedTherapyMatches = therapyMatches.sort((a, b) => 
    b.matchScore - a.matchScore
  );
  
  const sortedCoachingMatches = coachingMatches.sort((a, b) => 
    b.matchScore - a.matchScore
  );

  // Create a balanced mix of results
  let results: TherapyOption[] = [];
  
  // Ensure we have at least one therapy if available
  if (sortedTherapyMatches.length > 0) {
    results.push(sortedTherapyMatches[0]);
  }
  
  // Ensure we have at least one coaching if available
  if (sortedCoachingMatches.length > 0) {
    results.push(sortedCoachingMatches[0]);
  }
  
  // Add more results up to maxResults, alternating between therapy and coaching
  let therapyIndex = 1;
  let coachingIndex = 1;
  
  while (results.length < maxResults) {
    if (therapyIndex < sortedTherapyMatches.length && results.length < maxResults) {
      results.push(sortedTherapyMatches[therapyIndex]);
      therapyIndex++;
    }
    
    if (coachingIndex < sortedCoachingMatches.length && results.length < maxResults) {
      results.push(sortedCoachingMatches[coachingIndex]);
      coachingIndex++;
    }
    
    // If we've exhausted both lists, break
    if (therapyIndex >= sortedTherapyMatches.length && 
        coachingIndex >= sortedCoachingMatches.length) {
      break;
    }
  }
  
  // Ensure we have at least 2 results if possible by adding more from either category
  if (results.length < 2) {
    if (therapyIndex < sortedTherapyMatches.length) {
      results.push(sortedTherapyMatches[therapyIndex]);
    } else if (coachingIndex < sortedCoachingMatches.length) {
      results.push(sortedCoachingMatches[coachingIndex]);
    }
  }
  
  return results;
}

export function TherapyQuestionnaireNew() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    situation: '',
    need: '',
    intimacyFocus: false,
    gender: '',
    stage: '',
  })
  const [recommendations, setRecommendations] = useState<TherapyOption[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedTherapyId, setSelectedTherapyId] = useState<string | null>(null)
  const [selectedOfferingType, setSelectedOfferingType] = useState<'therapy' | 'coaching' | null>(null)
  const questionnaireRef = useRef<HTMLElement>(null)

  const handleSituationSelect = (situation: string) => {
    setAnswers((prev) => ({ ...prev, situation }))
    setStep(2)
  }

  const handleNeedSelect = (need: string) => {
    setAnswers((prev) => ({ ...prev, need }))

    if (need === 'intimacy' && answers.situation === 'individual') {
      setStep(3) // Go to gender selection
      return
    }

    let keywords: string[] = [];
    let recommendedOptions: TherapyOption[] = [];
    
    switch (need) {
      case 'regular':
        keywords = ['individuel', 'thérapie individuelle', 'accompagnement régulier'];
        recommendedOptions = getMatchingOfferingsOptions(keywords, 'individual');
        break;
      case 'intensive':
        keywords = ['intensif', 'vit', 'thérapie intensive'];
        recommendedOptions = getMatchingOfferingsOptions(keywords, answers.situation);
        break;
      case 'intimacy':
        if (answers.situation === 'couple') {
          keywords = ['intimité', 'sexualité', 'désir', 'couple'];
          recommendedOptions = getMatchingOfferingsOptions(keywords, 'couple');
        }
        break;
      case 'start':
        keywords = ['démarrer', 'commencer', 'relation', 'couple', 'démarrage'];
        recommendedOptions = getMatchingOfferingsOptions(keywords, 'couple');
        break;
      case 'improve':
        keywords = ['améliorer', 'relation', 'couple', 'harmonie', 'communication'];
        recommendedOptions = getMatchingOfferingsOptions(keywords, 'couple');
        break;
      case 'decide':
        keywords = ['décision', 'avenir', 'relation', 'couple'];
        recommendedOptions = getMatchingOfferingsOptions(keywords, 'couple');
        break;
      default:
        recommendedOptions = [];
    }

    setRecommendations(recommendedOptions)
    setStep(4)
  }

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setAnswers((prev) => ({ ...prev, gender }))
    
    const keywords = gender === 'male' 
      ? ['homme', 'masculin', 'sexualité masculine'] 
      : ['femme', 'féminin', 'sexualité féminine'];
    
    const recommendedOptions = getMatchingOfferingsOptions(keywords, 'individual');
    
    setRecommendations(recommendedOptions)
    setStep(4)
  }

  const handleStageSelect = (stage: string) => {
    setAnswers((prev) => ({ ...prev, stage }))
    
    let keywords: string[] = [];
    switch (stage) {
      case 'beginning':
        keywords = ['démarrer', 'commencer', 'démarrage', 'débuter'];
        break;
      case 'checkup':
        keywords = ['bilan', 'point', 'check-up', 'évaluation'];
        break;
      case 'decision':
        keywords = ['décision', 'choisir', 'avenir', 'décider'];
        break;
      default:
        keywords = [];
    }
    
    const recommendedOptions = getMatchingOfferingsOptions(keywords, answers.situation);
    
    setRecommendations(recommendedOptions)
    setStep(4)
  }

  const handleRestart = () => {
    setStep(1)
    setAnswers({
      situation: '',
      need: '',
      intimacyFocus: false,
      gender: '',
      stage: '',
    })
    setRecommendations([])
    scrollToSection('questionnaire-new')
  }

  const handleCloseReward = () => {
    // Removed
  };

  const handleShowPromo = (therapyId: string) => {
    // Find the selected option to determine if it's therapy or coaching
    const selectedOption = recommendations.find(opt => opt.therapyId === therapyId);
    
    setSelectedTherapyId(therapyId)
    setSelectedOfferingType(selectedOption?.offeringType || 'therapy')
    setShowModal(true)
  }

  const renderCard = (option: TherapyOption) => {
    // Get the offering data based on type (therapy or coaching)
    let offering;
    if (option.offeringType === 'therapy') {
      offering = getTherapyTypeById(option.therapyId);
    } else {
      offering = getCoachingTypeById(option.therapyId);
    }
    
    // Use a default theme if none is available
    const theme = offering?.themes?.[0] || {
      title: option.title,
      description: option.description,
    };

    // Get benefit icon based on therapy type
    const getBenefitIcon = () => {
      const type = option.type.toLowerCase();
      
      if (type.includes('couple') || type === 'sexology') {
        return <Heart size={24} />;
      } else if (type === 'vit') {
        return <Clock size={24} />;
      } else if (type === 'beginning' || type === 'checkup' || type === 'decision') {
        return <Target size={24} />;
      } else if (type === 'men' || type === 'women' || type === 'individual') {
        return <User size={24} />;
      } else {
        return <Sparkles size={24} />;
      }
    };

    return (
      <div
        key={option.therapyId}
        className="flex flex-col h-full bg-primary-forest/30 backdrop-blur-sm rounded-[16px] overflow-hidden hover:shadow-xl transition-shadow border border-primary-cream/20"
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center mb-4">
            <div className="mr-3 text-primary-coral">
              {getBenefitIcon()}
            </div>
            <h3 className="text-xl font-semibold text-primary-cream">
              {option.title}
            </h3>
          </div>
          
          <p className="text-primary-cream/70 mb-4 line-clamp-3">
            {theme?.description || option.description}
          </p>
          
          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary-cream/60">
                {option.offeringType === 'therapy' ? 'Thérapie' : 'Coaching'}
              </span>
              
              <button
                onClick={() => handleShowPromo(option.therapyId)}
                className="inline-flex items-center text-primary-coral hover:text-primary-coral/80 font-medium transition-colors"
              >
                En savoir plus <ArrowUpRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPromoModal = () => {
    if (!selectedTherapyId || !selectedOfferingType) return null;

    // Get the offering data based on type (therapy or coaching)
    let offering;
    if (selectedOfferingType === 'therapy') {
      offering = getTherapyTypeById(selectedTherapyId);
    } else {
      offering = getCoachingTypeById(selectedTherapyId);
    }
    
    if (!offering) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-primary-dark w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[16px]">
          <div className="p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-primary-cream/70 hover:text-primary-cream transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <h2 className="text-3xl font-semibold text-primary-cream mb-4">
              {offering.title}
            </h2>
            
            <p className="text-primary-cream/80 mb-6">{offering.description}</p>
            
            {/* Themes Section */}
            {offering.themes && offering.themes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-4 text-primary-coral">
                  Thèmes abordés
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offering.themes.map((theme, index) => (
                    <div
                      key={index}
                      className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]"
                    >
                      <h4 className="font-bold text-primary-cream mb-2">
                        {theme.title}
                      </h4>
                      <p className="text-primary-cream/80">{theme.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Details Section - Optional */}
            {offering.mainOffering?.details && (
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-4 text-primary-coral">
                  {offering.mainOffering.details.title || 'Détails'}
                </h3>
                <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
                  {offering.mainOffering.details.schedule && (
                    <p className="text-primary-cream mb-2">{offering.mainOffering.details.schedule}</p>
                  )}
                  
                  {offering.mainOffering.details.inclusions && (
                    <div>
                      <p className="text-primary-cream font-bold mb-2">Inclus:</p>
                      <ul className="space-y-1">
                        {offering.mainOffering.details.inclusions.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary-coral mr-2">✓</span>
                            <span className="text-primary-cream/90">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-primary-cream/20">
              <button
                onClick={() => setShowModal(false)}
                className="text-primary-cream/70 hover:text-primary-cream font-medium transition-colors"
              >
                Retour
              </button>
              <Link
                href={`/${selectedOfferingType === 'therapy' ? 'therapies' : 'coaching'}/${selectedTherapyId}`}
                className="bg-primary-coral text-primary-dark hover:bg-primary-coral/90 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Découvrir ce forfait
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section
        ref={questionnaireRef}
        id="questionnaire-new"
        className="py-16 bg-primary-forest"
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
                {step === 4
                  ? recommendations.length === 1
                    ? 'Notre recommandation pour vous'
                    : 'Nos recommandations pour vous'
                  : 'Quelle thérapie vous correspond ?'}
              </h2>
              {step !== 4 && (
                <p className="text-lg mt-4">
                  Répondez à deux questions simples pour découvrir nos
                  recommandations personnalisées
                </p>
              )}
            </div>
          </div>

          <div className="bg-primary-forest/30 backdrop-blur-sm rounded-[32px] border border-primary-cream/20">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-8"
                >
                  <h3 className="text-xl text-primary-cream mb-6">
                    Quelle est votre situation ?
                  </h3>
                  <div className="grid gap-4">
                    <button
                      onClick={() => handleSituationSelect('couple')}
                      className="w-full bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 flex-shrink-0" />
                        <span>
                          Je suis en couple ou je souhaite travailler sur ma
                          relation
                        </span>
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
              ) : step === 2 && answers.situation === 'couple' ? (
                <motion.div
                  key="step-2-couple"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-8"
                >
                  <h3 className="text-xl text-primary-cream mb-6">
                    Que souhaitez-vous ?
                  </h3>
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
                        <span>
                          Prendre une décision sur l'avenir de notre relation
                        </span>
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
              ) : step === 2 && answers.situation === 'individual' ? (
                <motion.div
                  key="step-2-individual"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-8"
                >
                  <h3 className="text-xl text-primary-cream mb-6">
                    Je souhaite :
                  </h3>
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
              ) : step === 3 && answers.need === 'intimacy' ? (
                <motion.div
                  key="step-3-gender"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 p-8"
                >
                  <h3 className="text-xl text-primary-cream mb-6">
                    Vous êtes :
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      className="bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-6 text-left transition-colors"
                      onClick={() => handleGenderSelect('male')}
                    >
                      <h4 className="text-xl mb-2">Un homme</h4>
                      <p className="text-primary-cream/70">
                        Programme de transformation sexuelle pour hommes
                      </p>
                    </button>
                    <button
                      className="bg-primary-forest hover:bg-primary-forest/70 text-primary-cream rounded-[24px] p-6 text-left transition-colors"
                      onClick={() => handleGenderSelect('female')}
                    >
                      <h4 className="text-xl mb-2">Une femme</h4>
                      <p className="text-primary-cream/70">
                        Voyage vers une sexualité libérée et épanouie
                      </p>
                    </button>
                  </div>
                </motion.div>
              ) : step === 4 && recommendations.length > 0 ? (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-12 bg-primary-forest/30 backdrop-blur-sm rounded-[32px] p-8 border border-primary-cream/20"
                >
                  <h2 className="text-3xl text-center font-light mb-1 text-primary-cream">
                    Recommandations
                  </h2>
                  <p className="text-center text-primary-cream/70 mb-8">
                    Basées sur vos réponses, voici les options qui pourraient vous convenir
                  </p>

                  <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendations.map((option) => (
                        <div key={option.therapyId}>
                          {renderCard(option)}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-center mt-12">
                      <button
                        onClick={handleRestart}
                        className="bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-[24px] py-3 px-6 font-bold"
                      >
                        Recommencer
                      </button>
                    </div>
                  </div>
                </motion.section>
              ) : null}
            </AnimatePresence>

            {step > 1 && (
              <motion.div
                key="restart-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center mt-8 pb-8"
              >
                <button
                  onClick={handleRestart}
                  className="text-primary-cream/50 hover:text-primary-cream transition-colors"
                >
                  Recommencer le questionnaire
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {showModal && selectedTherapyId && renderPromoModal()}
    </>
  )
}
