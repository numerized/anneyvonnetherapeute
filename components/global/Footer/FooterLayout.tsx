'use client'

import { urlForImage } from '@/sanity/lib/utils'
import { Facebook, Instagram, Linkedin, Music, Youtube } from 'lucide-react'
import type { PortableTextBlock } from 'next-sanity'
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  const newsletter = data?.newsletter || {
    title: 'CAPSULES AUDIO et CODE PROMO !',
    description: "Inscrivez-vous et recevez gratuitement : Des infos sur nos prochains LIVE, 1 code promo - 10 % (COEUR180), le questionnaire de l'amoureux, et un accès à nos capsules audio exclusives pour enrichir votre développement relationnel.",
    buttonText: 'Accéder aux capsules',
    placeholder: 'Votre adresse email'
  }
  const [isSubscribed, setIsSubscribed] = useState(false)
  const logoUrl = data?.logo?.asset?.url;

  if (!footer || footer.length === 0) return null;

  return (
    <footer className="bg-primary-dark py-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          {/* Column 1 - Logo */}
          <div className="flex items-center justify-center lg:col-span-4">
            {logoUrl && (
              <Link href="/" className="flex-shrink-0 block">
                <Image
                  src={logoUrl}
                  alt={data.logo?.alt?.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() || "Logo"}
                  className="w-auto h-[200px] lg:h-[263px] rounded-[24px]"
                  width={500}
                  height={500}
                  priority
                />
              </Link>
            )}
          </div>

          {/* Column 2 - Newsletter */}
          <div className="flex items-center justify-center lg:col-span-8">
            <div className="bg-primary-forest/30 rounded-[24px] p-6 w-full">
              <h3 className="text-2xl text-primary-cream font-bold mb-4">
                {newsletter.title}
              </h3>
              {!isSubscribed && (
                <p className="text-primary-cream/80 mb-4">
                  {newsletter.description}
                </p>
              )}
              {isSubscribed ? (
                <div className="mt-4">
                  <p className="text-primary-coral font-bold text-left">Merci pour votre inscription !</p>
                  <p className="text-primary-coral text-left mt-2">Consultez votre email pour confirmer votre accès aux capsules gratuites</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
                  const email = emailInput.value;

                  try {
                    const response = await fetch('/api/newsletter', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ email }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                      throw new Error(data.error || 'Failed to subscribe');
                    }

                    // Clear the form and show success message
                    form.reset();
                    setIsSubscribed(true);
                  } catch (error) {
                    console.error('Newsletter subscription error:', error);
                    alert(error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.');
                  }
                }}>
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder={newsletter.placeholder}
                      required
                      className="w-full px-4 py-2 rounded-md bg-primary-dark/50 border border-primary-teal/20 text-primary-cream placeholder-primary-cream/50 focus:outline-none focus:ring-2 focus:ring-primary-teal form-input"
                      aria-label={newsletter.placeholder}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream py-3 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-primary-teal"
                    aria-label={newsletter.buttonText}
                  >
                    {newsletter.buttonText}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-primary-teal/20">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex space-x-6 text-primary-cream/80">
              <Link href="/mentions-legales" className="hover:text-primary-cream focus:outline-none focus:ring-2 focus:ring-primary-teal rounded-md px-2 py-1">
                Mentions légales
              </Link>
              <Link href="/politique-de-confidentialite" className="hover:text-primary-cream focus:outline-none focus:ring-2 focus:ring-primary-teal rounded-md px-2 py-1">
                Politique de confidentialité
              </Link>
            </div>
            <div className="flex space-x-6 text-primary-cream/80">

              <a href="https://www.instagram.com/sexologie_relation_therapie/" className="hover:text-primary-teal transition-colors focus:outline-none focus:ring-2 focus:ring-primary-teal rounded-full p-1" aria-label="Instagram">
                <SocialIcon platform="instagram" />
              </a>
              <a href="https://ch.linkedin.com/in/anne-yvonne-racine-8951b415b" className="hover:text-primary-teal transition-colors focus:outline-none focus:ring-2 focus:ring-primary-teal rounded-full p-1" aria-label="LinkedIn">
                <SocialIcon platform="linkedin" />
              </a>
              <a href="https://www.youtube.com/@anneyvonneracine123/featured" className="hover:text-primary-teal transition-colors focus:outline-none focus:ring-2 focus:ring-primary-teal rounded-full p-1" aria-label="YouTube">
                <SocialIcon platform="youtube" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
