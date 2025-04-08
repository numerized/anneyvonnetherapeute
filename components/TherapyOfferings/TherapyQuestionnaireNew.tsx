'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { getTherapyOfferings, getCoachingOfferings } from '@/data/therapyOfferings/utils'

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

// Define offerings that are specifically for couples
const coupleSpecificOfferings = ['couple', 'checkup', 'decision', 'vit-a-la-carte']

// This function gets matching offerings based on the keywords and situation.
// It intelligently scores and filters offerings to provide the most relevant matches.
const getMatchingOfferingsOptions = (keywords: string[], situation: string = '', maxResults: number = 2): TherapyOption[] => {
  const therapyOfferings = getTherapyOfferings()
  const coachingOfferings = getCoachingOfferings()

  // Define offerings that are specifically for individuals
  const individualSpecificOfferings = ['individual', 'new-relationship']

  // First, collect all offerings into a uniform format
  const allOfferings: TherapyOption[] = [
    ...therapyOfferings.therapyTypes.map((therapy) => ({
      title: therapy.title,
      description: therapy.description || '',
      type: therapy.id as any,
      therapyId: therapy.id,
      offeringType: 'therapy' as const,
    })),
    ...coachingOfferings.coachingTypes.map((coaching) => ({
      title: coaching.title,
      description: coaching.description || '',
      type: coaching.id as any,
      therapyId: coaching.id,
      offeringType: 'coaching' as const,
    })),
  ]

  // Create a copy of the array to avoid mutation
  const scoredOfferings = [...allOfferings]

  // Score each offering based on keyword match
  scoredOfferings.forEach((offering) => {
    let score = 0
    const titleLower = offering.title.toLowerCase()
    const descLower = offering.description.toLowerCase()

    // Check if the offering is appropriate for the situation
    if (situation === 'individual' && coupleSpecificOfferings.includes(offering.therapyId)) {
      // Heavily penalize couple-specific offerings for individuals
      score -= 100
    } else if (situation === 'couple' && individualSpecificOfferings.includes(offering.therapyId)) {
      // Penalize individual-specific offerings for couples
      score -= 50
    }

    // Additional text-based checks for situation
    if (situation === 'individual') {
      // Penalize offerings that mention couples or relationships in their title
      if (
        titleLower.includes('couple') ||
        titleLower.includes('relation') ||
        titleLower.includes('partenaire')
      ) {
        score -= 30
      }
    }

    // Score based on keyword matches
    keywords.forEach((keyword) => {
      const keywordLower = keyword.toLowerCase()
      
      // Check title for keyword
      if (titleLower.includes(keywordLower)) {
        score += 5
      }
      
      // Check description for keyword
      if (descLower.includes(keywordLower)) {
        score += 3
      }
    })

    // Add the score to the offering
    offering['score'] = score
  })

  // Sort by score (highest first)
  scoredOfferings.sort((a, b) => b['score'] - a['score'])

  // Filter out negatively scored offerings
  const positiveOfferings = scoredOfferings.filter(offering => offering['score'] > -10)

  // Return the top results, with a default maximum
  return positiveOfferings.slice(0, maxResults)
}

const TherapyQuestionnaireNew = () => {
  // State for current step and answers
  const [step, setStep] = useState<number>(1)
  const [answers, setAnswers] = useState<{
    situation: string
    priority: string
    challenge: string
    intention: string
  }>({
    situation: '',
    priority: '',
    challenge: '',
    intention: ''
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
    setStep(3)
  }
  
  // Handler for challenge selection
  const handleChallengeSelect = (challenge: string) => {
    setAnswers({ ...answers, challenge })
    generateRecommendations(answers.situation, answers.priority, challenge)
    setStep(4)
  }

  // Generate recommendations based on user selections
  const generateRecommendations = (situation: string, priority: string, challenge: string) => {
    // Fetch all available offerings
    const therapyOfferings = getTherapyOfferings()
    const coachingOfferings = getCoachingOfferings()

    // Combine all offerings for easier selection
    const allOfferings: TherapyOption[] = [
      ...therapyOfferings.therapyTypes.map((therapy) => ({
        title: therapy.title,
        description: therapy.description || '',
        type: therapy.id as any,
        therapyId: therapy.id,
        offeringType: 'therapy' as const,
      })),
      ...coachingOfferings.coachingTypes.map((coaching) => ({
        title: coaching.title,
        description: coaching.description || '',
        type: coaching.id as any,
        therapyId: coaching.id,
        offeringType: 'coaching' as const,
      })),
    ]
    
    // Filter out VIT and NEURO TRIBU offerings
    const filteredOfferings = allOfferings.filter(o => 
      !o.therapyId.includes('vit') && !o.therapyId.includes('neuro')
    )
    
    // Helper function to find an offering by its ID
    const findOffering = (id: string): TherapyOption | undefined => {
      return filteredOfferings.find(o => o.therapyId === id)
    }
    
    // Create an array to hold our final recommendations
    let recommendations: TherapyOption[] = []
    
    // For each path, select the 2 most appropriate existing offerings 
    switch(priority) {
      case 'A1': // Célibataire > Comprendre schémas
        recommendations = [
          findOffering('individual') || filteredOfferings[0],
          findOffering('new-relationship') || filteredOfferings[0]
        ].filter(Boolean).slice(0, 2)
        break
        
      case 'A2': // Célibataire > Aligner désirs/choix
        recommendations = [
          findOffering('new-relationship') || filteredOfferings[0],
          findOffering('individual') || filteredOfferings[0]
        ].filter(Boolean).slice(0, 2)
        break
        
      case 'B1': // En couple > Communication
        recommendations = [
          findOffering('couple') || filteredOfferings[0],
          findOffering('communication-conflicts') || filteredOfferings[0] 
        ].filter(Boolean).slice(0, 2)
        break
        
      case 'B2': // En couple > Désir
        recommendations = [
          findOffering('desire-exploration') || filteredOfferings[0],
          findOffering('couple') || filteredOfferings[0]
        ].filter(Boolean).slice(0, 2)
        break
        
      case 'C1': // En questionnement > Évaluation
        recommendations = [
          findOffering('couple-checkup') || filteredOfferings[0],
          findOffering('individual') || filteredOfferings[0]
        ].filter(Boolean).slice(0, 2)
        break
        
      case 'C2': // En questionnement > Décision
        // Since there's no direct 'decision' offering, we'll use related ones
        recommendations = [
          findOffering('couple') || filteredOfferings[0],
          findOffering('individual') || filteredOfferings[0]
        ].filter(Boolean).slice(0, 2)
        break
        
      case 'D1': // Rupture > Comprendre
        recommendations = [
          findOffering('individual') || filteredOfferings[0],
          findOffering('new-relationship') || filteredOfferings[0]
        ].filter(Boolean).slice(0, 2)
        break
        
      case 'D2': // Rupture > Reconstruction
        recommendations = [
          findOffering('new-relationship') || filteredOfferings[0],
          findOffering('individual') || filteredOfferings[0]
        ].filter(Boolean).slice(0, 2)
        break
        
      default:
        // Fallback to algorithm-based recommendations if no specific case matched
        let keywords: string[] = []
        
        if (situation === 'A') keywords.push('individuel', 'personnel')
        else if (situation === 'B') keywords.push('couple', 'communication')
        else if (situation === 'C') keywords.push('decision', 'bilan')
        else if (situation === 'D') keywords.push('rupture', 'reconstruction')
        
        recommendations = getMatchingOfferingsOptions(keywords, 
          situation === 'A' || situation === 'D' ? 'individual' : 'couple', 2)
    }
    
    // Ensure we have exactly 2 recommendations
    if (recommendations.length < 2) {
      // Add more recommendations from the filtered offerings if needed
      const additionalRecommendations = filteredOfferings
        .filter(o => !recommendations.some(r => r.therapyId === o.therapyId))
        .slice(0, 2 - recommendations.length)
      
      recommendations.push(...additionalRecommendations)
    }
    
    // Ensure we don't have more than 2 recommendations
    if (recommendations.length > 2) {
      recommendations = recommendations.slice(0, 2)
    }
    
    setRecommendations(recommendations)
  }

  // Get appropriate intention text based on priority and challenge
  const getIntentionText = () => {
    if (answers.priority === 'A1') {
      return "Explorer mon passé affectif pour mieux comprendre mes schémas. Apprendre à sortir de la répétition et à faire des choix conscients."
    } else if (answers.priority === 'A2') {
      return "Clarifier mes attentes pour construire une relation plus alignée avec moi-même. Dépasser mes blocages et m'ouvrir à des relations épanouissantes."
    } else if (answers.priority === 'B1') {
      return "Apprendre à communiquer de manière plus fluide et constructive. Mieux comprendre mon/ma partenaire pour renforcer notre relation."
    } else if (answers.priority === 'B2') {
      return "Retrouver du désir et de la spontanéité dans mon couple. Explorer de nouvelles manières de nourrir l'intimité."
    } else if (answers.priority === 'C1') {
      return "Faire le point sur mon couple et mes attentes sans précipitation. Comprendre les dynamiques profondes de ma relation."
    } else if (answers.priority === 'C2') {
      return "Être accompagné(e) dans une prise de décision sereine. Clarifier mes doutes et choisir la direction la plus juste pour moi."
    } else if (answers.priority === 'D1') {
      return "Donner du sens à ma rupture et éviter de reproduire les mêmes schémas. Transformer cette étape en un apprentissage pour l'avenir."
    } else if (answers.priority === 'D2') {
      return "Retrouver une stabilité émotionnelle et reconstruire ma confiance. Me préparer à une nouvelle histoire d'amour plus consciente."
    } else {
      return ""
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Trouvez votre itinéraire intérieur</h2>
      <p className="text-center mb-8">Un questionnaire en 5 étapes pour découvrir l'accompagnement qui vous correspond : coaching (voyage intérieur) ou thérapie (exploration profonde).</p>
      
      {/* Progress indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`w-1/4 h-1 ${
              s <= step ? 'bg-primary-coral' : 'bg-gray-200'
            } transition-all duration-300`}
          ></div>
        ))}
      </div>
      
      {/* Step 1: Current Situation */}
      {step === 1 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">ÉTAPE 1 : Où en êtes-vous actuellement ?</h3>
          <div className="space-y-4">
            <button
              onClick={() => handleSituationSelect('A')}
              className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
            >
              <h4 className="font-medium">A. Je suis célibataire et je veux mieux comprendre mon rapport aux relations.</h4>
            </button>
            <button
              onClick={() => handleSituationSelect('B')}
              className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
            >
              <h4 className="font-medium">B. Je suis en couple et je souhaite améliorer notre relation.</h4>
            </button>
            <button
              onClick={() => handleSituationSelect('C')}
              className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
            >
              <h4 className="font-medium">C. Je me questionne sur l'avenir de ma relation.</h4>
            </button>
            <button
              onClick={() => handleSituationSelect('D')}
              className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
            >
              <h4 className="font-medium">D. Je viens de vivre une rupture et je veux avancer.</h4>
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Current Priority */}
      {step === 2 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button onClick={() => setStep(1)} className="mr-2 text-primary-coral">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold">ÉTAPE 2 : Quelle est votre priorité actuelle ?</h3>
          </div>
          
          <div className="space-y-4">
            {answers.situation === 'A' && (
              <>
                <button
                  onClick={() => handlePrioritySelect('A1')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">A1. Comprendre pourquoi je répète toujours les mêmes schémas.</h4>
                </button>
                <button
                  onClick={() => handlePrioritySelect('A2')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">A2. Mieux cerner mes désirs et mes attentes pour orienter mes choix relationnels.</h4>
                </button>
              </>
            )}
            
            {answers.situation === 'B' && (
              <>
                <button
                  onClick={() => handlePrioritySelect('B1')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">B1. Améliorer la communication et éviter les incompréhensions.</h4>
                </button>
                <button
                  onClick={() => handlePrioritySelect('B2')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">B2. Raviver le désir et retrouver une connexion plus profonde.</h4>
                </button>
              </>
            )}
            
            {answers.situation === 'C' && (
              <>
                <button
                  onClick={() => handlePrioritySelect('C1')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">C1. Évaluer si ma relation est encore alignée avec mes aspirations.</h4>
                </button>
                <button
                  onClick={() => handlePrioritySelect('C2')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">C2. Prendre une décision réfléchie sur l'avenir du couple.</h4>
                </button>
              </>
            )}
            
            {answers.situation === 'D' && (
              <>
                <button
                  onClick={() => handlePrioritySelect('D1')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">D1. Mieux comprendre cette rupture et ce qu'elle révèle sur moi.</h4>
                </button>
                <button
                  onClick={() => handlePrioritySelect('D2')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">D2. Me reconstruire et envisager une nouvelle dynamique amoureuse.</h4>
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Step 3: Main Challenge */}
      {step === 3 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button onClick={() => setStep(2)} className="mr-2 text-primary-coral">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold">ÉTAPE 3 : Quel est votre principal défi ?</h3>
          </div>
          
          <div className="space-y-4">
            {answers.priority === 'A1' && (
              <>
                <button
                  onClick={() => handleChallengeSelect('A1.1')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">A1.1 J'ai du mal à identifier ce qui influence mes choix relationnels.</h4>
                </button>
                <button
                  onClick={() => handleChallengeSelect('A1.2')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">A1.2 Je ressens un blocage émotionnel qui m'empêche d'avancer sereinement.</h4>
                </button>
              </>
            )}
            
            {answers.priority === 'A2' && (
              <>
                <button
                  onClick={() => handleChallengeSelect('A2.1')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">A2.1 J'ai du mal à exprimer mes attentes dans une relation.</h4>
                </button>
                <button
                  onClick={() => handleChallengeSelect('A2.2')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">A2.2 J'ai peur de m'engager et de faire les mauvais choix.</h4>
                </button>
              </>
            )}
            
            {answers.priority === 'B1' && (
              <>
                <button
                  onClick={() => handleChallengeSelect('B1.1')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">B1.1 Nos discussions tournent souvent en conflit.</h4>
                </button>
                <button
                  onClick={() => handleChallengeSelect('B1.2')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">B1.2 J'aimerais mieux comprendre les besoins de mon/ma partenaire.</h4>
                </button>
              </>
            )}
            
            {answers.priority === 'B2' && (
              <>
                <button
                  onClick={() => handleChallengeSelect('B2.1')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">B2.1 La routine a pris le dessus sur notre relation.</h4>
                </button>
                <button
                  onClick={() => handleChallengeSelect('B2.2')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">B2.2 Il y a un déséquilibre dans nos attentes affectives et sexuelles.</h4>
                </button>
              </>
            )}
            
            {answers.priority === 'C1' && (
              <>
                <button
                  onClick={() => handleChallengeSelect('C1.1')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">C1.1 Je ressens une distance émotionnelle avec mon/ma partenaire.</h4>
                </button>
                <button
                  onClick={() => handleChallengeSelect('C1.2')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">C1.2 J'ai peur de me tromper et de regretter ma décision.</h4>
                </button>
              </>
            )}
            
            {answers.priority === 'C2' && (
              <>
                <button
                  onClick={() => handleChallengeSelect('C2.1')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">C2.1 Je veux clarifier mes sentiments et ceux de mon/ma partenaire.</h4>
                </button>
                <button
                  onClick={() => handleChallengeSelect('C2.2')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">C2.2 J'ai besoin d'un espace neutre pour poser les choses sereinement.</h4>
                </button>
              </>
            )}
            
            {answers.priority === 'D1' && (
              <>
                <button
                  onClick={() => handleChallengeSelect('D1.1')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">D1.1 J'ai du mal à tourner la page émotionnellement.</h4>
                </button>
                <button
                  onClick={() => handleChallengeSelect('D1.2')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">D1.2 Je ressens une peur de reproduire les mêmes erreurs.</h4>
                </button>
              </>
            )}
            
            {answers.priority === 'D2' && (
              <>
                <button
                  onClick={() => handleChallengeSelect('D2.1')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">D2.1 Je veux retrouver confiance en moi et en l'amour.</h4>
                </button>
                <button
                  onClick={() => handleChallengeSelect('D2.2')}
                  className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                >
                  <h4 className="font-medium">D2.2 J'aimerais être accompagné(e) pour redéfinir ma manière d'aimer.</h4>
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
            <button onClick={() => setStep(3)} className="mr-2 text-primary-coral">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold">Votre itinéraire personnalisé</h3>
          </div>
          
          {/* Intention section */}
          <div className="bg-primary-cream p-6 rounded-lg mb-8 border border-primary-coral">
            <h4 className="font-semibold text-lg mb-3">Votre intention profonde :</h4>
            <p className="text-gray-700">{getIntentionText()}</p>
          </div>
          
          {/* Recommendations */}
          <h4 className="font-semibold text-lg mb-4">Offres recommandées pour vous :</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((option, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-all">
                <h4 className="font-bold text-lg mb-2 text-primary-coral">{option.title}</h4>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <span className="inline-block bg-primary-cream text-primary-coral px-3 py-1 rounded-full text-sm">
                  {option.offeringType === 'therapy' ? 'Thérapie' : 'Coaching'}
                </span>
                <div className="mt-4">
                  <Link
                    href={`/therapy-offerings/${option.therapyId}`}
                    className="flex items-center text-primary-coral hover:text-primary-rust"
                  >
                    <span className="mr-1">En savoir plus</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-primary-coral text-white rounded-lg hover:bg-primary-rust transition-all"
            >
              Recommencer le questionnaire
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TherapyQuestionnaireNew
