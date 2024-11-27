import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlFor = (source: Image | undefined) => {
  if (!source?.asset?._ref) {
    return null
  }

  return imageBuilder.image(source)
}
