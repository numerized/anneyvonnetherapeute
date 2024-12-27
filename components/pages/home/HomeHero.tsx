'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

import { CustomPortableText } from '@/components/shared/CustomPortableText'
import { scrollToSection } from '@/utils/scroll'
import { ShowcaseHero } from '@/types'

interface HomeHeroProps {
  data: ShowcaseHero
  overview: any[]
  hideButton?: boolean
}

export function HomeHero({ data, overview, hideButton }: HomeHeroProps) {
  const { heading, tagline, image } = data
  const overviewRef = useRef<HTMLElement>(null)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {image && (
          <Image
            src={image.asset.url}
            alt={image.alt || 'Hero background'}
            className="object-cover"
            priority
            fill
            sizes="100vw"
            quality={90}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {heading && (
            <h1 className="text-4xl md:text-6xl font-light mb-6">
              <CustomPortableText value={heading} />
            </h1>
          )}
          {tagline && (
            <div className="text-xl md:text-2xl text-primary-cream/80 mb-12">
              <CustomPortableText value={tagline} />
            </div>
          )}
          {!hideButton && overview?.length > 0 && (
            <motion.button
              onClick={() => scrollToSection(overviewRef)}
              className="bg-primary-coral hover:bg-primary-rust text-white px-8 py-3 rounded-full text-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Découvrir
            </motion.button>
          )}
        </motion.div>
      </div>
    </section>
  )
}
