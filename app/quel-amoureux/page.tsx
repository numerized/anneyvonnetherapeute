'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { RadioGroup } from '@headlessui/react'

interface Question {
  id: string
  text: string
  required?: boolean
}

const questions: Question[] = [
  {
    id: 'communication',
    text: `Dans tes relations amoureuses, tu es capable de converser avec assurance, de partager ses pensées, ses silence, ses émotions et ses blagues sans problème.`,
    required: true
  },
  {
    id: 'empathy',
    text: `Dans une relation amoureuse, tu sais exprimer ton amour et ton soutien d'une manière qui résonne avec les émotions et les besoins de l'autre, même sans que ceux-ci soient explicitement exprimés.`
  },
  {
    id: 'respect',
    text: `Tu respectes l'opinion de l'autre, même quand il pense que la pizza ananas est un crime, et tu sais propager des énergies positives comme si c'était ton job à plein temps.`
  },
  {
    id: 'confidence',
    text: `Tu as autant confiance en ton/ta partenaire qu'en tes compétences pour commander au restaurant, fixer un ciné, offrir un livre ou organiser un week-end en amoureux.`
  },
  {
    id: 'intuition',
    text: `Dans une relation amoureuse, tu as ce sixième sens qui permet de comprendre exactement ce que ton/ta partenaire ressent, même sans mots.`
  },
  {
    id: 'acceptance',
    text: `Tu sais respecter et accepter ton/ta partenaire dans ses différences, même lorsque cela te gène ou te limite.`
  },
  {
    id: 'balance',
    text: `Tu sais trouver un terrain d'entente entre une série, un chill et une soirée avec les amis, sans perdre de vue ce qui compte vraiment pour l'autre.`
  },
  {
    id: 'support',
    text: `Tu es le plus grand fan de ton partenaire, tu sais le soutenir dans ses rêves et ses objectifs, même s'il veut devenir chanteur de karaoké professionnel`
  },
  {
    id: 'stability',
    text: `Tu sais gérer les hauts et les bas de la relation sans exploser comme un smartphone avec une batterie en fin de vie.`
  },
  {
    id: 'quality_time',
    text: `Tu fais en sorte de passer du temps de qualité ensemble, même si c'est juste pour se faire des câlins ou entrer dans de grandes discussions.`
  },
  {
    id: 'connection',
    text: `Tu peux créer une connexion profonde qui rendrait jaloux les super-héros avec des pouvoirs télépathiques.`
  },
  {
    id: 'listening',
    text: `Tu là pour offrir un soutien inconditionnel et une écoute attentive lorsque ton/ta partenaire en a besoin.`
  },
  {
    id: 'adaptability',
    text: `Tu es aussi flexible qu'un acrobate, prêt à t'adapter aux changements et à traverser les coups durs sans te plaindre.`
  },
  {
    id: 'trust_intuition',
    text: `Tu t'es toujours fié.e à ton intuition et à tes ressentis pour choisir tes partenaires et tes histoires d'amour.`
  },
  {
    id: 'sexuality',
    text: `Tu te permets de vivre ta sexualité librement et tu acceptes facilement les demandes sexuelles/érotique de ton/ta partenaire.`
  },
  {
    id: 'forgiveness',
    text: `Tu sais pardonner et laisser aller les erreurs passées, ce qui permet à la relation de progresser et de se développer au fil du temps.`
  },
  {
    id: 'encouragement',
    text: `Tu es un partenaire solidaire et encourageant, qui soutient les rêves et les aspirations de l'autre.`
  },
  {
    id: 'initiative',
    text: `Tu es prêt à prendre des initiatives pour résoudre les problèmes et surmonter les obstacles qui se présentent dans la relation.`
  }
]

const options = [
  { id: 'often', label: 'Le plus souvent' },
  { id: 'partially', label: 'Partiellement' },
  { id: 'rarely', label: 'Très peu' }
]

export default function QuelAmoureuxPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const [date] = useState(() => {
    const today = new Date()
    return today.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  return (
    <main className="min-h-screen bg-primary-forest p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-lg print:shadow-none">
        <div className="flex flex-col h-full print-container">
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-primary-coral md:max-w-[70%]">
                Quel genre d'amoureux.se es-tu ?
              </h1>
              <div className="text-right space-y-2">
                <div className="text-sm md:text-base">
                  <span className="text-gray-600">Date : </span>
                  <span className="text-gray-700">{date}</span>
                </div>
                {email && (
                  <div className="text-sm md:text-base">
                    <span className="text-gray-600">Email : </span>
                    <span className="text-gray-700">{email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-gray-50 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-primary-coral font-medium">
                      {index + 1}/{questions.length}
                    </span>
                    <h3 className="text-lg text-gray-800">
                      {question.text}
                      {question.required && <span className="text-primary-coral ml-1">*</span>}
                    </h3>
                  </div>

                  <RadioGroup 
                    value={answers[question.id] || ''} 
                    onChange={(value) => handleAnswerChange(question.id, value)}
                    className="mt-4"
                  >
                    <div className="space-y-3">
                      {options.map((option) => (
                        <RadioGroup.Option
                          key={option.id}
                          value={option.id}
                          className={({ active, checked }) =>
                            `${active ? 'ring-2 ring-primary-coral/60 ring-offset-2' : ''}
                            ${checked ? 'bg-primary-coral/10' : 'bg-white'}
                            relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none hover:bg-gray-50 transition-all duration-200`
                          }
                        >
                          {({ checked }) => (
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center">
                                <div className="text-sm">
                                  <RadioGroup.Label
                                    as="p"
                                    className={`font-medium ${
                                      checked ? 'text-primary-coral' : 'text-gray-900'
                                    }`}
                                  >
                                    {option.label}
                                  </RadioGroup.Label>
                                </div>
                              </div>
                              {checked && (
                                <div className="shrink-0 text-primary-coral">
                                  <CheckIcon className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowResults(true)}
                className="bg-primary-coral hover:bg-primary-coral/90 text-white px-8 py-3 rounded-full transition-all duration-200"
              >
                Voir mes résultats
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="currentColor" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
