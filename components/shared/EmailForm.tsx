'use client'

import { useState } from 'react'
import { functions } from '@/lib/firebase'
import { Modal } from '@/components/shared/Modal'

interface EmailFormProps {
  onClose?: () => void
}

export function EmailForm({ onClose }: EmailFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('https://us-central1-coeurs-a-corps.cloudfunctions.net/sendContactEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Server error:', error)
        throw new Error(error.details || error.error || 'Failed to send email')
      }
      setSubmitStatus('success')
      setName('')
      setEmail('')
      setMessage('')
      setTimeout(() => {
        if (onClose) onClose()
      }, 2000)
    } catch (error) {
      console.error('Error sending email:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="CONTACTEZ-NOUS"
      subtitle="Pour plus d'informations sur nos services"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Votre nom"
            className="mt-1 block w-full bg-transparent border-b border-primary-cream/20 pb-2 text-primary-cream/90 placeholder-primary-cream/50 focus:border-primary-coral focus:ring-0 sm:text-sm"
          />
        </div>
        <div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Votre adresse email"
            className="mt-1 block w-full bg-transparent border-b border-primary-cream/20 pb-2 text-primary-cream/90 placeholder-primary-cream/50 focus:border-primary-coral focus:ring-0 sm:text-sm"
          />
        </div>
        <div>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            placeholder="Votre message"
            className="mt-1 block w-full bg-transparent border-b border-primary-cream/20 pb-2 text-primary-cream/90 placeholder-primary-cream/50 focus:border-primary-coral focus:ring-0 sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-[24px] px-4 py-3 text-base font-medium text-primary-cream shadow-sm ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-coral hover:bg-primary-rust transition-colors'
            }`}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </div>
        {submitStatus === 'success' && (
          <p className="text-sm text-primary-teal">Message envoyé avec succès!</p>
        )}
        {submitStatus === 'error' && (
          <p className="text-sm text-primary-rust">
            Une erreur s'est produite. Veuillez réessayer plus tard.
          </p>
        )}
      </form>
    </Modal>
  )
}
