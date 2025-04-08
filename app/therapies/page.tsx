import React from 'react'

import TherapyQuestionnaireNew from '@/components/TherapyOfferings/TherapyQuestionnaireNew'
import TherapyOfferingsPage from '@/components/TherapyOfferings/TherapyOfferingsPage'

export const metadata = {
  title: 'Thérapies - Coeur à Corps | Anne Yvonne Thérapie',
  description:
    'Découvrez nos différentes approches thérapeutiques pour votre épanouissement relationnel et personnel.',
}

export default function TherapiesPage() {
  return (
    <>
      <TherapyOfferingsPage />
      <TherapyQuestionnaireNew />
    </>
  )
}
