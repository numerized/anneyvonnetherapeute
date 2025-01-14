'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionnaireJSON } from '@/components/pages/questionnaire/QuestionnaireJSON'
import questionnaire from '@/data/questionnaires/self-esteem.json'

export default function QuestionnaireJSONRoute() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < questionnaire.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      router.push('/questionnaire/completed')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    } else {
      router.back()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <QuestionnaireJSON 
          questionnaire={questionnaire}
          currentStep={currentStep}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>
    </div>
  )
}
