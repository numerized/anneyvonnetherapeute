import { CoachingRelationelEnGroupePage } from '@/components/pages/coaching-relationnel-en-groupe/CoachingRelationelEnGroupePage'
import { loadHomePage, loadSettings } from '@/sanity/loader/loadQuery'

export default async function CoachingRelationelEnGroupeRoute() {
  const [initial, settings] = await Promise.all([
    loadHomePage(),
    loadSettings()
  ])

  if (!initial.data) {
    return null
  }

  return <CoachingRelationelEnGroupePage data={initial.data} settings={settings.data} />
}
