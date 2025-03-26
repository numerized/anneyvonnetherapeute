import { Metadata } from 'next'

import { ClientNavbar } from '@/components/global/Navbar/ClientNavbar'
import CapsulesPage from '@/components/pages/capsules/CapsulesPage'
import { loadSettings } from '@/sanity/loader/loadQuery'

export const metadata: Metadata = {
  title: 'Capsules Audio - Anne Yvonne Relations',
  description:
    'Découvrez nos capsules audio de méditation et de développement personnel.',
}

export default async function Capsules() {
  const initial = await loadSettings()

  return (
    <>
      <ClientNavbar data={initial.data} />
      <CapsulesPage />
    </>
  )
}
