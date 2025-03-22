import { Metadata } from 'next'
import Espace180Page from '@/components/pages/espace180/Espace180Page'
import Espace180Navbar from '@/components/global/Navbar/Espace180Navbar'
import { loadSettings } from '@/sanity/loader/loadQuery'

export const metadata: Metadata = {
  title: 'Espace 180 - Anne Yvonne Relations',
  description: 'Découvrez nos capsules audio de méditation et de développement personnel.',
}

export default async function Espace180() {
  const initial = await loadSettings()

  return (
    <>
      <Espace180Navbar data={initial.data} />
      <Espace180Page />
    </>
  )
}
