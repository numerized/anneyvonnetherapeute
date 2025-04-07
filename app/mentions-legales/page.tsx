import { Metadata } from 'next'

import { ObfuscatedEmail } from '@/components/shared/ObfuscatedEmail'

export const metadata: Metadata = {
  title: 'Mentions Légales | Anne Yvonne Racine',
  description:
    'Mentions légales et informations juridiques concernant le site web de Anne Yvonne Racine, thérapeute relationnelle.',
  robots: 'noindex, nofollow',
}

export default function MentionsLegales() {
  return (
    <main className="bg-primary-dark min-h-screen py-32">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl text-primary-cream mb-12">Mentions Légales</h1>

        <div className="prose prose-lg prose-invert">
          <section className="mb-12">
            <h2 className="text-2xl text-primary-cream mb-6">
              Éditeur du site
            </h2>
            <p className="text-primary-cream/80">
              Ce site est édité par Anne Yvonne Racine, thérapeute
              relationnelle.
              <br />
              Adresse : FAUBOURG DE L'HÔPITAL 14 2000 Neuchâtel
              <br />
              Email :{' '}
              <ObfuscatedEmail
                email="a.ra@bluewin.ch"
                className="text-primary-cream/80"
              />
              <br />
              Téléphone : +41 79 367 21 30
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl text-primary-cream mb-6">Hébergement</h2>
            <p className="text-primary-cream/80">
              Ce site est hébergé par Vercel Inc.
              <br />
              Adresse : 340 S Lemon Ave #4133 Walnut, CA 91789, USA
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl text-primary-cream mb-6">
              Propriété intellectuelle
            </h2>
            <p className="text-primary-cream/80">
              L'ensemble de ce site relève de la législation française et
              internationale sur le droit d'auteur et la propriété
              intellectuelle. Tous les droits de reproduction sont réservés, y
              compris pour les documents téléchargeables et les représentations
              iconographiques et photographiques.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl text-primary-cream mb-6">Responsabilité</h2>
            <p className="text-primary-cream/80">
              Les informations fournies sur ce site le sont à titre informatif.
              L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des
              informations diffusées, dont elle se réserve le droit de corriger
              le contenu à tout moment et sans préavis.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
