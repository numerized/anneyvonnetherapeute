import 'server-only'

import * as queryStore from '@sanity/react-loader'
import { draftMode } from 'next/headers'

import { client } from '@/sanity/lib/client'
import {
  homePageQuery,
  pagesBySlugQuery,
  settingsQuery,
} from '@/sanity/lib/queries'
import { token } from '@/sanity/lib/token'
import {
  HomePagePayload,
  PagePayload,
  SettingsPayload,
} from '@/types'

const serverClient = client.withConfig({
  token,
  stega: process.env.VERCEL_ENV === 'preview',
})

queryStore.setServerClient(serverClient)

const usingCdn = serverClient.config().useCdn

// Automatically handle draft mode
export const loadQuery = (async (query: string, params = {}, options = {}) => {
  const draft = await draftMode()
  const {
    perspective = draft.isEnabled ? 'previewDrafts' : 'published',
  } = options

  // Don't cache by default
  let revalidate: NextFetchRequestConfig['revalidate'] = 0

  // If `next.tags` is set, and we're not using the CDN, then it's safe to cache
  if (!usingCdn && Array.isArray(options.next?.tags)) {
    revalidate = false
  } else if (usingCdn) {
    revalidate = 60
  }

  return queryStore.loadQuery(query, params, {
    ...options,
    next: {
      revalidate,
      tags: ['sanity.studio'],
    },
    perspective,
    stega: draft.isEnabled,
  })
}) satisfies (query: string, params?: any, options?: any) => Promise<any>

/**
 * Loaders that are used in more than one place are declared here, otherwise they're colocated with the component
 */

export async function loadSettings() {
  const data = await loadQuery(
    settingsQuery,
    {},
    { next: { tags: ['settings', 'home', 'page'] } },
  )
  return data as SettingsPayload
}

export async function loadHomePage() {
  const data = await loadQuery(
    homePageQuery,
    {},
    {
      next: {
        tags: ['home', 'settings'],
      },
    }
  )
  return data as HomePagePayload
}

export async function loadPage(slug: string) {
  const data = await loadQuery(
    pagesBySlugQuery,
    { slug },
    { next: { tags: [`page:${slug}`] } },
  )
  return data as PagePayload | null
}
