'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Moon, Star } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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
  }>({
    situation: '',
    priority: '',
    challenge: '',
    intention: '',
    skippedChallengeStep: false,
  })

  // State for recommendations
  const [recommendations, setRecommendations] = useState<TherapyOption[]>([])

  // Handler for situation selection
  const handleSituationSelect = (situation: string) => {
    setAnswers({ ...answers, situation })
    setStep(2)
  }

  // Handler for priority selection
  const handlePrioritySelect = (priority: string) => {
    setAnswers({ ...answers, priority })

    // Check if we should skip the challenge step
    const skipChallengeForPriorities = ['A1', 'A2', 'B1', 'D1', 'D2']
    const shouldSkipChallenge = skipChallengeForPriorities.includes(priority)

    // Store whether we skipped for back button logic
    setAnswers((prev) => ({
      ...prev,
      priority,
      skippedChallengeStep: shouldSkipChallenge,
    }))

    if (shouldSkipChallenge) {
      // Skip directly to results with a default challenge
      const defaultChallenge = `${priority}.1`
      handleChallengeSelect(defaultChallenge)
    } else {
      // Continue to challenge step as normal
      setStep(3)
    }
  }

  // Handler for challenge selection
  const handleChallengeSelect = (challenge: string) => {
    // Generate recommendation based on answers
    const recommendedOptions = generateRecommendedOptions(
      answers.situation,
      answers.priority,
      challenge,
    )

    // Generate intention text
    const intention = getIntentionText(answers.priority, challenge)

    setRecommendations(recommendedOptions)
    setAnswers((prev) => ({ ...prev, challenge, intention }))
    setStep(4)
  }

  return (
    <section className="bg-primary-dark py-16">
      <div className="max-w-4xl mx-auto p-6 text-primary-cream/90">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 text-xs font-medium bg-primary-forest/50 text-primary-cream rounded-full mb-4">
            QUESTIONNAIRE
          </div>
          <h2 className="text-4xl font-light text-primary-coral mb-4">
            Quelle thérapie vous correspond ?
          </h2>
          <p className="text-primary-cream/80">
            Répondez à deux questions simples pour découvrir nos recommandations
            personnalisées
          </p>
        </div>

        {/* Step 1: Current Situation */}
        {step === 1 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6 text-primary-cream">
              Quelle est votre situation ?
            </h3>

            <div className="space-y-4">
              <button
                onClick={() => handleSituationSelect('A')}
                className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-cream"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <h4 className="font-medium">
                  Je suis célibataire et je veux mieux comprendre mon rapport
                  aux relations.
                </h4>
              </button>

              <button
                onClick={() => handleSituationSelect('B')}
                className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-cream"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </span>
                <h4 className="font-medium">
                  Je suis en couple et je souhaite améliorer notre relation.
                </h4>
              </button>

              <button
                onClick={() => handleSituationSelect('C')}
                className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-cream"
                  >
                    <path d="M9 18l6-6-6-6"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-cream"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </span>
                <h4 className="font-medium">
                  Je viens de vivre une rupture et je veux avancer.
                </h4>
              </button>
            </div>
          </div>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
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
                      <Moon className="w-5 h-5 text-primary-cream" />
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M9 18l6-6-6-6"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M14 9V5a3 3 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m15 9-6 6"></path>
                        <path d="m9 9 6 6"></path>
                      </svg>
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
        {step === 3 && (
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m15 9-6 6"></path>
                        <path d="m9 9 6 6"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"></path>
                        <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2"></path>
                        <path d="M19 11h2m-1 -1v2"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M10 13a5 5 0 0 1 7.54.54l3-3a5 5 0 0 1-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 1-7.54-.54l-3 3a5 5 0 0 1 7.07 7.07l1.71-1.71"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <line x1="9" y1="21" x2="9" y2="9"></line>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                        <path d="M12 9v4"></path>
                        <path d="M12 17h.01"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m15 9-6 6"></path>
                        <path d="m9 9 6 6"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-cream"
                      >
                        <path d="M21 2H3v16h5v4l4-4h5l4-4V2zM7 7h.01M12 7h.01M17 7h.01"></path>
                      </svg>
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
                onClick={() => setStep(answers.skippedChallengeStep ? 2 : 3)}
                className="mr-2 text-primary-coral"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-semibold text-primary-coral">
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
                          {option.price && (
                            <div className="text-right">
                              <span className="text-sm font-medium">
                                {option.price}€{' '}
                                {option.priceDetails && (
                                  <span>({option.priceDetails})</span>
                                )}
                              </span>
                            </div>
                          )}
                          {!option.price && option.priceDetails && (
                            <div className="text-right whitespace-pre-line">
                              <span className="text-sm font-medium">
                                {option.priceDetails}
                              </span>
                            </div>
                          )}
                          {!option.price && !option.priceDetails && (
                            <div className="text-right">
                              <span className="text-sm font-medium">
                                Tarif sur demande
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Session length section */}
                        {option.sessionLength && (
                          <div className="mt-3 pt-3 border-t border-primary-cream/20">
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-primary-coral"
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              <p className="text-sm text-primary-cream/90">
                                {option.sessionLength}
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
                                      {formula.title}: {formula.price}€
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
              <p className="mb-2 font-medium text-primary-coral">
                Votre voyage commence ici. Prêt(e) à embarquer ?
              </p>
              <p className="text-primary-cream/90">
                Un itinéraire peut être suivi pas à pas ou construit librement.
                Chaque chemin est là pour vous aider à mieux vous comprendre,
                choisir, aimer, et vous sentir plus libre dans vos relations.
              </p>
              <div className="mt-4">
                <Link href="/rendez-vous" className="inline-flex items-center px-6 py-3 bg-primary-coral text-white rounded-lg hover:bg-primary-rust transition-all">
                  Réserver une séance gratuite de 20min
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center">
              <span
                onClick={() => setStep(1)}
                className="text-primary-cream cursor-pointer hover:text-primary-coral underline"
              >
                Recommencer le questionnaire
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default TherapyQuestionnaireNew
