'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Stats } from '@/components/shared/Stats'
import PaymentSuccess from './PaymentSuccess'
import { PurchaseTicket } from './PurchaseTicket'

export function CoachingRelationelEnGroupePage({ data, settings }: any) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedTicketType, setSelectedTicketType] = useState<'standard' | 'vip'>('standard')
  const [isClient, setIsClient] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlaying2, setIsPlaying2] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const searchParams = useSearchParams()
  const success = searchParams?.get('success') ?? null
  const isCanceled = searchParams?.get('canceled') === 'true'
  const couponCode = searchParams?.get('coupon') ?? undefined
  const currency = settings?.currency || 'EUR'
  const hasDiscount = isCanceled || couponCode === 'COEUR180'
  const capsulesSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)

    const hash = window.location.hash
    if (hash === '#capsules' && capsulesSectionRef.current) {
      setTimeout(() => {
        capsulesSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }

    const handleStopCapsuleVideos = () => {
      if (videoRef.current && isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      }
      if (videoRef2.current && isPlaying2) {
        videoRef2.current.pause()
        setIsPlaying2(false)
      }
    }
    window.addEventListener('stopCapsuleVideos', handleStopCapsuleVideos)
    
    return () => {
      window.removeEventListener('stopCapsuleVideos', handleStopCapsuleVideos)
    }
  }, [isPlaying, isPlaying2])

  const handleTicketPurchase = (type: 'standard' | 'vip') => {
    setSelectedTicketType(type)
    setShowPurchaseModal(true)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        const headerVideo = document.querySelector('video[data-header-video]') as HTMLVideoElement
        if (headerVideo) {
          headerVideo.pause()
          window.dispatchEvent(new CustomEvent('headerVideoPause'))
        }
        if (videoRef2.current && isPlaying2) {
          videoRef2.current.pause()
          setIsPlaying2(false)
        }
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const togglePlay2 = () => {
    if (videoRef2.current) {
      if (isPlaying2) {
        videoRef2.current.pause()
      } else {
        const headerVideo = document.querySelector('video[data-header-video]') as HTMLVideoElement
        if (headerVideo) {
          headerVideo.pause()
          window.dispatchEvent(new CustomEvent('headerVideoPause'))
        }
        if (videoRef.current && isPlaying) {
          videoRef.current.pause()
          setIsPlaying(false)
        }
        videoRef2.current.play()
      }
      setIsPlaying2(!isPlaying2)
    }
  }

  const statsItems = [
    { value: '95%', label: 'Taux de satisfaction client' },
    { value: '500+', label: 'Couples accompagnés' },
    { value: '20', label: 'Années d\'expérience' },
    { value: '85%', label: 'Amélioration des relations' }
  ]

  if (success === 'true') {
    return (
      <PaymentSuccess />
    )
  }

  return (
    <main className="flex-auto">
      <section className="py-24 bg-primary-forest/80 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/MIEUX VIVRE L'AUTRE.webp"
            alt="Mieux Vivre L'autre"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <br/><br/>
            <h2 className="text-3xl md:text-5xl font-medium text-primary-coral mb-4">
              COACHING RELATIONNEL EN GROUPE
            </h2>
            <div className="text-lg md:text-xl">
              <p className="font-bold mb-4" style={{ color: '#D9B70D' }}>DÉPASSEZ VOS SCHÉMAS, VIVEZ L'AMOUR AUTREMENT</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-6 auto-rows-fr">
            <div className="flex-grow">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl text-primary-coral font-semibold">333 {currency?.toUpperCase()}</div>
                  <p className="text-sm text-primary-cream/60 mt-6 max-w-md mx-auto">
                    L'argent ne doit pas être un obstacle, contactez-moi si vous faites faces à des difficultés financières, nous trouverons une solution !
                  </p>
                  {showPurchaseModal && (
                    <PurchaseTicket
                      ticketType="standard"
                      onClose={() => setShowPurchaseModal(false)}
                      defaultCouponCode={couponCode}
                    />
                  )}
                  <button
                    onClick={() => setShowPurchaseModal(true)}
                    className="w-full bg-primary-coral hover:bg-primary-rust text-primary-cream py-3 px-6 rounded-full transition-colors duration-200 mt-6"
                  >
                    Réserver ma place
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-primary-forest rounded-[32px] p-8 shadow-lg">
                <ul className="space-y-4 text-primary-cream/80 m-0">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral">♦</span>
                    <span>Trois séances intensives (11, 18 et 25 mars)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral">♦</span>
                    <span>Horaires : 20h-21h30</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral">♦</span>
                    <span>Petits groupes (5 personnes max)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral">♦</span>
                    <span>Exercices pratiques et prises de conscience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral">♦</span>
                    <span>Transformation profonde de votre manière d'aimer</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-primary-forest rounded-[32px] p-8 mb-8 shadow-lg">
            <h2 className="text-2xl font-medium text-primary-coral mb-6">
              Une immersion profonde pour transformer votre manière d'aimer
            </h2>

            <div className="space-y-6 text-primary-cream/80">
              <p>
                Vous sentez que vos relations amoureuses rejouent toujours les mêmes scénarios ? Vous oscillez entre attirance et peur, 
                entre espoir et déception ? Vous aspirez à un amour plus libre, plus conscient, qui ne repose plus sur l'attente ni la dépendance ?
              </p>

              <p className="font-medium mb-4">Au fil de trois séances intensives, vous découvrirez :</p>
              <ul className="space-y-4 text-primary-cream/80 m-0">
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Pourquoi vous êtes attiré(e) par certains types de personnes et comment sortir des répétitions inconscientes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Comment distinguer l'amour réel du fantasme ou du besoin de validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Comment aimer sans se perdre, sans s'accrocher ni exiger que l'autre nous comble</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral">♦</span>
                  <span>Comment ancrer un amour qui part de soi, sans attente, sans contrôle</span>
                </li>
              </ul>

              <p className="italic font-medium" style={{ color: '#D9B70D' }}>
                Prêt(e) à transformer votre manière d'aimer et à vivre des relations plus authentiques ?
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <Stats 
              title="Une approche unique de la thérapie relationnelle"
              items={statsItems}
            />
          </div>
      </div>
    </main>
  )
}
