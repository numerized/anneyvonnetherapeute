'use client'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { Loader2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'

import { EmailForm } from '@/components/shared/EmailForm'
import { app } from '@/lib/firebase'
import { urlFor } from '@/sanity/lib/image'
import { SettingsPayload } from '@/types'
import NotificationBanner from '../NotificationBanner/NotificationBanner'

interface Espace180NavbarProps {
  data: SettingsPayload
}

export default function Espace180Navbar({ data }: Espace180NavbarProps) {
  const pathname = usePathname()
  const isProchainement = pathname === '/prochainement'
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined)

  const logoAsset = data?.logo?.asset
  const logoUrl = logoAsset?.path ? `https://cdn.sanity.io/${logoAsset.path}` : null

  useEffect(() => {
    const auth = getAuth(app);
    
    // Set initial auth state
    setIsLoggedIn(!!auth.currentUser);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  // Don't render anything until we know the auth state
  if (isLoggedIn === undefined) {
    return null;
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="relative bg-primary-dark hidden md:block" role="banner">
        {isProchainement ? (
          <NotificationBanner message="Lancement en 2025" />
        ) : data.notificationMessage && (
          <NotificationBanner message={data.notificationMessage} />
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
                      alt={data.logo?.alt?.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() || "Logo"}
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
              {/* No navigation links for Espace180 page */}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="relative bg-primary-dark md:hidden" role="banner">
        {isProchainement ? (
          <NotificationBanner message="Lancement en 2025" />
        ) : data.notificationMessage && (
          <NotificationBanner message={data.notificationMessage} />
        )}
        <div className="px-4">
          <nav className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              {logoUrl ? (
                <Image 
                  src={logoUrl}
                  alt={data.logo?.alt?.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() || "Logo"}
                  className="h-12 w-auto"
                  width={200}
                  height={200}
                  priority
                />
              ) : (
                <span className="text-white font-bold text-xl">Anne Yvonne</span>
              )}
            </Link>

            {/* No mobile menu button for Espace180 page */}
          </nav>
        </div>
      </header>
    </>
  )
}
