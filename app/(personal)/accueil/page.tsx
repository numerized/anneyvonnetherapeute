import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import Link from 'next/link'

import { HomePage } from '@/components/pages/home/HomePage'
import HomePagePreview from '@/components/pages/home/HomePagePreview'
import { studioUrl } from '@/sanity/lib/api'
import { loadHomePage, loadSettings } from '@/sanity/loader/loadQuery'

export default async function AccueilRoute() {
  const [initial, settings] = await Promise.all([
    loadHomePage(),
    loadSettings(),
  ])

  if ((await draftMode()).isEnabled) {
    return <HomePagePreview initial={initial} settings={settings} />
  }

  if (!initial.data) {
    return (
      <div className="text-center">
        You don&rsquo;t have a homepage yet,{' '}
        <Link href={`${studioUrl}/structure/home`} className="underline">
          create one now
        </Link>
        !
      </div>
    )
  }

  return <HomePage data={initial.data} settings={settings.data} />
}
