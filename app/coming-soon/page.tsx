import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import Link from 'next/link'

import { ComingSoonPage } from '@/components/pages/coming-soon/ComingSoonPage'
import { studioUrl } from '@/sanity/lib/api'
import { loadHomePage, loadSettings } from '@/sanity/loader/loadQuery'

export default async function ComingSoonRoute() {
  const [initial, settings] = await Promise.all([
    loadHomePage(),
    loadSettings()
  ])

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

  return <ComingSoonPage data={initial.data} settings={settings.data} />
}
