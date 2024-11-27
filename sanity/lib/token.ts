import 'server-only'

export const token = process.env.SANITY_API_READ_TOKEN

if (!token) {
  throw new Error('Missing SANITY_API_READ_TOKEN')
}

// Ensure this token is only used on the server side
if (typeof window !== 'undefined') {
  throw new Error('Sanity API token should not be accessed on the client side')
}
