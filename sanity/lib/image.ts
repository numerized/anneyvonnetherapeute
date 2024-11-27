import createImageUrlBuilder from '@sanity/image-url'
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder'
import type { SanityImage, SanityImageReference, SanityImageAsset } from '@/types'

import { dataset, projectId } from '@/sanity/lib/api'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

function isImageReference(asset: any): asset is SanityImageReference {
  return typeof asset?._ref === 'string' && typeof asset?._type === 'string'
}

function isImageAsset(asset: any): asset is SanityImageAsset {
  return typeof asset?.url === 'string'
}

// Convert our custom SanityImage type to Sanity's expected format
function convertToSanityImage(source: SanityImage | undefined) {
  if (!source?.asset) {
    return undefined
  }

  // If we already have a reference, use it directly
  if (isImageReference(source.asset)) {
    return {
      _type: 'image',
      asset: source.asset,
    }
  }

  // If we have a direct asset with _id, convert it to a reference
  if (isImageAsset(source.asset) && source.asset._id) {
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: source.asset._id,
      },
    }
  }

  return undefined
}

export const urlForImage = (source: SanityImage | undefined): ImageUrlBuilder | undefined => {
  // Try to convert to a Sanity image first
  const sanityImage = convertToSanityImage(source)
  if (sanityImage?.asset?._ref) {
    return imageBuilder?.image(sanityImage)
  }

  // Fallback to direct URL if available
  if (source?.asset && isImageAsset(source.asset) && source.asset.url) {
    return imageBuilder?.image(source.asset.url)
  }

  return undefined
}

export function urlForOpenGraphImage(image: SanityImage | undefined): string | undefined {
  const imageUrlBuilder = urlForImage(image)
  return imageUrlBuilder?.width(1200).height(627).fit('crop').url()
}
