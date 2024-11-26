import { StatItem } from './StatItem'
import { StatsProps } from './types'

export function Stats({ title, items }: StatsProps) {
  return (
    <section 
      className="bg-primary-dark py-20"
      aria-labelledby="stats-title"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 
          id="stats-title"
          className="text-primary-cream text-3xl md:text-4xl font-light text-center mb-16"
        >
          {title}
        </h2>
        
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          role="list"
          aria-label="Statistiques de réussite"
        >
          {items.map((item, index) => (
            <StatItem 
              key={index}
              value={item.value} 
              label={item.label}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
