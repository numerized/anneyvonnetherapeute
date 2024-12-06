import { StatItemProps } from './types'

export function StatItem({ value, label }: StatItemProps) {
  return (
    <div 
      className="text-center bg-primary-forest/30 p-6 rounded-[24px]"
      role="listitem"
    >
      <div 
        className="text-primary-coral text-5xl font-black mb-2"
        aria-hidden="true"
      >
        {value}
      </div>
      <div 
        className="text-primary-cream/80 text-sm md:text-base"
        aria-label={`${value} ${label}`}
      >
        {label}
      </div>
    </div>
  )
}
