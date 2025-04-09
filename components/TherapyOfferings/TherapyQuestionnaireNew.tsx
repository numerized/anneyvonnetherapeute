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
  price?: number
  priceDetails?: string
  hasFormulas?: boolean
  formulas?: any[]
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
      ...therapyOfferings.therapyTypes.map((therapy: any) => {
        // Extract price and priceDetails based on the structure
        let price: number | undefined;
        let priceDetails: string | undefined;
        let hasFormulas = false;
        let formulas: any[] = [];
        
        // Special case for VIT therapy
        if (therapy.id === 'vit-a-la-carte' && therapy.pricing) {
          hasFormulas = false; // Not formula-based
          if (therapy.pricing.individual && therapy.pricing.couple) {
            price = undefined; // Don't show a main price
            priceDetails = `individuel: ${therapy.pricing.individual}€ par séance\ncouple: ${therapy.pricing.couple}€ par séance`;
          } else if (therapy.pricing.individual) {
            price = therapy.pricing.individual;
            priceDetails = "par séance (individuel)";
          } else if (therapy.pricing.couple) {
            price = therapy.pricing.couple;
            priceDetails = "par séance (couple)";
          }
        } else if (therapy.formulas && Array.isArray(therapy.formulas) && therapy.formulas.length > 0) {
          // Store formulas information
          hasFormulas = true;
          formulas = therapy.formulas;
          
          // Use the first formula's price as the main price display
          price = therapy.formulas[0].price;
          priceDetails = "plusieurs formules disponibles";
        } else if (therapy.mainOffering && therapy.mainOffering.formulas && 
                  Array.isArray(therapy.mainOffering.formulas) && therapy.mainOffering.formulas.length > 0) {
          // Handle case where formulas are inside mainOffering
          hasFormulas = true;
          formulas = therapy.mainOffering.formulas;
          
          // Use the first formula's price as the main price display
          price = therapy.mainOffering.formulas[0].price;
          priceDetails = "plusieurs formules disponibles";
        } else if (therapy.pricing && typeof therapy.pricing === 'object') {
          // Handle case where pricing is an object with couple/individual properties
          if (therapy.pricing.couple) {
            price = therapy.pricing.couple;
            priceDetails = "pour couple";
          } else if (therapy.pricing.individual) {
            price = therapy.pricing.individual;
            priceDetails = "pour individuel";
          }
        } else if (therapy.mainOffering && therapy.mainOffering.price) {
          // Handle case where price is in mainOffering
          price = therapy.mainOffering.price;
          priceDetails = therapy.mainOffering.note;
        } else if (therapy.price) {
          // Direct price property
          price = therapy.price;
          priceDetails = therapy.priceDetails;
        }
        
        return {
          title: therapy.title,
          description: therapy.description || '',
          type: therapy.id as any,
          therapyId: therapy.id,
          offeringType: 'therapy' as const,
          price,
          priceDetails,
          hasFormulas,
          formulas
        };
      }),
      ...coachingOfferings.coachingTypes.map((coaching: any) => {
        // Extract price and priceDetails
        let price: number | undefined;
        let priceDetails: string | undefined;
        
        if (coaching.price) {
          price = coaching.price;
        } else if (coaching.mainOffering && coaching.mainOffering.price) {
          // Get price from mainOffering
          price = coaching.mainOffering.price;
          
          if (coaching.mainOffering.details && coaching.mainOffering.details.duration) {
            priceDetails = coaching.mainOffering.details.duration;
          }
        }
        
        return {
          title: coaching.title,
          description: coaching.description || '',
          type: coaching.id as any,
          therapyId: coaching.id,
          offeringType: 'coaching' as const,
          price,
          priceDetails
        };
      }),
    ]
    
    // Filter out NEURO TRIBU offerings but keep VIT for later
    const filteredOfferings = allOfferings.filter(o => 
      !o.therapyId.includes('neuro')
    )
    
    // Separate VIT offerings for later use
    const vitOffering = allOfferings.find(o => o.therapyId.includes('vit-a-la-carte'))
    
    // If vitOffering exists but doesn't have price info, add it
    if (vitOffering && !vitOffering.price) {
      const rawVitOffering = therapyOfferings.therapyTypes.find((t: any) => t.id === 'vit-a-la-carte');
      if (rawVitOffering && rawVitOffering.mainOffering && rawVitOffering.mainOffering.price) {
        vitOffering.price = rawVitOffering.mainOffering.price;
        vitOffering.priceDetails = rawVitOffering.mainOffering.note || 'par séance';
      } else if (rawVitOffering && rawVitOffering.pricing) {
        // Use individual price by default
        vitOffering.price = rawVitOffering.pricing.individual || rawVitOffering.pricing.couple;
        vitOffering.priceDetails = 'par séance';
      }
    }
    
    // Helper function to find an offering by its ID
    const findOffering = (id: string): TherapyOption | undefined => {
      // Get the offering from the filtered list
      const offering = filteredOfferings.find(o => o.therapyId === id);
      
      if (!offering) return undefined;
      
      // For THÉRAPIE RELATIONNELLE INDIVIDUELLE specifically, ensure formulas are included
      if (id === 'individual') {
        // Find the original data with complete formulas
        const rawOffering = therapyOfferings.therapyTypes.find((t: any) => t.id === 'individual');
        if (rawOffering && rawOffering.mainOffering && rawOffering.mainOffering.formulas && 
            Array.isArray(rawOffering.mainOffering.formulas)) {
          offering.hasFormulas = true;
          offering.formulas = rawOffering.mainOffering.formulas;
          if (!offering.price && rawOffering.mainOffering.formulas.length > 0) {
            offering.price = rawOffering.mainOffering.formulas[0].price;
            offering.priceDetails = "plusieurs formules disponibles";
          }
        }
      }
      
      return offering;
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
          findOffering('communication-conflicts') || filteredOfferings[0],
          findOffering('expectations-disappointments') || filteredOfferings[0]
        ].filter(Boolean).slice(0, 3)
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
          findOffering('individual') || filteredOfferings[0],
          findOffering('expectations-disappointments') || filteredOfferings[0]
        ].filter(Boolean).slice(0, 3)
        break
        
      case 'C2': // En questionnement > Décision
        recommendations = [
          findOffering('doubts-decision') || filteredOfferings[0],
          findOffering('couple') || filteredOfferings[0],
          findOffering('individual') || filteredOfferings[0]
        ].filter(Boolean).slice(0, 3)
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
    
    // Ensure we have at least 2 recommendations
    if (recommendations.length < 2) {
      // Add more recommendations from the filtered offerings if needed
      const additionalRecommendations = filteredOfferings
        .filter(o => !recommendations.some(r => r.therapyId === o.therapyId))
        .slice(0, 2 - recommendations.length)
      
      recommendations.push(...additionalRecommendations)
    }
    
    // Add VIT offering if not already in recommendations
    if (vitOffering && !recommendations.some(r => r.therapyId.includes('vit'))) {
      recommendations.push(vitOffering)
    }
    
    // Ensure we don't have more than 3 recommendations
    if (recommendations.length > 3) {
      recommendations = recommendations.slice(0, 3)
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
            Répondez à deux questions simples pour découvrir nos recommandations personnalisées
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-cream">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <h4 className="font-medium">Je suis célibataire et je veux mieux comprendre mon rapport aux relations.</h4>
              </button>

              <button
                onClick={() => handleSituationSelect('B')}
                className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-cream">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </span>
                <h4 className="font-medium">Je suis en couple et je souhaite améliorer notre relation.</h4>
              </button>

              <button
                onClick={() => handleSituationSelect('C')}
                className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-cream">
                    <path d="M9 18l6-6-6-6"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </span>
                <h4 className="font-medium">Je me questionne sur l'avenir de ma relation.</h4>
              </button>

              <button
                onClick={() => handleSituationSelect('D')}
                className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-cream">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </span>
                <h4 className="font-medium">Je viens de vivre une rupture et je veux avancer.</h4>
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Current Priority */}
        {step === 2 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <button onClick={() => setStep(1)} className="mr-2 text-primary-coral">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-semibold text-primary-cream">
                {answers.situation === 'A' 
                  ? "Quel est votre objectif principal ?" 
                  : answers.situation === 'B'
                    ? "Quelle est votre priorité de couple ?"
                    : answers.situation === 'C'
                      ? "Quelle est votre préoccupation ?"
                      : "Comment souhaitez-vous avancer ?"}
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-cream">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </span>
                    <h4 className="font-medium">Comprendre pourquoi je répète toujours les mêmes schémas.</h4>
                  </button>
                  <button
                    onClick={() => handlePrioritySelect('A2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-cream">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    </span>
                    <h4 className="font-medium">Mieux cerner mes désirs et mes attentes pour orienter mes choix relationnels.</h4>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-cream">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </span>
                    <h4 className="font-medium">Améliorer la communication et éviter les incompréhensions.</h4>
                  </button>
                  <button
                    onClick={() => handlePrioritySelect('B2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-cream">
                        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"></path>
                        <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2"></path>
                        <path d="M19 11h2m-1 -1v2"></path>
                      </svg>
                    </span>
                    <h4 className="font-medium">Raviver le désir et retrouver une connexion plus profonde.</h4>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-cream">
                        <path d="M9 18l6-6-6-6"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    </span>
                    <h4 className="font-medium">Évaluer si ma relation est encore alignée avec mes aspirations.</h4>
                  </button>
                  <button
                    onClick={() => handlePrioritySelect('C2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-cream">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                    </span>
                    <h4 className="font-medium">Prendre une décision réfléchie sur l'avenir du couple.</h4>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-cream">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                      </svg>
                    </span>
                    <h4 className="font-medium">Apprendre à mieux me connaître et à m'accepter.</h4>
                  </button>
                  <button
                    onClick={() => handlePrioritySelect('D2')}
                    className="w-full text-left p-5 bg-primary-forest/30 hover:bg-primary-forest/40 transition-all rounded-lg flex items-center"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-forest/50 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-cream">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5"></path>
                      </svg>
                    </span>
                    <h4 className="font-medium">Développer mes capacités relationnelles et ma confiance.</h4>
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
              <h3 className="text-xl font-semibold text-primary-coral">ÉTAPE 3 : Quel est votre principal défi ?</h3>
            </div>
            
            <div className="space-y-4">
              {answers.priority === 'A1' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('A1.1')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">J'ai du mal à identifier ce qui influence mes choix relationnels.</h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('A1.2')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">Je ressens un blocage émotionnel qui m'empêche d'avancer sereinement.</h4>
                  </button>
                </>
              )}
              
              {answers.priority === 'A2' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('A2.1')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">J'ai du mal à exprimer mes attentes dans une relation.</h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('A2.2')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">J'ai peur de m'engager et de faire les mauvais choix.</h4>
                  </button>
                </>
              )}
              
              {answers.priority === 'B1' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('B1.1')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">Nos discussions tournent souvent en conflit.</h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('B1.2')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">J'aimerais mieux comprendre les besoins de mon/ma partenaire.</h4>
                  </button>
                </>
              )}
              
              {answers.priority === 'B2' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('B2.1')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">La routine a pris le dessus sur notre relation.</h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('B2.2')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">Il y a un déséquilibre dans nos attentes affectives et sexuelles.</h4>
                  </button>
                </>
              )}
              
              {answers.priority === 'C1' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('C1.1')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">Je ressens une distance émotionnelle avec mon/ma partenaire.</h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('C1.2')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">J'ai peur de me tromper et de regretter ma décision.</h4>
                  </button>
                </>
              )}
              
              {answers.priority === 'C2' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('C2.1')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">Je veux clarifier mes sentiments et ceux de mon/ma partenaire.</h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('C2.2')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">J'ai besoin d'un espace neutre pour poser les choses sereinement.</h4>
                  </button>
                </>
              )}
              
              {answers.priority === 'D1' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('D1.1')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">J'ai du mal à tourner la page émotionnellement.</h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('D1.2')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">Je ressens une peur de reproduire les mêmes erreurs.</h4>
                  </button>
                </>
              )}
              
              {answers.priority === 'D2' && (
                <>
                  <button
                    onClick={() => handleChallengeSelect('D2.1')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">Je veux retrouver confiance en moi et en l'amour.</h4>
                  </button>
                  <button
                    onClick={() => handleChallengeSelect('D2.2')}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary-coral hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium">J'aimerais être accompagné(e) pour redéfinir ma manière d'aimer.</h4>
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
              <h3 className="text-xl font-semibold text-primary-coral">Votre itinéraire personnalisé</h3>
            </div>
            
            {/* Intention section */}
            <div className="bg-primary-forest/30 backdrop-blur-sm p-6 rounded-[24px] mb-8">
              <h4 className="font-semibold text-lg mb-3 text-primary-coral">Votre intention profonde :</h4>
              <p className="text-primary-cream/90">{getIntentionText()}</p>
            </div>
            
            {/* Recommendations */}
            <h4 className="font-semibold text-lg mb-4 text-primary-coral">Offres recommandées pour vous :</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((option, index) => (
                <div key={index} className="relative overflow-hidden rounded-[32px] bg-primary-forest/30 p-8 hover:bg-primary-forest/40 transition-colors">
                  <div className="space-y-12">
                    <div className="text-right">
                      <span className="inline-block bg-primary-dark text-primary-coral px-3 py-1 rounded-full text-sm mb-3">
                        {option.offeringType === 'therapy' ? 'Thérapie' : 'Coaching'}
                      </span>
                      <h4 className="text-2xl text-primary-coral font-light mb-2">{option.title}</h4>
                    </div>

                    <div className="space-y-6">
                      <p className="text-primary-cream/90">{option.description}</p>

                      <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4">
                        {/* Price section */}
                        <div className="text-primary-cream/90">
                          {option.price && (
                            <div className="text-right">
                              <span className="text-sm font-medium">
                                {option.price}€ {option.priceDetails && <span>({option.priceDetails})</span>}
                              </span>
                            </div>
                          )}
                          {!option.price && option.priceDetails && (
                            <div className="text-right whitespace-pre-line">
                              <span className="text-sm font-medium">{option.priceDetails}</span>
                            </div>
                          )}
                          {!option.price && !option.priceDetails && (
                            <div className="text-right">
                              <span className="text-sm font-medium">Tarif sur demande</span>
                            </div>
                          )}
                        </div>

                        {/* Formulas section */}
                        {option.hasFormulas && option.formulas && option.formulas.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-primary-cream/20">
                            <p className="text-primary-cream/90 mb-2">
                              <strong>Formules disponibles</strong>
                            </p>
                            <div className="space-y-2">
                              {option.formulas.map((formula, idx) => (
                                <div key={idx} className="text-sm text-primary-cream/80 flex items-center gap-2">
                                  <span className="text-primary-coral">♦</span>
                                  <span>
                                    {formula.title}: {formula.price}€
                                    {formula.duration && <span> ({formula.duration})</span>}
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
              <p className="mb-2 font-medium text-primary-coral">Votre voyage commence ici. Prêt(e) à embarquer ?</p>
              <p className="text-primary-cream/90">Un itinéraire peut être suivi pas à pas ou construit librement. Chaque chemin est là pour vous aider à mieux vous comprendre, choisir, aimer, et vous sentir plus libre dans vos relations.</p>
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
    </section>
  )
}

export default TherapyQuestionnaireNew
