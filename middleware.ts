import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Handle favicon.ico request
  if (request.nextUrl.pathname === '/favicon.ico') {
    return NextResponse.rewrite(new URL('/images/logo.png', request.url))
  }

  // Add CORS headers to API routes
  if (path.startsWith('/api/')) {
    const response = NextResponse.next()

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    )
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    return response
  }

  return NextResponse.next()
}

// Configure the middleware to run only for API routes and OPTIONS requests
export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
}
