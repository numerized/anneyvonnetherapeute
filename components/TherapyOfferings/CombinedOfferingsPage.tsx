'use client'

import React from 'react'

import { BaseOffering } from '@/data/therapyOfferings/types'
import {
  getAllCoachingTypes,
  getAllTherapyTypes,
  getCoachingOfferings,
  getOfferingsByType,
  getTherapyOfferings,
} from '@/data/therapyOfferings/utils'

import { TherapyGrid } from './TherapyGrid'

interface CombinedOfferingsPageProps {
  displayAll?: boolean
  displayIds?: string[]
  offeringType?: 'therapy' | 'coaching'
}

const CombinedOfferingsPage: React.FC<CombinedOfferingsPageProps> = ({
  displayAll = true,
  displayIds = [],
  offeringType = 'therapy',
}) => {
  // Get the offerings and types based on the offering type
  const offerings =
    offeringType === 'therapy' ? getTherapyOfferings() : getCoachingOfferings()

  const offeringTypes = getOfferingsByType(offeringType)

  // Get the title and headline based on the offering type
  const title =
    offerings.title ||
    (offeringType === 'therapy'
      ? 'Transformez Votre Vie avec la Thérapie'
      : 'Transformez Votre Vie avec le Coaching')

  const headlineItem = offeringTypes.length > 0 ? offeringTypes[0] : null
  const headline =
    headlineItem?.headline ||
    'Une approche holistique pour une harmonie durable'

  // Badge text based on offering type
  const badgeText = offeringType === 'therapy' ? 'THÉRAPIES' : 'COACHINGS'

  return (
    <div className="py-16 bg-[#2D3E3C]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-primary-teal text-primary-cream px-4 py-2 rounded-[24px] text-sm mb-4">
            THÉRAPIES ET COACHINGS
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-primary-coral">
            Trouvez l'Accompagnement Qui Vous Correspond
          </h2>
          <p className="text-primary-cream">
            Découvrez notre sélection d'approches thérapeutiques et de coachings
            personnalisés pour votre épanouissement
          </p>
        </div>

        {/* Therapy Section */}
        <div className="mb-16">
          <h3 className="text-2xl text-primary-cream mb-8 text-center">
            Nos Thérapies
          </h3>
          <TherapyGrid
            therapies={getAllTherapyTypes() as BaseOffering[]}
            displayAll={true}
            offeringType="therapy"
          />
        </div>

        {/* Coaching Section */}
        <div className="mt-16">
          <h3 className="text-2xl text-primary-cream mb-8 text-center">
            Nos Coachings
          </h3>
          <TherapyGrid
            therapies={getAllCoachingTypes() as BaseOffering[]}
            displayAll={true}
            offeringType="coaching"
          />
        </div>

        {/* Note: Common Benefits section is intentionally removed as requested */}
      </div>
    </div>
  )
}

export default CombinedOfferingsPage
