'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { urlFor } from '@/sanity/lib/image'
import type { HomePagePayload } from '@/types'

interface HeroProps {
  hero: HomePagePayload['hero']
  data: any
}

export function WebinarHero({ hero, data }: HeroProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Type guard function
  const isValidImage = (img: any): img is { asset: { _ref: string } } => {
    return img && typeof img === 'object' && img.asset && '_ref' in img.asset
  }

  const logoAsset = data?.logo?.asset
  const logoUrl = logoAsset?.path
    ? `https://cdn.sanity.io/${logoAsset.path}`
    : null

  return (
    <section
      className="relative min-h-[600px] grid place-items-center pt-24 md:pt-0"
      id="webinar"
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
          alt="Webinar background"
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
        <Link
          href={isLoggedIn ? '/dashboard' : '/login'}
          className="inline-block px-3 py-1 text-sm rounded-full transition-all duration-200 bg-primary-coral text-white font-bold hover:bg-primary-coral/90 hover:scale-105 whitespace-nowrap"
        >
          {isLoggedIn ? 'Espace Privé' : 'Se loguer'}
        </Link>
      </div> */}

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
                <motion.h1
                  id="hero-title"
                  className="text-4xl md:text-5xl lg:text-6xl text-primary-cream font-black mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {hero.title}
                </motion.h1>
              )}
              {hero?.subtitle && (
                <motion.p
                  className="text-xl text-primary-cream/80 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {hero.subtitle}
                </motion.p>
              )}
              {hero?.ctaButton && (
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="inline-block bg-primary-coral text-primary-cream px-4 py-1.5 md:px-8 md:py-3 rounded-[24px] font-bold text-sm md:text-base cursor-default">
                    RÉSERVER MA PLACE
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
