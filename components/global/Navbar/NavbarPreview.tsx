'use client'

import { useSettings } from '@/sanity/loader/useQuery'

import NavbarLayout from './NavbarLayout'

type Props = {
  initial: Parameters<typeof useSettings>[0]
}

export default function NavbarPreview(props: Props) {
  // We still use useSettings to trigger live preview updates
  useSettings(props.initial)

  return <NavbarLayout />
}
