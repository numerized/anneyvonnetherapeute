'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import React, { Suspense } from 'react'

import { urlFor } from '@/sanity/lib/image'
import type { HomePagePayload } from '@/types'

interface HeroProps {
  hero: HomePagePayload['hero']
  data: any
  onShowPurchase?: () => void
  customButtonText?: string
}

function ProchainementHeroContent({
  hero,
  data,
  onShowPurchase,
  customButtonText,
}: HeroProps) {
  const [isClient, setIsClient] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const searchParams = useSearchParams()
  const isCanceled = searchParams?.get('canceled') === 'true'
  const couponCode = searchParams?.get('coupon') ?? undefined
  const hasDiscount = isCanceled || couponCode === 'COEUR180'

  useEffect(() => {
    setIsClient(true)

    // Listen for pause events from capsules section
    const handleHeaderVideoPause = () => {
      setIsPlaying(false)
    }
    window.addEventListener('headerVideoPause', handleHeaderVideoPause)

    return () => {
      window.removeEventListener('headerVideoPause', handleHeaderVideoPause)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        // Stop any playing capsule videos
        window.dispatchEvent(new CustomEvent('stopCapsuleVideos'))
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handlePurchase = () => {
    if (onShowPurchase) {
      onShowPurchase()
    }
  }

  if (isCanceled) {
    return null
  }

  const logoAsset = data?.logo?.asset
  const logoUrl = logoAsset?.path
    ? `https://cdn.sanity.io/${logoAsset.path}`
    : null

  return (
    <section
      className="relative min-h-[600px] grid place-items-center pt-24 md:pt-0 pb-5"
      id="prochainement"
      role="main"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0">
        {/* Existing horizontal gradient for subtle overall tint */}
        <div
          className="absolute inset-0 z-10"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(90deg, rgba(15,26,23,0.45) 5%, rgba(31,54,44,0.18) 50%, rgba(31,54,44,0.05) 100%)',
          }}
        />
        <Image
          src="/images/soon-back.jpg"
          alt="Prochainement background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </div>

      {/* Mobile Logo and Login - Removed to prevent duplication with NavbarLayout */}
      {/* <div className="absolute top-4 w-full px-4 flex justify-between items-center md:hidden z-50">
        {logoUrl && (
          <Image
            src={logoUrl}
            alt="Anne Yvonne Racine Thérapeute Logo"
            className="h-20 w-auto"
            width={300}
            height={300}
          />
        )}
      </div> */}

      <div className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center md:text-left">
              {hero?.badge && (
                <div className="flex md:justify-start justify-center">
                  <div
                    className="inline-block bg-primary-teal/20 text-primary-cream px-3 py-1 md:px-4 md:py-2 rounded-[24px] text-xs md:text-sm mb-4"
                    role="presentation"
                    aria-label={hero.badge.ariaLabel}
                  >
                    {hero.badge.text}
                  </div>
                </div>
              )}
              {hasDiscount && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex md:justify-start justify-center mb-4"
                >
                  <div className="bg-primary-coral/20 text-primary-coral px-4 py-2 rounded-[24px] text-sm">
                    Code promo COEUR180 (-10%) appliqué !
                  </div>
                </motion.div>
              )}
              {hero?.title && (
                <div>
                  <motion.h1
                    id="hero-title"
                    className="text-4xl md:text-5xl lg:text-6xl text-primary-cream font-black mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    CŒUR À CORPS
                  </motion.h1>
                </div>
              )}
              {hero?.subtitle && (
                <motion.p
                  className="text-lg text-primary-cream/80 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Thérapies et Coachings de la relation Amoureuse et Désirante.
                </motion.p>
              )}
              {/* CTA Button */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <button
                  onClick={handlePurchase}
                  className="bg-primary-coral hover:bg-primary-coral/90 text-white px-8 py-3 rounded-full transition-colors duration-200 animate-glow font-bold text-lg"
                >
                  {customButtonText || "Découvrir l'offre"}
                </button>
              </motion.div>
            </div>

            {/* Right Column - Video */}
            <div className="w-full flex items-center justify-center">
              <div className="relative w-full max-w-[300px] aspect-[4/3]">
                <div className="absolute inset-0 border-[3px] border-primary-coral rounded-[32px] overflow-hidden">
                  <div className="absolute inset-[12px]">
                    <div className="w-full h-full relative overflow-hidden rounded-[32px]">
                      {isClient && (
                        <>
                          <video
                            ref={videoRef}
                            data-header-video
                            className="absolute inset-0 w-full h-full object-cover"
                            playsInline
                            webkit-playsinline="true"
                            src="/videos/PRESENTATION 3 THERAPIES.mp4"
                            poster="/images/posters/PRESENTATION 3 THERAPIES.jpg"
                          />
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
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProchainementHero(props: HeroProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[600px] bg-primary-forest flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-coral"></div>
        </div>
      }
    >
      <ProchainementHeroContent {...props} />
    </Suspense>
  )
}

export function ProchainementHeroWrapper({
  hero,
  data,
  onShowPurchase,
  customButtonText,
}: HeroProps) {
  return (
    <ProchainementHero
      hero={hero}
      data={data}
      onShowPurchase={onShowPurchase}
      customButtonText={customButtonText}
    />
  )
}
