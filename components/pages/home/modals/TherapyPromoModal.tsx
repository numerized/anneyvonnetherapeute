import { Modal } from '@/components/shared/Modal'

interface TherapyPromoModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'couple' | 'individual' | 'vit' | 'beginning' | 'checkup' | 'decision'
}

export function TherapyPromoModal({ isOpen, onClose, type }: TherapyPromoModalProps) {
  const getContent = () => {
    switch (type) {
      case 'couple':
        return {
          title: 'Thérapie Relationnelle de Couple',
          content: (
            <div className="space-y-4 text-primary-cream/80">
              <p>La thérapie relationnelle de couple vous aide à :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Améliorer votre communication</li>
                <li>Résoudre les conflits de manière constructive</li>
                <li>Renforcer votre connexion émotionnelle</li>
                <li>Retrouver l'harmonie dans votre relation</li>
              </ul>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
      case 'individual':
        return {
          title: 'Thérapie Relationnelle Individuelle',
          content: (
            <div className="space-y-4 text-primary-cream/80">
              <p>La thérapie relationnelle individuelle vous permet de :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Explorer vos schémas relationnels</li>
                <li>Développer votre confiance en vous</li>
                <li>Améliorer vos relations</li>
                <li>Vous reconnecter à vous-même</li>
              </ul>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
      case 'vit':
        return {
          title: 'Forfait Individuel VIT',
          content: (
            <div className="space-y-4 text-primary-cream/80">
              <p>Le forfait VIT (Very Important Therapy) offre :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Un accompagnement personnalisé</li>
                <li>Une flexibilité maximale</li>
                <li>Un accès prioritaire</li>
                <li>Des ressources exclusives</li>
              </ul>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
      case 'beginning':
        return {
          title: 'Coaching de Début de Relation',
          content: (
            <div className="space-y-4 text-primary-cream/80">
              <p>Le coaching de début de relation vous aide à :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Poser des bases solides</li>
                <li>Identifier les points d'attention</li>
                <li>Développer une communication saine</li>
                <li>Construire une relation durable</li>
              </ul>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
      case 'checkup':
        return {
          title: 'Check Up Relationnel',
          content: (
            <div className="space-y-4 text-primary-cream/80">
              <p>Le check-up relationnel vous permet de :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Faire le point sur votre relation</li>
                <li>Identifier les axes d'amélioration</li>
                <li>Renforcer vos points forts</li>
                <li>Maintenir une relation saine</li>
              </ul>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
      case 'decision':
        return {
          title: 'Rester ou Partir',
          content: (
            <div className="space-y-4 text-primary-cream/80">
              <p>L'accompagnement "Rester ou Partir" vous aide à :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Clarifier vos sentiments</li>
                <li>Évaluer votre situation</li>
                <li>Prendre une décision éclairée</li>
                <li>Planifier les prochaines étapes</li>
              </ul>
              <p className="mt-6">Pour plus d'informations sur les tarifs et la prise de rendez-vous, contactez-nous.</p>
            </div>
          )
        }
    }
  }

  const content = getContent()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={content?.title || ''}>
      {content?.content}
    </Modal>
  )
}
