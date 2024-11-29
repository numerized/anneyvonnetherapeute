'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import type { SettingsPayload } from '@/types'
import { urlFor } from '@/sanity/lib/image'
import NotificationBanner from '../NotificationBanner/NotificationBanner'

interface NavbarProps {
  data: SettingsPayload
}

export default function Navbar(props: NavbarProps) {
  const { data } = props
  const menuItems = data?.menuItems || []
  console.log('All menu items:', menuItems);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)

  const logoAsset = data?.logo?.asset
  const logoUrl = logoAsset?.path ? `https://cdn.sanity.io/${logoAsset.path}` : null

  const renderMenuItem = (item: any) => {
    console.log('Menu item:', JSON.stringify(item, null, 2));
    
    // Clean up the style value by removing hidden Unicode characters
    const cleanStyle = item.style?.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    console.log('Clean style:', cleanStyle);
    
    const baseClasses = "text-primary-cream hover:text-primary-cream/80 transition-colors duration-200";
    const buttonBaseClasses = "px-4 py-2 rounded-full transition-all duration-200";
    const buttonPlainClasses = `${buttonBaseClasses} bg-primary-coral text-white font-bold hover:bg-primary-coral/90 hover:scale-105`;
    const buttonClearClasses = `${buttonBaseClasses} border-2 border-primary-cream hover:bg-primary-cream/10`;
    
    console.log('Item style:', item.style);
    console.log('Applied classes:', cleanStyle === 'button-plain' ? buttonPlainClasses : cleanStyle === 'button-clear' ? buttonClearClasses : baseClasses);
    
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
    <header className="relative" role="banner">
      {data.notificationMessage && (
        <NotificationBanner message={data.notificationMessage} />
      )}
      <nav 
        className="bg-primary-dark text-primary-cream px-6 py-4" 
        role="navigation" 
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto flex justify-end items-center relative">
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
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map(renderMenuItem)}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            id="mobile-menu" 
            className="md:hidden absolute top-full left-0 w-full bg-primary-dark border-t border-primary-cream/10"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              {menuItems.map((item) => (
                <div key={item.title} className="w-full">
                  {renderMenuItem(item)}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

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
  )
}
