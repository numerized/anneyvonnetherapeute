'use client'

import { ProchainementHero } from './ProchainementHero'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
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
          
          {/* Festival Section */}
          <section className="py-24 bg-primary-forest/30">
            <div className="max-w-4xl mx-auto px-6">
              <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[32px] p-8 md:p-12">
                {/* Header */}
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-light text-primary-cream mb-4">
                    Festival de la Poésie
                  </h2>
                  <p className="text-xl text-primary-coral italic mb-2">8e édition</p>
                  <p className="text-lg text-primary-cream/80">
                    Intervention en direct sur Whereby par <span className="text-primary-coral">Anne Yvonne Racine</span>
                  </p>
                </div>

                {/* Event Details */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="space-y-6">
                    <div className="bg-primary-forest/30 rounded-[24px] p-6">
                      <h3 className="text-xl font-light text-primary-cream mb-4">Détails de l'événement</h3>
                      <ul className="space-y-4 text-primary-cream/80">
                        <li className="flex items-start gap-2">
                          <span className="text-primary-coral">♦</span>
                          <span>Date: 15 Mars 2025</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary-coral">♦</span>
                          <span>Heure: 19h00 - 22h00</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary-coral">♦</span>
                          <span>Format: Diffusion en direct sur Whereby</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-primary-forest/30 rounded-[24px] p-6">
                      <h3 className="text-xl font-light text-primary-cream mb-4">Tarifs</h3>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-primary-cream/80">
                            <span>Accès standard</span>
                            <span className="text-primary-coral font-bold">45 CHF</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTicketPurchase('standard')}
                            className="w-full bg-primary-coral/20 hover:bg-primary-coral/30 text-primary-cream rounded-full py-2 text-sm transition-colors"
                          >
                            Acheter
                          </motion.button>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-primary-cream/80">
                            <span>Pack VIP (places limitées)</span>
                            <span className="text-primary-coral font-bold">85 CHF</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTicketPurchase('vip')}
                            className="w-full bg-primary-coral hover:bg-primary-rust text-primary-cream rounded-full py-2 text-sm transition-colors"
                          >
                            Acheter en VIP
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-primary-forest/30 rounded-[24px] p-6 mb-12">
                  <h3 className="text-xl font-light text-primary-cream mb-4">À propos de l'événement</h3>
                  <p className="text-primary-cream/80 mb-4">
                    Rejoignez-nous pour une soirée exceptionnelle dédiée à la poésie et à l'expression artistique, 
                    diffusée en direct par Anne Yvonne Racine. Cette 8e édition du Festival de la Poésie promet 
                    d'être une célébration unique de la créativité et de l'émotion à travers les mots.
                  </p>
                  <p className="text-primary-cream/80 mb-4">
                    Profitez de cette expérience immersive depuis le confort de votre domicile grâce à notre 
                    diffusion en direct sur Whereby. Interagissez en temps réel et plongez dans l'univers poétique.
                  </p>
                  <p className="text-primary-cream/80">
                    Le pack VIP inclut : un accès prioritaire, une session de questions-réponses exclusive avec 
                    Anne Yvonne Racine après le spectacle, et l'accès à l'enregistrement de l'événement pendant 30 jours.
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
