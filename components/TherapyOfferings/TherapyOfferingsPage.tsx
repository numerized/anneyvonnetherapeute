'use client'

import React from 'react'

import { PurchaseTicket } from '@/components/pages/prochainement/PurchaseTicket'
import { BaseOffering } from '@/data/therapyOfferings/types'
import {
  getAllCoachingTypes,
  getAllTherapyTypes,
  getCoachingOfferings,
  getOfferingsByType,
  getTherapyOfferings,
} from '@/data/therapyOfferings/utils'

import { CommonBenefits } from './CommonBenefits'
import { TherapyGrid } from './TherapyGrid'
import LightCapsule from '@/components/pages/therapies/LightCapsule'

interface TherapyOfferingsPageProps {
  displayAll?: boolean
  displayIds?: string[]
  offeringType?: 'therapy' | 'coaching'
}

const TherapyOfferingsPage: React.FC<TherapyOfferingsPageProps> = ({
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

  // Get common benefits
  const commonBenefits = offerings.commonBenefits || []

  // Badge text based on offering type
  const badgeText = offeringType === 'therapy' ? 'THÉRAPIE' : 'COACHING'

  // --- Payment Modal State (copied from TherapyQuestionnaireNew) ---
  const [showPurchaseModal, setShowPurchaseModal] = React.useState(false)
  const [purchaseCurrency, setPurchaseCurrency] = React.useState<'eur' | 'chf'>(
    'chf',
  )
  const [purchaseDetails, setPurchaseDetails] = React.useState<any | null>(null)

  // Wrapper functions to handle type compatibility with TherapyGrid/TherapyCard
  const handleSetPurchaseCurrency = (currency: string) => {
    setPurchaseCurrency(currency as 'eur' | 'chf')
  }

  const handleSetPurchaseDetails = (details: any) => {
    setPurchaseDetails(details)
  }

  const handleSetShowPurchaseModal = (show: boolean) => {
    setShowPurchaseModal(show)
  }

  return (
    <div className="py-16 bg-[#2D3E3C]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <div className="inline-block bg-primary-teal text-primary-cream px-4 py-2 rounded-[24px] text-sm mb-4">
            {badgeText}
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-primary-coral">
            {title}
          </h2>
          <p className="text-primary-cream">{headline}</p>
        </div>
        {/* LightCapsule video component */}
        {/* <LightCapsule
          videoUrl="/videos/PRESENTATION 3 THERAPIES.mp4"
          posterUrl="/images/posters/PRESENTATION 3 THERAPIES.jpg"
          title="Présentation des 3 Thérapies"
          description="Découvrez la présentation vidéo des 3 approches thérapeutiques proposées par Coeur à Corps."
          className="mt-0"
        /> */}
        {/* Therapy Grid */}
        <TherapyGrid
          therapies={offeringTypes as BaseOffering[]}
          displayAll={displayAll}
          displayIds={displayIds}
          offeringType={offeringType}
          setPurchaseDetails={handleSetPurchaseDetails}
          setPurchaseCurrency={handleSetPurchaseCurrency}
          setShowPurchaseModal={handleSetShowPurchaseModal}
        />

        {/* Common Benefits Section */}
        {commonBenefits.length > 0 && (
          <CommonBenefits benefits={commonBenefits} />
        )}
      </div>
      {/* Payment Modal (conditionally render) */}
      {showPurchaseModal && purchaseDetails && (
        <PurchaseTicket
          ticketType="standard"
          onClose={() => setShowPurchaseModal(false)}
          defaultCouponCode={undefined}
          price={purchaseDetails.price}
          currency={purchaseCurrency}
          title={purchaseDetails.title}
          description={purchaseDetails.description}
          priceDetails={purchaseDetails.priceDetails}
          sessionLength={purchaseDetails.sessionLength}
          hasFormulas={purchaseDetails.hasFormulas}
          formulas={purchaseDetails.formulas}
          offeringType={offeringType}
          type={purchaseDetails.type}
        />
      )}
    </div>
  )
}

export default TherapyOfferingsPage
