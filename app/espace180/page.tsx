import { Metadata } from 'next'
import { Suspense } from 'react'

import Espace180Page from '@/components/pages/espace180/Espace180Page'

// Default metadata for the page
export const metadata: Metadata = {
  title: "Espace 180 Conversion d'Amour - Anne Yvonne Relations",
  description:
    'Découvrez nos capsules audio de méditation et de développement personnel.',
  // Add default OG images that will be used when no capsule is specified
  openGraph: {
    images: ['/images/og-espace180.jpg'],
  },
}

export default async function Espace180() {
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen bg-primary-dark flex items-center justify-center">
            <div className="text-white text-2xl">
              Chargement des capsules...
            </div>
          </div>
        }
      >
        <Espace180Page />
      </Suspense>
    </>
  )
}
