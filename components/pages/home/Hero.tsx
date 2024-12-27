'use client'

import { urlFor } from '@/sanity/lib/image'
import type { HomePagePayload } from '@/types'
import { scrollToSection } from '@/utils/scroll'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface HeroProps {
  hero: HomePagePayload['hero']
  data: any
  comingSoon?: boolean
}

export function Hero({ hero, data, comingSoon }: HeroProps) {
  
  const logoAsset = data?.logo?.asset
  const logoUrl = logoAsset?.path ? `https://cdn.sanity.io/${logoAsset.path}` : null

  const [isClient, setIsClient] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  const scrollToQuestionnaire = () => {
    scrollToSection('questionnaire');
  };

  // Generate image URL only if we have a valid image reference
  let imageUrl: string | null = null;
  if (hero?.image?.asset?._ref) {
    const imageBuilder = urlFor(hero.image);
    if (imageBuilder) {
      imageUrl = imageBuilder.width(1920).height(1080).url();
    }
  }

  return (
    <section 
      className="relative min-h-[600px] grid place-items-center pt-24 md:pt-0"
      id="accueil"
      role="main"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#0F1A17]/90 from-5% via-primary-forest/65 via-50% to-primary-forest/30 z-10" 
          aria-hidden="true"
        />
        {imageUrl && (
          <img 
            src={imageUrl}
            alt={hero?.image?.alt || 'Hero background'}
            className="w-full h-full object-cover"
            loading="eager"
            width={1920}
            height={1080}
          />
        )}
      </div>

      {/* Mobile Logo and Login */}
      <div className="absolute top-4 w-full px-4 flex justify-between items-center md:hidden z-50">
        {logoUrl && (
          <Image 
            src={logoUrl}
            alt={data.logo?.alt?.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() || "Logo"}
            className="h-20 w-auto"
            width={300}
            height={300}
            priority
          />
        )}
        {data?.menuItems?.length > 0 && data.menuItems[data.menuItems.length - 1] && (
          <Link
            href={data.menuItems[data.menuItems.length - 1].reference?.slug?.current ? `/${data.menuItems[data.menuItems.length - 1].reference.slug.current}` : '#'}
            className="inline-block px-3 py-1 text-sm rounded-full transition-all duration-200 bg-primary-coral text-white font-bold hover:bg-primary-coral/90 hover:scale-105 whitespace-nowrap"
          >
            {data.menuItems[data.menuItems.length - 1].title}
          </Link>
        )}
      </div>

      <div className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Left side - Text Content */}
            <div className="w-full md:w-1/2 md:ml-[4rem] lg:ml-[6rem] mt-12 md:mt-0 text-center md:text-left">
              {hero?.badge && (
                <div className="flex justify-center md:justify-start">
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
                <h1 
                  id="hero-title"
                  className="text-4xl md:text-5xl lg:text-6xl text-primary-cream font-black mb-2"
                >
                  {hero.title}
                </h1>
              )}
              {hero?.subtitle && (
                <p className="text-xl text-primary-cream/80 mb-4">
                  {hero.subtitle}
                </p>
              )}
              <div className="hidden md:block">
                {hero?.ctaButton && (
                  <div className="flex w-full md:w-auto">
                    <motion.button 
                      className="w-full md:w-auto bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream px-4 py-1.5 md:px-8 md:py-3 rounded-[24px] font-bold mt-8 text-sm md:text-base"
                      aria-label={comingSoon ? "Prochainement" : hero.ctaButton.ariaLabel}
                      onClick={comingSoon ? undefined : scrollToQuestionnaire}
                      whileTap={{ scale: 0.95 }}
                      transition={{ ease: [0, 0.71, 0.2, 1] }}
                    >
                      {comingSoon ? "PROCHAINEMENT" : hero.ctaButton.text}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Video */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="relative w-full max-w-[300px] aspect-[4/3]">
                <div className="absolute inset-0 border-[3px] border-primary-coral rounded-[32px] overflow-hidden">
                  <div className="absolute inset-[12px]">
                    <div className="w-full h-full relative overflow-hidden rounded-[32px]">
                      {isClient && (
                        <>
                          <video
                            ref={videoRef}
                            className="absolute top-auto bottom-0 left-0 w-full max-h-[300px] object-cover rounded-[32px] shadow-2xl"
                            playsInline
                            webkit-playsinline="true"
                            src="/videos/capsule0.mp4"
                            poster="/images/cover0.webp"
                          />
                          {/* Dark green gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgb(41,53,49,0.62)] rounded-[32px]" />
                          {/* Frost bubbles */}
                          <div className="absolute top-4 right-4 flex gap-4 z-20">
                            {/* Capsule title bubble */}
                            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                              <span className="text-white font-medium">Capsule #1</span>
                            </div>
                          </div>
                          {/* Play/Pause button */}
                          <button
                            onClick={togglePlay}
                            className="absolute right-4 bottom-4 z-20 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 cursor-pointer"
                            aria-label={isPlaying ? 'Pause video' : 'Play video'}
                          >
                            <div className="w-6 h-6 flex items-center justify-center">
                              {isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
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

          {/* Mobile CTA Button */}
          <div className="block md:hidden mt-6 mb-8 md:mb-0 px-4 text-center">
            {hero?.ctaButton && (
              <div className="flex w-full">
                <motion.button 
                  className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream px-4 py-2.5 rounded-[24px] font-bold text-base"
                  aria-label={hero.ctaButton.ariaLabel}
                  onClick={scrollToQuestionnaire}
                  whileTap={{ scale: 0.95 }}
                  transition={{ ease: [0, 0.71, 0.2, 1] }}
                >
                  {hero.ctaButton.text}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
