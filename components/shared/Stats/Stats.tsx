import { StatItem } from './StatItem'
import { StatsProps } from './types'

export function Stats({ title, items }: StatsProps) {
  return (
    <section 
      className="py-20 -mx-[2rem] md:-mx-[4rem] lg:-mx-[6rem]"
      aria-labelledby="stats-title"
    >
      <div className="mx-[2rem] md:mx-[4rem] lg:mx-[6rem]">
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
