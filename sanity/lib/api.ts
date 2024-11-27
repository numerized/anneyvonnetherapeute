/**
 * As this file is reused in several other files, try to keep it lean and small.
 * Importing other npm packages here could lead to needlessly increasing the client bundle size, or end up in a server-only function that don't need it.
 */

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-24'

// see https://www.sanity.io/docs/api-versioning for how versioning works

export const useCdn = false

// See the app/api/revalidate/route.ts for how this is used
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET

/**
 * Used to configure edit intent links, for Presentation Mode, as well as to configure where the Studio is mounted in the router.
 */
export const studioUrl = '/studio'
