import { Metadata } from 'next'

import { ObfuscatedEmail } from '@/components/shared/ObfuscatedEmail'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Anne Yvonne Racine',
  description:
    'Politique de confidentialité et informations sur la protection des données personnelles du site web de Anne Yvonne Racine.',
  robots: 'noindex, nofollow',
}

export default function PolitiqueConfidentialite() {
  return (
    <main className="bg-primary-dark min-h-screen py-32">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl text-primary-cream mb-12">
          Politique de Confidentialité
        </h1>

        <div className="prose prose-lg prose-invert">
          <section className="mb-12">
            <h2 className="text-2xl text-primary-cream mb-6">
              Collecte des données personnelles
            </h2>
            <p className="text-primary-cream/80">
              Les données personnelles collectées sur ce site sont uniquement
              utilisées pour permettre l'accès aux capsules audio et pour vous
              contacter dans le cadre de nos services. Ces données incluent :
            </p>
            <ul className="text-primary-cream/80 list-disc pl-6 mt-4">
              <li>Votre adresse email (pour l'accès aux capsules audio)</li>
              <li>
                Les informations que vous fournissez volontairement lors de nos
                échanges
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl text-primary-cream mb-6">
              Utilisation des données
            </h2>
            <p className="text-primary-cream/80">
              Vos données sont utilisées pour :
            </p>
            <ul className="text-primary-cream/80 list-disc pl-6 mt-4">
              <li>Vous donner accès aux capsules audio</li>
              <li>Vous informer des nouveaux contenus disponibles</li>
              <li>Améliorer nos services et votre expérience utilisateur</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl text-primary-cream mb-6">
              Protection des données
            </h2>
            <p className="text-primary-cream/80">
              Nous mettons en œuvre des mesures de sécurité pour protéger vos
              données contre tout accès, modification, divulgation ou
              destruction non autorisée. Vos données sont stockées sur des
              serveurs sécurisés et ne sont accessibles qu'aux personnes
              autorisées.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl text-primary-cream mb-6">Vos droits</h2>
            <p className="text-primary-cream/80">
              Conformément au RGPD, vous disposez des droits suivants concernant
              vos données :
            </p>
            <ul className="text-primary-cream/80 list-disc pl-6 mt-4">
              <li>Droit d'accès</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité</li>
            </ul>
            <p className="text-primary-cream/80 mt-4">
              Pour exercer ces droits, contactez-nous à{' '}
              <ObfuscatedEmail
                email="a.ra@bluewin.ch"
                className="text-primary-cream/80"
              />
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
