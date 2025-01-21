'use client'

import { useState } from 'react'
import { RangeInput } from '@/components/ui/RangeInput'

interface Question {
  id: string
  title: string
  min: string
  max: string
}

const socialQuestions: Question[] = [
  {
    id: 'autonomie_decisionnelle',
    title: 'Autonomie décisionnelle',
    min: 'Je suis incapable de prendre des décisions sans l\'aval des autres.',
    max: 'Je prends toutes mes décisions de manière totalement indépendante.'
  },
  {
    id: 'gestion_temps',
    title: 'Gestion du temps personnel',
    min: 'Je consacre tout mon temps aux autres, sans moments pour moi.',
    max: 'Je gère mon temps de manière totalement indépendante, sans considération pour les autres.'
  },
  {
    id: 'expression_opinions',
    title: 'Expression des opinions personnelles',
    min: 'Je n\'exprime jamais mes opinions par peur de déplaire.',
    max: 'J\'exprime toujours mes opinions, sans tenir compte de l\'impact sur les autres.'
  },
  {
    id: 'limites',
    title: 'Capacité à établir des limites',
    min: 'Je suis incapable de dire non ou d\'établir des limites dans mes relations.',
    max: 'J\'établis des limites strictes dans toutes mes interactions, sans flexibilité.'
  },
  {
    id: 'solitude',
    title: 'Gestion de la solitude',
    min: 'Je suis incapable de rester seul, même pour de courtes périodes.',
    max: 'Je préfère toujours être seul et évite toute interaction sociale.'
  },
  {
    id: 'independance_emotionnelle',
    title: 'Indépendance émotionnelle',
    min: 'Mon bien-être émotionnel dépend entièrement des autres.',
    max: 'Je suis totalement détaché émotionnellement des autres.'
  },
  {
    id: 'autonomie_activites',
    title: 'Autonomie dans les activités quotidiennes',
    min: 'J\'ai besoin de l\'aide ou de l\'approbation des autres pour toutes mes activités.',
    max: 'Je réalise toutes mes activités de manière totalement indépendante, sans jamais demander d\'aide.'
  },
  {
    id: 'conflits_sociaux',
    title: 'Gestion des conflits sociaux',
    min: 'J\'évite tout conflit pour préserver mes relations, même à mon détriment.',
    max: 'Je gère les conflits de manière unilatérale, sans chercher de compromis.'
  },
  {
    id: 'independance_financiere',
    title: 'Indépendance financière',
    min: 'Je dépends entièrement des autres pour mes finances.',
    max: 'Je suis totalement indépendant(e) financièrement et ne partage jamais mes ressources.'
  },
  {
    id: 'initiatives_sociales',
    title: 'Prise d\'initiatives dans les interactions sociales',
    min: 'J\'attends toujours que les autres prennent l\'initiative dans les discussions ou projets.',
    max: 'Je prends toutes les initiatives sans demander l\'avis ou le consentement des autres.'
  }
]

const relationshipQuestions: Question[] = [
  {
    id: 'autonomie_relation',
    title: 'Autonomie décisionnelle dans la relation',
    min: 'Je suis incapable de prendre des décisions sans l\'avis ou l\'approbation de mon/mes partenaire(s).',
    max: 'Je prends toutes mes décisions sans tenir compte de l\'avis ou des besoins de l\'autre.'
  },
  {
    id: 'temps_partage',
    title: 'Gestion du temps partagé',
    min: 'Je consacre tout mon temps à mon/mes partenaire(s), sans moment pour moi.',
    max: 'Je privilégie toujours mon propre emploi du temps, sans accorder de temps de qualité à la relation.'
  },
  {
    id: 'besoins_emotionnels',
    title: 'Expression des besoins émotionnels',
    min: 'Je n\'exprime jamais mes besoins émotionnels par peur de déranger ou d\'être rejeté(e).',
    max: 'J\'exprime mes besoins sans prendre en compte les capacités ou limites émotionnelles de l\'autre.'
  },
  {
    id: 'limites_relation',
    title: 'Capacité à poser des limites dans la relation',
    min: 'Je suis incapable de poser des limites ou de dire non à mon/mes partenaire(s).',
    max: 'Je pose des limites strictes et inflexibles, sans chercher de compromis.'
  },
  {
    id: 'attachement',
    title: 'Gestion de l\'attachement',
    min: 'Je me sens totalement perdu(e) ou anxieux(se) lorsque je suis loin de mon/mes partenaire(s).',
    max: 'Je reste émotionnellement distant(e) et évite tout attachement profond.'
  },
  {
    id: 'independance_emotionnelle_relation',
    title: 'Indépendance émotionnelle dans la relation',
    min: 'Mon bien-être émotionnel dépend entièrement de l\'approbation ou de l\'affection de mon/mes partenaire(s).',
    max: 'Je suis totalement insensible ou détaché(e) des émotions de l\'autre dans la relation.'
  },
  {
    id: 'responsabilites',
    title: 'Partage des responsabilités dans la relation',
    min: 'J\'attends que mon/mes partenaire(s) gèrent tous les aspects pratiques et émotionnels de la relation.',
    max: 'Je m\'occupe de tout, refusant toute aide ou implication de l\'autre.'
  },
  {
    id: 'conflits_relation',
    title: 'Gestion des conflits relationnels',
    min: 'J\'évite systématiquement les conflits par crainte de nuire à la relation.',
    max: 'Je traite les conflits de manière unilatérale, imposant mes points de vue sans discussion.'
  },
  {
    id: 'intimite',
    title: 'Intimité physique et affective',
    min: 'Je n\'ose pas exprimer mes désirs ou mes besoins intimes par peur de jugement ou de rejet.',
    max: 'J\'impose toujours mes désirs intimes sans tenir compte du consentement ou du confort de l\'autre.'
  },
  {
    id: 'vision_commune',
    title: 'Capacité à maintenir une vision commune',
    min: 'Je me conforme toujours à la vision ou aux attentes de mon/mes partenaire(s), même si elles vont à l\'encontre des miennes.',
    max: 'Je n\'intègre jamais les attentes de l\'autre dans mes projets ou ma vision à long terme.'
  }
]

export function EvaluationHandicapRelationnel() {
  const [date] = useState(() => {
    const today = new Date()
    return today.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })

  const [scores, setScores] = useState<Record<string, string>>({})

  const handleScoreChange = (id: string, value: string) => {
    setScores(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const QuestionItem = ({ question }: { question: Question }) => {
    return (
      <li className="rating-item mb-12">
        <div className="flex items-center justify-between mb-2">
          <span className="italic">{question.title}</span>
          <span className="text-4xl font-light text-primary-coral">{scores[question.id] || '5'}</span>
        </div>
        <div className="space-y-4">
          <RangeInput
            value={scores[question.id] || '5'}
            onChange={(value) => handleScoreChange(question.id, value)}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{question.min}</span>
            <span>{question.max}</span>
          </div>
        </div>
      </li>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg print:shadow-none relative min-h-screen">
      <div className="flex flex-col h-full print-container">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-2xl font-light text-primary-coral">
              Formulaire d'Évaluation du Handicap Relationnel
            </h1>
            <div className="text-right">
              <span className="text-gray-600">Date: </span>
              <span className="text-gray-700">{date}</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-gray-700">
              Ce formulaire est divisé en deux parties : l'une centrée sur vos interactions sociales générales,
              l'autre sur vos relations intimes ou amoureuses. Pour chaque affirmation, évaluez votre situation
              actuelle en choisissant une note de 0 (dépendance totale) à 10 (indépendance totale).
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-medium text-primary-coral mb-8">Section 1 : Relationnelle Sociale</h2>
            <ul className="list-none space-y-8">
              {socialQuestions.map(question => (
                <QuestionItem key={question.id} question={question} />
              ))}
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-medium text-primary-coral mb-8">Section 2 : Relationnelle Intime et Amoureuse</h2>
            <ul className="list-none space-y-8">
              {relationshipQuestions.map(question => (
                <QuestionItem key={question.id} question={question} />
              ))}
            </ul>
          </div>
        </div>

        <blockquote className="text-primary-coral italic text-sm mt-8 print:hidden">
          "L'équilibre entre dépendance et indépendance est la clé d'une relation saine."
        </blockquote>
      </div>
    </div>
  )
}
