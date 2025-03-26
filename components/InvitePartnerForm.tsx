import { getFunctions, httpsCallable } from 'firebase/functions'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { app } from '@/lib/firebase'

interface InvitePartnerFormProps {
  onClose: () => void
  onSubmit?: (email: string) => void
}

export function InvitePartnerForm({
  onClose,
  onSubmit,
}: InvitePartnerFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (onSubmit) {
        // If onSubmit is provided, use it
        await onSubmit(email)
      } else {
        // Default behavior - call cloud function
        const functions = getFunctions(app, 'europe-west1')
        const sendPartnerInvite = httpsCallable<
          { partnerEmail: string },
          { success: boolean }
        >(functions, 'sendPartnerInvite')

        const result = await sendPartnerInvite({ partnerEmail: email })

        if (result.data.success) {
          toast.success('Invitation envoyée avec succès')
          onClose()
        } else {
          throw new Error("Échec de l'envoi de l'invitation")
        }
      }
      onClose()
    } catch (error: any) {
      console.error('Error sending invitation:', error)
      const errorMessage =
        error.message || "Erreur lors de l'envoi de l'invitation"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-medium text-primary-cream mb-1">
          Email de votre partenaire
        </div>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="partenaire@exemple.com"
          required
          className="bg-primary-forest border-primary-cream/20 text-primary-cream placeholder:text-primary-cream/40"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-primary-cream/20 text-primary-cream hover:bg-primary-cream/10"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary-coral hover:bg-primary-coral/90 text-white"
        >
          {isLoading ? 'Envoi...' : "Envoyer l'invitation"}
        </Button>
      </div>
    </form>
  )
}
