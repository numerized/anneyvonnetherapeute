'use client'

import { BookOpen, Heart, MessageSquare, ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Benefit } from '../Benefit'

interface GenderTherapyCardProps {
  onShowPromo: () => void
  title: string
  subtitle: string
  videoSrc: string
  modalType: 'men' | 'women'
}

export function GenderTherapyCard({ 
  onShowPromo, 
  title, 
  subtitle,
  videoSrc,
  modalType 
}: GenderTherapyCardProps) {
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
    <div className="relative overflow-hidden rounded-[32px] bg-primary-forest/30 p-8 hover:bg-primary-forest/40 transition-colors h-full">
      <div className="space-y-12">
        <div className="text-right">
          <h3 className="text-2xl text-primary-cream font-light mb-2">{title}</h3>
          <p className="text-primary-coral italic">{subtitle}</p>
        </div>

        <blockquote className="border-l-4 border-primary-coral pl-4 my-4 text-left">
          <p className="text-primary-cream/90 italic">
            "Ensemble, construisons une relation plus forte et plus épanouie"
          </p>
        </blockquote>

        {isClient && (
          <div
            className="relative aspect-video rounded-[24px] overflow-hidden cursor-pointer group"
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src={videoSrc}
              playsInline
              loop
              muted
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary-cream/20 backdrop-blur-sm flex items-center justify-center">
                <ArrowUpRight className="w-8 h-8 text-primary-cream" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4">
          <p className="text-primary-cream/90 mb-2">
            <strong>Organisation</strong>
          </p>
          <ul className="text-sm text-primary-cream/70 space-y-2 list-none m-0 p-0">
            <li className="flex items-center gap-2 m-0">
              <span className="text-primary-coral">♦</span>
              <span>12 séances de 75 minutes</span>
            </li>
            <li className="flex items-center gap-2 m-0">
              <span className="text-primary-coral">♦</span>
              <span>2 séances par mois</span>
            </li>
            <li className="flex items-center gap-2 m-0">
              <span className="text-primary-coral">♦</span>
              <span>Parcours sur 6 mois</span>
            </li>
          </ul>
        </div>

        <div className="bg-primary-forest/30 rounded-[24px] p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl text-primary-coral font-light text-left">VOTRE THÉRAPIE</h3>
            <div className="flex items-end gap-1 justify-start">
              <p className="text-4xl text-primary-cream font-light">2590 €</p>
              <p className="text-primary-cream/70 pb-1">(ou 3 x 880€ mensuel)</p>
            </div>
            <ul className="text-sm text-primary-cream/70 space-y-2 mt-2 list-none m-0 p-0">
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>Programme sur 6 mois</span>
              </li>
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>Bilans et introspections réguliers</span>
              </li>
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>Support continu entre les séances</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <Benefit
            icon={<MessageSquare size={24} />}
            title="Support WhatsApp hebdomadaire"
            description="Posez une question, recevez une réponse audio personnalisée"
          />
          <Benefit
            icon={<BookOpen size={24} />}
            title="Accès à la plateforme"
            description="Ressources exclusives et exercices pour votre relation"
          />
          <Benefit
            icon={<Heart size={24} />}
            title="Investissement dans l'amour"
            description="Transformez votre relation et construisez une connexion durable"
          />
        </div>

        <button
          onClick={() => onShowPromo()}
          className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-[24px] py-3 font-bold"
        >
          En savoir plus
        </button>
      </div>
    </div>
  )
}
