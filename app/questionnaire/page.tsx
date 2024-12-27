'use client'

import { useState } from 'react'
import { QuestionnaireDay1 } from '@/components/pages/questionnaire/QuestionnaireDay1'
import { QuestionnaireDay2 } from '@/components/pages/questionnaire/QuestionnaireDay2'

export default function QuestionnairePage() {
  const [currentPage, setCurrentPage] = useState(1)

  const questionnaires = [
    <QuestionnaireDay1 key="day1" onNext={() => setCurrentPage(2)} />,
    <QuestionnaireDay2 
      key="day2" 
      onPrevious={() => setCurrentPage(1)} 
      onNext={() => setCurrentPage(3)} 
    />,
  ]

  return (
    <main className="min-h-screen bg-primary-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {questionnaires[currentPage - 1]}
        </div>
      </div>
    </main>
  )
}
