import { HomePagePayload, SettingsPayload } from '@/types'

import { Header } from '@/components/shared/Header'
import { Hero } from '@/components/pages/home/Hero'
import { RelationshipStages } from '@/components/pages/home/RelationshipStages'
import { TherapyPricing } from '@/components/pages/home/TherapyPricing'
import { Stats } from '@/components/shared/Stats'

export interface ComingSoonPageProps {
  data: HomePagePayload | null
  settings: SettingsPayload | null
}

export function ComingSoonPage({ data, settings }: ComingSoonPageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { overview = [], title = '', hero, statistics = [] } = data ?? {}

  return (
    <>
      {/* Hero Section */}
      {hero && <Hero hero={hero} data={settings} comingSoon />}

      {/* Stats Section */}
      {statistics && statistics.length > 0 && (
        <div className="max-w-7xl mx-auto px-6">
          <Stats 
            title="Une approche unique de la thérapie relationnelle"
            items={statistics.map(stat => ({
              value: stat.number,
              label: stat.label
            }))}
          />
        </div>
      )}

      {/* Title and Overview */}
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {title && !hero && <Header centered title={title} description={overview} />}
      </div>
    </>
  )
}
