'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { WebinarHero } from './WebinarHero'
import { PurchaseTicket } from './PurchaseTicket'
import PaymentSuccess from './PaymentSuccess'

interface Settings {
  title?: string
  description?: string
  logo?: string
  // Add other settings fields as needed
}

interface WebinarData {
  hero: {
    title: string
    subtitle: string
  }
}

interface WebinarPageProps {
  data: WebinarData
  settings: Settings
}

export function WebinarPage({ data, settings }: WebinarPageProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedTicketType, setSelectedTicketType] = useState<'standard' | 'vip' | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

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

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Add validation for required data
  if (!data?.hero?.title || !settings) {
    console.error('Missing required data:', { data, settings })
    setIsLoading(true)
    return (
      <div className="min-h-screen bg-primary-forest flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h1 className="text-3xl mb-4">Contenu en cours de chargement</h1>
          <p>Merci de patienter quelques instants...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-forest flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h1 className="text-3xl mb-4">Contenu en cours de chargement</h1>
          <p>Merci de patienter quelques instants...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex-auto">
      {searchParams.get('success') === 'true' ? (
        <PaymentSuccess />
      ) : (
        <>
          <WebinarHero hero={data.hero} data={settings} />
          
          {/* Festival Section */}
          <section className="py-24 bg-primary-forest">
            <div className="max-w-4xl mx-auto px-6">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-medium text-primary-coral mb-4">
                  Mieux vivre l'autre
                </h2>
                <p className="text-lg md:text-xl text-primary-cream/80">
                  Une formation pour élever la conscience relationnelle dans la diversité
                </p>
              </div>

              {/* Whereby Video */}
              <div className="w-full max-w-4xl mx-auto px-4 py-8">
                <div className="relative aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl group">
                  <video 
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    poster="/images/whereby-poster.png"
                    onClick={toggleVideo}
                  >
                    <source src="/videos/whereby.mp4" type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                  
                  {/* Frosted Play/Pause Button */}
                  <div 
                    className={`absolute top-4 left-4 transition-opacity duration-300 
                      ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                    onClick={toggleVideo}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md cursor-pointer 
                                  flex items-center justify-center
                                  transform transition-transform duration-300 hover:scale-110">
                      {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid md:grid-cols-2 gap-8 mb-12 auto-rows-fr">
                <div>
                  <div className="bg-primary-forest/60 rounded-[24px] p-6">
                    <h3 className="text-xl font-light text-primary-cream mb-4">Détails de l'événement</h3>
                    <ul className="space-y-4 text-primary-cream/80">
                      <li className="flex items-start gap-2">
                        <span className="text-primary-coral">♦</span>
                        <span>DATES INCLUES DANS LA RESERVATION</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-coral">♦</span>
                        <span>2 + 9 + 23 février 2025</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-coral">♦</span>
                        <span>19h-21.30h</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-coral">♦</span>
                        <span>Format: Whereby (sans inscriptions ni installation)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="bg-primary-forest/60 rounded-[24px] p-6">
                    <h3 className="text-xl font-light text-primary-cream mb-4">Tarif</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-primary-cream/80">
                          <span>Tarif unique</span>
                          <span className="text-primary-coral font-bold">1 CHF/EUROS</span>
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

              {/* Description */}
              <div className="bg-primary-forest/60 rounded-[24px] p-6 mb-12">
                <h3 className="text-xl font-light text-primary-cream mb-4">À propos de l'événement</h3>
                <div className="space-y-4 text-primary-cream/80">
                  <p>
                    Dans un monde où les interactions sociales sont souvent façonnées par des normes implicites, les personnes multipotentielles et neurodivergentes se distinguent par leur conscience élevée et leur perception unique de la réalité.
                  </p>
                  <p>
                    Leur richesse cognitive, leur hypersensibilité et leur pensée divergente sont des manifestations d'une conscience éveillée, offrant à la fois des opportunités d'évolution personnelle et collective, mais aussi des défis relationnels.
                  </p>
                  <p>
                    Cette mini-formation vise à offrir des outils concrets pour naviguer dans cet univers relationnel complexe avec une conscience accrue.
                  </p>
                  <p>
                    Que vous soyez multipotentiel(le), doté(e) d'une curiosité insatiable et d'une quête constante d'expansion de conscience, ou neurodivergent(e), avec des modes de perception et de communication transcendant les normes conventionnelles, cette formation vous guidera pour :
                  </p>
                  
                  <ul className="space-y-4 pl-6">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-coral">♦</span>
                      <span>Approfondir votre conscience de soi et valoriser votre essence unique : Identifier vos besoins relationnels profonds, établir des limites saines, et cultiver des liens alignés avec votre vérité intérieure.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-coral">♦</span>
                      <span>Explorer les dimensions supérieures de la communication : Développer des stratégies pour transmuter les incompréhensions liées à votre fonctionnement atypique en opportunités d'éveil mutuel, favorisant des échanges authentiques et élevés.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-coral">♦</span>
                      <span>Tisser des liens d'âme à âme : Découvrir comment vos différences sont en réalité des portails vers une compréhension plus profonde de l'humanité, enrichissant vos relations personnelles et professionnelles d'une dimension spirituelle.</span>
                    </li>
                  </ul>

                  <p>
                    En célébrant la diversité cognitive et émotionnelle comme une expression de l'évolution de la conscience collective, cette formation vise à construire des relations plus harmonieuses et éveillées.
                  </p>
                  <p>
                    Elle offre un espace sacré où chacun peut apprendre à incarner pleinement sa fréquence unique tout en honorant celle des autres. Cette formation met l'accent sur l'éveil de la conscience de soi, la compréhension mutuelle à un niveau supérieur, et le développement d'une communication qui transcende les différences apparentes.
                  </p>
                  <p>
                    Elle répond aux défis spécifiques rencontrés par les âmes multipotentielles (comme le besoin d'expansion constante ou la gestion de l'hypersensibilité) et les êtres neurodivergents (comme la navigation dans les subtilités des attentes sociales ou l'expression de besoins non conventionnels), tout en célébrant leurs dons uniques comme des catalyseurs d'évolution collective.
                  </p>
                  <p>
                    En seulement deux soirées et un Q/R, vous pourrez amorcer un changement durable dans votre façon d'interagir avec les autres et avec vous-même. C'est un investissement précieux pour votre bien-être émotionnel et votre épanouissement personnel.
                  </p>
                  <p className="text-primary-coral font-bold">
                    Inscrivez-vous dès maintenant pour réserver votre place et commencer votre voyage vers des relations plus conscientes et épanouissantes !
                  </p>
                  <p className="text-sm text-primary-cream/60">
                     Le prix comprend les trois soirées de formation. Le lien vous sera envoyé dès le payement reçu.
                  </p>
                </div>
                <div className="mt-8 flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTicketPurchase('standard')}
                    className="bg-primary-coral hover:bg-primary-rust text-primary-cream rounded-full py-3 px-8 text-lg transition-colors w-full max-w-md"
                  >
                    Réserver ma place
                  </motion.button>
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
