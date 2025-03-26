const isBrowser = typeof window !== 'undefined'

export const token = isBrowser
  ? process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN
  : process.env.SANITY_API_READ_TOKEN

if (!token && process.env.NODE_ENV === 'production') {
  throw new Error(
    'Missing SANITY_API_READ_TOKEN or NEXT_PUBLIC_SANITY_API_READ_TOKEN',
  )
}
