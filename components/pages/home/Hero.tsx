'use client'

import { urlFor } from '@/sanity/lib/image'
import type { HomePagePayload } from '@/types'

interface HeroProps {
  hero: HomePagePayload['hero']
}

export function Hero({ hero }: HeroProps) {
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
      className="relative h-screen"
      id="accueil"
      role="main"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-transparent z-10" 
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

      <div className="relative z-20 h-full">
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center h-full gap-8 py-20">
            {/* Left side - Text Content */}
            <div className="w-full md:w-1/2 md:ml-[4rem] lg:ml-[6rem] flex flex-col justify-center">
              {hero?.badge && (
                <div className="flex">
                  <div 
                    className="inline-block bg-primary-teal/20 text-primary-cream px-4 py-2 rounded-[24px] text-sm mb-4"
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
                  className="text-4xl md:text-5xl lg:text-6xl text-primary-cream font-light mb-6"
                >
                  {hero.title}
                </h1>
              )}
              {hero?.subtitle && (
                <p className="text-xl text-primary-cream/80 mb-8">
                  {hero.subtitle}
                </p>
              )}
              {hero?.ctaButton && (
                <div className="flex">
                  <button 
                    className="bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream px-8 py-3 rounded-[24px] font-bold mt-8"
                    aria-label={hero.ctaButton.ariaLabel}
                  >
                    {hero.ctaButton.text}
                  </button>
                </div>
              )}
            </div>

            {/* Right side - Video */}
            <div className="w-full md:w-[400px] relative">
              <div className="aspect-[9/16] relative">
                <video
                  className="absolute inset-0 w-full h-full object-cover rounded-[24px] shadow-2xl"
                  controls
                  playsInline
                  src="/videos/VIDEO_1ERE_PAGE_ESSAI.mp4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
