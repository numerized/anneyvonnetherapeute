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
      <div className="max-w-7xl mx-auto px-6 relative z-20 h-full flex flex-col justify-center">
        <div className="max-w-prose mx-auto px-4 sm:px-6 lg:px-8 w-full md:ml-[4rem] lg:ml-[6rem] md:mr-auto">
          {hero?.badge && (
            <div 
              className="inline-block bg-primary-teal/20 text-primary-cream px-4 py-2 rounded-2xl text-sm mb-4"
              role="presentation"
              aria-label={hero.badge.ariaLabel}
            >
              {hero.badge.text}
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
            <button 
              className="inline-block bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream px-8 py-3 rounded-[24px] font-bold mt-8"
              aria-label={hero.ctaButton.ariaLabel}
            >
              {hero.ctaButton.text}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
