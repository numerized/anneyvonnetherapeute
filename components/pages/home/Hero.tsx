'use client'

import { urlFor } from '@/sanity/lib/image'
import type { HomePagePayload } from '@/types'
import { scrollToSection } from '@/utils/scroll'
import Image from 'next/image'
import Link from 'next/link'

interface HeroProps {
  hero: HomePagePayload['hero']
  data: any
}

export function Hero({ hero, data }: HeroProps) {
  console.log('Hero data:', data);
  console.log('Logo data:', data?.logo);
  console.log('Logo asset:', data?.logo?.asset);
  
  const logoAsset = data?.logo?.asset
  const logoUrl = logoAsset?.path ? `https://cdn.sanity.io/${logoAsset.path}` : null
  console.log('Logo URL:', logoUrl);

  // Generate image URL only if we have a valid image reference
  let imageUrl: string | null = null;
  if (hero?.image?.asset?._ref) {
    const imageBuilder = urlFor(hero.image);
    if (imageBuilder) {
      imageUrl = imageBuilder.width(1920).height(1080).url();
    }
  }

  const scrollToQuestionnaire = () => {
    scrollToSection('questionnaire');
  };

  return (
    <section 
      className="relative min-h-[100vh] md:min-h-[80vh] grid place-items-center pt-24 md:pt-0"
      id="accueil"
      role="main"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#0F1A17]/90 from-5% via-primary-forest/85 via-50% to-primary-forest/30 z-10" 
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
            <div className="w-full md:w-1/2 md:ml-[4rem] lg:ml-[6rem] mt-12 md:mt-0">
              {hero?.badge && (
                <div className="flex">
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
                    <button 
                      className="w-full md:w-auto bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream px-4 py-1.5 md:px-8 md:py-3 rounded-[24px] font-bold mt-8 text-sm md:text-base"
                      aria-label={hero.ctaButton.ariaLabel}
                      onClick={scrollToQuestionnaire}
                    >
                      {hero.ctaButton.text}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Video */}
            <div className="w-full relative">
              <div className="relative w-full aspect-[4/3]">
                <div className="absolute inset-0 border-[3px] border-primary-coral rounded-[32px] overflow-hidden">
                  <div className="absolute inset-[12px]">
                    <div className="w-full h-full relative overflow-hidden rounded-[32px]">
                      <video
                        className="absolute top-auto bottom-0 left-0 w-full object-cover rounded-[32px] shadow-2xl"
                        controls
                        playsInline
                        src="/videos/VIDEO_1ERE_PAGE_ESSAI2.mp4"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="block md:hidden mt-6 px-4">
                {hero?.ctaButton && (
                  <div className="flex w-full">
                    <button 
                      className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream px-4 py-2.5 rounded-[24px] font-bold text-base"
                      aria-label={hero.ctaButton.ariaLabel}
                      onClick={scrollToQuestionnaire}
                    >
                      {hero.ctaButton.text}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
