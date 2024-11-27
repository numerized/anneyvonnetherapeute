import { createClient } from 'next-sanity'

import {
  apiVersion,
  dataset,
  projectId,
} from '@/sanity/lib/api'

// Base client configuration
const clientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
}

// Default client for general use
export const client = createClient({
  ...clientConfig,
  perspective: 'published',
  stega: {
    enabled: process.env.VERCEL_ENV === 'development',
    studioUrl: '/studio',
  },
})

// Client with write permissions for mutations
export const writeClient = createClient({
  ...clientConfig,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Preview client for draft mode
export const previewClient = createClient({
  ...clientConfig,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_READ_TOKEN,
})
