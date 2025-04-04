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
  priceSuffix?: string;
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
  benefits?: string[] | {
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
  priceSuffix?: string;
  note?: string;
  targetAudience?: string;
}

export interface TherapyType {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  headline: string;
  description: string;
  themes: TherapyTheme[];
  proverbs: string[];
  mainOffering: TherapyMainOffering;
  options?: TherapyOption[];
  hasAudioPresentation: boolean;
  hasTest?: boolean;
  pricing?: {
    couple: number;
    individual: number;
  };
}

export interface TherapyOfferings {
  title: string;
  therapyTypes: TherapyType[];
}
