import { NextRequest, NextResponse } from 'next/server'

import { capsules } from '@/components/pages/espace180/data/capsules'

export async function GET(request: NextRequest) {
  // Get the capsule ID from the URL query parameter
  const url = new URL(request.url)
  const capsuleId = url.searchParams.get('id')

  if (!capsuleId) {
    return NextResponse.json(
      {
        error: 'Missing capsule ID',
      },
      { status: 400 },
    )
  }

  // Find the matching capsule
  const capsule = capsules.find((c) => c.uniqueId === capsuleId)

  if (!capsule) {
    return NextResponse.json(
      {
        error: 'Capsule not found',
      },
      { status: 404 },
    )
  }

  // Determine the image URL
  const siteUrl = 'https://coeur-a-corps.org'
  const imageUrl = capsule.squarePosterUrl
    ? `${siteUrl}${capsule.squarePosterUrl}`
    : `${siteUrl}${capsule.posterUrl}`

  // Construct the capsule URL for sharing
  const capsuleUrl = `${siteUrl}/espace180?capsule=${capsule.uniqueId}`

  // Return the metadata
  return NextResponse.json({
    title: `${capsule.title} - Espace 180 | Anne Yvonne Relations`,
    description: capsule.description,
    ogImage: imageUrl,
    ogUrl: capsuleUrl,
  })
}
