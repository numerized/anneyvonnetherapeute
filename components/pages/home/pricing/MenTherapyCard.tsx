import { Heart, ArrowUpRight, MessageSquare, BookOpen, Clock, Users2 } from 'lucide-react'

interface MenTherapyCardProps {
  onShowPromo: () => void
}

export function MenTherapyCard({ onShowPromo }: MenTherapyCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary-forest/30 p-8 hover:bg-primary-forest/40 transition-colors">
      <div className="space-y-12">
        <div className="text-right">
          <h3 className="text-2xl font-light text-primary-cream mb-2">FORFAIT HOMME</h3>
          <p className="text-primary-coral italic">Programme de transformation sexuelle pour hommes</p>
          <blockquote className="mt-6 border-l-4 border-primary-coral pl-4 text-primary-cream/80 text-left">
            "Développez une sexualité épanouie et harmonieuse"
          </blockquote>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg text-primary-cream">Organisation</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-primary-coral mt-1">♦</span>
              <span className="text-primary-cream/80">6 séances individuelles de 75 minutes sur 3 mois</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-coral mt-1">♦</span>
              <span className="text-primary-cream/80">2 rendez-vous par mois pour un suivi optimal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-coral mt-1">♦</span>
              <span className="text-primary-cream/80">Accès à la plateforme Eros Inspiration pour des ressources complémentaires</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-coral mt-1">♦</span>
              <span className="text-primary-cream/80">Outils personnalisés pour pratiquer entre les séances</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-coral mt-1">♦</span>
              <span className="text-primary-cream/80">Option : séances d'hypnose thérapeutique pour un déblocage en profondeur</span>
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
                <span>Outils personnalisés pour votre progression</span>
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
              <h4 className="font-medium text-primary-cream mb-1">Bénéfices</h4>
              <ul className="text-primary-cream/70 space-y-1 list-none m-0 p-0">
                <li>• Surmonter l'impuissance et retrouver confiance en soi</li>
                <li>• Maîtriser l'éjaculation précoce pour des rapports plus satisfaisants</li>
                <li>• Explorer sereinement son orientation sexuelle</li>
                <li>• Développer une sexualité épanouie et harmonieuse</li>
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
  )
}
