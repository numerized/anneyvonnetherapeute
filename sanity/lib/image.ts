import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '../env'

if (!projectId || !dataset) {
  throw new Error('Sanity project ID and dataset are required')
}

const imageBuilder = createImageUrlBuilder({
  projectId: projectId,
  dataset: dataset,
})

export const urlFor = (source: Image | undefined) => {
  if (!source?.asset?._ref) {
    console.warn('Invalid image source:', source)
    return undefined
  }

  return imageBuilder.image(source)
}
