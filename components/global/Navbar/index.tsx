import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'

import { loadSettings } from '@/sanity/loader/loadQuery'

import { ClientNavbar } from './ClientNavbar'

const NavbarPreview = dynamic(() => import('./NavbarPreview'))

export async function Navbar() {
  const initial = await loadSettings()

  if ((await draftMode()).isEnabled) {
    return <NavbarPreview initial={initial} />
  }

  return <ClientNavbar data={initial.data} />
}
