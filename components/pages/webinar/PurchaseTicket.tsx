'use client'

import { loadStripe } from '@stripe/stripe-js'
import { motion } from 'framer-motion'
import { useState } from 'react'

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

interface PurchaseTicketProps {
  ticketType: 'standard' | 'vip'
  onClose: () => void
}

export function PurchaseTicket({ ticketType, onClose }: PurchaseTicketProps) {
  const [email, setEmail] = useState('')
  const [currency, setCurrency] = useState('eur')
  const [couponCode, setCouponCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [discount, setDiscount] = useState(0)

  const basePrice = 1
  const finalPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase()
    setCouponCode(code)
    if (code === 'POESIE180') {
      setDiscount(50)
    } else {
      setDiscount(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          ticketType,
          currency,
          discount,
          couponCode: couponCode || undefined,
          productType: 'webinar',
          cancelPath:
            typeof window !== 'undefined'
              ? window.location.pathname
              : '/webinar',
        }),
      })

      if (!response.ok) {
        throw new Error('Payment failed')
      }

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId })
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    }

    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-primary-forest rounded-[32px] p-8 max-w-md w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-primary-cream/60 hover:text-primary-cream"
        >
          ✕
        </button>

        <h3 className="text-2xl font-light text-primary-cream mb-6">
          Réserver ma place
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-primary-cream/80 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-full bg-primary-dark/30 text-primary-cream border border-primary-cream/20 focus:border-primary-coral outline-none"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-primary-cream/80 mb-3">
                Devise de paiement
              </label>
              <div className="flex gap-8 justify-center">
                <label className="flex flex-col items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-colors ${currency === 'eur' ? 'bg-primary-coral/20 border-primary-coral' : 'border-primary-cream/20 hover:border-primary-coral/50'}`}
                  >
                    <input
                      type="radio"
                      name="currency"
                      value="eur"
                      checked={currency === 'eur'}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="sr-only"
                    />
                    <span
                      className={`text-2xl font-bold transition-colors ${currency === 'eur' ? 'text-primary-coral' : 'text-primary-cream/80 group-hover:text-primary-coral/80'}`}
                    >
                      EUR
                    </span>
                  </div>
                  <span
                    className={`text-sm transition-colors ${currency === 'eur' ? 'text-primary-coral' : 'text-primary-cream/60'}`}
                  >
                    Euros
                  </span>
                </label>

                <label className="flex flex-col items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-colors ${currency === 'chf' ? 'bg-primary-coral/20 border-primary-coral' : 'border-primary-cream/20 hover:border-primary-coral/50'}`}
                  >
                    <input
                      type="radio"
                      name="currency"
                      value="chf"
                      checked={currency === 'chf'}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="sr-only"
                    />
                    <span
                      className={`text-2xl font-bold transition-colors ${currency === 'chf' ? 'text-primary-coral' : 'text-primary-cream/80 group-hover:text-primary-coral/80'}`}
                    >
                      CHF
                    </span>
                  </div>
                  <span
                    className={`text-sm transition-colors ${currency === 'chf' ? 'text-primary-coral' : 'text-primary-cream/60'}`}
                  >
                    Francs Suisses
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="coupon"
                className="block text-primary-cream/80 mb-2"
              >
                Code promo (optionnel)
              </label>
              <input
                type="text"
                id="coupon"
                value={couponCode}
                onChange={handleCouponChange}
                className="w-full px-4 py-2 rounded-full bg-primary-dark/30 text-primary-cream border border-primary-cream/20 focus:border-primary-coral outline-none uppercase"
                placeholder="Entrez votre code promo"
              />
              {discount > 0 && (
                <p className="mt-2 text-primary-coral">
                  Code promo appliqué : -{discount}% de réduction
                </p>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-primary-cream/80">Prix total :</p>
              <div className="flex items-center justify-center gap-2">
                {discount > 0 && (
                  <span className="text-primary-cream/60 line-through">
                    {basePrice} {currency.toUpperCase()}
                  </span>
                )}
                <span className="text-2xl font-bold text-primary-coral">
                  {finalPrice} {currency.toUpperCase()}
                </span>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-coral hover:bg-primary-rust disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-primary-cream rounded-full py-3 font-bold"
            >
              {isLoading ? 'Chargement...' : 'Procéder au paiement'}
            </button>

            <p className="text-primary-cream/60 text-sm text-center">
              Paiement sécurisé par Stripe
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
