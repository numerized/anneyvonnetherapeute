'use client'

import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Capsule {
  id: number
  title: string
  description: string
  date: Date
  videoUrl: string
  posterUrl: string
}

const capsules: Capsule[] = [
  {
    id: 1,
    title: 'Méditation guidée pour la relaxation',
    description: 'Une séance de méditation douce pour vous aider à vous détendre et à retrouver votre calme intérieur.',
    date: new Date('2025-01-09'),
    videoUrl: '/videos/capsule0.mp4',
    posterUrl: '/images/cover0.webp'
  },
  // Add more capsules here
]

export default function CapsulesPage() {
  const [isClient, setIsClient] = useState(false)
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({})

  useEffect(() => {
    setIsClient(true)
  }, [])

  const togglePlay = (capsuleId: number) => {
    const video = videoRefs.current[capsuleId]
    if (!video) return

    if (video.paused) {
      // Pause any other playing video
      if (activeVideo !== null && activeVideo !== capsuleId) {
        const activeVideoElement = videoRefs.current[activeVideo]
        if (activeVideoElement) {
          activeVideoElement.pause()
        }
      }
      video.play()
      setActiveVideo(capsuleId)
    } else {
      video.pause()
      setActiveVideo(null)
    }
  }

  return (
    <main className="min-h-screen bg-primary-cream pt-[var(--navbar-height)]">
      {/* Hero Section */}
      <div className="relative bg-primary-forest py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl ml-auto text-right"> 
            <h1 className="text-4xl md:text-5xl font-bold text-primary-cream mb-6">
              Capsules Audio
            </h1>
            <p className="text-xl text-primary-cream/80">
              Découvrez notre collection de méditations guidées et d&apos;exercices pratiques 
              pour vous accompagner dans votre cheminement personnel.
            </p>
          </div>
        </div>
        {/* Decorative circles - adjusted for right-aligned content */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary-coral/20 blur-3xl" />
        <div className="absolute -bottom-32 right-[-20%] w-96 h-96 rounded-full bg-primary-coral/10 blur-3xl" />
      </div>

      {/* Capsules Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capsules.map((capsule) => (
            <div key={capsule.id} className="space-y-6">
              {/* Video Container */}
              <div className="relative w-full rounded-[32px] overflow-hidden">
                {/* Aspect ratio container */}
                <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
                  {isClient && (
                    <>
                      <video
                        ref={(el) => el && (videoRefs.current[capsule.id] = el)}
                        className="absolute inset-0 w-full h-full object-cover rounded-[32px] shadow-2xl"
                        playsInline
                        webkit-playsinline="true"
                        src={capsule.videoUrl}
                        poster={capsule.posterUrl}
                      />
                      {/* Dark green gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgb(41,53,49,0.62)] rounded-[32px]" />
                      {/* Frost bubbles */}
                      <div className="absolute top-4 right-4 flex gap-4 z-20">
                        {/* Capsule title bubble */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                          <span className="text-white font-medium">Capsule #{capsule.id}</span>
                        </div>
                      </div>
                      {/* Play/Pause button */}
                      <button
                        onClick={() => togglePlay(capsule.id)}
                        className="absolute right-4 bottom-4 z-20 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 cursor-pointer"
                        aria-label={activeVideo === capsule.id ? 'Pause video' : 'Play video'}
                      >
                        <div className="w-6 h-6 flex items-center justify-center">
                          {activeVideo === capsule.id ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Capsule Info */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-primary-forest">{capsule.title}</h2>
                <p className="text-primary-forest/80">{capsule.description}</p>
                <p className="text-sm text-primary-forest/60">
                  {format(capsule.date, 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
