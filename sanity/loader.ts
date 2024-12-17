'use client'

import { createQueryStore } from '@sanity/react-loader'
import { client } from '@/sanity/lib/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export const queryStore = createQueryStore({
  client,
  // Prevent the store from fetching when server-side rendering
  isStega: typeof window !== 'undefined',
  studioUrl: '/studio',
  projectId,
  dataset,
} as any)
