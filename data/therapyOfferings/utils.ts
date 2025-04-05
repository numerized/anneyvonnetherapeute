import { AllOfferings, BaseOffering, CoachingOfferings, CoachingType, TherapyOfferings, TherapyType } from './types';
import offeringsData from './offerings.json';
import coachingData from './coachingOfferings.json';

/**
 * Returns the full therapy offerings data structure
 */
export function getTherapyOfferings(): TherapyOfferings {
  return offeringsData as TherapyOfferings;
}

/**
 * Returns the full coaching offerings data structure
 */
export function getCoachingOfferings(): CoachingOfferings {
  console.log('Raw coaching data:', coachingData);
  return coachingData as CoachingOfferings;
}

/**
 * Returns all offerings combined in a unified structure
 */
export function getAllOfferings(): AllOfferings {
  const therapyOfferings = getTherapyOfferings();
  const coachingOfferings = getCoachingOfferings();
  
  return {
    therapies: therapyOfferings.therapyTypes,
    coaching: coachingOfferings.coachingTypes,
    commonBenefits: {
      therapy: therapyOfferings.commonBenefits,
      coaching: coachingOfferings.commonBenefits
    },
    titles: {
      therapy: therapyOfferings.title,
      coaching: coachingOfferings.title
    }
  };
}

/**
 * Returns a specific therapy type by ID
 * @param id The ID of the therapy type to retrieve
 */
export function getTherapyTypeById(id: string): TherapyType | undefined {
  const offerings = getTherapyOfferings();
  return offerings.therapyTypes.find(therapy => therapy.id === id);
}

/**
 * Returns a specific coaching type by ID
 * @param id The ID of the coaching type to retrieve
 */
export function getCoachingTypeById(id: string): CoachingType | undefined {
  const offerings = getCoachingOfferings();
  console.log('getCoachingTypeById called with ID:', id);
  console.log('Available coaching types:', offerings.coachingTypes.map(c => c.id));
  const result = offerings.coachingTypes.find(coaching => coaching.id === id);
  console.log('Coaching type found:', !!result);
  return result;
}

/**
 * Returns an offering (therapy or coaching) by ID
 * @param id The ID of the offering to retrieve
 */
export function getOfferingById(id: string): BaseOffering | undefined {
  // First try to find it in therapy offerings
  const therapyType = getTherapyTypeById(id);
  if (therapyType) return therapyType;
  
  // Then try coaching offerings
  return getCoachingTypeById(id);
}

/**
 * Returns all therapy types
 */
export function getAllTherapyTypes(): TherapyType[] {
  const offerings = getTherapyOfferings();
  return offerings.therapyTypes;
}

/**
 * Returns all coaching types
 */
export function getAllCoachingTypes(): CoachingType[] {
  const offerings = getCoachingOfferings();
  return offerings.coachingTypes;
}

/**
 * Returns all offerings of a specific type
 * @param type The type of offerings to retrieve ("therapy" or "coaching")
 */
export function getOfferingsByType(type: "therapy" | "coaching"): BaseOffering[] {
  return type === "therapy" ? getAllTherapyTypes() : getAllCoachingTypes();
}

/**
 * Returns an option from a therapy type by IDs
 * @param therapyId The ID of the therapy type
 * @param optionId The ID of the option to retrieve
 */
export function getTherapyOption(therapyId: string, optionId: string) {
  const therapyType = getTherapyTypeById(therapyId);
  if (!therapyType || !therapyType.options) return undefined;
  
  return therapyType.options.find(option => option.id === optionId);
}

/**
 * Returns a formula from the individual therapy type by ID
 * @param formulaId The ID of the formula to retrieve
 */
export function getIndividualTherapyFormula(formulaId: string) {
  const individualTherapy = getTherapyTypeById('individual');
  if (!individualTherapy || !individualTherapy.mainOffering.formulas) return undefined;
  
  return individualTherapy.mainOffering.formulas.find(formula => formula.id === formulaId);
}
