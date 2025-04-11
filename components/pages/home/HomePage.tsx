'use client'

import type { EncodeDataAttributeCallback } from '@sanity/react-loader'

import { Header } from '@/components/shared/Header'
import { Stats } from '@/components/shared/Stats'
import TherapyQuestionnaireNew from '@/components/TherapyOfferings/TherapyQuestionnaireNew'
import type { HomePagePayload } from '@/types'

import { About } from './About'
import { AiCompanion } from './AiCompanion'
import { EvaluationSection } from './EvaluationSection'
import { Hero } from './Hero'
import { ProfessionalTraining } from './ProfessionalTraining'
import { RelationshipStages } from './RelationshipStages'
import { TherapyPricing } from './TherapyPricing'

export interface HomePageProps {
  data: HomePagePayload | null
  encodeDataAttribute?: EncodeDataAttributeCallback
  settings?: any
}

export function HomePage({
  data,
  encodeDataAttribute,
  settings,
}: HomePageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { overview = [], title = '', hero, statistics = [] } = data ?? {}

  return (
    <>
      {/* Hero Section */}
      {hero && <Hero hero={hero} data={settings} />}

      {/* Stats Section */}
      {statistics && statistics.length > 0 && (
        <div className="max-w-7xl mx-auto px-6">
          <Stats
            title="Une approche unique de la thérapie relationnelle"
            items={statistics.map((stat) => ({
              value: stat.number,
              label: stat.label,
            }))}
          />
        </div>
      )}

      {/* About Section */}
      <About />

      <TherapyQuestionnaireNew />

      <ProfessionalTraining />
      <AiCompanion />
      <EvaluationSection />

      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {title && !hero && (
          <Header centered title={title} description={overview} />
        )}
      </div>
    </>
  )
}

export default HomePage
