'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RangeInput } from '@/components/ui/RangeInput'
import type { Questionnaire, QuestionnaireField } from '@/types/questionnaire'

interface QuestionnaireJSONProps {
  questionnaire: Questionnaire
  currentStep: number
  onNext: () => void
  onBack: () => void
}

export function QuestionnaireJSON({ 
  questionnaire, 
  currentStep,
  onNext, 
  onBack 
}: QuestionnaireJSONProps) {
  const [date] = useState(() => {
    const today = new Date()
    return today.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })

  const [values, setValues] = useState<Record<string, string>>(() => {
    // Initialize with default values from all fields
    const initialValues: Record<string, string> = {}
    questionnaire.steps.forEach(step => {
      step.fields.forEach(field => {
        initialValues[field.id] = field.defaultValue
      })
    })
    return initialValues
  })

  const currentStepData = questionnaire.steps[currentStep]

  const handleFieldChange = (fieldId: string, value: string) => {
    setValues(prev => ({ ...prev, [fieldId]: value }))
  }

  const renderField = (field: QuestionnaireField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <div className="mb-12 question-group">
            <h3 className="text-lg font-medium text-gray-700 italic mb-2">
              {field.title}
            </h3>
            {field.description && (
              <p className="text-gray-600 mb-4">{field.description}</p>
            )}
            {field.hint && (
              <p className="text-gray-500 text-sm mb-4">{field.hint}</p>
            )}
            <textarea
              value={values[field.id]}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full border-b border-gray-300 focus:border-primary-coral outline-none min-h-[150px] resize-none p-2 text-primary-rust"
              placeholder={field.placeholderValue}
            />
          </div>
        )
      
      case 'range':
        return (
          <li className="rating-item mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="italic text-primary-rust font-medium text-xl">{field.title}</span>
              <span className="text-4xl font-light text-primary-rust">
                {values[field.id]}
              </span>
            </div>
            {field.description && (
              <p className="text-gray-600 mb-4">{field.description}</p>
            )}
            {field.hint && (
              <p className="text-gray-500 text-sm mb-4">{field.hint}</p>
            )}
            <RangeInput
              value={values[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
              min={field.min}
              max={field.max}
            />
          </li>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg print:shadow-none relative min-h-screen">
      <div className="flex flex-col h-full print-container">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-4xl font-light">
              <span className="text-primary-coral">étape</span>
              <span className="text-gray-200 text-6xl">{currentStep + 1}</span>
            </h1>
            <div className="text-right">
              <span className="text-gray-600">Date: </span>
              <span className="text-gray-700">{date}</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-primary-coral">{questionnaire.title}</h2>
              <h3 className="text-xl text-gray-600 text-right">{currentStepData.title}</h3>
            </div>
            <p className="text-gray-700 mb-6">{currentStepData.description}</p>
          </div>

          {currentStepData.type === 'mixed' ? (
            <ul className="list-none space-y-8 mb-12">
              {currentStepData.fields.map(field => (
                <div key={field.id}>{renderField(field)}</div>
              ))}
            </ul>
          ) : (
            currentStepData.fields.map(field => (
              <div key={field.id}>{renderField(field)}</div>
            ))
          )}
        </div>

        <div className="flex justify-between mt-8 print:hidden">
          <Button
            variant="outline"
            onClick={onBack}
          >
            Précédent
          </Button>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => window.print()}
            >
              Imprimer
            </Button>
            <Button
              onClick={onNext}
            >
              Suivant
            </Button>
          </div>
        </div>

        {currentStepData.quote && (
          <blockquote className="text-primary-coral italic text-sm mt-8 print:hidden">
            {currentStepData.quote}
          </blockquote>
        )}
      </div>
    </div>
  )
}
