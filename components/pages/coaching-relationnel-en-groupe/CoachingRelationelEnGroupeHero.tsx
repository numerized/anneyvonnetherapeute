import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface HeroProps {
  hero: any
  data: any
  onShowPurchase: () => void
}

export function CoachingRelationelEnGroupeHero({ hero, data, onShowPurchase }: HeroProps) {
  return (
    <section
      id="coaching-relationnel-en-groupe"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-900 px-4 py-32 text-center sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Coaching Relationnel En Groupe background"
          className="h-full w-full object-cover opacity-20"
          width={1920}
          height={1080}
          priority
        />
        <div className="absolute inset-0 bg-gray-900/50 mix-blend-multiply" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            <span className="block">Coaching Relationnel</span>
            <span className="block text-pink-500">En Groupe</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-xl text-gray-300 sm:max-w-3xl">
            Découvrez une nouvelle approche du coaching relationnel en groupe. Partagez, apprenez et
            évoluez ensemble dans un cadre bienveillant et professionnel.
          </p>
          <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
            <Button
              onClick={onShowPurchase}
              size="lg"
              className="w-full rounded-md px-8 py-3 text-base font-medium text-white hover:bg-pink-600 sm:w-auto"
            >
              Réserver ma place
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function CoachingRelationelEnGroupeHeroWrapper({ hero, data, onShowPurchase }: HeroProps) {
  return (
    <CoachingRelationelEnGroupeHero hero={hero} data={data} onShowPurchase={onShowPurchase} />
  )
}
