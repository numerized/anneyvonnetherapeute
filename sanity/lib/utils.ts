import { urlForImage, urlForOpenGraphImage } from './image'

export { urlForImage, urlForOpenGraphImage }

export function resolveHref(
  documentType?: string,
  slug?: string,
): string | undefined {
  switch (documentType) {
    case 'home':
      return '/'
    case 'page':
      return slug ? `/${slug}` : undefined
    default:
      return undefined
  }
}
