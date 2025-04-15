'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Anchor,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronsUp,
  Clock,
  Compass,
  Crosshair,
  Heart,
  HeartCrack,
  Home,
  Lightbulb,
  MessageCircle,
  MessageSquare,
  Moon,
  Network,
  Route,
  Sparkles,
  Star,
  Target,
  User,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { CalendlyModal } from '@/components/dashboard/CalendlyModal'
import { scrollToSection } from '@/utils/scroll'
import {
  generateRecommendedOptions,
  getIntentionText,
} from '@/utils/therapyRecommendations'

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
  price?: number
  priceDetails?: string
  sessionLength?: string
  hasFormulas?: boolean
  formulas?: any[]
}

// Define offerings that are specifically for couples
const coupleSpecificOfferings = [
  'couple',
  'checkup',
  'decision',
  'vit-a-la-carte',
]

const TherapyQuestionnaireNew = () => {
  // State for current step and answers
  const [step, setStep] = useState<number>(1)
  const [answers, setAnswers] = useState<{
    situation: string
    priority: string
    challenge: string
    intention: string
    skippedChallengeStep: boolean
    lastStep?: number
  }>({
    situation: '',
    priority: '',
    challenge: '',
    intention: '',
    skippedChallengeStep: false,
  })

  // State for recommendations
  const [recommendations, setRecommendations] = useState<TherapyOption[]>([])

  // State for tracking if the component is mounted (client-side rendering)
  const [mounted, setMounted] = useState(false)

  // State for Calendly modal
  const [showCalendlyModal, setShowCalendlyModal] = useState(false)
  const [appointmentScheduled, setAppointmentScheduled] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState('')

  // State for coupon
  const [hasCoupon, setHasCoupon] = useState(false)

  // Check if we're on the home/accueil route
  const pathname = usePathname()
  const isHomePage =
    pathname === '/' ||
    pathname === '/accueil' ||
    pathname?.includes('/prochainement')

  // Calculate discounted price (10% off)
  const calculateDiscountedPrice = (price: number) => {
    return Math.round(price * 0.9)
  }

  // First useEffect to mark component as mounted and load saved data
  useEffect(() => {
    setMounted(true)

    // Check for coupon in URL
    const url = new URL(window.location.href)
    const coupon = url.searchParams.get('coupon')
    setHasCoupon(coupon === 'COEUR180')

    // Load data from localStorage
    try {
      const completed = localStorage.getItem('questionnaire_completed')

      if (completed === 'true') {
        const storedAnswers = localStorage.getItem('answers')
        const storedRecommendations = localStorage.getItem('recommendations')

        if (storedAnswers && storedRecommendations) {
          const parsedAnswers = JSON.parse(storedAnswers)
          const parsedRecommendations = JSON.parse(storedRecommendations)

          // Only proceed if we have valid data
          if (
            parsedAnswers &&
            parsedAnswers.intention &&
            parsedRecommendations &&
            parsedRecommendations.length > 0
          ) {
            // Set state with saved values
            setAnswers(parsedAnswers)
            setRecommendations(parsedRecommendations)

            // Set step to show results after a small delay
            setTimeout(() => setStep(4), 200)
          }
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      // Clear localStorage on error
      localStorage.removeItem('questionnaire_completed')
      localStorage.removeItem('answers')
      localStorage.removeItem('recommendations')
    }
  }, [])

  // Function to save questionnaire results
  const saveQuestionnaireResults = (updatedAnswers, recommendedOptions) => {
    try {
      localStorage.setItem('questionnaire_completed', 'true')
      localStorage.setItem('answers', JSON.stringify(updatedAnswers))
      localStorage.setItem(
        'recommendations',
        JSON.stringify(recommendedOptions),
      )
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  // Handler for situation selection
  const handleSituationSelect = (situation: string) => {
    setAnswers({ ...answers, situation })
    setStep(2)
  }

  // Handler for priority selection
  const handlePrioritySelect = (priority: string) => {
    // Check if we should skip the challenge step
    const skipChallengeForPriorities = ['A1', 'A2', 'B1', 'D1', 'D2']
    const shouldSkipChallenge = skipChallengeForPriorities.includes(priority)

    // Update state with the new priority and skippedChallengeStep flag
    const updatedAnswers = {
      ...answers,
      priority,
      skippedChallengeStep: shouldSkipChallenge,
      lastStep: 2,
    }
    
    setAnswers(updatedAnswers)

    if (shouldSkipChallenge) {
      // Skip directly to results with a default challenge
      const defaultChallenge = `${priority}.1`
      handleChallengeSelect(defaultChallenge, updatedAnswers)
    } else {
      // Continue to challenge step as normal
      setStep(3)
    }
  }

  // Handler for challenge selection & generate results
  const handleChallengeSelect = (challenge: string, currentAnswers = answers) => {
    // Generate recommendation based on answers
    const recommendedOptions = generateRecommendedOptions(
      currentAnswers.situation,
      currentAnswers.priority,
      challenge,
    )

    // Generate intention text
    const intention = getIntentionText(currentAnswers.priority, challenge)

    const updatedAnswers = {
      ...currentAnswers,
      challenge,
      intention,
      lastStep: currentAnswers.skippedChallengeStep ? 2 : 3,
    }

    // Update state
    setRecommendations(recommendedOptions)
    setAnswers(updatedAnswers)
    setStep(4)

    // Save data to localStorage when results are generated
    saveQuestionnaireResults(updatedAnswers, recommendedOptions)
  }

  // Handle appointment scheduled
  const handleAppointmentScheduled = async (eventData: any) => {
    try {
      // Validate that we have the expected event data structure
      if (
        eventData.event !== 'calendly.event_scheduled' ||
        !eventData.payload
      ) {
        console.error('Invalid event data format:', eventData)
        return
      }

      // Extract data from Calendly's standard event structure
      const eventUri = eventData.payload?.event?.uri || ''

      if (!eventUri) {
        console.error('Missing event URI:', eventData)
        return
      }

      try {
        // Fetch event details from our API
        const eventDetailsResponse = await fetch(
          `/api/calendly/event-details?eventUri=${encodeURIComponent(eventUri)}`,
        )

        if (!eventDetailsResponse.ok) {
          throw new Error(
            `Failed to fetch event details: ${eventDetailsResponse.status}`,
          )
        }

        const eventDetailsResult = await eventDetailsResponse.json()

        if (!eventDetailsResult.success || !eventDetailsResult.data) {
          throw new Error('Invalid response from event details API')
        }

        const eventDetails = eventDetailsResult.data

        // Get event start time
        let startTime = eventDetails.start_time

        if (!startTime) {
          // Fallback (should rarely happen)
          const scheduledTime = new Date()
          scheduledTime.setHours(scheduledTime.getHours() + 1)
          startTime = scheduledTime.toISOString()
        }

        // Format date for display
        const dateObj = new Date(startTime)
        const formattedDate = new Intl.DateTimeFormat('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(dateObj)

        // Format to capitalize first letter of the day name
        const formattedDateCapitalized =
          formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

        setAppointmentDate(formattedDateCapitalized)
        setAppointmentScheduled(true)
      } catch (error) {
        console.error('Error fetching appointment details:', error)
      }
    } catch (error) {
      console.error('Error handling appointment:', error)
    }
  }

  return (
    <section id="questionnaire" className="bg-primary-dark py-16">
      <div
        className={`mx-auto p-6 text-primary-cream/90 ${isHomePage ? 'max-w-6xl' : 'max-w-4xl'}`}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 text-xs font-medium bg-primary-forest/50 text-primary-cream rounded-full mb-4">
            QUESTIONNAIRE
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary-cream">
            Quelle offre vous correspond?
          </h2>
          <p className="text-primary-cream/80">
            Répondez à deux questions simples pour découvrir nos recommandations
            personnalisées
          </p>
        </div>

        {/* Step 1: Current Situation */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-medium mb-6 text-center">
              Quelle est votre situation actuelle?
            </h3>
            <div
              className={`space-y-4 ${isHomePage ? 'md:max-w-5xl md:mx-auto' : ''}`}
            >
              <button
                onClick={() => handleSituationSelect('A')}
                className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                  <Heart className="w-5 h-5 text-primary-cream" />
                </span>
                <h4 className="font-medium">
                  Je suis en couple et souhaite améliorer ma relation.
                </h4>
              </button>
              <button
                onClick={() => handleSituationSelect('B')}
                className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                  <HeartCrack className="w-5 h-5 text-primary-cream" />
                </span>
                <h4 className="font-medium">
                  Je traverse des difficultés dans mon couple.
                </h4>
              </button>
              <button
                onClick={() => handleSituationSelect('C')}
                className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                  <Target className="w-5 h-5 text-primary-cream" />
                </span>
                <h4 className="font-medium">
                  Je me questionne sur l'avenir de ma relation.
                </h4>
              </button>
              <button
                onClick={() => handleSituationSelect('D')}
                className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                  <User className="w-5 h-5 text-primary-cream" />
                </span>
                <h4 className="font-medium">
                  Je souhaite travailler sur moi-même et ma façon d'être en
                  relation.
                </h4>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Current Priority */}
        {step === 2 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setStep(1)}
                className="mr-2 text-primary-coral"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-semibold text-primary-cream">
                {answers.situation === 'A'
                  ? 'Quel est votre objectif principal ?'
                  : answers.situation === 'B'
                    ? 'Quelle est votre priorité de couple ?'
                    : answers.situation === 'C'
                      ? 'Quelle est votre préoccupation ?'
                      : 'Comment souhaitez-vous avancer ?'}
              </h3>
            </div>

            <div className="space-y-4">
              {answers.situation === 'A' && (
                <>
                  <button
                    onClick={() => handlePrioritySelect('A1')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <ChevronsUp className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Comprendre pourquoi je répète toujours les mêmes schémas.
                    </h4>
                  </button>
                  <button
                    onClick={() => handlePrioritySelect('A2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <MessageCircle className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Mieux cerner mes désirs et mes attentes pour orienter mes
                      choix relationnels.
                    </h4>
                  </button>
                </>
              )}

              {answers.situation === 'B' && (
                <>
                  <button
                    onClick={() => handlePrioritySelect('B1')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Target className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Améliorer la communication et éviter les incompréhensions.
                    </h4>
                  </button>
                  <button
                    onClick={() => handlePrioritySelect('B2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Anchor className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Raviver le désir et retrouver une connexion plus profonde.
                    </h4>
                  </button>
                </>
              )}

              {answers.situation === 'C' && (
                <>
                  <button
                    onClick={() => handlePrioritySelect('C1')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Crosshair className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Évaluer si ma relation est encore alignée avec mes
                      aspirations.
                    </h4>
                  </button>
                  <button
                    onClick={() => handlePrioritySelect('C2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Route className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Prendre une décision réfléchie sur l'avenir du couple.
                    </h4>
                  </button>
                </>
              )}

              {answers.situation === 'D' && (
                <>
                  <button
                    onClick={() => handlePrioritySelect('D1')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Compass className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Apprendre à mieux me connaître et à m'accepter.
                    </h4>
                  </button>
                  <button
                    onClick={() => handlePrioritySelect('D2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Sparkles className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Développer mes capacités relationnelles et ma confiance.
                    </h4>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Main Challenge */}
        {step === 3 && !answers.skippedChallengeStep && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setStep(2)}
                className="mr-2 text-primary-coral"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-semibold text-primary-cream">
                Quel est votre principal défi ?
              </h3>
            </div>

            <div className="space-y-6">
              {answers.priority === 'A1' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('A1.1')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Lightbulb className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      J'ai du mal à identifier ce qui influence mes choix
                      relationnels.
                    </h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('A1.2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <HeartCrack className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Je ressens un blocage émotionnel qui m'empêche d'avancer
                      sereinement.
                    </h4>
                  </button>
                </>
              )}

              {answers.priority === 'A2' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('A2.1')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Network className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      J'ai du mal à exprimer mes attentes dans une relation.
                    </h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('A2.2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <MessageSquare className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      J'ai peur de m'engager et de faire les mauvais choix.
                    </h4>
                  </button>
                </>
              )}

              {answers.priority === 'B1' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('B1.1')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <BookOpen className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Nos discussions tournent souvent en conflit.
                    </h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('B1.2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Check className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      J'aimerais mieux comprendre les besoins de mon/ma
                      partenaire.
                    </h4>
                  </button>
                </>
              )}

              {answers.priority === 'B2' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('B2.1')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Clock className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      La routine a pris le dessus sur notre relation.
                    </h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('B2.2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Heart className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Il y a un déséquilibre dans nos attentes affectives et
                      sexuelles.
                    </h4>
                  </button>
                </>
              )}

              {answers.priority === 'C1' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('C1.1')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <User className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Je ressens une distance émotionnelle avec mon/ma
                      partenaire.
                    </h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('C1.2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <ChevronsUp className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      J'ai peur de me tromper et de regretter ma décision.
                    </h4>
                  </button>
                </>
              )}

              {answers.priority === 'C2' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('C2.1')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Compass className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Je veux clarifier mes sentiments et ceux de mon/ma
                      partenaire.
                    </h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('C2.2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Crosshair className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      J'ai besoin d'un espace neutre pour poser les choses
                      sereinement.
                    </h4>
                  </button>
                </>
              )}

              {answers.priority === 'D1' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('D1.1')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Sparkles className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      J'ai du mal à tourner la page émotionnellement.
                    </h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('D1.2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Network className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Je ressens une peur de reproduire les mêmes erreurs.
                    </h4>
                  </button>
                </>
              )}

              {answers.priority === 'D2' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('D2.1')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <Heart className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      Je veux retrouver confiance en moi et en l'amour.
                    </h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('D2.2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <MessageSquare className="w-5 h-5 text-primary-cream" />
                    </span>
                    <h4 className="font-medium">
                      J'aimerais être accompagné(e) pour redéfinir ma manière
                      d'aimer.
                    </h4>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Results and Recommendations */}
        {step === 4 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <button
                onClick={() => {
                  // Always go back to the appropriate step based on the path taken
                  setStep(answers.skippedChallengeStep ? 2 : 3);
                }}
                className="mr-2 text-primary-coral"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-semibold text-primary-coral">
                Votre itinéraire personnalisé
              </h3>
            </div>

            {/* Intention section */}
            <div className="bg-primary-forest/30 backdrop-blur-sm p-6 rounded-[24px] mb-8">
              <h4 className="font-semibold text-lg mb-3 text-primary-coral">
                Votre intention profonde :
              </h4>
              <p className="text-primary-cream/90">{answers.intention}</p>
            </div>

            {/* Coupon notification */}
            {hasCoupon && (
              <div className="bg-primary-coral/20 p-4 rounded-[24px] mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="text-primary-coral" size={18} />
                  <p className="text-primary-coral font-medium">
                    Code promo COEUR180 (-10%) appliqué !
                  </p>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <h4 className="font-semibold text-lg mb-4 text-primary-coral">
              Offres recommandées pour vous :
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((option, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-[32px] bg-primary-forest/30 p-8 hover:bg-primary-forest/40 transition-colors"
                >
                  <div className="space-y-12">
                    <div className="text-right">
                      <span className="inline-block bg-primary-dark text-primary-cream px-3 py-1 rounded-full text-sm mb-3">
                        {option.offeringType === 'therapy'
                          ? 'Thérapie'
                          : 'Coaching'}
                      </span>
                      <h4 className="text-2xl text-primary-coral font-light mb-2">
                        {option.title}
                      </h4>
                    </div>

                    <div className="space-y-6">
                      <p className="text-primary-cream/90">
                        {option.description}
                      </p>

                      <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4">
                        {/* Price section */}
                        <div className="text-primary-cream/90">
                          {option.offeringType === 'therapy' && option.hasFormulas && option.formulas && option.formulas.length > 1 ? (
                            <div className="text-right">
                              <span className="text-sm font-medium">
                                Plusieurs formules disponibles
                              </span>
                            </div>
                          ) : option.price && (
                            <div className="text-right">
                              {hasCoupon ? (
                                <span className="text-sm font-medium">
                                  <span className="line-through">
                                    {option.price} CHF / EUR
                                  </span>{' '}
                                  <span className="text-primary-coral">
                                    {calculateDiscountedPrice(option.price)} CHF / EUR
                                  </span>{' '}
                                  {option.priceDetails && (
                                    <span>({option.priceDetails})</span>
                                  )}
                                </span>
                              ) : (
                                <span className="text-sm font-medium">
                                  {option.price} CHF / EUR{' '}
                                  {option.priceDetails && (
                                    <span>({option.priceDetails})</span>
                                  )}
                                </span>
                              )}
                            </div>
                          )}
                          {!option.price && option.priceDetails && !(option.offeringType === 'therapy' && option.hasFormulas && option.formulas && option.formulas.length > 1) && (
                            <div className="text-right whitespace-pre-line">
                              <span className="text-sm font-medium">
                                {option.priceDetails}
                              </span>
                            </div>
                          )}
                          {!option.price && !option.priceDetails && option.hasFormulas && option.formulas && option.formulas.length === 1 && (
                            <div className="text-right">
                              <span className="text-sm font-medium">
                                À partir de {option.formulas[0].price} CHF / EUR {option.formulas[0].priceDetails && `(${option.formulas[0].priceDetails})`}
                              </span>
                            </div>
                          )}
                          {!option.price && !option.priceDetails && (!option.hasFormulas || !option.formulas || option.formulas.length === 0) && (
                            <div className="text-right">
                              <span className="text-sm font-medium">
                                {option.type === 'individual' 
                                  ? (option.offeringType === 'therapy' ? 'Plusieurs formules disponibles' : 'À partir de 720 CHF / EUR (programme complet)')
                                  : option.type === 'vit' || option.therapyId === 'vit-a-la-carte' 
                                    ? 'À partir de 210 CHF / EUR par séance'
                                    : option.type === 'couple' || option.therapyId === 'couple'
                                      ? '2250 CHF / EUR (programme complet)'
                                      : 'Tarif sur demande'
                                }
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Session length section */}
                        {option.sessionLength && (
                          <div className="mt-3 pt-3 border-t border-primary-cream/20">
                            <div className="flex items-center gap-2">
                              <Clock className="text-primary-coral" size={18} />
                              <p className="text-sm text-primary-cream/90">
                                {option.type === 'individual' || option.therapyId === 'individual'
                                  ? `${option.sessionLength} par séance`
                                  : option.sessionLength}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Formulas section */}
                        {option.hasFormulas &&
                          option.formulas &&
                          option.formulas.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-primary-cream/20">
                              <p className="text-primary-cream/90 mb-2">
                                <strong>Formules disponibles</strong>
                              </p>
                              <div className="space-y-2">
                                {option.formulas.map((formula, idx) => (
                                  <div
                                    key={idx}
                                    className="text-sm text-primary-cream/80 flex items-center gap-2"
                                  >
                                    <span className="text-primary-coral">
                                      ♦
                                    </span>
                                    <span>
                                      {formula.title}:{' '}
                                      {hasCoupon ? (
                                        <>
                                          <span className="line-through">
                                            {formula.price} CHF / EUR
                                          </span>{' '}
                                          <span className="text-primary-coral">
                                            {calculateDiscountedPrice(
                                              formula.price,
                                            )} CHF / EUR
                                          </span>
                                        </>
                                      ) : (
                                        <>{formula.price} CHF / EUR</>
                                      )}
                                      {formula.duration && (
                                        <span> ({formula.duration})</span>
                                      )}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message about the journey */}
            <div className="mt-8 mb-8 bg-primary-forest/30 backdrop-blur-sm p-6 rounded-[24px] text-center">
              <p className="mb-2 font-bold text-lg text-primary-coral">
                Votre voyage commence ici. Prêt(e) à embarquer ?
              </p>
              <p className="text-primary-cream/90">
                Un itinéraire peut être suivi pas à pas ou construit librement.
                Chaque chemin est là pour vous aider à mieux vous comprendre,
                choisir, aimer, et vous sentir plus libre dans vos relations.
              </p>
              <div className="mt-4">
                {appointmentScheduled ? (
                  <div className="bg-primary-dark/50 p-4 rounded-lg text-primary-cream flex flex-col items-center">
                    <div className="flex items-center mb-2">
                      <Check className="text-primary-coral mr-2 h-5 w-5" />
                      <span className="font-medium">Rendez-vous confirmé</span>
                    </div>
                    <p className="text-sm">{appointmentDate}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCalendlyModal(true)}
                    className="inline-flex items-center px-6 py-3 bg-primary-coral text-white rounded-lg hover:bg-primary-rust transition-all"
                  >
                    Réserver une séance gratuite de 20min
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 text-center">
              <span
                onClick={() => {
                  localStorage.removeItem('answers')
                  localStorage.removeItem('recommendations')
                  localStorage.removeItem('questionnaire_completed')
                  setStep(1)
                  setAnswers({
                    situation: '',
                    priority: '',
                    challenge: '',
                    intention: '',
                    skippedChallengeStep: false,
                  })
                  setRecommendations([])
                  scrollToSection('questionnaire')
                }}
                className="text-primary-cream cursor-pointer hover:text-primary-coral"
              >
                Recommencer le questionnaire
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Calendly Modal */}
      <CalendlyModal
        isOpen={showCalendlyModal}
        onClose={(isScheduled) => {
          setShowCalendlyModal(false)
          if (!isScheduled) {
            // Only reset if user closed without scheduling
            setAppointmentScheduled(false)
          }
        }}
        sessionType="20-min-free-session"
        onAppointmentScheduled={handleAppointmentScheduled}
        userEmail=""
        customUrl="https://calendly.com/numerized-ara/20min"
      />
    </section>
  )
}

export default TherapyQuestionnaireNew
