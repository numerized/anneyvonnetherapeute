'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { motion } from 'framer-motion'

import { urlFor } from '@/sanity/lib/image'
import type { HomePagePayload } from '@/types'

interface HeroProps {
  hero: HomePagePayload['hero']
  data: any
  onShowPurchase?: () => void
}

export function ProchainementHero({ hero, data, onShowPurchase }: HeroProps) {
  const [isClient, setIsClient] = useState(false)
  const searchParams = useSearchParams()
  const isCanceled = searchParams.get('canceled') === 'true'

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (isCanceled) {
    return null
  }

  const handlePurchase = async () => {
    const offerSection = document.getElementById('offer-section')
    if (offerSection) {
      offerSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const logoAsset = data?.logo?.asset
  const logoUrl = logoAsset?.path
    ? `https://cdn.sanity.io/${logoAsset.path}`
    : null

  return (
    <section
      className="relative min-h-[600px] grid place-items-center pt-24 md:pt-0"
      id="prochainement"
      role="main"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0F1A17]/90 from-5% via-primary-forest/65 via-50% to-primary-forest/30 z-10"
          aria-hidden="true"
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

      {/* Mobile Logo and Login */}
      <div className="absolute top-4 w-full px-4 flex justify-between items-center md:hidden z-50">
        {logoUrl && (
          <Image
            src={logoUrl}
            alt={
              data.logo?.alt?.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() ||
              'Logo'
            }
            className="h-20 w-auto"
            width={300}
            height={300}
            priority
          />
        )}
      </div>

      <div className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-8">
            {/* Text Content */}
            <div className="w-full text-center">
              {hero?.badge && (
                <div className="flex justify-center">
                  <div
                    className="inline-block bg-primary-teal/20 text-primary-cream px-3 py-1 md:px-4 md:py-2 rounded-[24px] text-xs md:text-sm mb-4"
                    role="presentation"
                    aria-label={hero.badge.ariaLabel}
                  >
                    {hero.badge.text}
                  </div>
                </div>
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
                  className="text-sm text-primary-cream/80 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {hero.subtitle}
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
                  className="bg-primary-coral hover:bg-primary-coral/90 text-white px-8 py-3 rounded-full transition-colors duration-200"
                >
                  Découvrir l'offre
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
