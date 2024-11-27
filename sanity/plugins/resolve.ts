/**
 * Sets up the Presentation Resolver API,
 * see https://www.sanity.io/docs/presentation-resolver-api for more information.
 */

import { defineLocations, DocumentLocationsState } from 'sanity/presentation'

import { resolveHref } from '@/sanity/lib/utils'

type DocumentValues = Record<'title' | 'slug', any> | null

export const locations = {
  settings: defineLocations({
    message: 'This document is used on all pages',
    tone: 'caution',
  }),
  home: defineLocations({
    message: 'This document is used to render the front page',
    tone: 'positive',
    locations: [{ title: 'Home', href: resolveHref('home')! }],
  }),
  project: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (doc: DocumentValues): DocumentLocationsState | null => {
      if (!doc) return null
      return {
        locations: [
          {
            title: doc.title || 'Untitled',
            href: resolveHref('project', doc.slug)!,
          },
        ],
      }
    },
  }),
  page: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (doc: DocumentValues): DocumentLocationsState | null => {
      if (!doc) return null
      return {
        locations: [
          {
            title: doc.title || 'Untitled',
            href: resolveHref('page', doc.slug)!,
          },
        ],
      }
    },
  }),
}
