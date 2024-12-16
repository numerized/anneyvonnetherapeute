'use client'

import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect,useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'

import { urlFor } from '@/sanity/lib/image'
import { resolveHref } from '@/sanity/lib/utils'
import { SettingsPayload } from '@/types'

import NotificationBanner from '../NotificationBanner/NotificationBanner'

interface NavbarProps {
  data: SettingsPayload
}

export default function Navbar(props: NavbarProps) {
  const { data } = props
  const menuItems = data?.menuItems || []
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)

  const logoAsset = data?.logo?.asset
  const logoUrl = logoAsset?.path ? `https://cdn.sanity.io/${logoAsset.path}` : null

  const renderMenuItem = (item: any) => {
    
    // Clean up the style value by removing hidden Unicode characters
    const cleanStyle = item.style?.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    
    const baseClasses = "text-primary-cream hover:text-primary-cream/80 transition-colors duration-200";
    const buttonBaseClasses = "px-4 py-2 rounded-full transition-all duration-200";
    const buttonPlainClasses = `${buttonBaseClasses} bg-primary-coral text-white font-bold hover:bg-primary-coral/90 hover:scale-105`;
    const buttonClearClasses = `${buttonBaseClasses} border-2 border-primary-cream hover:bg-primary-cream/10`;
    
    const classes = cleanStyle === 'button-plain' 
      ? buttonPlainClasses 
      : cleanStyle === 'button-clear'
        ? buttonClearClasses
        : baseClasses;

    if (item.linkType === 'reference' && item.reference?.slug) {
      return (
        <Link
          key={item.title}
          href={`/${item.reference.slug}`}
          className={classes}
        >
          {item.title}
        </Link>
      );
    }

    if (item.linkType === 'anchor' && item.anchor) {
      return (
        <a
          key={item.title}
          href={`#${item.anchor}`}
          className={classes}
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById(item.anchor);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          {item.title}
        </a>
      );
    }

    return null;
  };

  return (
    <>
      {/* Mobile Logo */}
      {logoUrl && (
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <Image 
            src={logoUrl}
            alt={data.logo?.alt?.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() || "Logo"}
            className="h-24 w-auto"
            width={500}
            height={500}
            priority
            onError={(e) => {
              console.error('Error loading logo:', e)
            }}
          />
        </div>
      )}

      {/* Mobile Button */}
      {menuItems.length > 0 && (
        <div className="fixed top-4 right-8 z-50 md:hidden">
          <Link
            href={menuItems[menuItems.length - 1].reference?.slug ? `/${menuItems[menuItems.length - 1].reference.slug}` : '#'}
            className="inline-block px-6 py-2 rounded-full transition-all duration-200 bg-primary-coral text-white font-bold hover:bg-primary-coral/90 hover:scale-105 whitespace-nowrap max-w-[calc(100vw-4rem)]"
          >
            {menuItems[menuItems.length - 1].title}
          </Link>
        </div>
      )}

      {/* Desktop Header */}
      <header className="relative bg-primary-dark hidden md:block" role="banner">
        {data.notificationMessage && (
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
                </div>
              )}
              
              {/* Desktop Menu */}
              <div className="flex items-center space-x-8">
                {menuItems.map(renderMenuItem)}
              </div>
            </div>
          </nav>
        </div>

        {showAppointmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Prendre rendez-vous</h2>
              {/* Add your appointment form or content here */}
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="mt-4 bg-primary-coral hover:bg-primary-rust transition-colors px-6 py-2 rounded-md text-white font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
