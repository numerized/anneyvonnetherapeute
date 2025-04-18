'use client'

import React, { useEffect,useRef, useState } from 'react'

import { Header } from '@/components/shared/Header'

// Declare the global function on the window object
declare global {
  interface Window {
    stopAllProchainementVideos: (exceptId?: string) => void
  }
}

// This component is a minimal, centered capsule player for a single video, no tags or description
export interface ProchainementVideoCapsuleProps {
  title: string
  introduction?: string
  videoUrl: string
  posterUrl?: string
  videoRef?: React.RefObject<HTMLVideoElement | null>
  isPlaying?: boolean
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ProchainementVideoCapsule({
  title,
  introduction,
  videoUrl,
  posterUrl,
  videoRef: externalVideoRef,
  isPlaying: externalIsPlaying,
  setIsPlaying: externalSetIsPlaying,
}: ProchainementVideoCapsuleProps) {
  // Use internal refs and state if external ones aren't provided
  const internalVideoRef = useRef<HTMLVideoElement | null>(null)
  const [internalIsPlaying, setInternalIsPlaying] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Use external props if provided, otherwise use internal state
  const videoRef = externalVideoRef || internalVideoRef
  const isPlaying =
    externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying
  const setIsPlaying = externalSetIsPlaying || setInternalIsPlaying

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handlePlayPause = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      // Stop all other videos before playing this one
      if (window.stopAllProchainementVideos) {
        window.stopAllProchainementVideos('presentationVideo')
      }

      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <section className="w-full max-w-xl mx-auto flex flex-col items-center py-12 px-4">
      <Header
        title=""
        customTitle={
          <>
            <h2 className="text-primary-cream text-3xl md:text-4xl font-light text-center mb-2">
              {title}
            </h2>
            <br />
            <div className="text-primary-cream/70 text-lg md:text-xl text-center mb-8">
              Capsule Audio par Anne Yvonne Racine{' '}
            </div>
          </>
        }
        description={introduction ? [introduction] : undefined}
        centered
      />
      <div className="w-full overflow-hidden relative aspect-video rounded-[12px]">
        {isClient && (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl}
              className="w-full h-full object-cover"
              playsInline
              webkit-playsinline="true"
            />
            {/* Match the play/pause button to the /espace180 capsules style */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/30">
              {/* Left bottom positioned play button, matching /espace180 style */}
              <div className="absolute left-4 bottom-4 z-20">
                <button
                  onClick={handlePlayPause}
                  className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 cursor-pointer"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    {isPlaying ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-white"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-white"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
