import { Facebook, Instagram, Linkedin, Music, Youtube } from 'lucide-react'
import type { PortableTextBlock } from 'next-sanity'

import { CustomPortableText } from '@/components//shared/CustomPortableText'
import type { SettingsPayload } from '@/types'

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

interface FooterProps {
  data: SettingsPayload
}

export default function Footer(props: FooterProps) {
  const { data } = props
  const footer = data?.footer || ([] as PortableTextBlock[])

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
              <h3 className="text-primary-cream text-xl mb-4">CAPSULES AUDIO</h3>
              <p className="text-primary-cream/80 mb-4">
                Inscrivez-vous pour accéder à nos capsules podcast, à écouter en déplacement ou tranquillement chez vous.
              </p>
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Votre adresse email"
                    required
                    className="w-full px-4 py-2 rounded-md bg-primary-dark/50 border border-primary-teal/20 text-primary-cream placeholder-primary-cream/50 focus:outline-none focus:ring-2 focus:ring-primary-teal form-input"
                    aria-label="Entrez votre adresse email pour accéder aux capsules audio"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream py-3 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  aria-label="Accéder aux capsules"
                >
                  Accéder aux capsules
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
