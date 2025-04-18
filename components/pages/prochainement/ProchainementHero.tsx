'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  const searchParams = useSearchParams()
  const isCanceled = searchParams?.get('canceled') === 'true'
  const couponCode = searchParams?.get('coupon') ?? undefined
  const hasDiscount = isCanceled || couponCode === 'COEUR180'

  useEffect(() => {
    setIsClient(true)
  }, [])

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
          <div className="grid items-center">
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
                  className="text-xl md:text-2xl font-semibold text-primary-cream/80 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Thérapies et Coachings
                  <br />
                  de la relation Amoureuse et Désirante.
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
