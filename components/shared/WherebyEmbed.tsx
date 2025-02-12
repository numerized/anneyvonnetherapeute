'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface WherebyEmbedProps {
  className?: string
}

export function WherebyEmbed({ className }: WherebyEmbedProps) {
  const [isLiveActive, setIsLiveActive] = useState(false)

  useEffect(() => {
    const checkLiveStatus = () => {
      const now = new Date()
      const liveStart = new Date('2025-02-18T18:00:00+01:00')
      const liveEnd = new Date('2025-02-18T22:00:00+01:00')
      setIsLiveActive(now >= liveStart && now <= liveEnd)
    }

    // Check initially
    checkLiveStatus()

    // Check every minute
    const interval = setInterval(checkLiveStatus, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!isLiveActive) {
    return (
      <div className={`relative w-full ${className}`} style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          {/* Background Image with Blur */}
          <div className="absolute inset-0">
            <Image
              src="/images/soon-back.jpg"
              alt="Background"
              fill
              className="object-cover blur-sm brightness-50"
              priority
            />
          </div>
          
          {/* Content Overlay */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-4 sm:p-6">
            <svg 
              className="w-16 h-16 sm:w-24 sm:h-24 text-primary-coral mb-4 sm:mb-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
              />
            </svg>
            <h3 className="text-xl sm:text-2xl md:text-3xl text-primary-coral mb-3 sm:mb-4">
              Le live commencera le 18 février à 19h
            </h3>
            <h2 className="text-xl sm:text-2xl md:text-3xl text-primary-coral mb-3 sm:mb-4">
              "L'Amour à 2"
            </h2>
            <p className="text-primary-cream/90 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg sm:max-w-2xl mx-auto">
              En attendant, n'oubliez pas de vous inscrire à la newsletter ci-dessus pour recevoir un rappel et toutes les informations nécessaires.
            </p>
            <a 
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Live%20d%27Anne%20Yvonne%20sur%20le%20Divan%20-%20L%27amour%20%C3%A0%202&details=Le%20live%20mensuel%20sur%20le%20th%C3%A8me%20du%20mois%3A%20l%27amour%20%C3%A0%202.%20Rejoignez-nous%20sur%20www.coeur-a-corps.org%2Flive&dates=20250218T180000Z%2F20250218T190000Z&location=www.coeur-a-corps.org%2Flive"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary-cream/10 hover:bg-primary-cream/20 text-primary-cream px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-colors backdrop-blur-sm text-sm sm:text-base"
            >
              <span>📅</span>
              <span>Ajouter au calendrier</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full ${className}`} style={{ paddingBottom: '56.25%' }}>
      <iframe
        src="https://whereby.com/coeur-a-corps?minimal=1"
        allow="camera; microphone; fullscreen; speaker; display-capture"
        className="absolute top-0 left-0 w-full h-full rounded-2xl"
      ></iframe>
    </div>
  )
}
