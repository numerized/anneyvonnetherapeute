'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface WherebyEmbedProps {
  className?: string
}

export function WherebyEmbed({ className }: WherebyEmbedProps) {
  const [isLiveActive, setIsLiveActive] = useState(false)
  const [isLiveFinished, setIsLiveFinished] = useState(false)

  useEffect(() => {
    const checkLiveStatus = () => {
      const now = new Date()
      const liveStart = new Date('2025-04-15T19:45:00+02:00')
      const liveEnd = new Date('2025-04-15T23:00:00+02:00')
      setIsLiveActive(now >= liveStart && now <= liveEnd)
      setIsLiveFinished(now > liveEnd)
    }

    // Check initially
    checkLiveStatus()

    // Check every minute
    const interval = setInterval(checkLiveStatus, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!isLiveActive) {
    return (
      <div className={`relative w-full h-full flex flex-col ${className}`}>
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
            {isLiveFinished ? (
              <>
                <h3 className="text-xl sm:text-2xl md:text-3xl text-primary-coral mb-3 sm:mb-4">
                  Le live est terminé
                </h3>
                <p className="text-primary-cream/90 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg sm:max-w-2xl mx-auto">
                  Merci d'avoir participé au live! N'oubliez pas de vous
                  inscrire à la newsletter pour être informé(e) des prochains
                  lives.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl sm:text-2xl md:text-3xl text-primary-coral mb-3 sm:mb-4">
                  Le live commencera le 15 avril à 20h
                </h3>
                <h2 className="text-xl sm:text-2xl md:text-3xl text-primary-coral mb-3 sm:mb-4">
                  Le live mensuel c'est ici! les prochains : 13 Mai - 17 Juin
                </h2>
                <p className="text-primary-cream/90 text-sm sm:text-base mb-4 sm:mb-6 max-w-lg sm:max-w-2xl mx-auto">
                  En attendant, n'oubliez pas de vous inscrire à la newsletter
                  ci-dessus pour recevoir un rappel et toutes les informations
                  nécessaires.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full flex flex-col ${className}`}>
      <iframe
        src={
          typeof window !== 'undefined' &&
          window.location.hostname === 'localhost'
            ? 'https://whereby.com/rezokev'
            : 'https://whereby.com/coeur-a-corps?minimal=1'
        }
        allow="camera; microphone; fullscreen; speaker; display-capture"
        className="w-full h-full rounded-2xl"
      ></iframe>
    </div>
  )
}
