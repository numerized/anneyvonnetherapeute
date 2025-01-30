'use client'

import { ProchainementHero } from './ProchainementHero'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { PurchaseTicket } from './PurchaseTicket'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import PaymentSuccess from './PaymentSuccess'
import Image from 'next/image'
import { Stats } from '@/components/shared/Stats'

export function ProchainementPage({ data, settings }: any) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedTicketType, setSelectedTicketType] = useState<'standard' | 'vip' | null>(null)
  const [currentImage, setCurrentImage] = useState<'tempoffer' | 'flyer'>('tempoffer')
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const isCanceled = searchParams.get('canceled') === 'true'

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Paiement réussi ! Vous recevrez un email avec les détails d\'accès.')
    }
    if (searchParams.get('canceled') === 'true') {
      toast.error('Le paiement a été annulé.')
    }
  }, [searchParams])

  const handleTicketPurchase = (type: 'standard' | 'vip') => {
    setSelectedTicketType(type)
    setShowPurchaseModal(true)
  }

  const toggleImage = () => {
    setCurrentImage(current => current === 'tempoffer' ? 'flyer' : 'tempoffer')
  }

  if (!data?.hero) {
    return null
  }

  const statsItems = [
    { value: '95%', label: 'Taux de satisfaction client' },
    { value: '500+', label: 'Couples accompagnés' },
    { value: '20', label: 'Années d\'expérience' },
    { value: '85%', label: 'Amélioration des relations' }
  ]

  return (
    <main className="flex-auto">
      {success === 'true' ? (
        <PaymentSuccess />
      ) : (
        <>
          <ProchainementHero hero={data.hero} data={settings} onShowPurchase={() => setShowPurchaseModal(true)} />

          {/* Main Content Section */}
          <section className="py-24 bg-primary-forest/80 rounded-3xl">
            <div className="max-w-4xl mx-auto px-6">

              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-medium text-primary-coral mb-4">
                  COACHING RELATIONNEL 7/7
                </h2>
                <div className="text-lg md:text-xl">
                  <p className="font-bold mb-4" style={{ color: '#D9B70D' }}>OFFRE EXCLUSIVE LIMITÉE</p>
                </div>
              </div>

              {/* Offer Image with Animation */}
              {!isCanceled && (
                <div
                  id="offer-section"
                  className="mb-12 relative w-full aspect-[16/9] rounded-[32px] overflow-hidden cursor-pointer"
                  onClick={toggleImage}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={`/images/${currentImage}.webp`}
                        alt={currentImage === 'tempoffer' ? 'Offre temporaire' : 'Flyer de la formation'}
                        fill
                        className="object-cover"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {/* Event Details and Price Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-6 auto-rows-fr">

                <div className="flex-grow">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      {isCanceled ? (
                        <div className="space-y-4">
                          <div className="text-2xl line-through text-primary-cream/60">999 EUROS/CHF</div>
                          <div className="text-3xl text-primary-coral font-semibold">899 EUROS/CHF</div>
                          <div className="bg-primary-coral/20 rounded-lg py-2 px-6 inline-block">
                            <span className="text-primary-coral font-semibold">COEUR180</span>
                            <span className="ml-2">-10%</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-3xl">999 EUROS/CHF</div>
                      )}
                      <p className="text-sm text-primary-cream/60 mt-6 max-w-md mx-auto">
                        L'argent ne doit pas être un obstacle, contactez-moi si vous faites faces à des difficultés financières, nous trouverons une solution !
                      </p>
                      <button
                        onClick={() => setShowPurchaseModal(true)}
                        className="w-full bg-primary-coral hover:bg-primary-rust text-primary-cream py-3 px-6 rounded-full transition-colors duration-200 mt-6"
                      >
                        {isCanceled ? 'Profiter de l\'offre -10%' : 'Réserver ma place'}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-primary-forest rounded-[32px] p-8 shadow-lg">
                    <ul className="space-y-4 text-primary-cream/80 m-0">
                      <li className="flex items-start gap-2">
                        <span className="text-primary-coral">♦</span>
                        <span>OPTIMISEZ VOS RELATIONS EN 1 MOIS</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-coral">♦</span>
                        <span>SPECIAL DIVERSITÉS</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-coral">♦</span>
                        <span>COACHING INDIVIDUEL 24/24 SUR 1 MOIS</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-coral">♦</span>
                        <span>ÉCHANGES QUOTIDIENS VIA TELEGRAM</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-coral">♦</span>
                        <span>TROIS SEANCES DE THÉRAPIE À LA CARTE VIA WHEREBY</span>
                      </li>
                    </ul>
                  </div>
                </div>


              </div>

              {/* Rest of the content... */}
              <div className="bg-primary-forest rounded-[32px] p-8 mb-8 shadow-lg">
                <h2 className="text-2xl font-medium text-primary-coral mb-6">
                  Explorez vos relations sous un nouveau prisme
                </h2>

                <div className="space-y-6 text-primary-cream/80">
                  <p>
                    Ce programme n'est pas une simple démarche d'accompagnement. C'est une exploration méthodique de vos dynamiques relationnelles,
                    fondée sur une analyse fine et des outils concrets.
                  </p>

                  <p>
                    Chaque interaction, chaque blocage, chaque incompréhension est porteur de sens. Ce coaching vous invite à déchiffrer
                    ces messages sous-jacents et à comprendre ce qui, parfois, freine ou complexifie vos liens personnels et professionnels.
                  </p>

                  <p className="font-medium mb-4">Les résultats ne résident pas dans des promesses vagues, mais dans une transformation palpable :</p>
                  <ul className="space-y-4 text-primary-cream/80 m-0">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-coral">♦</span>
                      <span>Une lucidité accrue sur vos comportements et leurs impacts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-coral">♦</span>
                      <span>Une capacité renforcée à ajuster vos réponses émotionnelles et stratégiques.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-coral">♦</span>
                      <span>La création de relations en phase avec vos valeurs, vos objectifs et votre vision.</span>
                    </li>
                  </ul>

                  <p>
                    En 1 mois, avec un accompagnement continu et des séances ciblées, vous développerez des compétences relationnelles tangibles,
                    applicables immédiatement dans votre quotidien. Loin des approches stéréotypées, ce programme vous offre une structure
                    rationnelle et rigoureuse pour atteindre une maîtrise de vos interactions.
                  </p>

                  <p className="italic font-medium" style={{ color: '#D9B70D' }}>
                    Comprendre, c'est changer. Êtes-vous prêt à repenser vos relations à la lumière d'une démarche précise et impactante ?
                  </p>
                </div>
              </div>
              {/* Stats Section */}
              <Stats
                title="Une approche unique de la thérapie relationnelle"
                items={statsItems}
              />
            </div>
          </section>

          {/* Purchase Modal */}
          {showPurchaseModal && (
            <PurchaseTicket
              ticketType="standard"
              onClose={() => setShowPurchaseModal(false)}
              defaultCouponCode={isCanceled ? 'COEUR180' : undefined}
            />
          )}
        </>
      )}
    </main>
  )
}
