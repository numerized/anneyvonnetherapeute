import Image from 'next/image'
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'

const VIDEO_URL = '/CAPSULES_MIROIR/lamour-dapres-1.mp4'
const POSTER_URL = '/images/posters/lamour-dapres-miroir-poster.jpg'
const TITLE = "L'amour d'Après — Capsule Prisme"
const DESCRIPTION =
  "Une exploration intime de l'amour après la transformation. Découvrez cette capsule miroir."

// Declare the global function on the window object
declare global {
  interface Window {
    stopAllProchainementVideos: (exceptId?: string) => void
  }
}

interface CustomCapsuleMiroirCardProps {
  videoRef?: RefObject<HTMLVideoElement | null>
  isPlaying?: boolean
  setIsPlaying?: Dispatch<SetStateAction<boolean>>
}

export function CustomCapsuleMiroirCard({
  videoRef: externalVideoRef,
  isPlaying: externalIsPlaying,
  setIsPlaying: externalSetIsPlaying,
}: CustomCapsuleMiroirCardProps = {}) {
  // Use external state if provided, otherwise use internal state
  const [internalIsPlaying, setInternalIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Use external video ref if provided, otherwise use internal ref
  const internalVideoRef = useRef<HTMLVideoElement | null>(null)
  const videoRef = externalVideoRef || internalVideoRef
  const progressTrackRef = useRef<HTMLDivElement | null>(null)

  // Determine which play state and setter to use
  const isPlaying =
    externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying
  const setIsPlaying = externalSetIsPlaying || setInternalIsPlaying

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(video.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsVideoLoaded(true)
      console.log('Video loaded, duration:', video.duration)
    }

    const handleError = (e: Event) => {
      console.error('Video error:', video.error, e)
      setVideoError(
        `Erreur de chargement de la vidéo: ${video.error?.message || 'Vérifiez le chemin ou le fichier.'}`,
      )
    }

    // Add event listeners
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('error', handleError)
    video.addEventListener('loadeddata', () => console.log('Video data loaded'))

    // Force load metadata if not already loaded
    if (video.readyState >= 1) {
      handleLoadedMetadata()
    }

    // Clean up event listeners
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadeddata', () => {})
    }
  }, [isDragging, videoRef])

  // Seek-to-position logic
  const seekTo = (clientX: number) => {
    const video = videoRef.current
    const track = progressTrackRef.current
    if (!video || !track) return

    const rect = track.getBoundingClientRect()
    const clickPosition = (clientX - rect.left) / rect.width
    const clampedPosition = Math.max(0, Math.min(1, clickPosition))
    const seekTime = clampedPosition * duration

    video.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  // Click event handler
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    seekTo(e.clientX)

    // Add global mouse event listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Drag handlers for mouse
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      seekTo(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    seekTo(e.touches[0].clientX)

    // Add global touch event listeners
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      e.preventDefault()
      seekTo(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
  }

  // Play/Pause toggle
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      // Stop all other videos before playing this one
      // @ts-ignore - We're using a global function added to the window object
      if (window.stopAllProchainementVideos) {
        window.stopAllProchainementVideos('capsuleMiroir')
      }

      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error('Play error:', error)
            setVideoError(`Erreur de lecture: ${error.message}`)
          })
      }
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  // Time formatter
  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return '00:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto mb-12 items-stretch">
      {/* Capsule Card (left, 2/3 on desktop) */}
      <div className="md:w-2/3 w-full flex flex-col">
        <div
          id="capsule-miroir"
          className="bg-primary-dark p-8 md:p-12 rounded-[32px] flex flex-col h-full"
        >
          {/* Media Container */}
          <div className="relative w-full rounded-[32px] overflow-hidden">
            <div className="relative pb-[56.25%]">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover rounded-[32px] shadow-2xl"
                playsInline
                preload="metadata"
                webkit-playsinline="true"
                controls={false}
                src={VIDEO_URL}
                poster={POSTER_URL}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={(e) => {
                  console.error('Video error event:', e)
                  setVideoError(
                    'Erreur de chargement de la vidéo. Vérifiez le chemin ou le fichier.',
                  )
                }}
              />
              {/* Frost bubbles */}
              <div className="absolute top-4 right-4 flex gap-4 z-20">
                {/* Capsule title bubble */}
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="text-white font-medium">Capsule Prisme</span>
                </div>
              </div>
              {/* Play button - Left side */}
              <div className="absolute left-4 bottom-4 z-20">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 cursor-pointer"
                  aria-label={isPlaying ? 'Pause media' : 'Play media'}
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
          </div>
          {/* Time scrubber */}
          <div className="mt-4 select-none">
            {videoError && (
              <div className="text-red-500 bg-white/80 rounded-lg px-4 py-2 mb-2 text-xs">
                {videoError}
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-white/70 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div
              ref={progressTrackRef}
              className="h-3 bg-white/10 rounded-full cursor-pointer relative overflow-hidden hover:bg-white/15 transition-colors select-none z-10"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{ userSelect: 'none' }}
            >
              {/* Background track with gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full"></div>
              {/* Progress fill */}
              <div
                className="absolute left-0 top-0 h-full bg-white/60 rounded-full transition-all duration-100"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              ></div>
              {/* Progress handle */}
              <div
                className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 -ml-2.5 shadow-md transition-transform duration-150 transform hover:scale-110"
                style={{
                  left: `${(currentTime / (duration || 1)) * 100}%`,
                  display: duration ? 'block' : 'none',
                  opacity: isDragging ? '1' : '0.7',
                  transform: isDragging
                    ? 'translateY(-50%) scale(1.1)'
                    : 'translateY(-50%)',
                  pointerEvents: 'auto',
                  zIndex: 20,
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              ></div>
            </div>
          </div>
          {/* Capsule Info */}
          <div className="flex-grow mt-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{TITLE}</h2>
            </div>
            <p className="text-white/80 mt-4">{DESCRIPTION}</p>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['Amour', 'Transformation', 'Podcast', 'Audio', 'Prisme'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-white/10 text-white font-medium inline-block"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Explanatory Box (right, 1/3 on desktop) */}
      <div className="md:w-1/3 w-full flex flex-col justify-center">
        <div className="h-full bg-white/10 rounded-[32px] p-8 flex flex-col justify-center min-h-[350px]">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Espace 180
          </h3>
          <p className="text-white text-lg leading-relaxed">
            <span className="text-primary-coral">
              Espace 180 Degrées de Conversion d'Amour
            </span>
            , c'est un centre de ressources audio en constante évolution,
            accessible à tous les clients. <br />
            <br />
            Écoutez nos capsules partout, à la maison ou en déplacement, pour
            explorer des thèmes essentiels sur qui nous sommes.
          </p>
          <a className="mt-8 w-full inline-block text-center px-6 py-3 bg-primary-dark text-white font-semibold rounded-full shadow hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50 transition">
            Prochainement!
          </a>
        </div>
      </div>
    </div>
  )
}
