import { Metadata } from 'next'
import Espace180Page from '@/components/pages/espace180/Espace180Page'
import { ClientNavbar } from '@/components/global/Navbar/ClientNavbar'
import { loadSettings } from '@/sanity/loader/loadQuery'

export const metadata: Metadata = {
  title: 'Espace 180 - Anne Yvonne Relations',
  description: 'Découvrez nos capsules audio de méditation et de développement personnel.',
}

export default async function Espace180() {
  const initial = await loadSettings()

  return (
    <>
      <ClientNavbar data={initial.data} />
      <Espace180Page />
    </>
  )
}
