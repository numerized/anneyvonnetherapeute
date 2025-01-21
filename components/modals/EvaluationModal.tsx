'use client'

import { X } from 'lucide-react'
import EvaluationHandicapRelationnelPage from '@/app/evaluation-handicap-relationnel/page'

interface EvaluationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EvaluationModal({ isOpen, onClose }: EvaluationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center">
          <div className="relative w-full">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <EvaluationHandicapRelationnelPage />
          </div>
        </div>
      </div>
    </div>
  )
}
