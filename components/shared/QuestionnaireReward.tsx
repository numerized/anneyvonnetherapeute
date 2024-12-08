'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Heart, Users, User, BookOpen } from 'lucide-react'

interface QuestionnaireRewardProps {
  isOpen: boolean
  onClose: () => void
  situation?: 'couple' | 'individual'
}

export function QuestionnaireReward({ isOpen, onClose, situation }: QuestionnaireRewardProps) {
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
                    className="absolute top-4 left-4 w-12 h-12 rounded-full bg-primary-coral/10 flex items-center justify-center"
                  >
                    <Heart className="w-6 h-6 text-primary-cream" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary-cream/10 flex items-center justify-center"
                  >
                    {situation === 'couple' ? (
                      <Users className="w-6 h-6 text-primary-cream" />
                    ) : (
                      <User className="w-6 h-6 text-primary-cream" />
                    )}
                  </motion.div>
                </>
              )}

              {/* Content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative z-10"
              >
                {/* Gamification Counter */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-end gap-2 text-white text-sm mb-4"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Carte 1 / 23 • Ajoutée au Carnet!</span>
                </motion.div>

                <h2 className="text-primary-coral text-3xl md:text-4xl font-light mb-6 text-right">
                  Merci pour votre sincérité
                </h2>
                <p className="text-primary-cream/90 text-lg mb-8 text-left">
                  Votre honnêteté est la première étape vers un véritable changement. Je suis là pour vous accompagner dans ce voyage.
                </p>
                <div className="text-left">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-8 py-3 bg-primary-cream text-primary-dark rounded-full hover:bg-primary-cream/90 transition-colors"
                  >
                    Continuer
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
