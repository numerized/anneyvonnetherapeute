'use client'

import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

import { resolveHref } from '@/sanity/lib/utils'
import { MenuItem } from '@/types'

interface FooterProps {
  data: {
    links?: MenuItem[]
    text?: any[]
  }
  hideNewsletter?: boolean
}

export function Footer({ data, hideNewsletter }: FooterProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add your newsletter subscription logic here
    setSubscribed(true)
  }

  return (
    <footer className="bg-primary-dark text-primary-cream">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Navigation */}
          <div>
            <h3 className="text-xl mb-6">Navigation</h3>
            <ul className="space-y-4">
              {data?.links?.map((link, key) => {
                const href = resolveHref(link?._type, link?.slug)
                if (!href) {
                  return null
                }
                return (
                  <li key={key}>
                    <Link
                      href={href}
                      className="hover:text-primary-coral transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl mb-6">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:contact@anneyvonne.fr"
                  className="hover:text-primary-coral transition-colors"
                >
                  contact@anneyvonne.fr
                </a>
              </li>
              <li>
                <a
                  href="tel:+33612345678"
                  className="hover:text-primary-coral transition-colors"
                >
                  +33 6 12 34 56 78
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl mb-6">Social</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-coral transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-coral transition-colors"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          {!hideNewsletter && (
            <div>
              <h3 className="text-xl mb-6">Newsletter</h3>
              {subscribed ? (
                <p className="text-primary-coral">
                  Merci pour votre inscription !
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    className="w-full bg-primary-forest text-primary-cream placeholder-primary-cream/50 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-coral"
                    required
                  />
                  <motion.button
                    type="submit"
                    className="w-full bg-primary-coral hover:bg-primary-rust text-white px-6 py-2 rounded-full transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    S'inscrire
                  </motion.button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Text */}
        {data?.text && (
          <div className="mt-12 pt-12 border-t border-primary-cream/20 text-sm text-primary-cream/60">
            <PortableText value={data.text} />
          </div>
        )}
      </div>
    </footer>
  )
}
