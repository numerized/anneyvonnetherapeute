import Image from 'next/image'

import { urlForImage } from '@/sanity/lib/utils'
import type { SanityImage } from '@/types'

interface ImageBoxProps {
  image?: SanityImage
  alt?: string
  width?: number
  height?: number
  size?: string
  classesWrapper?: string
  'data-sanity'?: string
}

export default function ImageBox({
  image,
  alt = 'Cover image',
  width = 3500,
  height = 2000,
  size = '100vw',
  classesWrapper,
  ...props
}: ImageBoxProps) {
  const imageBuilder = urlForImage(image)
  const imageUrl = imageBuilder ? imageBuilder.height(height).width(width).fit('crop').url() : undefined

  return (
    <div
      className={`w-full overflow-hidden rounded-[3px] bg-gray-50 ${classesWrapper}`}
      data-sanity={props['data-sanity']}
    >
      {imageUrl ? (
        <Image
          className="absolute h-full w-full"
          height={height}
          width={width}
          alt={alt}
          src={imageUrl}
          sizes={size}
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-gray-100 text-gray-500">
          {alt}
        </div>
      )}
    </div>
  )
}
