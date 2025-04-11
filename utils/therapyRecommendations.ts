import {
  getTherapyOfferings,
  getCoachingOfferings,
} from '@/data/therapyOfferings/utils'

// Define type for TherapyOption to match the one in the component
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

// This function gets matching offerings based on the keywords and situation.
// It intelligently scores and filters offerings to provide the most relevant matches.
export const getMatchingOfferingsOptions = (
  keywords: string[],
  situation: string = '',
  maxResults: number = 2,
): TherapyOption[] => {
  const allOfferings = [
    ...prepareTherapyOfferings(),
    ...prepareCoachingOfferings(),
  ]

  // Filter offerings by keywords
  let filteredOfferings = allOfferings.filter((offering) => {
    // For specific situations, filter by type
    if (
      situation === 'couple' &&
      !coupleSpecificOfferings.includes(offering.type)
    ) {
      return false
    } else if (
      situation === 'individual' &&
      coupleSpecificOfferings.includes(offering.type)
    ) {
      return false
    }

    // Simple keyword matching in title and description
    const offeringText =
      `${offering.title} ${offering.description}`.toLowerCase()
    return keywords.some((keyword) =>
      offeringText.includes(keyword.toLowerCase()),
    )
  })

  // Sort by relevance
  filteredOfferings.sort((a, b) => {
    const aText = `${a.title} ${a.description}`.toLowerCase()
    const bText = `${b.title} ${b.description}`.toLowerCase()

    // Count matching keywords
    const aMatches = keywords.filter((keyword) =>
      aText.includes(keyword.toLowerCase()),
    ).length
    const bMatches = keywords.filter((keyword) =>
      bText.includes(keyword.toLowerCase()),
    ).length

    return bMatches - aMatches
  })

  return filteredOfferings.slice(0, maxResults)
}

export const prepareTherapyOfferings = (): TherapyOption[] => {
  const therapyOfferings = getTherapyOfferings()

  return therapyOfferings.therapyTypes.map((therapy: any) => {
    // Extract price and priceDetails based on the structure
    let price: number | undefined
    let priceDetails: string | undefined
    let sessionLength: string | undefined
    let hasFormulas = false
    let formulas: any[] = []

    // HARMONIZED APPROACH: Check for formulas first (preferred structure)
    if (therapy.mainOffering?.formulas?.length > 0) {
      // Store formulas information
      hasFormulas = true
      formulas = therapy.mainOffering.formulas

      // Use the first formula's price as the main price display
      const firstFormula = therapy.mainOffering.formulas[0]
      price = firstFormula.price

      // Extract session length directly if available in formula
      if (firstFormula.sessionLength) {
        sessionLength = firstFormula.sessionLength
      }
      // Otherwise try to extract from duration string (e.g., "1 mois - 4 x 60'")
      else if (firstFormula.duration && firstFormula.duration.includes('x')) {
        const parts = firstFormula.duration.split(' x ')
        if (parts.length > 1) {
          sessionLength = parts[1]
        }
      }

      // Set price details
      if (formulas.length > 1) {
        priceDetails = 'plusieurs formules disponibles'
      } else if (firstFormula.priceDetails) {
        priceDetails = firstFormula.priceDetails
      }
    }
    // LEGACY APPROACH: Special case for VIT therapy
    else if (therapy.id === 'vit-a-la-carte' && therapy.pricing) {
      hasFormulas = false // Not formula-based
      if (therapy.pricing.individual && therapy.pricing.couple) {
        price = undefined // Don't show a main price
        priceDetails = `individuel: ${therapy.pricing.individual}€ par séance\ncouple: ${therapy.pricing.couple}€ par séance`
      } else if (therapy.pricing.individual) {
        price = therapy.pricing.individual
        priceDetails = 'par séance (individuel)'
      } else if (therapy.pricing.couple) {
        price = therapy.pricing.couple
        priceDetails = 'par séance (couple)'
      }
    }
    // LEGACY APPROACH: Other pricing structures
    else if (therapy.mainOffering && therapy.mainOffering.price) {
      price = therapy.mainOffering.price
      priceDetails = therapy.mainOffering.note
    } else if (therapy.price) {
      price = therapy.price
      priceDetails = therapy.priceDetails
    }

    return {
      title: therapy.title,
      description: therapy.description || '',
      type: therapy.id as any,
      therapyId: therapy.id,
      offeringType: 'therapy' as const,
      price,
      priceDetails,
      sessionLength,
      hasFormulas,
      formulas,
    }
  })
}

export const prepareCoachingOfferings = (): TherapyOption[] => {
  const coachingOfferings = getCoachingOfferings()

  return coachingOfferings.coachingTypes.map((coaching: any) => {
    // Extract price and priceDetails
    let price: number | undefined
    let priceDetails: string | undefined
    let sessionLength: string | undefined
    let hasFormulas = false
    let formulas: any[] = []

    // HARMONIZED APPROACH: Check for formulas first
    if (coaching.mainOffering?.formulas?.length > 0) {
      // Store formulas information
      hasFormulas = true
      formulas = coaching.mainOffering.formulas
      
      // Use the first formula's price as the main price display
      const firstFormula = coaching.mainOffering.formulas[0]
      price = firstFormula.price

      if (firstFormula.sessionLength) {
        sessionLength = firstFormula.sessionLength
      }

      if (coaching.mainOffering.formulas.length > 1) {
        priceDetails = 'plusieurs formules disponibles'
      } else if (firstFormula.priceDetails) {
        priceDetails = firstFormula.priceDetails
      }
    }
    // LEGACY APPROACH: Handle other pricing structures
    else if (coaching.price) {
      price = coaching.price
    } else if (coaching.mainOffering && coaching.mainOffering.price) {
      price = coaching.mainOffering.price
    }

    return {
      title: coaching.title,
      description: coaching.description || '',
      type: coaching.id as any,
      therapyId: coaching.id,
      offeringType: 'coaching' as const,
      price,
      priceDetails,
      sessionLength,
      hasFormulas,
      formulas,
    }
  })
}

export const generateRecommendedOptions = (
  situation: string,
  priority: string,
  challenge: string,
): TherapyOption[] => {
  // Fetch all available offerings
  const allOfferings = [
    ...prepareTherapyOfferings(),
    ...prepareCoachingOfferings(),
  ]

  // VIT therapy offering - always available as an option
  const vitOffering = allOfferings.find((offering) => offering.type === 'vit')

  // Find a specific offering based on type
  const findOffering = (type: string): TherapyOption | undefined => {
    return allOfferings.find(
      (offering) => offering.type === type || offering.therapyId === type,
    )
  }

  // Filter offers based on user needs
  let keywords: string[] = []

  switch (challenge) {
    case 'C1': // Communication
      keywords = ['communication', 'écoute', 'dialogue', 'expression']
      break
    case 'C2': // Trust
      keywords = ['confiance', 'sécurité', 'lien', 'attachement']
      break
    case 'C3': // Intimacy
      keywords = ['intimité', 'sexualité', 'désir', 'connexion']
      break
    case 'C4': // Future
      keywords = ['avenir', 'projet', 'engagement', 'construction']
      break
    case 'C5': // Understanding
      keywords = ['compréhension', 'empathie', 'patterns', 'observation']
      break
    default:
      keywords = []
  }

  // Filter offerings by situation
  const situationKeyword =
    situation === 'A'
      ? 'célibataire'
      : situation === 'B'
        ? 'couple'
        : situation === 'C'
          ? 'questionnement'
          : 'rupture'
  keywords.push(situationKeyword)

  // Filter offerings based on situation and keywords
  let filteredOfferings = allOfferings.filter((offering) => {
    // For couples, prefer couple-specific offerings
    if (situation === 'B' || situation === 'C') {
      return !offering.type.includes('individual')
    }
    // For singles and post-breakup, avoid couple offerings
    else {
      return !offering.type.includes('couple')
    }
  })

  // Create an array to hold our final recommendations
  let recommendedOptions: TherapyOption[] = []

  // For each path, select the most appropriate existing offerings
  switch (priority) {
    case 'A1': // Célibataire > Mieux comprendre
      recommendedOptions = [
        findOffering('individual') || filteredOfferings[0],
        findOffering('new-relationship') || filteredOfferings[0],
        findOffering('expectations-disappointments') || filteredOfferings[0],
      ]
        .filter(Boolean)
        .slice(0, 4) // Allow up to 4 highly relevant offerings
      break

    case 'A2': // Célibataire > Aligner désirs/choix
      recommendedOptions = [
        findOffering('new-relationship') || filteredOfferings[0],
        findOffering('individual') || filteredOfferings[0],
        findOffering('desire-exploration') || filteredOfferings[0],
      ]
        .filter(Boolean)
        .slice(0, 4) // Allow up to 4 highly relevant offerings
      break

    case 'B1': // En couple > Communication
      recommendedOptions = [
        findOffering('couple') || filteredOfferings[0],
        findOffering('communication-conflicts') || filteredOfferings[0],
        findOffering('expectations-disappointments') || filteredOfferings[0],
      ]
        .filter(Boolean)
        .slice(0, 4) // Allow up to 4 highly relevant offerings
      break

    case 'B2': // En couple > Désir
      if (challenge === 'B2.1') { // La routine a pris le dessus sur notre relation
        recommendedOptions = [
          findOffering('desire-exploration') || filteredOfferings[0],
          findOffering('couple') || filteredOfferings[0],
          findOffering('communication-conflicts') || filteredOfferings[0],
        ]
          .filter(Boolean)
          .slice(0, 4) 
      } else if (challenge === 'B2.2') { // Déséquilibre dans les attentes affectives et sexuelles
        recommendedOptions = [
          findOffering('desire-exploration') || filteredOfferings[0],
          findOffering('couple') || filteredOfferings[0],
          findOffering('expectations-disappointments') || filteredOfferings[0],
        ]
          .filter(Boolean)
          .slice(0, 4)
      } else {
        // Default B2 path if no specific challenge code
        recommendedOptions = [
          findOffering('desire-exploration') || filteredOfferings[0],
          findOffering('couple') || filteredOfferings[0],
          findOffering('expectations-disappointments') || filteredOfferings[0],
          findOffering('communication-conflicts') || filteredOfferings[0],
        ]
          .filter(Boolean)
          .slice(0, 4)
      }
      break

    case 'C1': // En questionnement > Évaluation
      recommendedOptions = [
        findOffering('couple-checkup') || filteredOfferings[0],
        findOffering('individual') || filteredOfferings[0],
        findOffering('expectations-disappointments') || filteredOfferings[0],
      ]
        .filter(Boolean)
        .slice(0, 4) // Allow up to 4 highly relevant offerings
      break

    case 'C2': // En questionnement > Décision
      recommendedOptions = [
        findOffering('doubts-decision') || filteredOfferings[0],
        findOffering('couple') || filteredOfferings[0],
        findOffering('individual') || filteredOfferings[0],
      ]
        .filter(Boolean)
        .slice(0, 4) // Allow up to 4 highly relevant offerings
      break

    case 'D1': // Rupture > Comprendre
      recommendedOptions = [
        findOffering('individual') || filteredOfferings[0],
        findOffering('new-relationship') || filteredOfferings[0],
        findOffering('traverse-unknown-relationship') || filteredOfferings[0],
        findOffering('expectations-disappointments') || filteredOfferings[0],
      ]
        .filter(Boolean)
        .slice(0, 4) // Allow up to 4 highly relevant offerings
      break

    case 'D2': // Rupture > Reconstruction
      recommendedOptions = [
        findOffering('new-relationship') || filteredOfferings[0],
        findOffering('individual') || filteredOfferings[0],
        findOffering('traverse-unknown-relationship') || filteredOfferings[0],
        findOffering('expectations-disappointments') || filteredOfferings[0],
      ]
        .filter(Boolean)
        .slice(0, 4) // Allow up to 4 highly relevant offerings
      break

    default:
      // Fallback: use keyword search based on situation
      if (situation === 'A') keywords.push('célibataire', 'individuel')
      else if (situation === 'B') keywords.push('couple', 'relation')
      else if (situation === 'C') keywords.push('decision', 'bilan')
      else if (situation === 'D') keywords.push('rupture', 'reconstruction')

      recommendedOptions = getMatchingOfferingsOptions(
        keywords,
        situation === 'A' || situation === 'D' ? 'individual' : 'couple',
        4, // Allow up to 4 highly relevant offerings
      )
  }

  // Ensure we have at least 2 recommendations, and try to fill up to 4 when possible
  if (recommendedOptions.length < 4) {
    // Add more recommendations from the filtered offerings if needed
    const additionalRecommendations = filteredOfferings
      .filter(
        (o) => !recommendedOptions.some((r) => r.therapyId === o.therapyId),
      )
      .slice(0, 4 - recommendedOptions.length)

    recommendedOptions.push(...additionalRecommendations)
  }

  // Add VIT offering if not already in recommendations and we have space for it
  if (
    vitOffering &&
    !recommendedOptions.some((r) => r.therapyId.includes('vit')) &&
    recommendedOptions.length < 4 // Only add if we have fewer than 4 offerings
  ) {
    recommendedOptions.push(vitOffering)
  }

  // Ensure we don't have more than 4 recommendations
  if (recommendedOptions.length > 4) {
    recommendedOptions = recommendedOptions.slice(0, 4)
  }

  return recommendedOptions
}

export const getIntentionText = (
  priority: string,
  challenge: string,
): string => {
  // Extract challenge type from combined IDs (e.g., 'A1.1' -> '1')
  const challengeCode = challenge.includes('.')
    ? challenge.split('.')[1]
    : challenge.replace(/[A-Z]/g, '')

  if (priority === 'A1') {
    // Single + Understanding patterns
    if (challengeCode === '1' || challenge === 'C1') {
      return 'Mieux comprendre mes schémas relationnels et les patterns qui se répètent dans mes relations.'
    } else if (challengeCode === '2' || challenge === 'C2') {
      return 'Comprendre pourquoi je ne parviens pas à faire confiance et à m\'engager dans une relation.'
    } else if (challengeCode === '3' || challenge === 'C3') {
      return "Explorer mes blocages autour de l'intimité et retrouver une relation sereine à ma sexualité."
    } else if (challengeCode === '4' || challenge === 'C4') {
      return 'Clarifier mes attentes relationnelles pour préparer une relation future épanouissante.'
    } else if (challengeCode === '5' || challenge === 'C5') {
      return 'Comprendre comment j\'ai contribué aux difficultés dans mes relations passées.'
    }
  } else if (priority === 'A2') {
    // Single + Aligning desires
    if (challengeCode === '1' || challenge === 'A2.1') {
      return 'Apprendre à mieux communiquer mes besoins et mes limites dans mes futures relations.'
    } else if (challengeCode === '2' || challenge === 'A2.2') {
      return 'Développer ma capacité à établir des relations de confiance et sécurisantes.'
    } else if (challengeCode === '3' || challenge === 'C3') {
      return "Explorer mes désirs profonds et créer une relation épanouissante à ma sexualité."
    } else if (challengeCode === '4' || challenge === 'C4') {
      return 'Aligner mes choix relationnels avec mes valeurs et mes aspirations profondes.'
    } else if (challengeCode === '5' || challenge === 'C5') {
      return 'Comprendre ce qui me bloque pour vivre la relation que je désire vraiment.'
    }
  } else if (priority === 'B1') {
    // Couple + Communication
    if (challengeCode === '1' || challenge === 'B1.1') {
      return "Améliorer notre communication et sortir des conflits répétitifs qui nous épuisent."
    } else if (challengeCode === '2' || challenge === 'B1.2') {
      return "Mieux comprendre les besoins de mon/ma partenaire pour restaurer notre connexion."
    } else if (challengeCode === '3' || challenge === 'C3') {
      return "Renouer avec l'intimité et raviver la flamme dans notre relation."
    } else if (challengeCode === '4' || challenge === 'C4') {
      return "Aligner nos visions d'avenir et construire un projet de couple cohérent."
    } else if (challengeCode === '5' || challenge === 'C5') {
      return "Comprendre les dynamiques qui nous séparent et retrouver notre complicité d'avant."
    }
  } else if (priority === 'B2') {
    // Couple + Desire
    if (challengeCode === '1' || challenge === 'B2.1') {
      return "Sortir de la routine qui a pris le dessus sur notre relation et raviver notre connexion."
    } else if (challengeCode === '2' || challenge === 'B2.2') {
      return "Équilibrer nos attentes affectives et sexuelles pour une relation plus harmonieuse."
    } else if (challengeCode === '3' || challenge === 'C3') {
      return "Raviver le désir et retrouver une sexualité épanouissante qui nous connecte."
    } else if (challengeCode === '4' || challenge === 'C4') {
      return "Construire un projet de couple qui nourrit notre complicité et notre intimité."
    } else if (challengeCode === '5' || challenge === 'C5') {
      return "Comprendre ce qui bloque notre épanouissement intime et émotionnel."
    }
  } else if (priority === 'C1') {
    // Questioning + Evaluation
    if (challengeCode === '1' || challenge === 'C1.1') {
      return 'Évaluer la distance émotionnelle dans notre relation et déterminer si elle peut être comblée.'
    } else if (challengeCode === '2' || challenge === 'C1.2') {
      return 'Clarifier mes doutes et prendre une décision réfléchie sur l\'avenir de notre relation.'
    } else if (challengeCode === '3' || challenge === 'C3') {
      return "Comprendre pourquoi notre intimité s'est érodée et si nous pouvons la reconstruire."
    } else if (challengeCode === '4' || challenge === 'C4') {
      return 'Déterminer si nos visions d\'avenir sont encore compatibles ou trop divergentes.'
    } else if (challengeCode === '5' || challenge === 'C5') {
      return 'Explorer les raisons profondes de mes questionnements sur notre relation.'
    }
  } else if (priority === 'C2') {
    // Questioning + Decision
    if (challengeCode === '1' || challenge === 'C2.1') {
      return 'Clarifier mes sentiments et ceux de mon/ma partenaire pour prendre une décision éclairée.'
    } else if (challengeCode === '2' || challenge === 'C2.2') {
      return 'Créer un espace neutre et sécurisant pour poser les choses sereinement.'
    } else if (challengeCode === '3' || challenge === 'C3') {
      return "Déterminer si notre connexion intime peut être restaurée ou si elle est définitivement perdue."
    } else if (challengeCode === '4' || challenge === 'C4') {
      return 'Évaluer si nos projets de vie peuvent encore s\'harmoniser ou s\'ils sont irréconciliables.'
    } else if (challengeCode === '5' || challenge === 'C5') {
      return 'Comprendre ce qui a mené à ce questionnement pour prendre la meilleure décision possible.'
    }
  } else if (priority === 'D1') {
    // Breakup + Understanding
    if (challengeCode === '1' || challenge === 'D1.1') {
      return 'Comprendre mes émotions pour tourner la page émotionnellement et faire mon deuil de la relation.'
    } else if (challengeCode === '2' || challenge === 'D1.2') {
      return 'Identifier mes patterns relationnels pour éviter de reproduire les mêmes erreurs à l\'avenir.'
    } else if (challengeCode === '3' || challenge === 'C3') {
      return "Comprendre l'impact de cette relation sur ma vision de l'intimité et de la sexualité."
    } else if (challengeCode === '4' || challenge === 'C4') {
      return 'Faire sens de cette expérience pour préparer mon avenir relationnel.'
    } else if (challengeCode === '5' || challenge === 'C5') {
      return 'Analyser cette rupture pour en tirer des leçons constructives.'
    }
  } else if (priority === 'D2') {
    // Breakup + Rebuilding
    if (challengeCode === '1' || challenge === 'D2.1') {
      return 'Retrouver confiance en moi et en l\'amour pour me préparer à une future relation.'
    } else if (challengeCode === '2' || challenge === 'D2.2') {
      return 'Redéfinir ma manière d\'aimer et de m\'engager dans mes futures relations.'
    } else if (challengeCode === '3' || challenge === 'C3') {
      return "Reconstruire une relation saine à mon corps et à ma sexualité après cette rupture."
    } else if (challengeCode === '4' || challenge === 'C4') {
      return 'Développer une vision équilibrée de ce que je veux dans mes futures relations.'
    } else if (challengeCode === '5' || challenge === 'C5') {
      return 'Me reconstruire personnellement pour être prêt(e) à aimer à nouveau.'
    }
  }

  // Default fallback text if no specific match is found
  return 'Explorer mes besoins relationnels et développer mes compétences pour des relations plus épanouissantes.'
}
