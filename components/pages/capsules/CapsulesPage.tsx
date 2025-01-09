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
  videoUrl: string
  posterUrl: string
  gradient: string
  tags: string[]
}

const capsules: Capsule[] = [
  {
    id: 10,
    title: 'Méditation guidée pour la relaxation profonde',
    description: 'Une séance apaisante pour vous aider à vous détendre et à retrouver votre calme intérieur. Idéale pour la fin de journée, cette méditation vous guidera à travers un voyage de relaxation profonde, en utilisant des techniques de respiration et de visualisation pour libérer les tensions accumulées pendant la journée.',
    date: new Date('2025-01-09'),
    videoUrl: '/videos/capsule0.mp4',
    posterUrl: '/images/cover0.webp',
    gradient: 'from-transparent to-[rgb(41,53,49,0.62)]',
    tags: ['Méditation', 'Relaxation', 'Respiration', 'Stress']
  },
  {
    id: 9,
    title: 'Exercice de respiration consciente',
    description: 'Découvrez des techniques de respiration puissantes pour gérer le stress et l\'anxiété au quotidien.',
    date: new Date('2024-12-28'),
    videoUrl: '/videos/capsule0.mp4',
    posterUrl: '/images/cover0.webp',
    gradient: 'from-transparent to-[rgb(146,71,71,0.62)]',
    tags: ['Respiration', 'Anti-stress', 'Méditation', 'Bien-être']
  },
  {
    id: 8,
    title: 'Visualisation créative pour le succès',
    description: 'Une pratique guidée pour manifester vos objectifs et renforcer votre confiance en vous. Cette séance combine des techniques de visualisation positive avec des affirmations puissantes pour vous aider à créer la vie que vous désirez. Apprenez à utiliser la loi d\'attraction de manière pratique et efficace.',
    date: new Date('2024-12-15'),
    videoUrl: '/videos/capsule0.mp4',
    posterUrl: '/images/cover0.webp',
    gradient: 'from-transparent to-[rgb(71,94,146,0.62)]',
    tags: ['Visualisation', 'Développement personnel', 'Méditation', 'Bien-être']
  },
  {
    id: 7,
    title: 'Méditation pour un sommeil réparateur',
    description: 'Préparez-vous à une nuit paisible avec cette séance relaxante.',
    date: new Date('2024-11-30'),
    videoUrl: '/videos/capsule0.mp4',
    posterUrl: '/images/cover0.webp',
    gradient: 'from-transparent to-[rgb(95,71,146,0.62)]',
    tags: ['Sommeil', 'Relaxation', 'Méditation', 'Bien-être']
  },
  {
    id: 6,
    title: 'Pratique de gratitude quotidienne',
    description: 'Cultivez la reconnaissance et la joie dans votre vie avec cet exercice de gratitude guidé. Découvrez comment la pratique régulière de la gratitude peut transformer votre perspective et attirer plus de positif dans votre vie. Une séance qui vous aidera à développer une attitude de reconnaissance envers les petits et grands moments de bonheur quotidiens.',
    date: new Date('2024-11-15'),
    videoUrl: '/videos/capsule0.mp4',
    posterUrl: '/images/cover0.webp',
    gradient: 'from-transparent to-[rgb(146,71,127,0.62)]',
    tags: ['Gratitude', 'Bien-être', 'Développement personnel', 'Méditation']
  },
  {
    id: 5,
    title: 'Ancrage et connexion à la terre',
    description: 'Retrouvez votre équilibre et votre stabilité avec cette méditation d\'ancrage puissante.',
    date: new Date('2024-10-28'),
    videoUrl: '/videos/capsule0.mp4',
    posterUrl: '/images/cover0.webp',
    gradient: 'from-transparent to-[rgb(71,146,89,0.62)]',
    tags: ['Ancrage', 'Équilibre', 'Méditation', 'Bien-être']
  },
  {
    id: 4,
    title: 'Méditation du matin énergisante',
    description: 'Commencez votre journée avec vitalité grâce à cette pratique dynamique et revigorante. Une séance conçue pour éveiller votre corps et votre esprit, stimuler votre énergie et vous préparer à une journée productive et positive. Inclut des exercices de respiration énergisante et des visualisations motivantes.',
    date: new Date('2024-10-15'),
    videoUrl: '/videos/capsule0.mp4',
    posterUrl: '/images/cover0.webp',
    gradient: 'from-transparent to-[rgb(146,132,71,0.62)]',
    tags: ['Énergie', 'Méditation', 'Respiration', 'Visualisation']
  },
  {
    id: 3,
    title: 'Libération des tensions émotionnelles',
    description: 'Une séance thérapeutique pour relâcher les émotions stagnantes et retrouver la légèreté.',
    date: new Date('2024-09-30'),
    videoUrl: '/videos/capsule0.mp4',
    posterUrl: '/images/cover0.webp',
    gradient: 'from-transparent to-[rgb(71,140,146,0.62)]',
    tags: ['Émotions', 'Thérapie', 'Bien-être', 'Relaxation']
  },
  {
    id: 2,
    title: 'Méditation pour la créativité',
    description: 'Stimulez votre imagination et débloquez votre potentiel créatif avec cette séance inspirante. Explorez les espaces de votre conscience où naissent les idées nouvelles et laissez votre créativité s\'épanouir naturellement. Une méditation qui combine des visualisations colorées et des exercices d\'expansion de conscience pour ouvrir les portes de votre expression créative.',
    date: new Date('2024-09-15'),
    videoUrl: '/videos/capsule0.mp4',
    posterUrl: '/images/cover0.webp',
    gradient: 'from-transparent to-[rgb(146,71,71,0.62)]',
    tags: ['Créativité', 'Méditation', 'Visualisation', 'Développement personnel']
  },
  {
    id: 1,
    title: 'Pratique d\'auto-compassion',
    description: 'Développez une relation bienveillante avec vous-même.',
    date: new Date('2024-08-30'),
    videoUrl: '/videos/capsule0.mp4',
    posterUrl: '/images/cover0.webp',
    gradient: 'from-transparent to-[rgb(71,146,116,0.62)]',
    tags: ['Auto-compassion', 'Bien-être', 'Méditation', 'Développement personnel']
  }
]

export default function CapsulesPage() {
  const [isClient, setIsClient] = useState(false)
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [likedCapsules, setLikedCapsules] = useState<{ [key: number]: number }>({})
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({})

  useEffect(() => {
    setIsClient(true)
    // Load liked capsules from localStorage
    const savedLikes = localStorage.getItem('capsuleLikes')
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
      localStorage.setItem('capsuleLikes', JSON.stringify(newLikes))
      return newLikes
    })
  }

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
    localStorage.removeItem('capsuleLikes');
    setLikedCapsules({});
  };

  return (
    <main className="min-h-screen bg-[rgb(232,146,124)] pt-[var(--navbar-height)]">
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
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary-coral/20 blur-3xl" />
        <div className="absolute -bottom-32 right-[-20%] w-96 h-96 rounded-full bg-primary-coral/10 blur-3xl" />
      </div>

      {/* Tag Filters */}
      <div className="bg-primary-dark/30 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
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
              {/* Video Container */}
              <div className="relative w-full rounded-[32px] overflow-hidden">
                {/* Aspect ratio container */}
                <div className="relative pb-[56.25%]">
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
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${capsule.gradient} rounded-[32px]`} />
                      {/* Frost bubbles */}
                      <div className="absolute top-4 right-4 flex gap-4 z-20">
                        {/* Capsule title bubble */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                          <span className="text-white font-medium">Capsule #{capsule.id}</span>
                        </div>
                      </div>
                      {/* Control buttons */}
                      <div className="absolute right-4 bottom-4 z-20 flex gap-2">
                        {/* Like button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleLike(capsule.id)
                          }}
                          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 relative group"
                          aria-label="Like this capsule"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className={`w-6 h-6 transition-all ${likedCapsules[capsule.id] ? 'text-red-500' : 'text-white group-hover:text-red-500'}`}
                          >
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                          </svg>
                          {likedCapsules[capsule.id] > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {likedCapsules[capsule.id]}
                            </span>
                          )}
                        </button>
                        {/* Play/Pause button */}
                        <button
                          onClick={() => togglePlay(capsule.id)}
                          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 cursor-pointer"
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
                <div className="flex flex-wrap gap-2 mt-4">
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
