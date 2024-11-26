import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import Link from 'next/link'
import { urlFor } from '../../../sanity/lib/image'

import { ProjectListItem } from '@/components/pages/home/ProjectListItem'
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
  const { overview = [], showcaseProjects = [], title = '', hero } = data ?? {}

  console.log('Full data from Sanity:', data)
  console.log('Hero data:', hero)
  console.log('Hero image:', hero?.image)

  // Generate image URL only if we have a valid image reference
  const imageBuilder = hero?.image ? urlFor(hero.image) : null
  const imageUrl = imageBuilder?.width(1920).height(1080).url()
  
  console.log('Image builder:', imageBuilder)
  console.log('Generated image URL:', imageUrl)

  return (
    <div>
      {/* Hero Section */}
      <main 
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
          {imageUrl ? (
            <>
              {console.log('Rendering image with URL:', imageUrl)}
              <img 
                src={imageUrl}
                alt={hero?.image?.alt || 'Hero background'}
                className="w-full h-full object-cover"
                loading="eager"
                width="1920"
                height="1080"
              />
            </>
          ) : (
            <>
              {console.log('No valid image URL, rendering fallback')}
              <div className="w-full h-full bg-primary-dark" />
            </>
          )}
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-24 h-full flex items-center">
          <div className="max-w-2xl">
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
      <Stats 
        title="Une approche unique de la thérapie relationnelle"
        items={[
          {
            value: "95%",
            label: "Taux de satisfaction client"
          },
          {
            value: "500+",
            label: "Couples accompagnés"
          },
          {
            value: "20",
            label: "Années d'expérience"
          },
          {
            value: "85%",
            label: "Amélioration des relations"
          }
        ]}
      />

      <div className="space-y-20">
        {/* Header */}
        {title && !hero && <Header centered title={title} description={overview} />}
        
        {/* Showcase projects */}
        {showcaseProjects && showcaseProjects.length > 0 && (
          <div className="mx-auto max-w-[100rem] rounded-md border">
            {showcaseProjects.map((project, key) => {
              const href = resolveHref(project?._type, project?.slug)
              if (!href) {
                return null
              }
              return (
                <Link
                  key={key}
                  href={href}
                  data-sanity={encodeDataAttribute?.([
                    'showcaseProjects',
                    key,
                    'slug',
                  ])}
                >
                  <ProjectListItem project={project} odd={key % 2} />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
