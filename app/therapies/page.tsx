import React from 'react'
import { CustomCapsuleMiroirCard } from '@/components/pages/prochainement/CustomCapsuleMiroirCard'
import TherapyOfferingsPage from '@/components/TherapyOfferings/TherapyOfferingsPage'
import LightCapsule from '@/components/pages/therapies/LightCapsule'
import { Hero } from '@/components/pages/home/Hero'

// Provide static props for Hero as a fallback
const heroProps = {
  hero: {
    title: 'Présentation des 3 Thérapies',
    subtitle: '',
    ctaButton: { label: '', ariaLabel: '' },
    image: null,
    // Add more fields as needed for your Hero component
  },
  data: {},
}

export const metadata = {
  title: 'Thérapies - Coeur à Corps | Anne Yvonne Thérapie',
  description:
    'Découvrez nos différentes approches thérapeutiques pour votre épanouissement relationnel et personnel.',
}

export default function TherapiesPage() {
  return (
    <div className="bg-primary-forest min-h-screen w-full">
      <TherapyOfferingsPage />
    </div>
  )
}
