'use client'

import { useState } from 'react'

import { PrintButton } from '@/components/pages/questionnaire/PrintButton'
import { QuestionnairePage1 } from '@/components/pages/questionnaire/QuestionnairePage1'
import { QuestionnairePage2 } from '@/components/pages/questionnaire/QuestionnairePage2'

import '@/styles/print.css'

export default function QuestionnairePage() {
  const [currentPage, setCurrentPage] = useState(1)

  const handleNext = () => {
    setCurrentPage(2)
  }

  const handlePrevious = () => {
    setCurrentPage(1)
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-primary-forest py-8 px-4 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="print:hidden mb-4 flex justify-end">
          <PrintButton />
        </div>
        <div className="print:block">
          {/* Page 1 */}
          <div
            className={`${currentPage === 1 ? 'block' : 'hidden'} print:block print:mb-0`}
          >
            <QuestionnairePage1 onNext={handleNext} onBack={handleBack} />
          </div>
          {/* Page 2 */}
          <div
            className={`${currentPage === 2 ? 'block' : 'hidden'} print:block print:break-before-page`}
          >
            <QuestionnairePage2 onPrevious={handlePrevious} onNext={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )
}
