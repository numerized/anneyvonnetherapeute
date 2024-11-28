'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

import type { SettingsPayload } from '@/types'
import { NavLinks } from './NavLinks'

interface NavbarProps {
  data: SettingsPayload
}

export default function Navbar(props: NavbarProps) {
  const { data } = props
  const menuItems = data?.menuItems || []
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)

  return (
    <header className="relative" role="banner">
      <nav 
        className="bg-primary-dark text-primary-cream px-6 py-4" 
        role="navigation" 
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto flex justify-end items-center relative">
          <div className="absolute -bottom-[86px] left-0 z-50 hidden md:block">
            <Image 
              src="https://firebasestorage.googleapis.com/v0/b/coeurs-a-corps.firebasestorage.app/o/WhatsApp%20Image%202024-11-21%20at%2013.09.15_4aa518c1.jpg?alt=media&token=105e861a-8ff8-4616-b6e1-de9c780ffbb7" 
              alt="Anne-Yvonne Racine Logo" 
              className="h-[172px] w-auto"
              width={172}
              height={172}
              priority
            />
          </div>

          <button 
            className="md:hidden p-2 ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <Menu size={24} aria-hidden="true" />
          </button>

          <div className="hidden md:flex items-center space-x-8">
            <NavLinks 
              menuItems={menuItems} 
              setIsMenuOpen={setIsMenuOpen} 
              setShowAppointmentModal={setShowAppointmentModal} 
            />
          </div>
        </div>

        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden absolute top-full left-0 right-0 bg-primary-dark border-t border-primary-teal/20 p-4"
          >
            <div className="flex flex-col space-y-4">
              <NavLinks 
                menuItems={menuItems} 
                setIsMenuOpen={setIsMenuOpen} 
                setShowAppointmentModal={setShowAppointmentModal} 
              />
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
