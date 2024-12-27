import { Modal as TherapyModal } from '@/components/shared/Modal'

interface TherapyPromoModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'couple' | 'individual' | 'vit' | 'beginning' | 'checkup' | 'decision' | 'sexology'
}

export function TherapyPromoModal({ isOpen, onClose, type }: TherapyPromoModalProps) {
  const getContent = () => {
    switch (type) {
      case 'couple':
        return {
          title: 'Thérapie Relationnelle de Couple',
          subtitle: 'De cœur et de corps',
          content: (
            <div className="text-primary-cream/90 text-lg leading-relaxed space-y-12">
              <p>La thérapie relationnelle de couple vous aide à :</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Améliorer votre communication</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Résoudre les conflits de manière constructive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Renforcer votre connexion émotionnelle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Retrouver l'harmonie dans votre relation</span>
                </li>
              </ul>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
      case 'individual':
        return {
          title: 'Thérapie Relationnelle Individuelle',
          subtitle: 'Accords à corps',
          content: (
            <div className="text-primary-cream/90 text-lg leading-relaxed space-y-12">
              <p>La thérapie relationnelle individuelle vous permet de :</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Explorer vos schémas relationnels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Développer votre confiance en vous</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Améliorer vos relations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Vous reconnecter à vous-même</span>
                </li>
              </ul>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
      case 'vit':
        return {
          title: ' FORFAIT INDIVIDUEL VERY IMPORTANT THERAPY',
          subtitle: 'Forfait Privilège',
          content: (
            <div className="text-primary-cream/90 text-lg leading-relaxed space-y-12">
              <p>Le forfait VIT (Very Important Therapy) offre :</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Un accompagnement personnalisé</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Une flexibilité maximale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Un accès prioritaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Des ressources exclusives</span>
                </li>
              </ul>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
      case 'beginning':
        return {
          title: 'Coaching de Début de Relation',
          subtitle: 'Construire sur des bases solides',
          content: (
            <div className="text-primary-cream/90 text-lg leading-relaxed space-y-12">
              <p>Le coaching de début de relation vous aide à :</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Poser des bases solides</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Identifier les points d'attention</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Développer une communication saine</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Construire une relation durable</span>
                </li>
              </ul>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
      case 'checkup':
        return {
          title: 'Check Up Relationnel',
          subtitle: 'La relation est vivante, elle évolue',
          content: (
            <div className="text-primary-cream/90 text-lg leading-relaxed space-y-12">
              <p>Le check-up relationnel vous permet de :</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Faire le point sur votre relation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Identifier les axes d'amélioration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Renforcer vos points forts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Maintenir une relation saine</span>
                </li>
              </ul>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
      case 'decision':
        return {
          title: 'Rester ou Partir',
          subtitle: 'Prendre une décision éclairée',
          content: (
            <div className="text-primary-cream/90 text-lg leading-relaxed space-y-12">
              <p>L'accompagnement "Rester ou Partir" vous aide à :</p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Clarifier vos sentiments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Évaluer votre situation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Prendre une décision éclairée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-coral mt-1">♦</span>
                  <span>Planifier les prochaines étapes</span>
                </li>
              </ul>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
      case 'sexology':
        return {
          title: 'FORFAIT COUPLE SEXOLOGIE',
          subtitle: 'Programme de renaissance intime pour couples',
          content: (
            <div className="text-primary-cream/90 text-lg leading-relaxed space-y-12">
              <div className="space-y-4">
                <p>Cette offre exclusive comprend :</p>
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>8 séances de 75 minutes sur 4 mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Alternance entre séances de couple et séances individuelles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Accès premium à la plateforme Eros Inspiration pour les deux partenaires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Outils pratiques à utiliser entre les séances pour renforcer les progrès</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Option : séances d'hypnose thérapeutique pour un déblocage en profondeur</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <p>Bénéfices pour le couple :</p>
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Raviver la flamme et renforcer l'intimité émotionnelle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Améliorer la communication autour de la sexualité</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Surmonter ensemble les difficultés (libido, blocages, dysfonctions)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Explorer de nouvelles dimensions de votre sexualité à deux</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Construire une vision commune de votre épanouissement sexuel</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <p>Déroulement du programme :</p>
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Séance de couple : Évaluation et objectifs communs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Séances individuelles pour chaque partenaire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Séance de couple : Bilan et ajustements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Nouvelles séances individuelles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Séances de couple finales : Intégration et consolidation</span>
                  </li>
                </ul>
              </div>
            </div>
          )
        }
    }
  }

  const content = getContent()

  return (
    <TherapyModal isOpen={isOpen} onClose={onClose} title={content?.title || ''} subtitle={content?.subtitle || ''}>
      {content?.content}
    </TherapyModal>
  )
}
