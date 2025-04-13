import { Metadata } from 'next'

import { ClientNavbar } from '@/components/global/Navbar/ClientNavbar'
import CapsulesPage from '@/components/pages/capsules/CapsulesPage'

export const metadata: Metadata = {
  title: 'Capsules Audio - Anne Yvonne Relations',
  description:
    'Découvrez nos capsules audio de méditation et de développement personnel.',
}

export default async function Capsules() {
  return (
    <>
      <ClientNavbar />
      <CapsulesPage />
    </>
  )
}
