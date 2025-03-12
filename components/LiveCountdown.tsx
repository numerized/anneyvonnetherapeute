import { motion } from 'framer-motion'

interface LiveCountdownProps {
  timeUntilLive: string
}

export function LiveCountdown({ timeUntilLive }: LiveCountdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-primary-cream/10 rounded-lg p-8 text-center"
    >
      <h2 className="text-2xl font-semibold text-primary-coral mb-4">
        Le live commence dans
      </h2>
      <div className="text-4xl font-bold text-primary-cream mb-4">
        {timeUntilLive}
      </div>
      <p className="text-primary-cream/80">
        Rendez-vous le 18 mars à 19h pour une expérience transformative autour de l'amour conscient.
      </p>
    </motion.div>
  )
}
