'use client'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HiMenu } from 'react-icons/hi'

import { EmailForm } from '@/components/shared/EmailForm'
import { app } from '@/lib/firebase'

import NotificationBanner from '../NotificationBanner/NotificationBanner'
import { NavLinks } from './NavLinks'

export default function NavbarLayout() {
  const pathname = usePathname()
  const isProchainement = pathname === '/prochainement'
  const isCoachingGroupe = pathname === '/coaching-relationnel-en-groupe'
  const isLive = pathname === '/live'

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined)

  const logoUrl = '/images/logo.png' // Static logo path

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
          <NotificationBanner message="" />
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
                      alt="Logo"
                      className="h-[172px] w-auto"
                      width={500}
                      height={500}
                      priority
                    />
                  </Link>
                </div>
              )}
              {/* Desktop Navigation */}
              {!isProchainement && (
                <div className="hidden md:flex items-center space-x-8">
                  <NavLinks 
                    setIsMenuOpen={setIsMenuOpen}
                    setShowAppointmentModal={setShowAppointmentModal}
                    isLoggedIn={isLoggedIn}
                  />
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header
        className="relative bg-primary-dark md:hidden"
        role="banner"
      >
        {isProchainement ? (
          <NotificationBanner message="Lancement en 2025" />
        ) : (
          <NotificationBanner message="" />
        )}
        <div className="px-4 sm:px-6 py-2">
          <nav className="relative flex justify-between items-center">
            {logoUrl && (
              <Link href="/" className="flex-shrink-0">
                <Image
                  src={logoUrl}
                  alt="Logo"
                  className="h-[60px] w-auto"
                  width={172}
                  height={60}
                  priority
                />
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <HiMenu className="w-8 h-8" />
              )}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-primary-dark/95 backdrop-blur-sm flex flex-col justify-center items-center">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 text-white"
              aria-label="Close menu"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col space-y-6 items-center">
              <NavLinks 
                setIsMenuOpen={setIsMenuOpen}
                setShowAppointmentModal={setShowAppointmentModal}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
        )}
      </header>

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
    </>
  )
}
