import { createClient } from 'next-sanity'

import {
  apiVersion,
  dataset,
  projectId,
} from './api'

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
})
