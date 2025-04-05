export interface TherapyTheme {
  title: string;
  description: string;
}

export interface TherapyOption {
  id: string;
  title: string;
  headline: string;
  description: string;
  sections?: {
    title: string;
    content?: string;
    bulletPoints?: string[];
  }[];
  commitments?: string[];
  themes?: string[];
  targetAudience?: string[];
  availability?: string;
  reservation?: string;
  audio?: string;
  pricing?: string | {
    couple?: {
      price: number;
      duration: string;
    };
    individual?: {
      price: number;
      duration: string;
    };
  };
  features?: string[];
  inclusions?: string[];
  tagline?: string;
}

export interface TherapyFormula {
  id: string;
  title: string;
  features: string[];
  duration?: string;
  price: number;
  priceDetails?: string;
  note?: string;
}

export interface TherapyMainOffering {
  title?: string;
  tagline?: string;
  quote?: string;
  process?: {
    title: string;
    details: string[];
  };
  uniqueBenefits?: string[] | {
    title: string;
    intro: string;
    list: string[];
  };
  motto?: string;
  idealFor?: string;
  alternativeTaglines?: string[];
  details?: {
    title: string;
    duration: string;
    schedule: string;
    sessionLength: string;
    price: number;
    inclusions: string[];
  };
  formulas?: TherapyFormula[];
  features?: string[];
  price?: number;
  note?: string;
  targetAudience?: string;
}

export interface BaseOffering {
  id: string;
  type?: string;
  title: string;
  subtitle?: string;
  category: string;
  headline: string;
  description: string;
  themes: TherapyTheme[];
  mainOffering: TherapyMainOffering;
  options?: TherapyOption[];
  hasAudioPresentation: boolean;
  hasTest?: boolean;
  pricing?: {
    couple: number;
    individual: number;
  };
}

export interface TherapyType extends BaseOffering {
  proverbs: string[];
}

export interface CoachingType extends BaseOffering {
  promises?: string[];
}

export interface TherapyOfferings {
  title: string;
  commonBenefits: string[];
  therapyTypes: TherapyType[];
}

export interface CoachingOfferings {
  title: string;
  commonBenefits: string[];
  coachingTypes: CoachingType[];
}

// Combined interface to handle all offering types
export interface AllOfferings {
  therapies: TherapyType[];
  coaching: CoachingType[];
  commonBenefits: {
    therapy: string[];
    coaching: string[];
  };
  titles: {
    therapy: string;
    coaching: string;
  }
}
