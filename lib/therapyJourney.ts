import { TherapyTimelineEvent, TherapyResource } from '@/functions/src/templates/types';

export const therapyJourneyEvents: TherapyTimelineEvent[] = [
  // Première Séance de Couple
  {
    type: 'email',
    title: 'Email de Bienvenue',
    description: 'Email initial de bienvenue avec introduction au parcours thérapeutique',
    triggerType: 'immediate',
    resources: [
      {
        type: 'capsule',
        title: 'Capsules Cœur à Corps',
        description: 'Accès privilégié aux capsules pendant deux ans'
      }
    ]
  },
  {
    type: 'session',
    sessionType: 'couple',
    title: 'Première Séance de Couple',
    description: 'Séance initiale pour comprendre votre situation et vos objectifs',
  },
  {
    type: 'email',
    title: 'Suivi Première Séance',
    description: 'Email de suivi avec réflexions et préparation pour les séances individuelles',
    triggerType: 'afterSession',
    delayDays: 1,
    resources: [
      {
        type: 'form',
        title: 'Formulaire de Préparation',
        description: 'Formulaire à remplir avant la séance individuelle'
      },
      {
        type: 'test',
        title: 'Test de l\'Amoureux',
        description: 'Test pour éclairer votre rapport à l\'amour et à la relation'
      },
      {
        type: 'capsule',
        title: 'Capsules Cœur à Corps',
        description: 'Ressources pour approfondir votre réflexion'
      }
    ]
  },

  // Séances Partenaire Masculin
  {
    type: 'email',
    title: 'Préparation Séance 1 - Homme',
    description: 'Instructions de préparation pour la première séance individuelle',
    triggerType: 'beforeSession',
    delayDays: 3,
    partner: 'male',
    resources: [
      {
        type: 'reflection',
        title: 'Réflexion sur les Premiers Modèles Relationnels',
        description: 'Réflexion sur vos premières expériences d\'amour et d\'attachement'
      }
    ]
  },
  {
    type: 'session',
    sessionType: 'individual',
    title: 'Séance Individuelle 1 - Homme',
    description: 'Première séance individuelle pour le partenaire masculin',
    partner: 'male',
  },
  {
    type: 'email',
    title: 'Suivi Séance 1 - Homme',
    description: 'Suivi et réflexions de la première séance individuelle',
    triggerType: 'afterSession',
    delayDays: 1,
    partner: 'male',
  },
  {
    type: 'email',
    title: 'Préparation Séance 2 - Homme',
    description: 'Préparation pour la deuxième séance individuelle',
    triggerType: 'beforeSession',
    delayDays: 3,
    partner: 'male',
    resources: [
      {
        type: 'test',
        title: 'Test Dépendance Relationnelle',
        description: 'Test pour identifier les zones de dépendance ou de rejet dans votre rapport aux autres'
      }
    ]
  },
  {
    type: 'session',
    sessionType: 'individual',
    title: 'Séance Individuelle 2 - Homme',
    description: 'Deuxième séance individuelle pour le partenaire masculin',
    partner: 'male',
  },
  {
    type: 'email',
    title: 'Suivi Séance 2 - Homme',
    description: 'Suivi et observations de la deuxième séance',
    triggerType: 'afterSession',
    delayDays: 1,
    partner: 'male',
  },
  {
    type: 'email',
    title: 'Préparation Séance 3 - Homme',
    description: 'Email de préparation pour la dernière séance (homme)',
    triggerType: 'beforeSession',
    delayDays: 7,
    partner: 'male',
    resources: [
      {
        type: 'audio',
        title: 'Capsule Audio "Désir de Soi"',
        description: 'Audio pour explorer votre désir de vous-même'
      },
      {
        type: 'reflection',
        title: 'Réflexion sur le Désir de Soi',
        description: 'Réflexion sur la question "Que pourrais-je trouver de plus merveilleux que le désir de moi-même ?"'
      }
    ]
  },
  {
    type: 'session',
    sessionType: 'individual',
    title: 'Séance Individuelle 3 - Homme',
    description: 'Dernière séance individuelle pour le partenaire masculin',
    partner: 'male',
  },
  {
    type: 'email',
    title: 'Fin du Parcours Individuel - Homme',
    description: 'Bilan des séances individuelles et préparation pour la réunion du couple',
    triggerType: 'afterSession',
    delayDays: 1,
    partner: 'male',
  },

  // Séances Partenaire Féminin
  {
    type: 'email',
    title: 'Préparation Séance 1 - Femme',
    description: 'Instructions de préparation pour la première séance individuelle',
    triggerType: 'beforeSession',
    delayDays: 3,
    partner: 'female',
    resources: [
      {
        type: 'reflection',
        title: 'Réflexion sur les Premiers Modèles Relationnels',
        description: 'Réflexion sur vos premières expériences d\'amour et d\'attachement'
      }
    ]
  },
  {
    type: 'session',
    sessionType: 'individual',
    title: 'Séance Individuelle 1 - Femme',
    description: 'Première séance individuelle pour la partenaire féminine',
    partner: 'female',
  },
  {
    type: 'email',
    title: 'Suivi Séance 1 - Femme',
    description: 'Suivi et réflexions de la première séance individuelle',
    triggerType: 'afterSession',
    delayDays: 1,
    partner: 'female',
  },
  {
    type: 'email',
    title: 'Préparation Séance 2 - Femme',
    description: 'Préparation pour la deuxième séance individuelle',
    triggerType: 'beforeSession',
    delayDays: 3,
    partner: 'female',
    resources: [
      {
        type: 'test',
        title: 'Test Dépendance Relationnelle',
        description: 'Test pour identifier les zones de dépendance ou de rejet dans votre rapport aux autres'
      }
    ]
  },
  {
    type: 'session',
    sessionType: 'individual',
    title: 'Séance Individuelle 2 - Femme',
    description: 'Deuxième séance individuelle pour la partenaire féminine',
    partner: 'female',
  },
  {
    type: 'email',
    title: 'Suivi Séance 2 - Femme',
    description: 'Suivi et observations de la deuxième séance',
    triggerType: 'afterSession',
    delayDays: 1,
    partner: 'female',
  },
  {
    type: 'email',
    title: 'Préparation Séance 3 - Femme',
    description: 'Email de préparation pour la dernière séance (femme)',
    triggerType: 'beforeSession',
    delayDays: 7,
    partner: 'female',
    resources: [
      {
        type: 'audio',
        title: 'Capsule Audio "Désir de Soi"',
        description: 'Audio pour explorer votre désir de vous-même'
      },
      {
        type: 'reflection',
        title: 'Réflexion sur le Désir de Soi',
        description: 'Réflexion sur la question "Que pourrais-je trouver de plus merveilleux que le désir de moi-même ?"'
      }
    ]
  },
  {
    type: 'session',
    sessionType: 'individual',
    title: 'Séance Individuelle 3 - Femme',
    description: 'Dernière séance individuelle pour la partenaire féminine',
    partner: 'female',
  },
  {
    type: 'email',
    title: 'Fin du Parcours Individuel - Femme',
    description: 'Bilan des séances individuelles et préparation pour la réunion du couple',
    triggerType: 'afterSession',
    delayDays: 1,
    partner: 'female',
  },

  // Séance Finale de Couple
  {
    type: 'email',
    title: 'Préparation Séance de Couple Finale',
    description: 'Préparation pour la dernière séance de couple',
    triggerType: 'beforeSession',
    delayDays: 5,
  },
  {
    type: 'session',
    sessionType: 'couple',
    title: 'Séance de Couple Finale',
    description: 'Dernière séance de couple pour intégrer les apprentissages et planifier l\'avenir',
  },
  {
    type: 'email',
    title: 'Fin du Parcours Thérapeutique',
    description: 'Suivi final et ressources pour continuer votre cheminement ensemble',
    triggerType: 'afterSession',
    delayDays: 1,
    resources: [
      {
        type: 'test',
        title: 'Test du Moi en Nous',
        description: 'Test pour évaluer votre rapport à l\'amour et à la relation'
      },
      {
        type: 'test',
        title: 'État des Lieux Érotiques et Sexuels',
        description: 'Évaluation personnelle pour identifier vos forces et vos besoins dans votre vie érotique et sexuelle'
      },
      {
        type: 'audio',
        title: 'Capsule sur "Le Couple Conscient"',
        description: 'Capsule audio sur le couple conscient'
      },
      {
        type: 'audio',
        title: 'Audio Guidé',
        description: 'Audio guidé pour continuer votre cheminement ensemble'
      }
    ]
  },
];
