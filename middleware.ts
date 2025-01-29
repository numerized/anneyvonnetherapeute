import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle favicon.ico request
  if (request.nextUrl.pathname === '/favicon.ico') {
    return NextResponse.rewrite(new URL('/images/logo.png', request.url))
  }

  return NextResponse.next()
}
