import { SessionType } from '@/components/dashboard/CalendlyModal'
import { TherapyResource } from '@/functions/src/templates/types'

// Re-export SessionType so it can be imported from this module
export type { SessionType }

export type TherapyEventType = 'session' | 'email' | 'preparation'
export type PartnerType = 'both' | 'partner1' | 'partner2'
export type EmailTrigger = 'immediate' | 'before' | 'after'
export type SessionPhase = 'initial' | 'individual' | 'final'

export interface TherapyJourneyEvent {
  id: string
  title: string
  description: string
  type: TherapyEventType
  sessionType?: SessionType
  partner?: PartnerType
  dependsOn?: string | string[]
  daysOffset?: number
  phase: SessionPhase
  triggerDays?: number
  triggerType?: EmailTrigger
  emailType?: 'welcome' | 'preparation' | 'followup' | 'final'
  resources?: TherapyResource[]
}

// The complete couple therapy journey including sessions and emails
export const coupleTherapyJourney: TherapyJourneyEvent[] = [
  // Initial Phase - Couple
  {
    id: 'welcome_email',
    title: 'Email de Bienvenue',
    description:
      'Email initial de bienvenue avec introduction au parcours thérapeutique',
    type: 'email',
    emailType: 'welcome',
    triggerType: 'immediate',
    phase: 'initial',
    partner: 'both',
    resources: [
      {
        type: 'capsule',
        title: 'Capsules Cœur à Corps',
        description: 'Accès privilégié aux capsules pendant deux ans',
      },
    ],
  },
  {
    id: 'initial_session',
    title: 'Séance de Couple Initiale',
    description:
      'Première séance pour comprendre vos besoins et définir le parcours',
    type: 'session',
    sessionType: 'initial',
    partner: 'both',
    phase: 'initial',
  },
  {
    id: 'initial_followup_email',
    title: 'Suivi Première Séance',
    description:
      'Email de suivi avec réflexions et préparation pour les séances individuelles',
    type: 'email',
    emailType: 'followup',
    triggerType: 'after',
    triggerDays: 1,
    dependsOn: 'initial_session',
    phase: 'initial',
    partner: 'both',
    resources: [
      {
        type: 'form',
        title: 'Formulaire de Préparation',
        description: 'Formulaire à remplir avant la séance individuelle',
      },
      {
        type: 'test',
        title: "Test de l'Amoureux",
        description:
          "Test pour éclairer votre rapport à l'amour et à la relation",
      },
      {
        type: 'capsule',
        title: 'Capsules Cœur à Corps',
        description: 'Ressources pour approfondir votre réflexion',
      },
      {
        type: 'reflection',
        title: "L'Observation Consciente",
        description: "Réflexion sur l'autre comme révélateur de soi-même",
      },
    ],
  },

  // Individual Phase - Partner 1 Journey
  {
    id: 'partner1_session_1_prep_email',
    title: 'Préparation Séance 1 - Partenaire 1',
    description:
      'Instructions de préparation pour la première séance individuelle',
    type: 'email',
    emailType: 'preparation',
    triggerType: 'before',
    triggerDays: 3,
    dependsOn: 'initial_session',
    phase: 'individual',
    partner: 'partner1',
    resources: [
      {
        type: 'reflection',
        title: 'Réflexion sur les Premiers Modèles Relationnels',
        description:
          "Réflexion sur vos premières expériences d'amour et d'attachement",
      },
    ],
  },
  {
    id: 'partner1_session_1',
    title: 'Séance Individuelle 1',
    description: 'Première séance individuelle',
    type: 'session',
    sessionType: 'individual1_partner1',
    partner: 'partner1',
    dependsOn: 'initial_session',
    daysOffset: 28,
    phase: 'individual',
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
    partner: 'partner1',
    resources: [
      {
        type: 'form',
        title: "Formulaire d'Introspection",
        description:
          "Formulaire structurant pour accompagner l'intégration de la séance",
      },
    ],
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
    partner: 'partner1',
    resources: [
      {
        type: 'test',
        title: 'Test Dépendance Relationnelle',
        description:
          'Test pour identifier les zones de dépendance ou de rejet dans votre rapport aux autres',
      },
      {
        type: 'reflection',
        title: 'Réflexion sur les Schémas Relationnels',
        description:
          'Réflexion sur les schémas de dépendance et de rejet dans vos relations',
      },
    ],
  },
  {
    id: 'partner1_session_2',
    title: 'Séance Individuelle 2',
    description: 'Deuxième séance individuelle',
    type: 'session',
    sessionType: 'individual2_partner1',
    partner: 'partner1',
    dependsOn: 'partner1_session_1',
    daysOffset: 28,
    phase: 'individual',
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
    partner: 'partner1',
    resources: [
      {
        type: 'form',
        title: "Formulaire d'Introspection",
        description:
          "Formulaire structurant pour accompagner l'intégration de la séance",
      },
    ],
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
    partner: 'partner1',
    resources: [
      {
        type: 'audio',
        title: 'Capsule Audio "Désir de Soi"',
        description: 'Audio pour explorer votre désir de vous-même',
      },
      {
        type: 'reflection',
        title: 'Réflexion sur le Désir de Soi',
        description:
          'Réflexion sur la question "Que pourrais-je trouver de plus merveilleux que le désir de moi-même ?"',
      },
    ],
  },
  {
    id: 'partner1_session_3',
    title: 'Séance Individuelle 3',
    description: 'Troisième séance individuelle',
    type: 'session',
    sessionType: 'individual3_partner1',
    partner: 'partner1',
    dependsOn: 'partner1_session_2',
    daysOffset: 28,
    phase: 'individual',
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
    partner: 'partner1',
    resources: [
      {
        type: 'form',
        title: "Formulaire d'Introspection",
        description:
          "Formulaire structurant pour accompagner l'intégration de la séance",
      },
    ],
  },

  // Individual Phase - Partner 2 Journey
  {
    id: 'partner2_session_1_prep_email',
    title: 'Préparation Séance 1 - Partenaire 2',
    description:
      'Instructions de préparation pour la première séance individuelle',
    type: 'email',
    emailType: 'preparation',
    triggerType: 'before',
    triggerDays: 3,
    dependsOn: 'initial_session',
    phase: 'individual',
    partner: 'partner2',
    resources: [
      {
        type: 'reflection',
        title: 'Réflexion sur les Premiers Modèles Relationnels',
        description:
          "Réflexion sur vos premières expériences d'amour et d'attachement",
      },
    ],
  },
  {
    id: 'partner2_session_1',
    title: 'Séance Individuelle 1',
    description: 'Première séance individuelle',
    type: 'session',
    sessionType: 'individual1_partner2',
    partner: 'partner2',
    dependsOn: 'initial_session',
    daysOffset: 28,
    phase: 'individual',
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
    partner: 'partner2',
    resources: [
      {
        type: 'form',
        title: "Formulaire d'Introspection",
        description:
          "Formulaire structurant pour accompagner l'intégration de la séance",
      },
    ],
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
    partner: 'partner2',
    resources: [
      {
        type: 'test',
        title: 'Test Dépendance Relationnelle',
        description:
          'Test pour identifier les zones de dépendance ou de rejet dans votre rapport aux autres',
      },
      {
        type: 'reflection',
        title: 'Réflexion sur les Schémas Relationnels',
        description:
          'Réflexion sur les schémas de dépendance et de rejet dans vos relations',
      },
    ],
  },
  {
    id: 'partner2_session_2',
    title: 'Séance Individuelle 2',
    description: 'Deuxième séance individuelle',
    type: 'session',
    sessionType: 'individual2_partner2',
    partner: 'partner2',
    dependsOn: 'partner2_session_1',
    daysOffset: 28,
    phase: 'individual',
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
    partner: 'partner2',
    resources: [
      {
        type: 'form',
        title: "Formulaire d'Introspection",
        description:
          "Formulaire structurant pour accompagner l'intégration de la séance",
      },
    ],
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
    partner: 'partner2',
    resources: [
      {
        type: 'audio',
        title: 'Capsule Audio "Désir de Soi"',
        description: 'Audio pour explorer votre désir de vous-même',
      },
      {
        type: 'reflection',
        title: 'Réflexion sur le Désir de Soi',
        description:
          'Réflexion sur la question "Que pourrais-je trouver de plus merveilleux que le désir de moi-même ?"',
      },
    ],
  },
  {
    id: 'partner2_session_3',
    title: 'Séance Individuelle 3',
    description: 'Troisième séance individuelle',
    type: 'session',
    sessionType: 'individual3_partner2',
    partner: 'partner2',
    dependsOn: 'partner2_session_2',
    daysOffset: 28,
    phase: 'individual',
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
    partner: 'partner2',
    resources: [
      {
        type: 'form',
        title: "Formulaire d'Introspection",
        description:
          "Formulaire structurant pour accompagner l'intégration de la séance",
      },
    ],
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
    partner: 'both',
  },
  {
    id: 'final_session',
    title: 'Séance Finale de Couple',
    description: 'Séance finale pour faire le point sur le parcours',
    type: 'session',
    sessionType: 'final',
    partner: 'both',
    dependsOn: ['partner1_session_3', 'partner2_session_3'],
    daysOffset: 28,
    phase: 'final',
  },
  {
    id: 'final_followup_email',
    title: 'Fin du Parcours Thérapeutique',
    description:
      'Suivi final et ressources pour continuer votre cheminement ensemble',
    type: 'email',
    emailType: 'final',
    triggerType: 'after',
    triggerDays: 1,
    dependsOn: 'final_session',
    phase: 'final',
    partner: 'both',
    resources: [
      {
        type: 'test',
        title: 'Test du Moi en Nous',
        description:
          "Test pour évaluer votre rapport à l'amour et à la relation",
      },
      {
        type: 'test',
        title: 'État des Lieux Érotiques et Sexuels',
        description:
          'Évaluation personnelle pour identifier vos forces et vos besoins dans votre vie érotique et sexuelle',
      },
      {
        type: 'audio',
        title: 'Capsule sur "Le Couple Conscient"',
        description: 'Capsule audio sur le couple conscient',
      },
      {
        type: 'audio',
        title: 'Audio Guidé',
        description: 'Audio guidé pour continuer votre cheminement ensemble',
      },
    ],
  },
]

// Filter functions to easily access specific parts of the journey
export const getSessionEvents = () =>
  coupleTherapyJourney.filter((event) => event.type === 'session')
export const getEmailEvents = () =>
  coupleTherapyJourney.filter((event) => event.type === 'email')
export const getPhaseEvents = (phase: SessionPhase) =>
  coupleTherapyJourney.filter((event) => event.phase === phase)
export const getPartnerEvents = (partner: PartnerType) =>
  coupleTherapyJourney.filter(
    (event) => event.partner === partner || event.partner === 'both',
  )
export const getPhasePartnerEvents = (
  phase: SessionPhase,
  partner?: PartnerType,
) =>
  coupleTherapyJourney.filter(
    (event) =>
      event.phase === phase &&
      (!partner || event.partner === partner || event.partner === 'both'),
  )
