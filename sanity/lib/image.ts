import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'
import type { SanityImage } from '@/types'

import { dataset, projectId } from '@/sanity/lib/api'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

// Convert our custom SanityImage type to Sanity's Image type
function convertToSanityImage(source: SanityImage | undefined): Image | undefined {
  if (!source?.asset) {
    return undefined
  }

  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: source.asset._id,
    },
  }
}

export const urlForImage = (source: SanityImage | undefined) => {
  const sanityImage = convertToSanityImage(source)
  
  if (!sanityImage?.asset?._ref) {
    // Fallback to direct URL if available
    return source?.asset?.url
  }

  return imageBuilder?.image(sanityImage).auto('format').fit('max')
}

export function urlForOpenGraphImage(image: SanityImage | undefined) {
  const sanityImage = convertToSanityImage(image)
  
  if (!sanityImage?.asset?._ref) {
    // Fallback to direct URL if available
    return image?.asset?.url
  }

  return imageBuilder?.image(sanityImage).width(1200).height(627).fit('crop').url()
}
