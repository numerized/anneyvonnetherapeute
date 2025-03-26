import { ProchainementPage } from '@/components/pages/prochainement/ProchainementPage'
import { loadHomePage, loadSettings } from '@/sanity/loader/loadQuery'

export default async function ProchainementRoute() {
  const [initial, settings] = await Promise.all([
    loadHomePage(),
    loadSettings(),
  ])

  if (!initial.data) {
    return null
  }

  return <ProchainementPage data={initial.data} settings={settings.data} />
}
