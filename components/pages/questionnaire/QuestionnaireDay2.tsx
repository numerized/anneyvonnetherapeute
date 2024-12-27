'use client'

import { useState } from 'react'

interface QuestionnaireDay2Props {
  onPrevious: () => void
  onNext: () => void
}

export function QuestionnaireDay2({ onPrevious, onNext }: QuestionnaireDay2Props) {
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
    const numValue = parseInt(value)
    if (!isNaN(numValue)) {
      if (numValue < 1) {
        setRatings(prev => ({ ...prev, [field]: '1' }))
      } else if (numValue > 10) {
        setRatings(prev => ({ ...prev, [field]: '10' }))
      } else {
        setRatings(prev => ({ ...prev, [field]: numValue.toString() }))
      }
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg print:shadow-none print:relative print:min-h-[calc(100vh-2cm)]">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-4xl font-light">
          <span className="text-primary-coral">jour</span>
          <span className="text-gray-200 text-6xl">2</span>
        </h1>
        <div className="text-right">
          <span className="text-gray-600">Date: </span>
          <span className="text-gray-700">{date}</span>
        </div>
      </div>

      <h2 className="text-xl text-gray-600 italic mb-8">Mon état des lieux relationnel</h2>

      <div className="mb-12">
        <h3 className="text-xl font-bold mb-6 italic">Évaluez-vous sur les aspects suivants</h3>
        <p className="text-gray-600 italic text-sm mb-6">(Échelle de 1 à 10)</p>
        
        <ul className="list-none space-y-4 mb-12">
          <li className="flex items-center rating-item">
            <span className="italic">Confiance en soi</span>
            <input
              type="number"
              min="1"
              max="10"
              value={ratings.confidence}
              onChange={(e) => handleRatingChange('confidence', e.target.value)}
              onBlur={() => {
                if (!ratings.confidence) {
                  setRatings(prev => ({ ...prev, confidence: '1' }))
                }
              }}
              className="w-12 text-center border border-gray-300 rounded ml-2"
            />
          </li>
          <li className="flex items-center rating-item">
            <span className="italic">Satisfaction dans mes relations actuelles</span>
            <input
              type="number"
              min="1"
              max="10"
              value={ratings.satisfaction}
              onChange={(e) => handleRatingChange('satisfaction', e.target.value)}
              onBlur={() => {
                if (!ratings.satisfaction) {
                  setRatings(prev => ({ ...prev, satisfaction: '1' }))
                }
              }}
              className="w-12 text-center border border-gray-300 rounded ml-2"
            />
          </li>
          <li className="flex items-center rating-item">
            <span className="italic">Capacité à exprimer mes besoins</span>
            <input
              type="number"
              min="1"
              max="10"
              value={ratings.needs}
              onChange={(e) => handleRatingChange('needs', e.target.value)}
              onBlur={() => {
                if (!ratings.needs) {
                  setRatings(prev => ({ ...prev, needs: '1' }))
                }
              }}
              className="w-12 text-center border border-gray-300 rounded ml-2"
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
              className="w-full border-b border-gray-300 focus:border-primary-coral outline-none min-h-[60px] resize-none p-2"
              placeholder="Vos réflexions..."
            />
          </div>
        </div>
      </div>

      <div className="print:absolute print:bottom-[1cm] print:left-8 print:right-8">
        <blockquote className="text-primary-coral italic text-sm">
          "Comme un diamant brut, ma valeur est innée et inaltérable ;
          ni les regards ni les jugements ne sauraient l'entamer."
        </blockquote>
      </div>

      <div className="mt-16 flex justify-between print:hidden">
        <button
          onClick={onPrevious}
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
  )
}
