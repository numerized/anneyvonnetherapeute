'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface QuestionnaireRewardProps {
  isOpen: boolean
  onClose: () => void
}

export function QuestionnaireReward({ isOpen, onClose }: QuestionnaireRewardProps) {
  const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowParticles(true), 500)
      return () => clearTimeout(timer)
    }
    setShowParticles(false)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        >
          <div className="relative max-w-lg w-full mx-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="bg-primary-forest p-8 rounded-[32px] text-center relative overflow-hidden"
            >
              {/* Decorative elements */}
              {showParticles && (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute top-4 left-4 w-20 h-20 rounded-full bg-primary-coral/10"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-primary-cream/10"
                  />
                </>
              )}

              {/* Content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative z-10"
              >
                <h2 className="text-primary-coral text-3xl md:text-4xl font-light mb-6">
                  Merci pour votre sincérité
                </h2>
                <p className="text-primary-cream/90 text-lg mb-8">
                  Votre honnêteté est la première étape vers un véritable changement. Je suis là pour vous accompagner dans ce voyage.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-8 py-3 bg-primary-cream text-primary-dark rounded-full hover:bg-primary-cream/90 transition-colors"
                >
                  Continuer
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
