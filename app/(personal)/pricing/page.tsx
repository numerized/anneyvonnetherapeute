import { Metadata } from 'next'

import { PricingPlans } from '@/components/pages/pricing/PricingPlans'

export const metadata: Metadata = {
  title: 'Tarifs | Anne Yvonne',
  description: 'Découvrez nos différentes offres de thérapie relationnelle.',
}

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 xl:p-24">
      <br />
      <br />
      <br />
      <PricingPlans />
    </main>
  )
}
