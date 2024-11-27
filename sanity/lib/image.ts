import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '../env'

console.log('Sanity Config:', { projectId, dataset })

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlFor = (source: Image | undefined) => {
  console.log('urlFor received source:', source)
  
  // Check if source has asset with _ref
  if (!source?.asset?._ref) {
    console.log('No valid image reference found:', source)
    return null
  }

  const builder = imageBuilder?.image(source)
  console.log('Image builder created:', builder)
  return builder
}
