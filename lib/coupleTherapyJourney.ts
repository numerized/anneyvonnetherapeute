import { SessionType } from '@/components/dashboard/CalendlyModal';

export type TherapyEventType = 'session' | 'email' | 'preparation';
export type PartnerType = 'both' | 'partner1' | 'partner2';
export type EmailTrigger = 'immediate' | 'before' | 'after';
export type SessionPhase = 'initial' | 'individual' | 'final';

export interface TherapyJourneyEvent {
  id: string;
  title: string;
  description: string;
  type: TherapyEventType;
  sessionType?: SessionType;
  partner?: PartnerType;
  dependsOn?: string | string[];
  daysOffset?: number;
  phase: SessionPhase;
  triggerDays?: number;
  triggerType?: EmailTrigger;
  emailType?: 'welcome' | 'preparation' | 'followup' | 'final';
}

// The complete couple therapy journey including sessions and emails
export const coupleTherapyJourney: TherapyJourneyEvent[] = [
  // Initial Phase - Couple
  {
    id: 'welcome_email',
    title: 'Email de Bienvenue',
    description: 'Email initial de bienvenue avec introduction au parcours thérapeutique',
    type: 'email',
    emailType: 'welcome',
    triggerType: 'immediate',
    phase: 'initial',
    partner: 'both'
  },
  {
    id: 'initial_session',
    title: 'Première Séance de Couple',
    description: 'Séance initiale pour comprendre votre situation et vos objectifs',
    type: 'session',
    sessionType: 'initial_couple',
    partner: 'both',
    phase: 'initial'
  },
  {
    id: 'initial_followup_email',
    title: 'Suivi Première Séance',
    description: 'Email de suivi avec réflexions et préparation pour les séances individuelles',
    type: 'email',
    emailType: 'followup',
    triggerType: 'after',
    triggerDays: 1,
    dependsOn: 'initial_session',
    phase: 'initial',
    partner: 'both'
  },

  // Individual Phase - Partner 1 Journey
  {
    id: 'partner1_session_1_prep_email',
    title: 'Préparation Séance 1 - Partenaire 1',
    description: 'Instructions de préparation pour la première séance individuelle',
    type: 'email',
    emailType: 'preparation',
    triggerType: 'before',
    triggerDays: 3,
    dependsOn: 'initial_session',
    phase: 'individual',
    partner: 'partner1'
  },
  {
    id: 'partner1_session_1',
    title: 'Séance Individuelle 1 - Partenaire 1',
    description: 'Première séance individuelle pour le partenaire 1',
    type: 'session',
    sessionType: 'individual_partner1',
    partner: 'partner1',
    dependsOn: 'initial_session',
    daysOffset: 7,
    phase: 'individual'
  },
  {
    id: 'partner1_session_1_followup_email',
    title: 'Suivi Séance 1 - Partenaire 1',
    description: 'Suivi et réflexions de la première séance individuelle',
    type: 'email',
    emailType: 'followup',
    triggerType: 'after',
    triggerDays: 1,
    dependsOn: 'partner1_session_1',
    phase: 'individual',
    partner: 'partner1'
  },
  {
    id: 'partner1_session_2_prep_email',
    title: 'Préparation Séance 2 - Partenaire 1',
    description: 'Préparation pour la deuxième séance individuelle',
    type: 'email',
    emailType: 'preparation',
    triggerType: 'before',
    triggerDays: 3,
    dependsOn: 'partner1_session_1',
    phase: 'individual',
    partner: 'partner1'
  },
  {
    id: 'partner1_session_2',
    title: 'Séance Individuelle 2 - Partenaire 1',
    description: 'Deuxième séance individuelle pour le partenaire 1',
    type: 'session',
    sessionType: 'individual_partner1',
    partner: 'partner1',
    dependsOn: 'partner1_session_1',
    daysOffset: 14,
    phase: 'individual'
  },
  {
    id: 'partner1_session_2_followup_email',
    title: 'Suivi Séance 2 - Partenaire 1',
    description: 'Suivi et réflexions de la deuxième séance individuelle',
    type: 'email',
    emailType: 'followup',
    triggerType: 'after',
    triggerDays: 1,
    dependsOn: 'partner1_session_2',
    phase: 'individual',
    partner: 'partner1'
  },
  {
    id: 'partner1_session_3_prep_email',
    title: 'Préparation Séance 3 - Partenaire 1',
    description: 'Préparation pour la troisième séance individuelle',
    type: 'email',
    emailType: 'preparation',
    triggerType: 'before',
    triggerDays: 3,
    dependsOn: 'partner1_session_2',
    phase: 'individual',
    partner: 'partner1'
  },
  {
    id: 'partner1_session_3',
    title: 'Séance Individuelle 3 - Partenaire 1',
    description: 'Troisième et dernière séance individuelle pour le partenaire 1',
    type: 'session',
    sessionType: 'individual_partner1',
    partner: 'partner1',
    dependsOn: 'partner1_session_2',
    daysOffset: 14,
    phase: 'individual'
  },
  {
    id: 'partner1_session_3_followup_email',
    title: 'Suivi Séance 3 - Partenaire 1',
    description: 'Suivi final du parcours individuel',
    type: 'email',
    emailType: 'followup',
    triggerType: 'after',
    triggerDays: 1,
    dependsOn: 'partner1_session_3',
    phase: 'individual',
    partner: 'partner1'
  },

  // Individual Phase - Partner 2 Journey
  {
    id: 'partner2_session_1_prep_email',
    title: 'Préparation Séance 1 - Partenaire 2',
    description: 'Instructions de préparation pour la première séance individuelle',
    type: 'email',
    emailType: 'preparation',
    triggerType: 'before',
    triggerDays: 3,
    dependsOn: 'initial_session',
    phase: 'individual',
    partner: 'partner2'
  },
  {
    id: 'partner2_session_1',
    title: 'Séance Individuelle 1 - Partenaire 2',
    description: 'Première séance individuelle pour le partenaire 2',
    type: 'session',
    sessionType: 'individual_partner2',
    partner: 'partner2',
    dependsOn: 'initial_session',
    daysOffset: 7,
    phase: 'individual'
  },
  {
    id: 'partner2_session_1_followup_email',
    title: 'Suivi Séance 1 - Partenaire 2',
    description: 'Suivi et réflexions de la première séance individuelle',
    type: 'email',
    emailType: 'followup',
    triggerType: 'after',
    triggerDays: 1,
    dependsOn: 'partner2_session_1',
    phase: 'individual',
    partner: 'partner2'
  },
  {
    id: 'partner2_session_2_prep_email',
    title: 'Préparation Séance 2 - Partenaire 2',
    description: 'Préparation pour la deuxième séance individuelle',
    type: 'email',
    emailType: 'preparation',
    triggerType: 'before',
    triggerDays: 3,
    dependsOn: 'partner2_session_1',
    phase: 'individual',
    partner: 'partner2'
  },
  {
    id: 'partner2_session_2',
    title: 'Séance Individuelle 2 - Partenaire 2',
    description: 'Deuxième séance individuelle pour le partenaire 2',
    type: 'session',
    sessionType: 'individual_partner2',
    partner: 'partner2',
    dependsOn: 'partner2_session_1',
    daysOffset: 14,
    phase: 'individual'
  },
  {
    id: 'partner2_session_2_followup_email',
    title: 'Suivi Séance 2 - Partenaire 2',
    description: 'Suivi et réflexions de la deuxième séance individuelle',
    type: 'email',
    emailType: 'followup',
    triggerType: 'after',
    triggerDays: 1,
    dependsOn: 'partner2_session_2',
    phase: 'individual',
    partner: 'partner2'
  },
  {
    id: 'partner2_session_3_prep_email',
    title: 'Préparation Séance 3 - Partenaire 2',
    description: 'Préparation pour la troisième séance individuelle',
    type: 'email',
    emailType: 'preparation',
    triggerType: 'before',
    triggerDays: 3,
    dependsOn: 'partner2_session_2',
    phase: 'individual',
    partner: 'partner2'
  },
  {
    id: 'partner2_session_3',
    title: 'Séance Individuelle 3 - Partenaire 2',
    description: 'Troisième et dernière séance individuelle pour le partenaire 2',
    type: 'session',
    sessionType: 'individual_partner2',
    partner: 'partner2',
    dependsOn: 'partner2_session_2',
    daysOffset: 14,
    phase: 'individual'
  },
  {
    id: 'partner2_session_3_followup_email',
    title: 'Suivi Séance 3 - Partenaire 2',
    description: 'Suivi final du parcours individuel',
    type: 'email',
    emailType: 'followup',
    triggerType: 'after',
    triggerDays: 1,
    dependsOn: 'partner2_session_3',
    phase: 'individual',
    partner: 'partner2'
  },

  // Final Phase - Couple
  {
    id: 'final_session_prep_email',
    title: 'Préparation Séance Finale de Couple',
    description: 'Préparation pour la dernière séance de couple',
    type: 'email',
    emailType: 'preparation',
    triggerType: 'before',
    triggerDays: 5,
    dependsOn: ['partner1_session_3', 'partner2_session_3'],
    phase: 'final',
    partner: 'both'
  },
  {
    id: 'final_session',
    title: 'Séance Finale de Couple',
    description: 'Dernière séance de couple pour intégrer les apprentissages et planifier l\'avenir',
    type: 'session',
    sessionType: 'final_couple',
    partner: 'both',
    dependsOn: ['partner1_session_3', 'partner2_session_3'],
    daysOffset: 7,
    phase: 'final'
  },
  {
    id: 'final_followup_email',
    title: 'Fin du Parcours Thérapeutique',
    description: 'Suivi final et ressources pour continuer votre cheminement ensemble',
    type: 'email',
    emailType: 'final',
    triggerType: 'after',
    triggerDays: 1,
    dependsOn: 'final_session',
    phase: 'final',
    partner: 'both'
  }
];

// Filter functions to easily access specific parts of the journey
export const getSessionEvents = () => coupleTherapyJourney.filter(event => event.type === 'session');
export const getEmailEvents = () => coupleTherapyJourney.filter(event => event.type === 'email');
export const getPhaseEvents = (phase: SessionPhase) => coupleTherapyJourney.filter(event => event.phase === phase);
export const getPartnerEvents = (partner: PartnerType) => coupleTherapyJourney.filter(event => 
  event.partner === partner || event.partner === 'both'
);
export const getPhasePartnerEvents = (phase: SessionPhase, partner?: PartnerType) => 
  coupleTherapyJourney.filter(event => 
    event.phase === phase && (!partner || event.partner === partner || event.partner === 'both')
  );
