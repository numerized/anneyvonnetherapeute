export interface Question {
  id: string
  text: string
  required?: boolean
}

export interface Option {
  id: string
  label: string
}

export const questions: Question[] = [
  {
    id: 'communication',
    text: 'Comment communiquez-vous vos besoins et vos émotions dans une relation ?',
    required: true
  },
  {
    id: 'conflict',
    text: 'Comment gérez-vous les conflits dans vos relations ?',
    required: true
  },
  {
    id: 'boundaries',
    text: 'Comment établissez-vous et maintenez-vous vos limites personnelles ?',
    required: true
  },
  {
    id: 'intimacy',
    text: 'Comment vivez-vous l\'intimité émotionnelle ?',
    required: true
  },
  {
    id: 'trust',
    text: 'Comment construisez-vous la confiance dans vos relations ?',
    required: true
  }
]

export const options: Option[] = [
  {
    id: 'direct',
    label: 'De manière directe et ouverte'
  },
  {
    id: 'careful',
    label: 'Avec précaution et diplomatie'
  },
  {
    id: 'indirect',
    label: 'De façon indirecte ou par des signaux non-verbaux'
  },
  {
    id: 'avoidant',
    label: 'J\'évite souvent d\'exprimer mes besoins'
  }
]
