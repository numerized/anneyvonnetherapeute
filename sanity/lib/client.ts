import { createClient } from 'next-sanity'

import {
  apiVersion,
  dataset,
  projectId,
} from '@/sanity/lib/api'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  stega: {
    enabled: process.env.VERCEL_ENV === 'development',
    studioUrl: '/studio',
  },
})
