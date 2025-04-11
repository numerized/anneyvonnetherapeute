'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Stats } from '@/components/shared/Stats'
import TherapyQuestionnaireNew from '@/components/TherapyOfferings/TherapyQuestionnaireNew'

import { ProchainementHeroWrapper as ProchainementHero } from './ProchainementHero'
import PaymentSuccess from './PaymentSuccess'

export function ProchainementPage({ data, settings }: any) {
  const [isClient, setIsClient] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlaying2, setIsPlaying2] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const searchParams = useSearchParams()
  const success = searchParams?.get('success') ?? null
  const capsulesSectionRef = useRef<HTMLDivElement>(null)

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
          />

          {/* Main Content Section */}
          <section className="py-24 bg-primary-forest/80 rounded-3xl">
            <div className="max-w-4xl mx-auto px-6">
              {/* Stats Section */}
              <Stats
                title="Une approche unique de la thérapie relationnelle"
                items={statsItems}
              />
              
              {/* Questionnaire Section */}
              <div className="mt-16 mb-16 overflow-hidden rounded-[32px]">
                <TherapyQuestionnaireNew />
              </div>

              {/* Presentation Section */}
              <div className="mb-16 bg-primary-dark/30 rounded-[32px] overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  {/* Image Column */}
                  <div className="relative md:h-full">
                    <div className="md:hidden relative aspect-[4/3] rounded-2xl overflow-hidden">
                      <Image
                        src="/images/anneyv-presentation2.webp"
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
                        src="/images/anneyv-presentation2.webp"
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
                  <div className="space-y-4 text-primary-cream">
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
              <div className="mt-24" id="capsules" ref={capsulesSectionRef}>
                <h2 className="text-3xl md:text-4xl font-medium text-primary-coral mb-12 text-center">
                  CAPSULES AUDIO
                </h2>

                <div className="w-full grid md:grid-cols-2 gap-8">
                  {/* First Capsule */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-full max-w-[600px] aspect-[4/3]">
                      <div className="absolute inset-0 rounded-[32px] overflow-hidden">
                        <div className="absolute inset-[12px]">
                          <div className="w-full h-full relative overflow-hidden rounded-[32px]">
                            {isClient && (
                              <>
                                <video
                                  ref={videoRef}
                                  className="absolute top-auto bottom-0 left-0 w-full max-h-[600px] object-cover rounded-[32px] shadow-2xl"
                                  playsInline
                                  webkit-playsinline="true"
                                  src="/videos/INTRODUCTION AU DEVELOPPEMENT RELATIONNEL.mp4"
                                  poster="/videos/INTRODUCTION AU DEVELOPPEMENT RELATIONNEL.jpg"
                                />
                                {/* Dark gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-dark/60 rounded-[32px]" />
                                {/* Frost bubbles */}
                                <div className="absolute top-4 right-4 flex gap-4 z-20">
                                  {/* Title bubble */}
                                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                                    <span className="text-white font-medium">
                                      INTRODUCTION
                                    </span>
                                  </div>
                                </div>
                                {/* Play/Pause button */}
                                <button
                                  onClick={togglePlay}
                                  className="absolute right-4 bottom-4 z-20 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 cursor-pointer"
                                  aria-label={
                                    isPlaying ? 'Pause audio' : 'Play audio'
                                  }
                                >
                                  <div className="w-6 h-6 flex items-center justify-center">
                                    {isPlaying ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-6 h-6 text-white"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-6 h-6 text-white"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second Capsule */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-full max-w-[600px] aspect-[4/3]">
                      <div className="absolute inset-0 rounded-[32px] overflow-hidden">
                        <div className="absolute inset-[12px]">
                          <div className="w-full h-full relative overflow-hidden rounded-[32px]">
                            {isClient && (
                              <>
                                <video
                                  ref={videoRef2}
                                  className="absolute top-0 left-0 w-full max-h-[600px] object-cover rounded-[32px] shadow-2xl"
                                  playsInline
                                  webkit-playsinline="true"
                                  src="/videos/CONVERSION AMOUR 180_002.mp4"
                                  poster="/videos/CONVERSION AMOUR 180_002.jpg"
                                />
                                {/* Dark gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-dark/60 rounded-[32px]" />
                                {/* Frost bubbles */}
                                <div className="absolute top-4 right-4 flex gap-4 z-20">
                                  {/* Title bubble */}
                                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                                    <span className="text-white font-medium">
                                      CONVERSION AMOUR 180°
                                    </span>
                                  </div>
                                </div>
                                {/* Play/Pause button */}
                                <button
                                  onClick={togglePlay2}
                                  className="absolute right-4 bottom-4 z-20 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 cursor-pointer"
                                  aria-label={
                                    isPlaying2 ? 'Pause audio' : 'Play audio'
                                  }
                                >
                                  <div className="w-6 h-6 flex items-center justify-center">
                                    {isPlaying2 ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-6 h-6 text-white"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-6 h-6 text-white"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  )
}
