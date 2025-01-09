import { Metadata } from 'next'
import CapsulesPage from '@/components/pages/capsules/CapsulesPage'

export const metadata: Metadata = {
  title: 'Capsules Audio - Anne-Yvonne Thérapeute',
  description: 'Découvrez nos capsules audio de méditation et de développement personnel.',
}

export default function Capsules() {
  return <CapsulesPage />
}
