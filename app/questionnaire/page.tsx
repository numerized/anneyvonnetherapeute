'use client'

import { useState } from 'react'
import { QuestionnaireDay1 } from '@/components/pages/questionnaire/QuestionnaireDay1'
import { QuestionnaireDay2 } from '@/components/pages/questionnaire/QuestionnaireDay2'
import { PrintButton } from '@/components/pages/questionnaire/PrintButton'
import '@/styles/print.css'

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
    <main className="min-h-screen bg-primary-dark print:bg-white print:min-h-0">
      <div className="container mx-auto px-4 py-12 print:p-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-4 print:hidden">
            <PrintButton />
          </div>
          <div className="print:block">
            {/* Day 1 */}
            <div className={`${currentPage === 1 ? 'block' : 'hidden'} print:block print:mb-0`}>
              {questionnaires[0]}
            </div>
            {/* Day 2 */}
            <div className={`${currentPage === 2 ? 'block' : 'hidden'} print:block print:break-before-page`}>
              {questionnaires[1]}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
