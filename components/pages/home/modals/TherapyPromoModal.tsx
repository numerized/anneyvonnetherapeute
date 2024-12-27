import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { X } from 'lucide-react'

interface TherapyPromoModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'couple' | 'individual' | 'vit' | 'beginning' | 'checkup' | 'decision' | 'sexology' | 'men' | 'women'
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
            </div>
          )
        }
      case 'men':
        return {
          title: 'FORFAIT HOMME',
          subtitle: 'Programme de transformation sexuelle pour hommes',
          content: (
            <div className="text-primary-cream/90 text-lg leading-relaxed space-y-12">
              <div className="space-y-4">
                <p>Objectifs du programme :</p>
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Développer une sexualité épanouie et confiante</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Comprendre et gérer les dysfonctionnements érectiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Maîtriser l'éjaculation précoce</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Retrouver le désir et la confiance</span>
                  </li>
                </ul>
              </div>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
      case 'women':
        return {
          title: 'FORFAIT FEMME',
          subtitle: 'Programme de transformation sexuelle pour femmes',
          content: (
            <div className="text-primary-cream/90 text-lg leading-relaxed space-y-12">
              <div className="space-y-4">
                <p>Objectifs du programme :</p>
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Développer une sexualité épanouie et confiante</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Comprendre et gérer les dysfonctionnements sexuels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Maîtriser le plaisir et la jouissance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-coral mt-1">♦</span>
                    <span>Retrouver le désir et la confiance</span>
                  </li>
                </ul>
              </div>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
      default:
        return {
          title: '',
          subtitle: '',
          content: null
        }
    }
  }

  const { title, subtitle, content } = getContent()

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-primary-forest text-left align-middle shadow-xl transition-all relative">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-primary-cream/20 hover:bg-primary-cream/30 flex items-center justify-center transition-colors z-10"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-primary-cream" />
                </button>

                <div className="p-8 md:p-12">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-3xl text-primary-cream font-light">{title}</h2>
                      <p className="text-xl text-primary-coral/90">{subtitle}</p>
                    </div>
                    {content}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
