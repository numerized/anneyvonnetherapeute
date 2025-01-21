'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EvaluationModal } from '@/components/modals/EvaluationModal'

export function EvaluationSection() {
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false)

  return (
    <>
      <section className="py-24 bg-primary-dark">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center space-y-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-primary-cream mb-6">
                Évaluez votre handicap relationnel
              </h2>
              <p className="text-xl text-primary-cream/80">
                Découvrez votre niveau d'autonomie dans vos relations sociales et intimes. Notre questionnaire vous aide à identifier vos forces et vos axes d'amélioration pour des relations plus épanouissantes.
              </p>
            </div>
            <Button 
              onClick={() => setIsEvaluationOpen(true)}
              size="lg"
              className="bg-primary-coral hover:bg-primary-rust text-primary-cream text-lg px-8 py-6 rounded-full transition-all duration-300"
            >
              Démarrer le questionnaire
            </Button>
          </div>
        </div>
      </section>

      <EvaluationModal 
        isOpen={isEvaluationOpen} 
        onClose={() => setIsEvaluationOpen(false)} 
      />
    </>
  )
}
