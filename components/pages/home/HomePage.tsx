import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import Link from 'next/link'
import { urlFor } from '../../../sanity/lib/image'
import Image from 'next/image'

import { Header } from '@/components/shared/Header'
import { Stats } from '@/components/shared/Stats'
import { resolveHref } from '@/sanity/lib/utils'
import type { HomePagePayload } from '@/types'

export interface HomePageProps {
  data: HomePagePayload | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export function HomePage({ data, encodeDataAttribute }: HomePageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { overview = [], title = '', hero, statistics = [] } = data ?? {}

  // Generate image URL only if we have a valid image reference
  let imageUrl: string | null = null;
  if (hero?.image?.asset?._ref) {
    const imageBuilder = urlFor(hero.image);
    if (imageBuilder) {
      imageUrl = imageBuilder.width(1920).height(1080).url();
    }
  }

  return (
    <>
      <main 
        className="relative h-screen px-6"
        id="accueil"
        role="main"
        aria-labelledby="hero-title"
      >
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-transparent z-10" 
            aria-hidden="true"
          />
          {imageUrl ? (
            <img 
              src={imageUrl}
              alt={hero?.image?.alt || 'Hero background'}
              className="w-full h-full object-cover"
              loading="eager"
              width={1920}
              height={1080}
            />
          ) : (
            <div className="w-full h-full bg-primary-dark">
              {/* Debug info for when image is not showing */}
              <div className="p-4 text-white">
                <p>Debug: Image not showing</p>
                <p>Hero exists: {hero ? 'Yes' : 'No'}</p>
                <p>Image exists: {hero?.image ? 'Yes' : 'No'}</p>
                <p>Asset exists: {hero?.image?.asset ? 'Yes' : 'No'}</p>
                <p>Asset ref: {hero?.image?.asset?._ref || 'None'}</p>
                <p>Full image data: {JSON.stringify(hero?.image, null, 2)}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="max-w-7xl mx-auto relative z-20 h-full flex items-center">
          <div className="max-w-prose mx-auto px-4 sm:px-6 lg:px-8 w-full md:ml-[4rem] lg:ml-[6rem] md:mr-auto">
            {hero?.badge && (
              <div 
                className="inline-block bg-primary-teal/90 text-primary-cream px-3 py-1 rounded-full text-sm mb-6"
                aria-label={hero.badge.ariaLabel}
              >
                {hero.badge.text}
              </div>
            )}
            <h1 
              id="hero-title"
              className="text-6xl font-black tracking-tight text-primary-cream mb-6 text-shadow leading-tight"
            >
              {hero?.title || title}
            </h1>
            {hero?.subtitle && (
              <p className="text-xl text-primary-cream/90 mb-8 text-shadow">
                {hero.subtitle}
              </p>
            )}
            {hero?.ctaButton && (
              <button 
                className="bg-primary-coral text-primary-cream px-8 py-3 rounded-md hover:bg-primary-rust transition-colors font-bold focus:outline-none focus:ring-2 focus:ring-primary-teal"
                aria-label={hero.ctaButton.ariaLabel}
              >
                {hero.ctaButton.text}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Stats Section */}
      {statistics && statistics.length > 0 && (
        <Stats 
          title="Une approche unique de la thérapie relationnelle"
          items={statistics.map(stat => ({
            value: stat.number,
            label: stat.label
          }))}
        />
      )}

      <div className="space-y-20">
        {/* Header */}
        {title && !hero && <Header centered title={title} description={overview} />}
      </div>
    </>
  )
}

export default HomePage
