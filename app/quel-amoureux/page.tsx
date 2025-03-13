'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { questions, options, Question, Option } from '@/lib/questionnaire'

function QuelAmoureuxContent() {
  const searchParams = useSearchParams()
  const email = searchParams?.get('email') ?? ''

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

export default function QuelAmoureuxPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary-forest flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-coral"></div>
      </div>
    }>
      <QuelAmoureuxContent />
    </Suspense>
  )
}
