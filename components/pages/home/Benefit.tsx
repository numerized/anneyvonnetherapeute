'use client'

import { ReactNode } from 'react'

interface BenefitProps {
  icon: ReactNode
  title: string
  description: string
}

export function Benefit({ icon, title, description }: BenefitProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-primary-coral mt-1">
        {icon}
      </div>
      <div>
        <h4 className="text-primary-cream font-bold mb-1">{title}</h4>
        <p className="text-primary-cream/80 text-sm">{description}</p>
      </div>
    </div>
  )
}
