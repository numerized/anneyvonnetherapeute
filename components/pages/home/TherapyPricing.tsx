'use client'

import { BookOpen, Calendar, Heart, MessageSquare, Users } from 'lucide-react'
import { useState } from 'react'

import { IndividualPromoModal } from '@/components/global/IndividualPromoModal'
import { PromoModal } from '@/components/global/PromoModal'
import { VitPromoModal } from '@/components/global/VitPromoModal'

import { Benefit } from './Benefit'
import { CoupleTherapyCard } from './pricing/CoupleTherapyCard'
import { IndividualTherapyCard } from './pricing/IndividualTherapyCard'
import { MenTherapyCard } from './pricing/MenTherapyCard'
import { SexologyTherapyCard } from './pricing/SexologyTherapyCard'
import { VitTherapyCard } from './pricing/VitTherapyCard'
import { WomenTherapyCard } from './pricing/WomenTherapyCard'

interface TherapyPricingProps {
  className?: string
}

export function TherapyPricing({ className }: TherapyPricingProps) {
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [showIndividualPromoModal, setShowIndividualPromoModal] = useState(false)
  const [showVitPromoModal, setShowVitPromoModal] = useState(false)

  const handleShowPromo = (modalType: string) => {
    if (modalType === 'promo') {
      setShowPromoModal(true)
    } else if (modalType === 'individual') {
      setShowIndividualPromoModal(true)
    } else if (modalType === 'vit') {
      setShowVitPromoModal(true)
    }
  }

  return (
    <>
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-primary-teal text-primary-cream px-4 py-2 rounded-[24px] text-sm mb-4">
              NOS THÉRAPIES
            </div>
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              Transformez Votre Vie
            </h2>
            <p className="text-gray-400">
              Une approche holistique pour une harmonie durable
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CoupleTherapyCard onShowPromo={() => handleShowPromo('promo')} />
            <SexologyTherapyCard onShowPromo={() => handleShowPromo('promo')} />
            <MenTherapyCard onShowPromo={() => handleShowPromo('individual')} />
            <WomenTherapyCard onShowPromo={() => handleShowPromo('individual')} />
            <IndividualTherapyCard onShowPromo={() => handleShowPromo('individual')} />
            <VitTherapyCard onShowPromo={() => handleShowPromo('vit')} />
          </div>
        </div>
      </section>

      <PromoModal isOpen={showPromoModal} onClose={() => setShowPromoModal(false)} />
      <IndividualPromoModal isOpen={showIndividualPromoModal} onClose={() => setShowIndividualPromoModal(false)} />
      <VitPromoModal isOpen={showVitPromoModal} onClose={() => setShowVitPromoModal(false)} />
    </>
  )
}
