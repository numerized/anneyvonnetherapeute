import 'server-only'

import * as queryStore from '@sanity/react-loader'
import { draftMode } from 'next/headers'
import type { QueryResponseInitial } from '@sanity/react-loader'

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

  const result = await queryStore.loadQuery(query, params, {
    ...options,
    next: {
      revalidate,
      tags: ['sanity.studio'],
    },
    perspective,
    stega: draft.isEnabled,
  })

  return {
    data: result,
    sourceMap: {
      documents: [],
      paths: [],
      mappings: {}
    }
  }
}) satisfies (query: string, params?: any, options?: any) => Promise<QueryResponseInitial<any>>

/**
 * Loaders that are used in more than one place are declared here, otherwise they're colocated with the component
 */

export async function loadSettings(): Promise<QueryResponseInitial<SettingsPayload>> {
  return loadQuery(
    settingsQuery,
    {},
    { next: { tags: ['settings', 'home', 'page'] } },
  )
}

export async function loadHomePage(): Promise<QueryResponseInitial<HomePagePayload>> {
  return loadQuery(
    homePageQuery,
    {},
    {
      next: {
        tags: ['home', 'settings'],
      },
    }
  )
}

export async function loadPage(slug: string): Promise<QueryResponseInitial<PagePayload | null>> {
  return loadQuery(
    pagesBySlugQuery,
    { slug },
    { next: { tags: [`page:${slug}`] } },
  )
}
