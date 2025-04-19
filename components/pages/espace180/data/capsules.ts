// Capsule data for Espace180
export interface Capsule {
  id: number
  uniqueId: string // Unguessable ID for URLs
  title: string
  description: string
  date: Date
  mediaUrl: string
  posterUrl: string
  squarePosterUrl?: string
  gradient?: string
  tags: string[]
  mediaType: 'audio' | 'video'
  duration?: string
  proportions: string
}

export const capsules: Capsule[] = [
  {
    id: 1,
    uniqueId: 'med-erozen-f8c7b2a1',
    title: 'Meditation Erozen 001',
    description:
      "Une capsule conçue pour libérer votre créativité et explorer votre potentiel d'expression. Laissez-vous guider dans cet espace où l'imagination se déploie sans contraintes.",
    date: new Date('2025-03-22'),
    mediaUrl: '/CAPSULES_MINUTES/CREATIVITE_CAPSULE-LIBRE.mp4',
    posterUrl: '/images/posters/CREATIVITE_CAPSULE-LIBRE-poster.jpg',
    squarePosterUrl: '/CAPSULES%20MIROIR_VISUELS/square/meditationerozen2.png',
    tags: ['Créativité', 'Expression', 'Bien-être', 'Minute'],
    duration: '12min35s',
    mediaType: 'video',
    proportions: '16:9',
  },
  {
    id: 21,
    uniqueId: 'zen-clic-copy-20250419',
    title: 'Zen Clic',
    description:
      'Un moment de détente et de recentrage pour retrouver votre équilibre intérieur. Cette capsule vous offre un espace de respiration dans votre quotidien.',
    date: new Date('2025-03-30'),
    mediaUrl: '/CAPSULES_MINUTES/ZEN_CLICK.mp4',
    posterUrl: '/images/posters/ZEN_CLIC_1-vertical-poster.jpg',
    squarePosterUrl: '/images/posters/ZEN_CLIC_1-square-poster.jpg',
    tags: ['Méditation', 'Zen', 'Relaxation', 'Minute'],
    duration: '5min',
    mediaType: 'video',
    proportions: '9:16',
  },
  {
    id: 3,
    uniqueId: 'amour-passion-2c4e6d8b',
    title: 'Amour Passion',
    description:
      "Explorez les dimensions de l'amour passionnel et ses manifestations dans nos relations. Une réflexion sur l'intensité et la profondeur des liens amoureux.",
    date: new Date('2025-04-02'),
    mediaUrl: '/CAPSULES_MIROIR/Amour-passion.m4a',
    posterUrl: '/CAPSULES%20MIROIR_VISUELS/mirroir5.png',
    squarePosterUrl: '/CAPSULES%20MIROIR_VISUELS/square/mirroir5.png',
    tags: ['Amour', 'Passion', 'Relation', 'Couple', 'Miroir'],
    duration: '6m16s',
    mediaType: 'audio',
    proportions: '16:9',
  },
  {
    id: 4,
    uniqueId: 'capsule-connaitre-4a2e1d6c',
    title: 'Capsule Connaître - Exploration',
    description:
      'Une invitation à explorer la connaissance de soi et des autres. Cette capsule audio vous guide dans une démarche introspective pour mieux vous comprendre et vous connecter à votre essence.',
    date: new Date('2025-04-06'),
    mediaUrl:
      '/CAPSULES_MIROIR/Capsule-connaitre---exploration-cac_Wind-Remover.mp3',
    posterUrl: '/CAPSULES%20MIROIR_VISUELS/mirroir6.png',
    squarePosterUrl: '/CAPSULES%20MIROIR_VISUELS/square/mirroir6.png',
    tags: ['Connaissance de soi', 'Exploration', 'Introspection', 'Miroir'],
    duration: '4m5s',
    mediaType: 'audio',
    proportions: '16:9',
  },
  {
    id: 5,
    uniqueId: 'et-si-la-relation-1a3e9d7f',
    title: "Et si la relation amoureuse n'est plus faite pour durer",
    description:
      "Une réflexion sur l'évolution des relations amoureuses dans notre société contemporaine. Questionnez vos attentes et vos perceptions sur la durabilité des liens affectifs.",
    date: new Date('2025-04-10'),
    mediaUrl:
      '/CAPSULES_MIROIR/Et-si-la-relation-amoureuse-n_est-plus-faite-pour-durer.m4a',
    posterUrl: '/CAPSULES%20MIROIR_VISUELS/mirroir7.png',
    squarePosterUrl: '/CAPSULES%20MIROIR_VISUELS/square/mirroir7.png',
    tags: ['Relation', 'Couple', 'Évolution', 'Société', 'Miroir'],
    duration: '4m4s',
    mediaType: 'audio',
    proportions: '16:9',
  },
  {
    id: 6,
    uniqueId: 'la-pensee-orientee-8a5e3c1d',
    title: 'La Pensée Orientée',
    description:
      "Découvrez comment aligner vos pensées vers des objectifs positifs et constructifs. Cette méditation guidée vous aide à structurer votre réflexion pour plus de clarté et d'efficacité.",
    date: new Date('2025-04-14'),
    mediaUrl: '/CAPSULES_MIROIR/La-pensee-orientee_Wind-Remover.mp3',
    posterUrl: '/CAPSULES%20MIROIR_VISUELS/mirroir8.png',
    squarePosterUrl: '/CAPSULES%20MIROIR_VISUELS/square/mirroir8.png',
    tags: [
      'Pensée',
      'Orientation',
      'Conscience',
      'Liberté',
      'Transformation',
      'Tantra',
      'Haut Potentiel',
      'Hédonisme',
      'Miroir',
    ],
    duration: '6m21s',
    mediaType: 'audio',
    proportions: '16:9',
  },
  {
    id: 7,
    uniqueId: 'les-uns-et-les-autres-3a2e9d1f',
    title: 'Les Uns et Les Autres',
    description:
      'Une exploration des dynamiques relationnelles et des interactions entre individus. Cette capsule vous invite à porter un regard nouveau sur la façon dont nous nous connectons les uns aux autres.',
    date: new Date('2025-04-18'),
    mediaUrl: '/CAPSULES_MIROIR/Les-uns-et-les-autres.m4a',
    posterUrl: '/CAPSULES%20MIROIR_VISUELS/mirroir9.png',
    squarePosterUrl: '/CAPSULES%20MIROIR_VISUELS/square/mirroir9.png',
    tags: [
      'Relations',
      'Interactions sociales',
      'Développement personnel',
      'Miroir',
    ],
    duration: '4m15s',
    mediaType: 'audio',
    proportions: '16:9',
  },
  {
    id: 8,
    uniqueId: 'lamour-dapres-1-20250419',
    title: "L'Amour d'Après (Miroir)",
    description:
      "Une réflexion sur l'amour après l'épreuve, la transformation des sentiments et la renaissance intérieure. Cette capsule vidéo vous invite à explorer la résilience et la beauté de l'amour renouvelé.",
    date: new Date('2025-04-19'),
    mediaUrl: '/CAPSULES_MIROIR/lamour-dapres-1.mp4',
    posterUrl: '/images/posters/lamour-dapres-1-poster.jpg',
    squarePosterUrl: '/images/posters/lamour-dapres-1-square-poster.jpg',
    tags: ['Amour', 'Résilience', 'Transformation', 'Miroir'],
    duration: '7m42s',
    mediaType: 'video',
    proportions: '16:9',
  },
]
