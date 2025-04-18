import { StatItem } from './StatItem'
import { StatsProps } from './types'

export function Stats({ title, items }: StatsProps) {
  return (
    <section
      className="py-12 -mx-[2rem] md:-mx-[4rem] lg:-mx-[6rem]"
      aria-labelledby="stats-title"
    >
      <div className="mx-[2rem] md:mx-[4rem] lg:mx-[6rem]">
        <h2
          id="stats-title"
          className="text-primary-cream text-3xl md:text-4xl font-light text-center mb-12"
        >
          {title}
        </h2>

        <div className="max-w-2xl mx-auto mb-10">
          <p className="text-primary-cream/80 text-center whitespace-pre-line text-base md:text-lg">
            {`Tout commence par un autre regard.\nSur le lien, sur le désir, sur ce que tu appelles "toi".\n\nJe t’accompagne à travers des séances individuelles ou de couple pour questionner les fondements de ta façon d’aimer et désirer, et faire émerger une nouvelle cohérence.`}
          </p>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          role="list"
          aria-label="Statistiques de réussite"
        >
          {items.map((item, index) => (
            <StatItem key={index} value={item.value} label={item.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
