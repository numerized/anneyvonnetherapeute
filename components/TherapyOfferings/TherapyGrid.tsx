'use client'

import React, { useState } from 'react'

import { BaseOffering, TherapyType } from '@/data/therapyOfferings/types'
import {
  getAllTherapyTypes,
  getCoachingOfferings,
  getOfferingsByType,
  getTherapyOfferings,
} from '@/data/therapyOfferings/utils'

import { CoachingModal } from './CoachingModal'
import { TherapyCard } from './TherapyCard'
import { TherapyModal } from './TherapyModal'

interface TherapyGridProps {
  therapies?: BaseOffering[]
  className?: string
  displayAll?: boolean
  displayIds?: string[]
  offeringType?: 'therapy' | 'coaching'
}

export const TherapyGrid: React.FC<TherapyGridProps> = ({
  therapies,
  className = '',
  displayAll = true,
  displayIds = [],
  offeringType = 'therapy',
}) => {
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [selectedTherapy, setSelectedTherapy] = useState<string | null>(null)

  // Get therapies from props or fetch all if not provided
  const therapyList = therapies || getOfferingsByType(offeringType)

  // Get common benefits from the offerings data
  const { commonBenefits = [] } =
    offeringType === 'therapy' ? getTherapyOfferings() : getCoachingOfferings()

  // Filter therapies if displayAll is false and displayIds is provided
  const filteredTherapies = displayAll
    ? therapyList
    : therapyList.filter((therapy) => displayIds.includes(therapy.id))

  const handleShowPromo = (therapyId: string) => {
    console.log('handleShowPromo called with ID:', therapyId)
    console.log('Current offering type:', offeringType)
    setSelectedTherapy(therapyId)
    setShowPromoModal(true)
  }

  const handleCloseModal = () => {
    console.log('handleCloseModal called')
    setShowPromoModal(false)
    setSelectedTherapy(null)
  }

  return (
    <div className={`${className}`}>
      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTherapies.map((therapy, index) => (
          <div key={therapy.id} className="h-full">
            <TherapyCard
              therapy={therapy}
              index={index}
              onShowPromo={handleShowPromo}
              commonBenefits={commonBenefits}
            />
          </div>
        ))}
      </div>

      {/* Modal for displaying additional information */}
      {showPromoModal && selectedTherapy && (
        <>
          {offeringType === 'therapy' ? (
            <TherapyModal
              isOpen={showPromoModal}
              onClose={handleCloseModal}
              therapyId={selectedTherapy}
            />
          ) : (
            <CoachingModal
              isOpen={showPromoModal}
              onClose={handleCloseModal}
              coachingId={selectedTherapy}
            />
          )}
        </>
      )}
    </div>
  )
}

export default TherapyGrid
