'use client'

import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { Check, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HiMenu } from 'react-icons/hi'

import { CalendlyModal } from '@/components/dashboard/CalendlyModal'
import { app } from '@/lib/firebase'

import NotificationBanner from '../NotificationBanner/NotificationBanner'
import { NavLinks } from './NavLinks'

export default function NavbarLayout() {
  const pathname = usePathname()
  const isProchainement = pathname === '/prochainement'
  const isCoachingGroupe = pathname === '/coaching-relationnel-en-groupe'
  const isLive = pathname === '/live'

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCalendlyModal, setShowCalendlyModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined)
  const [appointmentScheduled, setAppointmentScheduled] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState('')
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const logoUrl = '/images/logo.png' // Static logo path

  // Load appointment data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedAppointment = localStorage.getItem('appointmentData')
        if (savedAppointment) {
          const appointmentData = JSON.parse(savedAppointment)
          setAppointmentScheduled(appointmentData.scheduled)
          setAppointmentDate(appointmentData.date)
        }
      } catch (error) {
        console.error('Error loading appointment data from localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    const auth = getAuth(app)

    // Set initial auth state if available immediately
    if (auth.currentUser) {
      setIsLoggedIn(true)
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user)
    })

    return () => unsubscribe()
  }, [])

  // Save appointment data to localStorage whenever it changes
  useEffect(() => {
    if (appointmentScheduled && appointmentDate && typeof window !== 'undefined') {
      try {
        const appointmentData = {
          scheduled: appointmentScheduled,
          date: appointmentDate
        }
        localStorage.setItem('appointmentData', JSON.stringify(appointmentData))
      } catch (error) {
        console.error('Error saving appointment data to localStorage:', error)
      }
    }
  }, [appointmentScheduled, appointmentDate])

  // Don't render navbar on live or coaching-relationnel-en-groupe routes
  if (isLive || isCoachingGroupe) {
    return null
  }

  // Handle appointment scheduled
  const handleAppointmentScheduled = async (eventData: any) => {
    try {
      // Validate that we have the expected event data structure
      if (
        eventData.event !== 'calendly.event_scheduled' ||
        !eventData.payload
      ) {
        console.error('Invalid event data format:', eventData)
        return
      }

      // Extract data from Calendly's standard event structure
      const eventUri = eventData.payload?.event?.uri || ''

      if (!eventUri) {
        console.error('Missing event URI:', eventData)
        return
      }

      try {
        // Fetch event details from our API
        const eventDetailsResponse = await fetch(
          `/api/calendly/event-details?eventUri=${encodeURIComponent(eventUri)}`,
        )

        if (!eventDetailsResponse.ok) {
          throw new Error(
            `Failed to fetch event details: ${eventDetailsResponse.status}`,
          )
        }

        const eventDetailsResult = await eventDetailsResponse.json()

        if (!eventDetailsResult.success || !eventDetailsResult.data) {
          throw new Error('Invalid response from event details API')
        }

        const eventDetails = eventDetailsResult.data

        // Get event start time
        let startTime = eventDetails.start_time

        if (!startTime) {
          // Fallback (should rarely happen)
          const scheduledTime = new Date()
          scheduledTime.setHours(scheduledTime.getHours() + 1)
          startTime = scheduledTime.toISOString()
        }

        // Format date for display
        const dateObj = new Date(startTime)
        const formattedDate = new Intl.DateTimeFormat('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(dateObj)

        // Format to capitalize first letter of the day name
        const formattedDateCapitalized =
          formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

        setAppointmentDate(formattedDateCapitalized)
        setAppointmentScheduled(true)
        
        // Show the confirmation modal
        setShowConfirmationModal(true)

      } catch (error) {
        console.error('Error fetching appointment details:', error)
      }
    } catch (error) {
      console.error('Error handling appointment:', error)
    }
  }
  
  // Close the confirmation modal
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false)
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
                    setShowAppointmentModal={setShowCalendlyModal}
                    isLoggedIn={isLoggedIn}
                    appointmentScheduled={appointmentScheduled}
                    appointmentDate={appointmentDate}
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
                setShowAppointmentModal={setShowCalendlyModal}
                isLoggedIn={isLoggedIn}
                appointmentScheduled={appointmentScheduled}
                appointmentDate={appointmentDate}
              />
            </div>
          </div>
        )}
      </header>
      
      {/* Calendly Modal */}
      <CalendlyModal
        isOpen={showCalendlyModal}
        onClose={(isScheduled) => {
          setShowCalendlyModal(false)
          if (!isScheduled) {
            // Only reset if user closed without scheduling
            setAppointmentScheduled(false)
          }
        }}
        sessionType="20-min-free-session" 
        onAppointmentScheduled={handleAppointmentScheduled}
        userEmail=""
        customUrl="https://calendly.com/numerized-ara/20min"
      />
      
      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-teal/20 p-3 rounded-full mb-4">
                <Check className="h-8 w-8 text-primary-teal" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-primary-coral">Rendez-vous confirmé!</h2>
              <p className="mb-4 text-gray-700">
                Votre rendez-vous est prévu pour le {appointmentDate}.
              </p>
              <p className="mb-6 text-gray-700">
                Un email de confirmation a été envoyé à votre adresse email avec tous les détails.
              </p>
              <button
                onClick={closeConfirmationModal}
                className="px-6 py-2 bg-primary-coral text-white font-bold rounded-full hover:bg-primary-rust transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
