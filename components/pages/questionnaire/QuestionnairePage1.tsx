'use client'

import { useState } from 'react'

interface QuestionnairePage1Props {
  onNext: () => void
  onBack: () => void
}

export function QuestionnairePage1({ onNext, onBack }: QuestionnairePage1Props) {
  const [date] = useState(() => {
    const today = new Date()
    return today.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })
  const [whyImportant, setWhyImportant] = useState('')
  const [definition, setDefinition] = useState('')

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg print:shadow-none relative min-h-screen">
      <div className="flex flex-col h-full print-container">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-4xl font-light">
              <span className="text-primary-coral">jour</span>
              <span className="text-gray-200 text-6xl">1</span>
            </h1>
            <div className="text-right">
              <span className="text-gray-600">Date: </span>
              <span className="text-gray-700">{date}</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-gray-700 mb-6">
              L'estime de soi est la pierre angulaire de toutes les relations saines.
              Elle nous permet de nous respecter, de poser des limites et d'attirer des interactions
              épanouissantes. Dans ce carnet, vous explorerez vos forces, vos besoins et vos
              objectifs pour construire une vie amoureuse alignée avec vos valeurs.
            </p>
          </div>

          <div className="mb-12 question-group">
            <h3 className="text-lg font-medium text-gray-700 italic mb-6">Pourquoi l'estime de soi est essentielle en amour</h3>
            <textarea
              value={whyImportant}
              onChange={(e) => setWhyImportant(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-primary-coral outline-none min-h-[250px] resize-none p-2"
              placeholder="Votre réponse..."
            />
          </div>

          <div className="mb-12 question-group">
            <h3 className="text-lg font-medium text-gray-700 italic mb-6">Ma propre définition de l'estime de soi</h3>
            <textarea
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-primary-coral outline-none min-h-[150px] resize-none p-2"
              placeholder="Votre réponse..."
            />
          </div>
        </div>

        <div className="screen-only">
          <div className="flex justify-between">
            <button
              onClick={onBack}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors"
            >
              Précédent
            </button>
            <button
              onClick={onNext}
              className="bg-primary-coral text-white px-6 py-2 rounded-full hover:bg-primary-rust transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>

        <blockquote className="text-primary-coral italic text-sm mt-8 print:hidden">
          "Vous seul(e) détenez le pouvoir de définir votre valeur.
          Ne laissez jamais quelqu'un d'autre écrire votre histoire."
        </blockquote>
      </div>
    </div>
  )
}
