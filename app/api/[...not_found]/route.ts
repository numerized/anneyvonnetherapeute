import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(
  request: Request,
  { params }: { params: { not_found: string[] } }
) {
  const path = params.not_found.join('/')
  
  // Handle favicon.ico specifically
  if (path === 'favicon.ico') {
    try {
      const filePath = join(process.cwd(), 'public', 'favicon.ico')
      const fileBuffer = readFileSync(filePath)
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/x-icon',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } catch (error) {
      // If favicon.ico is not found, return 404
      return new NextResponse(null, { status: 404 })
    }
  }

  // For all other not found routes
  return new NextResponse(null, { status: 404 })
}
