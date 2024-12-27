import { Heart, ArrowUpRight, MessageSquare, BookOpen, Clock, Users2 } from 'lucide-react'

interface SexologyTherapyCardProps {
  onShowPromo: () => void
}

export function SexologyTherapyCard({ onShowPromo }: SexologyTherapyCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary-forest/30 p-8 hover:bg-primary-forest/40 transition-colors">
      <div className="space-y-12">
        <div>
          <h3 className="text-2xl font-light text-primary-cream mb-2">FORFAIT COUPLE SEXOLOGIE</h3>
          <p className="text-primary-coral italic">Programme de renaissance intime</p>
          <blockquote className="mt-6 border-l-2 border-primary-coral/30 pl-4 text-primary-cream/80">
            "Ravivez la flamme et renforcer l'intimité émotionnelle dans votre couple"
          </blockquote>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg text-primary-cream">Organisation</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-primary-coral mt-1">♦</span>
              <span className="text-primary-cream/80">8 séances de 75 minutes sur 4 mois</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-coral mt-1">♦</span>
              <span className="text-primary-cream/80">Alternance entre séances de couple et individuelles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-coral mt-1">♦</span>
              <span className="text-primary-cream/80">Accès premium à la plateforme Eros Inspiration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-coral mt-1">♦</span>
              <span className="text-primary-cream/80">Option d'hypnose thérapeutique disponible</span>
            </li>
          </ul>
        </div>
        <div className="bg-primary-forest/30 rounded-3xl p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl text-primary-coral font-light text-left">VOTRE THÉRAPIE DE COUPLE</h3>
            <div className="flex items-end gap-1 justify-start">
              <p className="text-4xl text-primary-cream font-light">2590 €</p>
              <p className="text-primary-cream/70 pb-1">(ou 3 x 880€ mensuel)</p>
            </div>
            <ul className="text-sm text-primary-cream/70 space-y-2 mt-2 list-none m-0 p-0">
              <li className="flex items-center gap-2 m-0">
                <span className="text-primary-coral">♦</span>
                <span>Programme sur 4 mois avec séances alternées</span>
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
              <h4 className="font-medium text-primary-cream mb-1">Investissement dans votre intimité</h4>
              <p className="text-primary-cream/70">Ravivez la flamme et renforcez votre connexion intime</p>
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
  )
}
