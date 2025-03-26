import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from './api'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  stega: {
    enabled: true,
    studioUrl: '/studio',
  },
  token: process.env.SANITY_API_TOKEN,
})

// Create a preview client with auth token
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'previewDrafts',
})
