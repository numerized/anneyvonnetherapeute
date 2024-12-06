'use client'

import { MessageSquare, BookOpen, Calendar, Heart, Users } from 'lucide-react'
import { Benefit } from './Benefit'
import { useState } from 'react'
import { PromoModal } from '@/components/global/PromoModal'
import { IndividualPromoModal } from '@/components/global/IndividualPromoModal'
import { VitPromoModal } from '@/components/global/VitPromoModal'
import { CoupleTherapyCard } from './pricing/CoupleTherapyCard'
import { IndividualTherapyCard } from './pricing/IndividualTherapyCard'
import { VitTherapyCard } from './pricing/VitTherapyCard'

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CoupleTherapyCard onShowPromo={handleShowPromo} />
            <IndividualTherapyCard onShowPromo={handleShowPromo} />
            <VitTherapyCard onShowPromo={handleShowPromo} />
          </div>
        </div>
      </section>

      <PromoModal isOpen={showPromoModal} onClose={() => setShowPromoModal(false)} />
      <IndividualPromoModal isOpen={showIndividualPromoModal} onClose={() => setShowIndividualPromoModal(false)} />
      <VitPromoModal isOpen={showVitPromoModal} onClose={() => setShowVitPromoModal(false)} />
    </>
  )
}
