'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-primary-forest flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-primary-forest/60 rounded-[24px] p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl text-primary-cream font-bold mb-4">
              Paiement réussi !
            </h1>
            <p className="text-lg text-primary-cream/80 mb-8">
              Merci pour votre inscription au webinar. Vous recevrez bientôt un
              email avec tous les détails d'accès.
            </p>
            <Link
              href="/prochainement"
              className="inline-flex items-center px-6 py-3 rounded-full bg-primary-coral hover:bg-primary-rust transition-colors duration-200 text-primary-cream font-medium"
            >
              Retour à l&apos;accueil
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
