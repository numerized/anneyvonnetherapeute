import { TherapyOfferings, TherapyType } from './types';
import offeringsData from './offerings.json';

/**
 * Returns the full therapy offerings data structure
 */
export function getTherapyOfferings(): TherapyOfferings {
  return offeringsData as TherapyOfferings;
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
 * Returns all therapy types
 */
export function getAllTherapyTypes(): TherapyType[] {
  const offerings = getTherapyOfferings();
  return offerings.therapyTypes;
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
