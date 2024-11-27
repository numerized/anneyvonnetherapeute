'use client'

import { Facebook, Instagram, Linkedin, Music, Youtube } from 'lucide-react'
import type { PortableTextBlock } from 'next-sanity'
import { useState, useEffect } from 'react'

import { CustomPortableText } from '@/components//shared/CustomPortableText'
import type { SettingsPayload } from '@/types'
import { createClient } from '@sanity/client'

// Create a read-only client for the frontend
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-24',
  useCdn: true,
})

interface CapsuleSettings {
  title: string
  description: string
  buttonText: string
  successMessage: string
}

interface FooterProps {
  data: SettingsPayload
}

export default function Footer(props: FooterProps) {
  const { data } = props
  const footer = data?.footer || ([] as PortableTextBlock[])
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [capsuleSettings, setCapsuleSettings] = useState<CapsuleSettings>({
    title: 'CAPSULES AUDIO',
    description: 'Inscrivez-vous pour accéder à nos capsules podcast, à écouter en déplacement ou tranquillement chez vous.',
    buttonText: 'Accéder aux capsules',
    successMessage: 'Merci de votre inscription ! Vous recevrez bientôt un email de confirmation.'
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await client.fetch<CapsuleSettings>(`
          *[_type == "capsuleSettings"][0]{
            title,
            description,
            buttonText,
            successMessage
          }
        `)
        if (settings) {
          setCapsuleSettings(settings)
        }
      } catch (error) {
        console.error('Error fetching capsule settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      const response = await fetch('/api/register-capsule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      setStatus('success')
      setMessage(capsuleSettings.successMessage)
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage('Désolé, une erreur est survenue. Veuillez réessayer plus tard.')
      console.error('Form submission error:', error)
    }
  }

  if (!footer || footer.length === 0) return null;

  return (
    <footer className="bg-primary-dark py-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Column 1 - Main Info */}
          <div>
            <div className="text-primary-cream/80">
              <CustomPortableText
                paragraphClasses="text-md md:text-xl mb-4"
                value={footer}
              />
            </div>
          </div>

          {/* Column 2 - Newsletter */}
          <div>
            <div className="bg-primary-forest/30 rounded-xl p-6">
              <h3 className="text-primary-cream text-xl mb-4">{capsuleSettings.title}</h3>
              <p className="text-primary-cream/80 mb-4">
                {capsuleSettings.description}
              </p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="sr-only">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                    className="w-full px-4 py-2 rounded-md bg-primary-dark/50 border border-primary-teal/20 text-primary-cream placeholder-primary-cream/50 focus:outline-none focus:ring-2 focus:ring-primary-teal form-input"
                    aria-label="Entrez votre adresse email pour accéder aux capsules audio"
                    disabled={status === 'loading'}
                  />
                </div>
                {message && (
                  <p className={`text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream py-3 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-primary-teal disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={capsuleSettings.buttonText}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Inscription en cours...' : capsuleSettings.buttonText}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-primary-teal/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6 text-primary-cream/80">
              <a href="/mentions-legales" className="hover:text-primary-cream focus:outline-none focus:ring-2 focus:ring-primary-teal rounded-md px-2 py-1">
                Mentions légales
              </a>
              <a href="/politique-confidentialite" className="hover:text-primary-cream focus:outline-none focus:ring-2 focus:ring-primary-teal rounded-md px-2 py-1">
                Politique de confidentialité
              </a>
            </div>
            <div className="flex space-x-6 text-primary-cream/80">
              <a href="https://facebook.com" className="hover:text-primary-teal transition-colors focus:outline-none focus:ring-2 focus:ring-primary-teal rounded-full p-1" aria-label="Facebook">
                <SocialIcon platform="facebook" />
              </a>
              <a href="https://instagram.com" className="hover:text-primary-teal transition-colors focus:outline-none focus:ring-2 focus:ring-primary-teal rounded-full p-1" aria-label="Instagram">
                <SocialIcon platform="instagram" />
              </a>
              <a href="https://linkedin.com" className="hover:text-primary-teal transition-colors focus:outline-none focus:ring-2 focus:ring-primary-teal rounded-full p-1" aria-label="LinkedIn">
                <SocialIcon platform="linkedin" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'facebook':
      return <Facebook size={20} aria-hidden="true" />;
    case 'instagram':
      return <Instagram size={20} aria-hidden="true" />;
    case 'linkedin':
      return <Linkedin size={20} aria-hidden="true" />;
    case 'youtube':
      return <Youtube size={20} aria-hidden="true" />;
    case 'spotify':
      return <Music size={20} aria-hidden="true" />;
    default:
      return null;
  }
};
