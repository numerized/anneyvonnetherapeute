'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Stats } from '@/components/shared/Stats'
import TherapyQuestionnaireNew from '@/components/TherapyOfferings/TherapyQuestionnaireNew'
import ProchainementVideoCapsule from "./ProchainementVideoCapsule";
import { CustomCapsuleMiroirCard } from './CustomCapsuleMiroirCard'

import PaymentSuccess from './PaymentSuccess'
import { ProchainementHeroWrapper as ProchainementHero } from './ProchainementHero'

export function ProchainementPage({ data, settings }: any) {
  const [isClient, setIsClient] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlaying2, setIsPlaying2] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const searchParams = useSearchParams()
  const success = searchParams?.get('success') ?? null
  const capsulesSectionRef = useRef<HTMLDivElement>(null)
  const questionnaireSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)

    // Check for hash in URL and scroll if needed
    const hash = window.location.hash
    if (hash === '#capsules' && capsulesSectionRef.current) {
      setTimeout(() => {
        capsulesSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }

    // Listen for stop capsule videos event from hero
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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        // Stop header video if playing and update its state
        const headerVideo = document.querySelector(
          'video[data-header-video]',
        ) as HTMLVideoElement
        if (headerVideo) {
          headerVideo.pause()
          // Update header's play button state through a custom event
          window.dispatchEvent(new CustomEvent('headerVideoPause'))
        }
        // Pause the second video if it's playing
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
        // Stop header video if playing and update its state
        const headerVideo = document.querySelector(
          'video[data-header-video]',
        ) as HTMLVideoElement
        if (headerVideo) {
          headerVideo.pause()
          // Update header's play button state through a custom event
          window.dispatchEvent(new CustomEvent('headerVideoPause'))
        }
        // Pause the first video if it's playing
        if (videoRef.current && isPlaying) {
          videoRef.current.pause()
          setIsPlaying(false)
        }
        videoRef2.current.play()
      }
      setIsPlaying2(!isPlaying2)
    }
  }

  const scrollToQuestionnaire = () => {
    questionnaireSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!data?.hero) {
    return null
  }

  const statsItems = [
    { value: '95%', label: 'Taux de satisfaction client' },
    { value: '500+', label: 'Couples accompagnés' },
    { value: '20', label: "Années d'expérience" },
    { value: '85%', label: 'Amélioration des relations' },
  ]

  return (
    <main className="flex-auto">
      {success === 'true' ? (
        <PaymentSuccess />
      ) : (
        <>
          <ProchainementHero
            hero={data.hero}
            data={settings}
            onShowPurchase={scrollToQuestionnaire}
            customButtonText="Commencer le questionnaire"
          />
          <ProchainementVideoCapsule
            title="Présentation de l'accompagnement Coeur à Corps"
            introduction="Découvrez la présentation vidéo de l'accompagnement Coeur à Corps."
            videoUrl="/videos/PRESENTATION 3 THERAPIES.mp4"
            posterUrl="/images/posters/PRESENTATION 3 THERAPIES.jpg"
          />
          {/* Main Content Section */}
          <section className="py-24 bg-primary-forest/80 rounded-3xl">
            {/* Stats Section */}
            <div className="ml-6 mr-6 max-w-[calc(100vw-48px)] w-full md:w-full md:mx-auto lg:w-4/5 lg:mx-auto">
              <Stats
                title="Une approche unique de la thérapie relationnelle"
                items={statsItems}
              />
            </div>

            {/* Questionnaire Section */}
            <div ref={questionnaireSectionRef} className="mt-16 mb-16 flex justify-center">
              <div className="w-[80vw] mx-auto rounded-[32px] overflow-hidden px-0 md:px-8 lg:px-16" style={{ backgroundColor: 'rgb(41, 58, 58)' }}>
                <TherapyQuestionnaireNew />
              </div>
            </div>

            {/* Presentation Section */}
            <div className="mb-16 bg-primary-dark/30 rounded-[32px] overflow-hidden max-w-[calc(100vw-48px)] w-full ml-6 mr-6 md:mx-auto md:w-4/5 lg:w-3/5">
              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Image Column */}
                <div className="relative md:h-full">
                  <div className="md:hidden relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <Image
                      src="/images/IMG_3901.webp"
                      alt="Anne Yvonne Racine"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={75}
                      priority
                    />
                  </div>
                  <div className="hidden md:block relative h-full min-h-[400px] rounded-2xl overflow-hidden">
                    <Image
                      src="/images/IMG_3901.webp"
                      alt="Anne Yvonne Racine"
                      fill
                      className="object-cover"
                      sizes="50vw"
                      quality={75}
                      priority
                    />
                  </div>
                </div>

                {/* Text Column */}
                <div className="space-y-4 text-primary-cream mx-6 lg:mx-0">
                  <div>
                    <h3 className="text-xl font-light text-primary-coral mb-1">
                      UNE HISTOIRE D'ENGAGEMENT
                    </h3>
                    <p className="text-base mb-3">
                      Anne Yvonne Racine et Cœurs à Corps, en quelques
                      phrases.
                    </p>
                  </div>

                  <div className="space-y-3 text-primary-cream/90 text-sm">
                    <p>
                      Depuis plus de 50 ans, ma vie et mon parcours
                      professionnel m'ont guidée vers une quête essentielle
                      pour moi, de mieux: comprendre, d'explorer profondément
                      et de transformer la manière dont nous nous relions à
                      nous-mêmes, aux autres et au monde.
                    </p>
                    <p>
                      Avec Cœur à Corps, je rassemble tout ce que mes
                      expériences de vie et mon engagement thérapeutique m'ont
                      appris pour offrir une plateforme dédiée à la Nouvelle
                      Relation. Une relation qui ne se limite plus à la simple
                      réaction, mais qui s'ouvre à une conscience profonde des
                      enjeux individuels et collectifs.
                    </p>
                    <p>
                      Cette démarche s'articule autour de trois axes
                      fondamentaux : Amour, Désir et Esprit. Ensemble, ils
                      nous invitent à retourner à la source de notre désir
                      d'amour, à explorer ce qui nous anime vraiment et à
                      grandir, à la fois individuellement et dans nos
                      relations.
                    </p>
                    <p>
                      Cœur à Corps propose un espace unique,{' '}
                      <span className="font-medium">
                        UNE CONVERSION à 180 DEGRES D'AMOUR
                      </span>{' '}
                      conçue avec des personnes incroyables dans une
                      atmosphère que je ne pensais pas pouvoir un jour
                      connaitre. Un espace conçu pour offrir à chacun la
                      liberté et la tranquillité nécessaires d'avancer, à son
                      rythme et là où il a le désir d'aller.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Capsules Section */}
          </section>
          <div className="mt-12">
            {/* Custom Capsule Card for L'amour d'Après, matching /espace180 */}
            <CustomCapsuleMiroirCard />
          </div>
        </>
      )}
    </main>
  )
}
