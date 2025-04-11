'use client'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { Loader2, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'

import { EmailForm } from '@/components/shared/EmailForm'
import { app } from '@/lib/firebase'
import { urlFor } from '@/sanity/lib/image'
import { resolveHref } from '@/sanity/lib/utils'
import { SettingsPayload } from '@/types'

import NotificationBanner from '../NotificationBanner/NotificationBanner'

interface NavbarProps {
  data: SettingsPayload
}

export default function NavbarLayout({ data }: NavbarProps) {
  const menuItems = data?.menuItems || []
  const pathname = usePathname()
  const isProchainement = pathname === '/prochainement'
  const isCoachingGroupe = pathname === '/coaching-relationnel-en-groupe'
  const isLive = pathname === '/live'

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined)

  const logoAsset = data?.logo?.asset
  const logoUrl = logoAsset?.path
    ? `https://cdn.sanity.io/${logoAsset.path}`
    : null

  useEffect(() => {
    const auth = getAuth(app)

    // Set initial auth state
    setIsLoggedIn(!!auth.currentUser)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user)
    })

    return () => unsubscribe()
  }, [])

  // Don't render navbar on live or coaching-relationnel-en-groupe routes
  if (isLive || isCoachingGroupe) {
    return null
  }

  // Don't render anything until we know the auth state
  if (isLoggedIn === undefined) {
    return null
  }

  const renderMenuItem = (item: any, index: number) => {
    // Clean up the style value by removing hidden Unicode characters
    const cleanStyle = item?.style?.replace(/[\u200B-\u200D\uFEFF]/g, '')
    const isLastItem = data.menuItems && index === data.menuItems.length - 1

    if (isLastItem) {
      const buttonBaseClasses =
        'px-4 py-2 rounded-full transition-all duration-200 flex items-center justify-center'
      const buttonClearClasses = `${buttonBaseClasses} border-2 border-white text-white hover:bg-white/10`

      return (
        <Link
          key={item._key}
          href={isLoggedIn ? '/dashboard' : '/login'}
          className={buttonClearClasses}
        >
          {isLoggedIn === null ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isLoggedIn ? (
            'Espace Privé'
          ) : (
            item.title
          )}
        </Link>
      )
    }

    if (item?.slug?.current === 'prochainement') {
      return (
        <Link
          key={item._key}
          href="/prochainement"
          className="text-white hover:text-white/80 transition-colors duration-200"
        >
          {item.title}
        </Link>
      )
    }

    // Clean up the style value by removing hidden Unicode characters
    const baseClasses =
      'text-white hover:text-white/80 transition-colors duration-200'
    const buttonBaseClasses =
      'px-4 py-2 rounded-full transition-all duration-200'
    const buttonPlainClasses = `${buttonBaseClasses} bg-primary-coral text-white font-bold hover:bg-primary-coral/90 hover:scale-105`
    const buttonClearClasses = `${buttonBaseClasses} border-2 border-white text-white hover:bg-white/10`

    const classes =
      cleanStyle === 'button-plain'
        ? buttonPlainClasses
        : cleanStyle === 'button-clear'
          ? buttonClearClasses
          : baseClasses

    if (item.linkType === 'reference' && item.reference?.slug) {
      return (
        <Link
          key={item.title}
          href={`/${item.reference.slug}`}
          className={classes}
        >
          {item.title}
        </Link>
      )
    }

    if (item.linkType === 'anchor' && item.anchor) {
      return (
        <a
          key={item.title}
          href={`#${item.anchor}`}
          className={classes}
          onClick={(e) => {
            e.preventDefault()
            const element = document.getElementById(item.anchor)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        >
          {item.title}
        </a>
      )
    }

    return null
  }

  return (
    <>
      {/* Desktop Header */}
      <header
        className="relative bg-primary-dark hidden md:block"
        role="banner"
      >
        {isProchainement ? (
          <NotificationBanner message="Lancement en 2025" />
        ) : (
          data.notificationMessage && (
            <NotificationBanner message={data.notificationMessage} />
          )
        )}
        <div className="max-w-7xl mx-auto px-6">
          <nav
            className="relative py-4"
            role="navigation"
            aria-label="Main navigation"
          >
            <div className="flex justify-end items-center relative">
              {logoUrl && (
                <div className="absolute -bottom-[86px] left-0 z-50 hidden md:block">
                  <Link href="/" className="flex-shrink-0">
                    <Image
                      src={logoUrl}
                      alt={
                        data.logo?.alt
                          ?.replace(/[\u200B-\u200D\uFEFF]/g, '')
                          .trim() || 'Logo'
                      }
                      className="h-[172px] w-auto"
                      width={500}
                      height={500}
                      priority
                      onError={(e) => {
                        console.error('Error loading logo:', e)
                      }}
                    />
                  </Link>
                </div>
              )}
              {/* Desktop Navigation */}
              {!isProchainement && data?.menuItems && (
                <div className="hidden md:flex items-center space-x-8">
                  {data.menuItems.map((item: any, index: number) => (
                    <div key={item._key || `menu-item-${index}`}>
                      {renderMenuItem(item, index)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {showAppointmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Prendre rendez-vous</h2>
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <EmailForm onClose={() => setShowAppointmentModal(false)} />
            </div>
          </div>
        )}
      </header>
    </>
  )
}
