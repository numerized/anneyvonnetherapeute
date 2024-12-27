'use client'

import { useState } from 'react'
import { RangeInput } from '@/components/ui/RangeInput'

interface QuestionnairePage2Props {
  onPrevious: () => void
  onNext: () => void
}

export function QuestionnairePage2({ onPrevious, onNext }: QuestionnairePage2Props) {
  const [date] = useState(() => {
    const today = new Date()
    return today.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })
  const [strengths, setStrengths] = useState('')
  const [improvements, setImprovements] = useState('')
  const [understanding, setUnderstanding] = useState('')
  const [ratings, setRatings] = useState({
    confidence: '1',
    satisfaction: '1',
    needs: '1'
  })

  const handleRatingChange = (field: keyof typeof ratings, value: string) => {
    setRatings(prev => ({ ...prev, [field]: value }))
  }

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

          <h2 className="text-xl text-gray-600 italic mb-8">Mon état des lieux relationnel</h2>

          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 italic">Évaluez-vous sur les aspects suivants</h3>
            
            <ul className="list-none space-y-8 mb-12">
              <li className="rating-item">
                <div className="flex items-center justify-between mb-2">
                  <span className="italic">Confiance en soi</span>
                  <span className="text-4xl font-light text-primary-coral">{ratings.confidence}</span>
                </div>
                <RangeInput
                  value={ratings.confidence}
                  onChange={(value) => handleRatingChange('confidence', value)}
                />
              </li>
              <li className="rating-item">
                <div className="flex items-center justify-between mb-2">
                  <span className="italic">Satisfaction dans mes relations actuelles</span>
                  <span className="text-4xl font-light text-primary-coral">{ratings.satisfaction}</span>
                </div>
                <RangeInput
                  value={ratings.satisfaction}
                  onChange={(value) => handleRatingChange('satisfaction', value)}
                />
              </li>
              <li className="rating-item">
                <div className="flex items-center justify-between mb-2">
                  <span className="italic">Capacité à exprimer mes besoins</span>
                  <span className="text-4xl font-light text-primary-coral">{ratings.needs}</span>
                </div>
                <RangeInput
                  value={ratings.needs}
                  onChange={(value) => handleRatingChange('needs', value)}
                />
              </li>
            </ul>

            <div className="space-y-8">
              <div className="question-group">
                <h3 className="text-lg font-medium text-gray-700 italic mb-6">Mes points forts</h3>
                <textarea
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  className="w-full border-b border-gray-300 focus:border-primary-coral outline-none min-h-[150px] resize-none p-2"
                  placeholder="Vos points forts..."
                />
              </div>

              <div className="question-group">
                <h3 className="text-lg font-medium text-gray-700 italic mb-6">Mes axes à renforcer</h3>
                <textarea
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  className="w-full border-b border-gray-300 focus:border-primary-coral outline-none min-h-[150px] resize-none p-2"
                  placeholder="Vos axes à renforcer..."
                />
              </div>

              <div className="question-group">
                <h3 className="text-lg font-medium text-gray-700 italic mb-6">J'ai compris que...</h3>
                <textarea
                  value={understanding}
                  onChange={(e) => setUnderstanding(e.target.value)}
                  className="w-full border-b border-gray-300 focus:border-primary-coral outline-none min-h-[150px] resize-none p-2"
                  placeholder="Vos réflexions..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="screen-only">
          <div className="flex justify-between">
            <button
              onClick={onPrevious}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors"
            >
              Précédent
            </button>
            <button
              onClick={onNext}
              disabled
              className="bg-gray-300 text-gray-500 px-6 py-2 rounded-full cursor-not-allowed opacity-50"
            >
              Enregistrer
            </button>
          </div>
        </div>

        <blockquote className="text-primary-coral italic text-sm mt-8 print:hidden">
          "Comme un diamant brut, ma valeur est innée et inaltérable ;
          ni les regards ni les jugements ne sauraient l'entamer."
        </blockquote>
      </div>
    </div>
  )
}
