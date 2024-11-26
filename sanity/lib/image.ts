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
  if (!source) {
    console.log('No source provided to urlFor')
    return undefined
  }
  const builder = imageBuilder?.image(source)
  console.log('Image builder created:', builder)
  return builder
}
