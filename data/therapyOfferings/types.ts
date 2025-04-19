export interface TherapyTheme {
  title: string
  description: string
}

export interface TherapyOption {
  id: string
  title: string
  headline?: string
  description?: string
  sections?: {
    title: string
    content?: string
    bulletPoints?: string[]
  }[]
  commitments?: string[]
  themes?: string[]
  targetAudience?: string[]
  availability?: string
  reservation?: string
  audio?: string
  pricing?:
    | string
    | {
        couple?: {
          price: number
          duration: string
        }
        individual?: {
          price: number
          duration: string
        }
      }
  features?: string[]
  inclusions?: string[]
  tagline?: string
}

export interface MoreInfosOption {
  title: string
  headline?: string
  sections?: {
    title?: string
    content?: string
  }[]
}

export interface MoreInfosFormula {
  title: string
  price: string
  duration: string
  details: string
}

export interface MoreInfos {
  title?: string
  headline?: string
  description?: string
  sagesse?: {
    title?: string
    quotes: string[]
  }
  themes?: {
    title?: string
    items: {
      title: string
      description: string
    }[]
  }
  process?: {
    title?: string
    details: string[]
  }
  benefits?: {
    title?: string
    items: string[]
  }
  commonBenefits?: string[]
  options?: MoreInfosOption[]
  formulas?:
    | MoreInfosFormula[]
    | {
        title?: string
        price?: string
        details?: {
          title?: string
          duration?: string
          features?: string
        }
      }
}

export interface TherapyFormula {
  id: string
  title: string
  features?: string[]
  duration?: string
  price: number
  priceDetails?: string
  note?: string
  sessionLength?: string
  inclusions?: string[]
}

export interface TherapyCardInfo {
  description?: string
  themes?: TherapyTheme[]
  proverbs?: string[]
  motto?: string
  targetAudience?: string
}

export interface TherapyModalInfo {
  description?: string
  themes?: TherapyTheme[]
  proverbs?: string[]
  modalBenefits?: string[]
  additionalBenefits?: string[]
  motto?: string
  targetAudience?: string
  options?: TherapyOption[]
  formulas?: TherapyFormula[]
  process?: {
    title: string
    details: string[]
  }
  moreInfos?: MoreInfos
  video?: string
  poster?: string
  posterSquare?: string
  videoDuration?: number
}

export interface TherapyMainOffering {
  title?: string
  tagline?: string
  quote?: string
  process?: {
    title: string
    details: string[]
  }
  uniqueBenefits?:
    | string[]
    | {
        title: string
        intro: string
        list: string[]
      }
  motto?: string
  idealFor?: string
  alternativeTaglines?: string[]
  details?: {
    title: string
    duration: string
    schedule: string
    sessionLength: string
    price: number
    inclusions: string[]
  }
  formulas?: TherapyFormula[]
  features?: string[]
  price?: number
  note?: string
  targetAudience?: string
  promises?: string[] // Added for coaching offerings
  commonBenefits?: string[]
  inclusions?: string[]
}

export interface BaseOffering {
  id: string
  type?: string
  title: string
  subtitle?: string
  category: string
  headline: string
  description?: string
  themes?: TherapyTheme[]
  mainOffering: TherapyMainOffering
  options?: TherapyOption[]
  hasAudioPresentation?: boolean
  hasTest?: boolean
  pricing?: {
    couple: number
    individual: number
  }
  cardInfo?: TherapyCardInfo
  modalInfo?: TherapyModalInfo
  process?: {
    title: string
    details: string[]
  }
  uniqueBenefits?: string[]
  formulas?: TherapyFormula[]
  inclusions?: string[]
}

export interface TherapyType extends BaseOffering {
  proverbs?: string[]
  commonBenefits?: string[]
}

export interface CoachingType extends BaseOffering {
  promises?: string[]
}

export interface TherapyOfferings {
  title: string
  commonBenefits: string[]
  therapyTypes: TherapyType[]
}

export interface CoachingOfferings {
  title: string
  commonBenefits: string[]
  coachingTypes: CoachingType[]
}

// Combined interface to handle all offering types
export interface AllOfferings {
  therapies: TherapyType[]
  coaching: CoachingType[]
  commonBenefits: {
    therapy: string[]
    coaching: string[]
  }
  titles: {
    therapy: string
    coaching: string
  }
}
