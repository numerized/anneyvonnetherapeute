'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function QuestionnaireCompleted() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-12 shadow-lg max-w-2xl mx-4 text-center">
        <h1 className="text-3xl font-light mb-6">
          <span className="text-primary-coral">Merci</span> pour vos réponses
        </h1>
        <p className="text-gray-600 mb-8">
          Vos réponses ont été enregistrées. Elles nous aideront à mieux comprendre votre parcours et à adapter nos prochaines séances.
        </p>
        <div className="space-y-4">
          <Button
            onClick={() => router.push('/accueil')}
          >
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    </div>
  )
}
