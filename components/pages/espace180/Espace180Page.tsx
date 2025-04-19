'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Masonry from 'react-masonry-css'

import { Capsule, capsules } from './data/capsules'

export default function Espace180Page() {
  const [isClient, setIsClient] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [activeMedia, setActiveMedia] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [likedCapsules, setLikedCapsules] = useState<{ [key: number]: number }>(
    {},
  )
  const [currentTime, setCurrentTime] = useState<{ [key: number]: number }>({})
  const [duration, setDuration] = useState<{ [key: number]: number }>({})
  const [isDragging, setIsDragging] = useState<{ [key: number]: boolean }>({})
  const [copiedCapsule, setCopiedCapsule] = useState<number | null>(null)
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({})
  const progressRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const progressTrackRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const searchParams = useSearchParams()
  const params = useParams()

  // Check for capsule ID from both route params and search params
  const routeParamId = params?.id ? (params.id as string) : null
  const searchParamId = searchParams.get('capsule')
    ? (searchParams.get('capsule') as string)
    : null
  const singleCapsuleId = routeParamId || searchParamId

  // Find the single capsule if ID is provided
  const singleCapsule = singleCapsuleId
    ? capsules.find((c) => c.uniqueId === singleCapsuleId)
    : null

  // Client-side only effects
  useEffect(() => {
    setIsClient(true)

    // Set body background color to match the capsule view and remove all gaps
    if (singleCapsuleId) {
      document.body.style.backgroundColor = 'rgb(232,146,124)'
      document.body.style.margin = '0'
      document.body.style.padding = '0'
      document.documentElement.style.margin = '0'
      document.documentElement.style.padding = '0'

      // Add a class to the html element to handle potential white gaps
      document.documentElement.classList.add('capsule-view')

      // Create style element to handle any gaps
      const style = document.createElement('style')
      style.id = 'capsule-view-styles'
      style.innerHTML = `
        html.capsule-view, 
        html.capsule-view body, 
        html.capsule-view #__next, 
        html.capsule-view main {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden;
        }
      `
      document.head.appendChild(style)
    }

    return () => {
      // Reset body styles when component unmounts
      document.body.style.backgroundColor = ''
      document.body.style.margin = ''
      document.body.style.padding = ''
      document.documentElement.style.margin = ''
      document.documentElement.style.padding = ''
      document.documentElement.classList.remove('capsule-view')

      // Remove the added style element
      const styleElement = document.getElementById('capsule-view-styles')
      if (styleElement) {
        styleElement.remove()
      }
    }
  }, [singleCapsuleId])

  // Set up Media Session API for mobile devices
  useEffect(() => {
    if (!isClient) return

    if ('mediaSession' in navigator && navigator.mediaSession) {
      const updateMediaSession = () => {
        if (activeMedia === null) return

        const activeCapsule = capsules.find((c) => c.id === activeMedia)
        if (!activeCapsule) return

        // Update metadata on lock screen / control center
        if (typeof MediaMetadata !== 'undefined') {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: activeCapsule.title || 'Audio Capsule',
            artist: 'Anne Yvonne Relations',
            album: 'Espace 180',
            artwork: [
              {
                src: activeCapsule.squarePosterUrl || activeCapsule.posterUrl,
                sizes: '512x512',
                type: 'image/png',
              },
            ],
          })
        }

        // Set up playback control handlers
        navigator.mediaSession.setActionHandler('play', () => {
          const media =
            audioRefs.current[activeMedia] || videoRefs.current[activeMedia]
          if (media && media.paused) {
            media
              .play()
              .catch((err) => console.error('Error playing media:', err))
            setIsPlaying(true)
          }
        })

        navigator.mediaSession.setActionHandler('pause', () => {
          const media =
            audioRefs.current[activeMedia] || videoRefs.current[activeMedia]
          if (media && !media.paused) {
            media.pause()
            setIsPlaying(false)
          }
        })

        // Optional seek controls
        navigator.mediaSession.setActionHandler('seekforward', () => {
          const media =
            audioRefs.current[activeMedia] || videoRefs.current[activeMedia]
          if (media) {
            media.currentTime = Math.min(media.currentTime + 10, media.duration)
          }
        })

        navigator.mediaSession.setActionHandler('seekbackward', () => {
          const media =
            audioRefs.current[activeMedia] || videoRefs.current[activeMedia]
          if (media) {
            media.currentTime = Math.max(media.currentTime - 10, 0)
          }
        })
      }

      if (activeMedia !== null) {
        updateMediaSession()

        // Update play state
        const media =
          audioRefs.current[activeMedia] || videoRefs.current[activeMedia]
        if (media) {
          // @ts-ignore - playbackState might not be typescripted correctly
          navigator.mediaSession.playbackState = media.paused
            ? 'paused'
            : 'playing'
        }
      } else {
        // No active media
        // @ts-ignore - playbackState might not be typescripted correctly
        navigator.mediaSession.playbackState = 'none'
      }
    }
  }, [isClient, activeMedia])

  // Meta tags for social sharing
  useEffect(() => {
    if (singleCapsuleId && isClient) {
      const capsule = capsules.find((c) => c.uniqueId === singleCapsuleId)

      if (capsule) {
        // Update meta tags for social sharing
        const siteUrl = 'https://coeur-a-corps.org'
        const imageUrl = capsule.squarePosterUrl
          ? `${siteUrl}${capsule.squarePosterUrl}`
          : `${siteUrl}${capsule.posterUrl}`

        // Create or update Open Graph meta tags
        updateMetaTag('og:title', capsule.title)
        updateMetaTag('og:description', capsule.description)
        updateMetaTag('og:image', imageUrl)
        updateMetaTag(
          'og:url',
          `${siteUrl}/espace180?capsule=${capsule.uniqueId}`,
        )
        updateMetaTag('og:type', 'website')

        // Twitter Card meta tags
        updateMetaTag('twitter:card', 'summary_large_image')
        updateMetaTag('twitter:title', capsule.title)
        updateMetaTag('twitter:description', capsule.description)
        updateMetaTag('twitter:image', imageUrl)
      }
    }

    // Helper function to create or update meta tags
    function updateMetaTag(property: string, content: string) {
      let meta: HTMLMetaElement | null = document.querySelector(
        `meta[property="${property}"]`,
      )

      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }

      meta.setAttribute('content', content)
    }

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      const metaTags = [
        'og:title',
        'og:description',
        'og:image',
        'og:url',
        'og:type',
        'twitter:card',
        'twitter:title',
        'twitter:description',
        'twitter:image',
      ]

      metaTags.forEach((tag) => {
        const meta = document.querySelector(`meta[property="${tag}"]`)
        if (meta) {
          document.head.removeChild(meta)
        }
      })
    }
  }, [singleCapsuleId, isClient])

  // Memoize document event handlers
  const handleDocumentMouseMove = useCallback(
    (e: MouseEvent) => {
      // Prevent text selection during dragging
      if (Object.values(isDragging).some((value) => value)) {
        e.preventDefault()
      }

      Object.keys(isDragging).forEach((idStr) => {
        const id = parseInt(idStr)
        if (isDragging[id] && progressTrackRefs.current[id]) {
          const trackRect =
            progressTrackRefs.current[id]!.getBoundingClientRect()
          let position = (e.clientX - trackRect.left) / trackRect.width

          // Clamp position between 0 and 1
          position = Math.max(0, Math.min(1, position))

          const media = audioRefs.current[id] || videoRefs.current[id]
          if (media) {
            const newTime = position * media.duration
            media.currentTime = newTime
            setCurrentTime((prev) => ({ ...prev, [id]: newTime }))
          }
        }
      })
    },
    [isDragging],
  )

  const handleDocumentMouseUp = useCallback(() => {
    setIsDragging({})
  }, [])

  const handleDocumentTouchMove = useCallback(
    (e: TouchEvent) => {
      // Prevent default behavior like scrolling during dragging
      if (Object.values(isDragging).some((value) => value)) {
        e.preventDefault()
      }

      Object.keys(isDragging).forEach((idStr) => {
        const id = parseInt(idStr)
        if (isDragging[id] && progressTrackRefs.current[id]) {
          const trackRect =
            progressTrackRefs.current[id]!.getBoundingClientRect()
          let position =
            (e.touches[0].clientX - trackRect.left) / trackRect.width

          // Clamp position between 0 and 1
          position = Math.max(0, Math.min(1, position))

          const media = audioRefs.current[id] || videoRefs.current[id]
          if (media) {
            const newTime = position * media.duration
            media.currentTime = newTime
            setCurrentTime((prev) => ({ ...prev, [id]: newTime }))
          }
        }
      })
    },
    [isDragging],
  )

  const handleDocumentTouchEnd = useCallback(() => {
    setIsDragging({})
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Store current refs to avoid closure issues
    const currentAudioRefs = { ...audioRefs.current }
    const currentVideoRefs = { ...videoRefs.current }

    const handlePlay = (event: Event) => {
      const element = event.target as HTMLMediaElement

      const capsuleId =
        Object.keys(currentAudioRefs).find(
          (key) => currentAudioRefs[key] === element,
        ) ||
        Object.keys(currentVideoRefs).find(
          (key) => currentVideoRefs[key] === element,
        )

      if (capsuleId) {
        setActiveMedia(parseInt(capsuleId))
        setIsPlaying(true)

        // Update media session
        if ('mediaSession' in navigator && navigator.mediaSession) {
          // @ts-ignore - playbackState might not be typescripted correctly
          navigator.mediaSession.playbackState = 'playing'
        }
      }
    }

    const handlePause = () => {
      setIsPlaying(false)

      // Update media session
      if ('mediaSession' in navigator && navigator.mediaSession) {
        // @ts-ignore - playbackState might not be typescripted correctly
        navigator.mediaSession.playbackState = 'paused'
      }
    }

    // Add event listeners to all media elements
    Object.values(currentAudioRefs).forEach((audio) => {
      if (audio) {
        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)
      }
    })

    Object.values(currentVideoRefs).forEach((video) => {
      if (video) {
        video.addEventListener('play', handlePlay)
        video.addEventListener('pause', handlePause)
      }
    })

    // Add document-level event listeners for dragging
    document.addEventListener('mousemove', handleDocumentMouseMove)
    document.addEventListener('mouseup', handleDocumentMouseUp)
    document.addEventListener('touchmove', handleDocumentTouchMove)
    document.addEventListener('touchend', handleDocumentTouchEnd)

    return () => {
      // Remove event listeners using the same refs from closure
      Object.values(currentAudioRefs).forEach((audio) => {
        if (audio) {
          audio.removeEventListener('play', handlePlay)
          audio.removeEventListener('pause', handlePause)
        }
      })

      Object.values(currentVideoRefs).forEach((video) => {
        if (video) {
          video.removeEventListener('play', handlePlay)
          video.removeEventListener('pause', handlePause)
        }
      })

      document.removeEventListener('mousemove', handleDocumentMouseMove)
      document.removeEventListener('mouseup', handleDocumentMouseUp)
      document.removeEventListener('touchmove', handleDocumentTouchMove)
      document.removeEventListener('touchend', handleDocumentTouchEnd)
    }
  }, [
    isClient,
    handleDocumentMouseMove,
    handleDocumentMouseUp,
    handleDocumentTouchMove,
    handleDocumentTouchEnd,
  ])

  // Load liked capsules from localStorage
  useEffect(() => {
    setIsClient(true)
    const savedLikes = localStorage.getItem('espace180Likes')
    if (savedLikes) {
      setLikedCapsules(JSON.parse(savedLikes))
    }
    // Clear any existing selected tag from localStorage
    localStorage.removeItem('espace180SelectedTag')
  }, [])

  const toggleLike = (capsuleId: number) => {
    setLikedCapsules((prev) => {
      const currentLikes = prev[capsuleId] || 0
      const newLikes = {
        ...prev,
        [capsuleId]: currentLikes > 0 ? 0 : 1, // Toggle between 0 and 1
      }
      // Save to localStorage
      localStorage.setItem('espace180Likes', JSON.stringify(newLikes))
      return newLikes
    })
  }

  const togglePlay = (capsuleId: number) => {
    const media = videoRefs.current[capsuleId] || audioRefs.current[capsuleId]
    if (!media) return

    if (media.paused) {
      // Pause any other playing media
      if (activeMedia !== null && activeMedia !== capsuleId) {
        const activeMediaElement =
          videoRefs.current[activeMedia] || audioRefs.current[activeMedia]
        if (activeMediaElement) {
          activeMediaElement.pause()
        }
      }
      // Play the media
      try {
        const playPromise = media.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Error playing media:', error)
          })
        }
      } catch (error) {
        console.error('Exception playing media:', error)
      }
      setActiveMedia(capsuleId)
    } else {
      media.pause()
      setActiveMedia(null)
    }
  }

  // Get unique tags with counts
  const allTags = capsules.reduce(
    (acc, capsule) => {
      capsule.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    },
    {} as { [key: string]: number },
  )

  // Sort tags by count (descending) and alphabetically
  const sortedTags = Object.entries(allTags).sort(
    ([tagA, countA], [tagB, countB]) => {
      if (countA === countB) {
        return tagA.localeCompare(tagB)
      }
      return countB - countA
    },
  )

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  // Filter capsules based on selected tags
  const filteredCapsules = capsules.filter((capsule) => {
    const isLiked = likedCapsules[capsule.id] || 0 > 0
    const hasFavoriteTag = selectedTags.includes('Mes Préférées')
    const otherTags = selectedTags.filter((tag) => tag !== 'Mes Préférées')

    // Check if capsule matches other selected tags
    const matchesOtherTags =
      otherTags.length === 0 ||
      otherTags.some((tag) => capsule.tags.includes(tag))

    // If favorites is selected, show liked capsules that match other tags (if any)
    if (hasFavoriteTag) {
      if (otherTags.length > 0) {
        return isLiked || matchesOtherTags
      }
      return isLiked
    }

    // If favorites is not selected, only show capsules matching other tags
    return matchesOtherTags
  })

  // Get count of liked capsules for the counter
  const likedCapsulesCount = Object.values(likedCapsules).filter(
    (count) => count > 0,
  ).length

  // Add reset likes function
  const resetAllLikes = () => {
    localStorage.removeItem('espace180Likes')
    setLikedCapsules({})
  }

  // Function to set the ref based on media type
  const setMediaRef = (
    element: HTMLVideoElement | HTMLAudioElement | null,
    id: number,
  ) => {
    if (element) {
      if (element instanceof HTMLVideoElement) {
        videoRefs.current[id] = element
      } else {
        audioRefs.current[id] = element
      }
    }
  }

  // Function to handle time updates
  const handleTimeUpdate = (id: number) => {
    const media = videoRefs.current[id] || audioRefs.current[id]
    if (media) {
      setCurrentTime((prev) => ({
        ...prev,
        [id]: media.currentTime,
      }))

      if (!duration[id] && media.duration && !isNaN(media.duration)) {
        setDuration((prev) => ({
          ...prev,
          [id]: media.duration,
        }))
      }

      // Update progress bar width
      const progressBar = progressRefs.current[id]
      if (progressBar) {
        const progress = (media.currentTime / (media.duration || 1)) * 100
        progressBar.style.width = `${progress}%`
      }
    }
  }

  // Function to handle seeking
  const handleSeek = (
    id: number,
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    const media = videoRefs.current[id] || audioRefs.current[id]
    if (!media) return

    const progressTrack = e.currentTarget
    const rect = progressTrack.getBoundingClientRect()

    // Get the x position based on mouse or touch event
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clickPosition = (clientX - rect.left) / rect.width

    // Clamp the position between 0 and 1
    const clampedPosition = Math.max(0, Math.min(1, clickPosition))
    const seekTime = clampedPosition * (media.duration || 0)

    // Update media current time
    media.currentTime = seekTime

    // Update state
    setCurrentTime((prev) => ({
      ...prev,
      [id]: seekTime,
    }))
  }

  const handleMouseDown = (
    id: number,
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    // Prevent default browser behavior
    e.preventDefault()

    // First seek to the clicked/touched position
    handleSeek(id, e)

    // Then start the dragging mode
    setIsDragging((prev) => ({ ...prev, [id]: true }))
  }

  const handleMouseMove = (
    id: number,
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    // Prevent default browser behavior if dragging
    if (isDragging[id]) {
      e.preventDefault()
      handleSeek(id, e)
    }
  }

  const handleMouseUp = (
    id: number,
    e?: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    // Prevent default browser behavior
    if (e) e.preventDefault()
    setIsDragging((prev) => ({ ...prev, [id]: false }))
  }

  // Memoize the dragging state check
  const isAnyDragging = useMemo(() => {
    return Object.values(isDragging).some((value) => value)
  }, [isDragging])

  // Effect to handle global user-select style during dragging
  useEffect(() => {
    if (isAnyDragging) {
      document.body.classList.add('user-select-none')
    } else {
      document.body.classList.remove('user-select-none')
    }

    return () => {
      document.body.classList.remove('user-select-none')
    }
  }, [isAnyDragging]) // Now correctly depends on the memoized value

  // Format time in seconds to MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return '00:00'

    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const renderCapsule = (capsule: Capsule, isLarge: boolean) => {
    // Determine aspect ratio and description display
    const isVertical = capsule.proportions === '9:16'
    return (
      <div
        key={capsule.id}
        className={`bg-primary-dark ${isLarge ? 'p-8 md:p-12' : 'p-8'} rounded-[32px] flex flex-col`}
      >
        {/* Media Container */}
        <div className="relative w-full rounded-[32px] overflow-hidden">
          {/* Aspect ratio container */}
          <div className={`relative ${isVertical ? 'pb-[177.77%]' : 'pb-[56.25%]'}`}> {/* 9:16 = 177.77%, 16:9 = 56.25% */}
            {isClient && (
              <>
                {capsule.mediaType === 'video' ? (
                  <video
                    ref={(el) => setMediaRef(el, capsule.id)}
                    className={`absolute inset-0 w-full h-full object-cover rounded-[32px] shadow-2xl ${isVertical ? 'object-contain bg-black' : ''}`}
                    playsInline
                    webkit-playsinline="true"
                    src={capsule.mediaUrl}
                    poster={capsule.posterUrl}
                    onTimeUpdate={() => handleTimeUpdate(capsule.id)}
                    onLoadedMetadata={(e) => {
                      const video = e.currentTarget
                      if (video.duration && !isNaN(video.duration)) {
                        setDuration((prev) => ({
                          ...prev,
                          [capsule.id]: video.duration,
                        }))
                      }
                    }}
                  />
                ) : (
                  <>
                    <audio
                      ref={(el) => setMediaRef(el, capsule.id)}
                      src={capsule.mediaUrl}
                      className="hidden"
                      onTimeUpdate={() => handleTimeUpdate(capsule.id)}
                      onLoadedMetadata={(e) => {
                        const audio = e.currentTarget
                        if (audio.duration && !isNaN(audio.duration)) {
                          setDuration((prev) => ({
                            ...prev,
                            [capsule.id]: audio.duration,
                          }))
                        }
                      }}
                    />
                    <div className="absolute inset-0 w-full h-full rounded-[32px] shadow-2xl overflow-hidden">
                      <img
                        src={capsule.posterUrl}
                        alt={capsule.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </>
                )}
                {/* Frost bubbles */}
                <div className="absolute top-4 right-4 flex gap-4 z-20">
                  {/* Capsule title bubble */}
                  <Link
                    href={`/espace180/capsule/${capsule.uniqueId}`}
                    className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/30 transition-all"
                  >
                    <span className="text-white font-medium">
                      #{capsule.id}
                    </span>
                  </Link>
                </div>
                {/* Play button - Left side */}
                <div className="absolute left-4 bottom-4 z-20">
                  {/* Play/Pause button */}
                  <button
                    onClick={() => togglePlay(capsule.id)}
                    className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 cursor-pointer"
                    aria-label={
                      activeMedia === capsule.id ? 'Pause media' : 'Play media'
                    }
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      {activeMedia === capsule.id ? (
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
                {/* Like button - Right side */}
                <div className="absolute right-4 bottom-4 z-20">
                  <div className="w-14 h-14 rounded-full relative">
                    <button
                      onClick={() => {
                        toggleLike(capsule.id)
                      }}
                      className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 hover:text-white flex items-center gap-2"
                      aria-label="Like this capsule"
                    >
                      <div className="w-6 h-6 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className={`w-6 h-6 transition-all ${likedCapsules[capsule.id] > 0 ? 'text-red-500' : 'text-white group-hover:text-white/80'}`}
                        >
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Time scrubber */}
        {isClient && (
          <div className="mt-4 select-none">
            <div className="flex items-center justify-between text-xs text-white/70 mb-1">
              <span>{formatTime(currentTime[capsule.id] || 0)}</span>
              <span>{formatTime(duration[capsule.id] || 0)}</span>
            </div>
            <div
              ref={(el) => {
                progressTrackRefs.current[capsule.id] = el
              }}
              className="h-3 bg-white/10 rounded-full cursor-pointer relative overflow-hidden hover:bg-white/15 transition-colors select-none"
              onMouseDown={(e) => handleMouseDown(capsule.id, e)}
              onTouchStart={(e) => handleMouseDown(capsule.id, e)}
              onMouseMove={(e) => handleMouseMove(capsule.id, e)}
              onTouchMove={(e) => handleMouseMove(capsule.id, e)}
              onMouseUp={(e) => handleMouseUp(capsule.id, e)}
              onTouchEnd={(e) => handleMouseUp(capsule.id, e)}
              onClick={(e) => handleSeek(capsule.id, e)}
            >
              {/* Background track with gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full"></div>

              {/* Progress fill */}
              <div
                ref={(el) => {
                  progressRefs.current[capsule.id] = el
                }}
                className="absolute left-0 top-0 h-full bg-white/60 rounded-full transition-all duration-100"
                style={{ width: '0%' }}
              />

              {/* Progress handle */}
              <div
                className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 -ml-2.5 shadow-md transition-transform duration-150 transform hover:scale-110"
                style={{
                  left: `${((currentTime[capsule.id] || 0) / (duration[capsule.id] || 1)) * 100}%`,
                  display: duration[capsule.id] ? 'block' : 'none',
                  opacity: isDragging[capsule.id] ? '1' : '0.7',
                  transform: isDragging[capsule.id]
                    ? 'translateY(-50%) scale(1.1)'
                    : 'translateY(-50%)',
                }}
              />
            </div>
          </div>
        )}

        {/* Capsule Info */}
        <div className="flex-grow mt-6">
          {/* Title on one row, date on the next row, duration right-aligned */}
          <div>
            <h2 className="text-2xl font-bold text-white">{capsule.title}</h2>
              {capsule.duration && (
                <div className="text-sm text-white/60 whitespace-nowrap text-left">{format(capsule.date, 'dd MMMM yyyy', { locale: fr })}</div>
              )}
          </div>

          {/* Description with spacing from title/duration group */}
          {!isVertical && (
            <p className="text-white/80 mt-4">{capsule.description}</p>
          )}

          {/* Share Button */}
          <div
            className="mt-2 flex justify-end"
            style={{ position: 'relative', zIndex: 40 }}
          >
            <button
              onClick={() => {
                // Create the URL with the capsule ID
                const shareUrl = `${window.location.origin}/espace180?capsule=${capsule.uniqueId}`

                // Copy to clipboard
                navigator.clipboard.writeText(shareUrl).then(
                  () => {
                    setCopiedCapsule(capsule.id)
                    // Reset the button text after 3 seconds
                    setTimeout(() => {
                      setCopiedCapsule(null)
                    }, 3000)
                  },
                  (err) => {
                    console.error('Erreur lors de la copie du lien:', err)
                  },
                )
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
              aria-label="Copier le lien de partage"
              style={{ pointerEvents: 'auto' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-share"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
              <span>
                {copiedCapsule === capsule.id
                  ? 'Copié'
                  : 'Copier le lien'}
              </span>
            </button>
          </div>

          {/* Tags */}
          <div
            className="flex flex-wrap gap-2 mt-4 justify-end"
            style={{ position: 'relative', zIndex: 30 }}
          >
            {capsule.tags.map((tag, index) => {
              // Create a function to handle tag click that's unique to this instance
              const handleThisTagClick = (e: React.MouseEvent) => {
                e.preventDefault()
                e.stopPropagation()
                console.log(`Tag clicked: ${tag}`)

                if (singleCapsule) {
                  // Set this tag and navigate back to main view
                  window.location.href = '/espace180'
                } else {
                  // Toggle this tag in the filter
                  toggleTag(tag)
                }
                return false
              }

              return (
                <span
                  key={index}
                  onClick={handleThisTagClick}
                  className="px-3 py-1 text-xs rounded-full transition-all cursor-pointer inline-block relative z-30 hover:bg-white/30"
                  style={{
                    backgroundColor: selectedTags.includes(tag)
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: selectedTags.includes(tag) ? '#1a202c' : 'white',
                    fontWeight: selectedTags.includes(tag) ? 500 : 400,
                    pointerEvents: 'auto',
                  }}
                >
                  {tag}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <main
      className={`min-h-screen ${singleCapsuleId ? 'bg-[rgb(232,146,124)] m-0 p-0' : 'bg-[rgb(232,146,124)]'}`}
    >
      {/* Hero Section - Only show if not viewing a single capsule */}
      {!singleCapsuleId && (
        <div className="relative bg-primary-forest py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl ml-auto text-right">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-cream mb-6">
                Espace 180° d'Amour
              </h1>
              <p className="text-xl text-primary-cream/80">
                Explorez l’Espace 180° d’Amour, un univers de ressources
                vibrantes pour accompagner votre déplacement intérieur.
                Découvrez des méditations guidées, des exercices pratiques et
                des contenus inspirants pour nourrir votre cheminement personnel
                et relationnel.
              </p>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary-coral/20 blur-3xl" />
          <div className="absolute -bottom-32 right-[-20%] w-96 h-96 rounded-full bg-primary-coral/10 blur-3xl" />
        </div>
      )}
      {/* Main Content */}
      <div className="relative">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-32 right-[-20%] w-96 h-96 rounded-full bg-primary-coral/10 blur-3xl" />
        </div>

        {/* Tag Filters - Only show if not in single capsule view */}
        {!singleCapsule && (
          <div className="bg-primary-dark/30 backdrop-blur-sm py-8 mb-12 w-full">
            <div className="container mx-auto px-4">
              {/* Mobile Filter Accordion Header */}
              <div className="md:hidden mb-4">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full flex items-center justify-between bg-white/10 text-white px-4 py-3 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Filtres</span>
                    {selectedTags.length > 0 && (
                      <span className="bg-white text-primary-dark text-xs font-bold px-2 py-1 rounded-full">
                        {selectedTags.length}
                      </span>
                    )}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-5 h-5 transition-transform duration-300 ${isFilterOpen ? 'rotate-90' : ''}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Filter Content - Hidden on mobile unless expanded */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden md:h-auto ${
                  isFilterOpen
                    ? 'max-h-[500px] opacity-100'
                    : 'max-h-0 opacity-0 md:max-h-[500px] md:opacity-100'
                }`}
              >
                <div className="flex flex-wrap gap-3 justify-center">
                  {/* Favorites Filter */}
                  <button
                    onClick={() => toggleTag('Mes Préférées')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${selectedTags.includes('Mes Préférées') ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                    Mes Préférées ({likedCapsulesCount})
                  </button>

                  {/* Other Tags */}
                  {sortedTags.map(([tag, count]) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTags.includes(tag) ? 'bg-white text-primary-dark' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                      {tag} ({count})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Capsules Grid */}
        <div className="container mx-auto px-4 pb-20">
          {filteredCapsules.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white text-xl">
                Aucune capsule ne correspond à vos filtres.
              </p>
              <button
                onClick={() => setSelectedTags([])}
                className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : filteredCapsules.length === 1 ? (
            <div className="max-w-lg mx-auto mt-12">
              {renderCapsule(filteredCapsules[0], true)}
            </div>
          ) : filteredCapsules.length === 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCapsules.map((capsule) => (
                <div key={capsule.id}>{renderCapsule(capsule, false)}</div>
              ))}
            </div>
          ) : singleCapsule ? (
            <div className="max-w-lg mx-auto mt-12">
              {renderCapsule(singleCapsule, true)}
            </div>
          ) : (
            <Masonry
              breakpointCols={{
                default: 3,
                1024: 2,
                640: 1,
              }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {filteredCapsules.map((capsule) => renderCapsule(capsule, false))}
            </Masonry>
          )}
          {/* CSS for Masonry Grid */}
          <style jsx global>{`
            .my-masonry-grid {
              display: flex;
              width: auto;
              gap: 2rem;
            }
            .my-masonry-grid_column {
              background-clip: padding-box;
            }
            .my-masonry-grid_column > div {
              margin-bottom: 2rem;
            }
          `}</style>
        </div>
      </div>
    </main>
  )
}
