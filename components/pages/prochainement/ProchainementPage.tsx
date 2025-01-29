'use client'

import { ProchainementHero } from './ProchainementHero'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { PurchaseTicket } from './PurchaseTicket'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import PaymentSuccess from './PaymentSuccess'

export function ProchainementPage({ data, settings }: any) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedTicketType, setSelectedTicketType] = useState<'standard' | 'vip' | null>(null)
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  useEffect(() => {
    // Check for successful payment
    if (searchParams.get('success') === 'true') {
      toast.success('Paiement réussi ! Vous recevrez un email avec les détails d\'accès.')
    }
    // Check for canceled payment
    if (searchParams.get('canceled') === 'true') {
      toast.error('Le paiement a été annulé.')
    }
  }, [searchParams])

  const handleTicketPurchase = (type: 'standard' | 'vip') => {
    setSelectedTicketType(type)
    setShowPurchaseModal(true)
  }

  if (!data?.hero) {
    return null
  }

  return (
    <main className="flex-auto">
      {success === 'true' ? (
        <PaymentSuccess />
      ) : (
        <>
          <ProchainementHero hero={data.hero} data={settings} />
          
          {/* Main Content Section */}
          <section className="py-24 bg-primary-forest/80 rounded-3xl">
            <div className="max-w-4xl mx-auto px-6">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-medium text-primary-coral mb-4">
                  COACHING RELATIONNEL 7/7
                </h2>
                <div className="text-lg md:text-xl text-primary-cream/80">
                  <p className="font-bold mb-4">OFFRE EXCLUSIVE LIMITÉE</p>
                  <p className="mb-4">
                    OPTIMISEZ VOS RELATIONS EN 1 MOIS
                  </p>
                  <p className="mb-6">
                    SPECIAL DIVERSITÉS
                  </p>
                </div>
              </div>

              {/* Event Details and Price Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-12 auto-rows-fr">
                <div>
                  <div className="bg-primary-forest rounded-[32px] p-8 shadow-lg">
                    <h3 className="text-xl font-light text-primary-cream mb-4">Détails de l'événement</h3>
                    <ul className="space-y-4 text-primary-cream/80">
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
                        <span>TROIS SEANCES DE THÉRAPIE À LA CARTE VIA ZOOM</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="bg-primary-forest rounded-[32px] p-8 shadow-lg">
                    <h3 className="text-xl font-light text-primary-cream mb-4">Tarif</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-primary-cream/80">
                          <span>Tarif unique</span>
                          <span className="text-primary-coral font-bold">999 EUROS/CHF</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleTicketPurchase('standard')}
                          className="w-full bg-primary-coral hover:bg-primary-rust text-primary-cream rounded-full py-2 text-sm transition-colors"
                        >
                          Réserver ma place
                        </motion.button>
                      </div>
                      <p className="text-primary-cream/60 text-sm mt-4">
                        L'argent ne doit pas être un obstacle, contactez-moi si vous faites faces à des difficultés financières, nous trouverons une solution !
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rest of the content... */}
              <div className="bg-primary-forest rounded-[32px] p-8 mb-12 shadow-lg">
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
                  <ul className="space-y-4 text-primary-cream/80">
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

                  <p className="italic font-medium text-primary-coral">
                    Comprendre, c'est changer. Êtes-vous prêt à repenser vos relations à la lumière d'une démarche précise et impactante ?
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Purchase Modal */}
          {showPurchaseModal && selectedTicketType && (
            <PurchaseTicket
              ticketType={selectedTicketType}
              onClose={() => {
                setShowPurchaseModal(false)
                setSelectedTicketType(null)
              }}
            />
          )}
        </>
      )}
    </main>
  )
}
