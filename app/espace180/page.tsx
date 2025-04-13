import { Metadata, ResolvingMetadata } from 'next'
import { Suspense } from 'react'

import Espace180Page from '@/components/pages/espace180/Espace180Page'
import { capsules } from '@/components/pages/espace180/data/capsules'

type Props = {
  params: { [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Extract the capsule parameter from the URL
  const capsuleId = props.searchParams.capsule as string | undefined
  
  // If no capsule parameter, return default metadata
  if (!capsuleId) {
    return {
      title: "Espace 180 Conversion d'Amour - Anne Yvonne Relations",
      description:
        'Découvrez nos capsules audio de méditation et de développement personnel.',
    }
  }
  
  // Find the matching capsule
  const capsule = capsules.find(c => c.uniqueId === capsuleId)
  
  if (!capsule) {
    return {
      title: "Espace 180 Conversion d'Amour - Anne Yvonne Relations",
      description:
        'Découvrez nos capsules audio de méditation et de développement personnel.',
    }
  }
  
  // Determine the absolute URL for the image
  const siteUrl = 'https://coeur-a-corps.org'
  const imageUrl = capsule.squarePosterUrl 
    ? `${siteUrl}${capsule.squarePosterUrl}` 
    : `${siteUrl}${capsule.posterUrl}`
  
  // Construct the capsule URL for sharing
  const capsuleUrl = `${siteUrl}/espace180?capsule=${capsule.uniqueId}`
  
  // Return capsule-specific metadata
  return {
    title: `${capsule.title} - Espace 180 | Anne Yvonne Relations`,
    description: capsule.description,
    openGraph: {
      title: capsule.title,
      description: capsule.description,
      url: capsuleUrl,
      siteName: 'Anne Yvonne Relations',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: capsule.title,
        },
      ],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: capsule.title,
      description: capsule.description,
      images: [imageUrl],
    },
  }
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
