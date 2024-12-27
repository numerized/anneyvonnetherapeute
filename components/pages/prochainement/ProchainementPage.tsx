'use client'

import { ProchainementHero } from './ProchainementHero'

export function ProchainementPage({ data, settings }: any) {
  if (!data?.hero) {
    return null
  }

  return (
    <main className="flex-auto">
      <ProchainementHero hero={data.hero} data={settings} />
    </main>
  )
}
