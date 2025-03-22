'use client'

import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Masonry from 'react-masonry-css'

interface Capsule {
  id: number
  title: string
  description: string
  date: Date
  mediaUrl: string
  posterUrl: string
  gradient: string
  tags: string[]
  mediaType: 'audio' | 'video'
}

const capsules: Capsule[] = [
  {
    id: 1,
    title: 'Meditation Erozen 001',
    description: 'Une capsule conçue pour libérer votre créativité et explorer votre potentiel d\'expression. Laissez-vous guider dans cet espace où l\'imagination se déploie sans contraintes.',
    date: new Date('2025-03-22'),
    mediaUrl: '/CAPSULES_MINUTES/CREATIVITE_CAPSULE-LIBRE.mp4',
    posterUrl: '/images/posters/CREATIVITE_CAPSULE-LIBRE-poster.jpg',
    gradient: 'from-transparent to-[rgb(146,71,127,0.62)]',
    tags: ['Créativité', 'Expression', 'Bien-être', 'Minute'],
    mediaType: 'video'
  },
  {
    id: 2,
    title: 'Zen Clic 1',
    description: 'Un moment de détente et de recentrage pour retrouver votre équilibre intérieur. Cette capsule vous offre un espace de respiration dans votre quotidien.',
    date: new Date('2025-03-22'),
    mediaUrl: '/CAPSULES_MINUTES/ZEN_CLIC_1.mp4',
    posterUrl: '/images/posters/ZEN_CLIC_1-poster.jpg',
    gradient: 'from-transparent to-[rgb(41,53,49,0.62)]',
    tags: ['Méditation', 'Zen', 'Relaxation', 'Minute'],
    mediaType: 'video'
  },
  {
    id: 3,
    title: 'Amour Passion',
    description: 'Explorez les dimensions de l\'amour passionnel et ses manifestations dans nos relations. Une réflexion sur l\'intensité et la profondeur des liens amoureux.',
    date: new Date('2025-03-22'),
    mediaUrl: '/CAPSULES_MIROIR/Amour-passion.m4a',
    posterUrl: '/CAPSULES%20MIROIR_VISUELS/mirroir5.png',
    gradient: 'from-transparent to-[rgb(146,71,71,0.62)]',
    tags: ['Amour', 'Passion', 'Relation', 'Couple', 'Miroir'],
    mediaType: 'audio'
  },
  {
    id: 4,
    title: 'Capsule Connaître - Exploration',
    description: 'Une invitation à explorer la connaissance de soi et des autres. Cette capsule audio vous guide dans une démarche introspective pour mieux vous comprendre et vous connecter à votre essence.',
    date: new Date('2025-03-22'),
    mediaUrl: '/CAPSULES_MIROIR/Capsule-connaitre---exploration-cac_Wind-Remover.mp3',
    posterUrl: '/CAPSULES%20MIROIR_VISUELS/mirroir6.png',
    gradient: 'from-transparent to-[rgb(71,94,146,0.62)]',
    tags: ['Connaissance de soi', 'Exploration', 'Introspection', 'Miroir'],
    mediaType: 'audio'
  },
  {
    id: 5,
    title: 'Et si la relation amoureuse n\'est plus faite pour durer',
    description: 'Une réflexion sur l\'évolution des relations amoureuses dans notre société contemporaine. Questionnez vos attentes et vos perceptions sur la durabilité des liens affectifs.',
    date: new Date('2025-03-22'),
    mediaUrl: '/CAPSULES_MIROIR/Et-si-la-relation-amoureuse-n_est-plus-faite-pour-durer.m4a',
    posterUrl: '/CAPSULES%20MIROIR_VISUELS/mirroir7.png',
    gradient: 'from-transparent to-[rgb(95,71,146,0.62)]',
    tags: ['Relation', 'Couple', 'Évolution', 'Société', 'Miroir'],
    mediaType: 'audio'
  },
  {
    id: 6,
    title: 'La Pensée Orientée',
    description: 'Découvrez comment aligner vos pensées vers des objectifs positifs et constructifs. Cette méditation guidée vous aide à structurer votre réflexion pour plus de clarté et d\'efficacité.',
    date: new Date('2025-03-22'),
    mediaUrl: '/CAPSULES_MIROIR/La-pensee-orientee_Wind-Remover.mp3',
    posterUrl: '/CAPSULES%20MIROIR_VISUELS/mirroir8.png',
    gradient: 'from-transparent to-[rgb(71,146,89,0.62)]',
    tags: ['Pensée positive', 'Méditation', 'Clarté mentale', 'Miroir'],
    mediaType: 'audio'
  },
  {
    id: 7,
    title: 'Les Uns et Les Autres',
    description: 'Une exploration des dynamiques relationnelles et des interactions entre individus. Cette capsule vous invite à porter un regard nouveau sur la façon dont nous nous connectons les uns aux autres.',
    date: new Date('2025-03-22'),
    mediaUrl: '/CAPSULES_MIROIR/Les-uns-et-les-autres.m4a',
    posterUrl: '/CAPSULES%20MIROIR_VISUELS/mirroir9.png',
    gradient: 'from-transparent to-[rgb(146,132,71,0.62)]',
    tags: ['Relations', 'Interactions sociales', 'Développement personnel', 'Miroir'],
    mediaType: 'audio'
  }
]

export default function Espace180Page() {
  const [isClient, setIsClient] = useState(false)
  const [activeMedia, setActiveMedia] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [likedCapsules, setLikedCapsules] = useState<{ [key: number]: number }>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | HTMLAudioElement }>({})

  useEffect(() => {
    setIsClient(true)
    // Load liked capsules from localStorage
    const savedLikes = localStorage.getItem('espace180Likes')
    if (savedLikes) {
      setLikedCapsules(JSON.parse(savedLikes))
    }
  }, [])

  const toggleLike = (capsuleId: number) => {
    setLikedCapsules(prev => {
      const currentLikes = prev[capsuleId] || 0
      const newLikes = {
        ...prev,
        [capsuleId]: currentLikes > 0 ? 0 : 1 // Toggle between 0 and 1
      }
      // Save to localStorage
      localStorage.setItem('espace180Likes', JSON.stringify(newLikes))
      return newLikes
    })
  }

  const togglePlay = (capsuleId: number) => {
    const media = videoRefs.current[capsuleId]
    if (!media) return

    if (media.paused) {
      // Pause any other playing media
      if (activeMedia !== null && activeMedia !== capsuleId) {
        const activeMediaElement = videoRefs.current[activeMedia]
        if (activeMediaElement) {
          activeMediaElement.pause()
        }
      }
      // Play the media
      try {
        const playPromise = media.play()
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error playing media:", error)
          })
        }
      } catch (error) {
        console.error("Exception playing media:", error)
      }
      setActiveMedia(capsuleId)
    } else {
      media.pause()
      setActiveMedia(null)
    }
  }

  // Get unique tags with counts
  const allTags = capsules.reduce((acc, capsule) => {
    capsule.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as { [key: string]: number })

  // Sort tags by count (descending) and alphabetically
  const sortedTags = Object.entries(allTags)
    .sort(([tagA, countA], [tagB, countB]) => {
      if (countA === countB) {
        return tagA.localeCompare(tagB)
      }
      return countB - countA
    })

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // Filter capsules based on selected tags
  const filteredCapsules = capsules.filter(capsule => {
    const isLiked = (likedCapsules[capsule.id] || 0) > 0;
    const hasFavoriteTag = selectedTags.includes('Mes Préférées');
    const otherTags = selectedTags.filter(tag => tag !== 'Mes Préférées');
    
    // Check if capsule matches other selected tags
    const matchesOtherTags = otherTags.length === 0 || 
      otherTags.some(tag => capsule.tags.includes(tag));

    // If favorites is selected, show liked capsules that match other tags (if any)
    if (hasFavoriteTag) {
      if (otherTags.length > 0) {
        return isLiked || matchesOtherTags;
      }
      return isLiked;
    }
    
    // If favorites is not selected, only show capsules matching other tags
    return matchesOtherTags;
  });

  // Get count of liked capsules for the counter
  const likedCapsulesCount = Object.values(likedCapsules).filter(count => count > 0).length;

  // Add reset likes function
  const resetAllLikes = () => {
    localStorage.removeItem('espace180Likes');
    setLikedCapsules({});
  };

  // Function to set the ref based on media type
  const setMediaRef = (element: HTMLVideoElement | HTMLAudioElement | null, id: number) => {
    if (element) {
      videoRefs.current[id] = element;
    }
  };

  return (
    <main className="min-h-screen bg-[rgb(232,146,124)] pt-[var(--navbar-height)]">
      {/* Hero Section */}
      <div className="relative bg-primary-forest py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl ml-auto text-right">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-cream mb-6">
              Espace 180
            </h1>
            <p className="text-xl text-primary-cream/80">
              Découvrez notre collection de méditations guidées et d'exercices pratiques 
              pour vous accompagner dans votre cheminement personnel.
            </p>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary-coral/20 blur-3xl" />
        <div className="absolute -bottom-32 right-[-20%] w-96 h-96 rounded-full bg-primary-coral/10 blur-3xl" />
      </div>

      {/* Tag Filters */}
      <div className="bg-primary-dark/30 backdrop-blur-sm py-8">
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
                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Filter Content - Hidden on mobile unless expanded */}
          <div 
            className={`transition-all duration-300 ease-in-out overflow-hidden md:h-auto ${
              isFilterOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 md:max-h-[500px] md:opacity-100'
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
                Mes Préférées
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

      {/* Capsules Grid */}
      <div className="container mx-auto px-4 py-16">
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
        
        <Masonry
          breakpointCols={{
            default: 3,
            1280: 2,
            768: 1
          }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {filteredCapsules.map((capsule) => (
            <div key={capsule.id} className="bg-primary-dark p-8 rounded-[32px] flex flex-col">
              {/* Media Container */}
              <div className="relative w-full rounded-[32px] overflow-hidden">
                {/* Aspect ratio container */}
                <div className="relative pb-[56.25%]">
                  {isClient && (
                    <>
                      {capsule.mediaType === 'video' ? (
                        <video
                          ref={(el) => setMediaRef(el, capsule.id)}
                          className="absolute inset-0 w-full h-full object-cover rounded-[32px] shadow-2xl"
                          playsInline
                          webkit-playsinline="true"
                          src={capsule.mediaUrl}
                          poster={capsule.posterUrl}
                        />
                      ) : (
                        <>
                          <audio
                            ref={(el) => setMediaRef(el, capsule.id)}
                            src={capsule.mediaUrl}
                            className="hidden"
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
                      {/* Gradient overlay - Removed as requested */}
                      {/* Frost bubbles */}
                      <div className="absolute top-4 right-4 flex gap-4 z-20">
                        {/* Capsule title bubble */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                          <span className="text-white font-medium">#{capsule.id}</span>
                        </div>
                      </div>
                      {/* Play button - Left side */}
                      <div className="absolute left-4 bottom-4 z-20">
                        {/* Play/Pause button */}
                        <button
                          onClick={() => togglePlay(capsule.id)}
                          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 cursor-pointer"
                          aria-label={activeMedia === capsule.id ? 'Pause media' : 'Play media'}
                        >
                          <div className="w-6 h-6 flex items-center justify-center">
                            {activeMedia === capsule.id ? (
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
                      </div>
                      {/* Like button - Right side */}
                      <div className="absolute right-4 bottom-4 z-20">
                        <div className="w-14 h-14 rounded-full relative">
                          <button
                            onClick={() => {
                              toggleLike(capsule.id)
                            }}
                            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-red-500 hover:text-white flex items-center gap-2"
                            aria-label="Like this capsule"
                          >
                            <div className="w-6 h-6 flex items-center justify-center">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="currentColor" 
                                className={`w-6 h-6 transition-all ${likedCapsules[capsule.id] ? 'text-red-500' : 'text-white group-hover:text-red-500'}`}
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
              
              {/* Capsule Info */}
              <div className="flex-grow space-y-4 mt-6">
                <h2 className="text-2xl font-bold text-white">{capsule.title}</h2>
                <p className="text-white/80">{capsule.description}</p>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4 justify-end">
                  {capsule.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-xs rounded-full transition-all
                        ${selectedTags.includes(tag)
                          ? 'bg-white text-primary-dark font-medium'
                          : 'bg-white/10 text-white'
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Date - Always at bottom */}
              <div className="text-right mt-4">
                <p className="text-sm text-white/60">
                  {format(capsule.date, 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
          ))}
        </Masonry>

        {/* Reset Likes Button */}
        {Object.keys(likedCapsules).length > 0 && (
          <div className="flex justify-center pb-12">
            <button
              onClick={resetAllLikes}
              className="px-6 py-3 rounded-full text-sm font-medium transition-all bg-white/10 text-white hover:bg-red-500 hover:text-white flex items-center gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-4 h-4"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              Réinitialiser mes préférées
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
