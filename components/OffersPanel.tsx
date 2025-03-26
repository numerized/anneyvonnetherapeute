import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getUserOffers, Offer } from '@/lib/offerService'

interface OffersPanelProps {
  userId: string
  partnerId?: string
  onOffersLoaded?: (offers: Offer[]) => void
}

export function OffersPanel({
  userId,
  partnerId,
  onOffersLoaded,
}: OffersPanelProps) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('OffersPanel mounted with:', { userId, partnerId })

    async function fetchOffers() {
      try {
        console.log('Fetching offers...')
        const userOffers = await getUserOffers(userId, partnerId)
        console.log('Fetched offers:', userOffers)
        setOffers(userOffers)
        onOffersLoaded?.(userOffers)
      } catch (error) {
        console.error('Error fetching offers:', error)
        toast.error('Failed to load offers')
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [userId, partnerId, onOffersLoaded])

  console.log('Current offers state:', offers)
  console.log('Loading state:', loading)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary-cream/80" />
      </div>
    )
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-8 text-primary-cream/60">
        Aucune offre disponible pour le moment
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {offers.map((offer) => (
        <div
          key={offer.id}
          className="bg-primary-cream/5 rounded-lg p-6 hover:bg-primary-cream/10 transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-medium text-primary-coral mb-1">
                {offer.offerName || offer.title || 'COACHING RELATIONNEL 7/7'}
              </h3>
              <p className="text-sm text-primary-cream/80">
                {offer.description}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-primary-coral font-medium">{offer.price} €</p>
            </div>
          </div>

          {offer.features && offer.features.length > 0 && (
            <div className="mt-4 space-y-2">
              {offer.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-primary-cream/80"
                >
                  <span className="text-primary-coral">♦</span>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-4 text-sm text-primary-cream/60 pt-4 border-t border-primary-cream/10">
            <span>
              Achetée le {new Date(offer.createdAt).toLocaleDateString('fr-FR')}
            </span>
            {offer.expiresAt && (
              <span>
                Expire le{' '}
                {new Date(offer.expiresAt).toLocaleDateString('fr-FR')}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
