import { BookOpen, Heart, MessageSquare } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface WomenTherapyCardProps {
  onShowPromo: () => void
}

export function WomenTherapyCard({ onShowPromo }: WomenTherapyCardProps) {
  const [isClient, setIsClient] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 rounded-[32px] w-full h-full">
      <div className="flex justify-center w-full h-fit">
        <div className="relative w-full max-w-[300px] aspect-[4/3]">
          {isClient && (
            <>
              <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-[32px]"
                playsInline
                webkit-playsinline="true"
                src="/videos/sexology.mp4"
                poster="/images/cover-sexology.png"
              />
              {/* Dark green gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgb(41,53,49,0.62)] rounded-[32px]" />
              {/* Frost bubbles */}
              <div className="absolute top-4 right-4 flex gap-4 z-20">
                {/* Title bubble */}
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="text-white font-medium">Sexologie</span>
                </div>
              </div>
              {/* Play/Pause button */}
              <button
                onClick={togglePlay}
                className="absolute right-4 bottom-4 z-20 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 cursor-pointer"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {isPlaying ? (
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
      <div className="relative overflow-hidden rounded-[32px] bg-primary-forest/30 p-8 hover:bg-primary-forest/40 transition-colors h-full">


        <div className="space-y-12">
          <div className="text-right">
            <h3 className="text-2xl font-light text-primary-cream mb-2">FORFAIT FEMME</h3>
            <p className="text-primary-coral italic">Voyage vers une sexualité libérée et épanouie pour femmes</p>
            <blockquote className="mt-6 border-l-4 border-primary-coral pl-4 text-primary-cream/80 text-left">
              "Cultivez un désir authentique et puissant"
            </blockquote>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg text-primary-cream">Organisation</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-primary-coral mt-1">♦</span>
                <span className="text-primary-cream/80">6 séances individuelles de 75 minutes réparties sur 3 mois</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-coral mt-1">♦</span>
                <span className="text-primary-cream/80">Accès illimité à la plateforme Eros Inspiration et ses ressources exclusives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-coral mt-1">♦</span>
                <span className="text-primary-cream/80">Outils pratiques à utiliser au quotidien pour ancrer les progrès</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-coral mt-1">♦</span>
                <span className="text-primary-cream/80">Option : séances d'hypnose pour libérer le subconscient et lever les blocages</span>
              </li>
            </ul>
          </div>

          <div className="bg-primary-forest/30 rounded-3xl p-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl text-primary-coral font-light text-left">VOTRE THÉRAPIE INDIVIDUELLE</h3>
              <div className="flex items-end gap-1 justify-start">
                <p className="text-4xl text-primary-cream font-light">1590 €</p>
                <p className="text-primary-cream/70 pb-1">(ou 3 x 540€ mensuel)</p>
              </div>
              <ul className="text-sm text-primary-cream/70 space-y-2 mt-2 list-none m-0 p-0">
                <li className="flex items-center gap-2 m-0">
                  <span className="text-primary-coral">♦</span>
                  <span>Programme sur 3 mois avec suivi régulier</span>
                </li>
                <li className="flex items-center gap-2 m-0">
                  <span className="text-primary-coral">♦</span>
                  <span>Outils pratiques pour ancrer les progrès</span>
                </li>
                <li className="flex items-center gap-2 m-0">
                  <span className="text-primary-coral">♦</span>
                  <span>Support continu entre les séances</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MessageSquare className="h-6 w-6 flex-shrink-0 text-primary-coral" />
              <div>
                <h4 className="font-medium text-primary-cream mb-1">Support WhatsApp hebdomadaire</h4>
                <p className="text-primary-cream/70">Posez une question, recevez une réponse audio personnalisée</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <BookOpen className="h-6 w-6 flex-shrink-0 text-primary-coral" />
              <div>
                <h4 className="font-medium text-primary-cream mb-1">Accès à la plateforme Eros Inspiration</h4>
                <p className="text-primary-cream/70">Ressources exclusives et exercices pratiques pour votre intimité</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Heart className="h-6 w-6 flex-shrink-0 text-primary-coral" />
              <div>
                <h4 className="font-medium text-primary-cream mb-1">Avantages</h4>
                <ul className="text-primary-cream/70 space-y-1 list-none m-0 p-0">
                  <li>• Raviver sa libido et redécouvrir le plaisir</li>
                  <li>• Cultiver un désir authentique et puissant</li>
                  <li>• Dépasser les blocages pour une sexualité libérée</li>
                  <li>• Explorer son orientation sexuelle en toute sérénité</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={onShowPromo}
            className="w-full rounded-full bg-primary-coral hover:bg-primary-coral/80 text-primary-cream py-4 transition-colors"
          >
            En savoir plus
          </button>
        </div>
      </div>
    </div>
  )
}
