import { Metadata } from 'next'
import { Suspense } from 'react'

import Espace180Navbar from '@/components/global/Navbar/Espace180Navbar'
import Espace180Page from '@/components/pages/espace180/Espace180Page'
import { loadSettings } from '@/sanity/loader/loadQuery'

export const metadata: Metadata = {
  title: "Espace 180 Conversion d'Amour - Anne Yvonne Relations",
  description:
    'Découvrez nos capsules audio de méditation et de développement personnel.',
}

export default async function Espace180() {
  const initial = await loadSettings()

  return (
    <>
      <Espace180Navbar data={initial.data} />
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
